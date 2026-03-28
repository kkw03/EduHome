"""ExternalOneMapAPI — SLA OneMap client for geocoding and routing.

Endpoints used:
  - Search (no auth):  GET /api/common/elastic/search
  - Routing (auth):    GET /api/public/routingsvc/route
  - Token:             POST /api/auth/post/getToken
"""

import logging
import time

import requests
from flask import current_app

logger = logging.getLogger(__name__)


class ExternalOneMapAPI:

    BASE_URL = "https://www.onemap.gov.sg/api"
    SEARCH_URL = f"{BASE_URL}/common/elastic/search"
    ROUTE_URL = f"{BASE_URL}/public/routingsvc/route"
    TOKEN_URL = f"{BASE_URL}/auth/post/getToken"

    # Rate-limit delay between consecutive requests (seconds)
    REQUEST_DELAY = 0.15

    _cached_token = None
    _token_expiry = 0

    # ------------------------------------------------------------------
    # Geocoding (no auth required)
    # ------------------------------------------------------------------

    @classmethod
    def request_coordinates(cls, search_val):
        """Geocode an address or postal code to (lat, lng).

        Args:
            search_val: Address string or 6-digit postal code.

        Returns:
            (lat, lng) tuple, or None if not found / service unavailable.
        """
        if current_app.config.get("DEMO_MODE"):
            return cls._demo_coordinates(search_val)

        try:
            resp = requests.get(
                cls.SEARCH_URL,
                params={
                    "searchVal": str(search_val),
                    "returnGeom": "Y",
                    "getAddrDetails": "Y",
                    "pageNum": 1,
                },
                timeout=10,
            )
            resp.raise_for_status()
            data = resp.json()

            if data.get("found", 0) == 0:
                logger.debug("OneMap: No results for '%s'", search_val)
                return None

            result = data["results"][0]
            lat = float(result["LATITUDE"])
            lng = float(result["LONGITUDE"])
            return (lat, lng)

        except Exception:
            logger.debug(
                "OneMap: Geocode failed for '%s'", search_val, exc_info=True
            )
            return None
        finally:
            time.sleep(cls.REQUEST_DELAY)

    # ------------------------------------------------------------------
    # Commute / routing (auth required)
    # ------------------------------------------------------------------

    @classmethod
    def request_commute_time(cls, start_lat, start_lng, end_lat, end_lng,
                             mode="pt"):
        """Get travel time between two points via OneMap routing API.

        Args:
            start_lat, start_lng: Origin coordinates.
            end_lat, end_lng:     Destination coordinates.
            mode: Route mode — "pt" (public transport), "drive", "walk",
                  "cycle". Default "pt".

        Returns:
            Travel time in minutes (int), or None on failure.
        """
        if current_app.config.get("DEMO_MODE"):
            return cls._demo_commute_time()

        token = cls._get_token()
        if token is None:
            logger.warning("OneMap: Cannot route without auth token")
            return None

        try:
            now_str = "07:30:00"  # default morning commute
            resp = requests.get(
                cls.ROUTE_URL,
                params={
                    "start": f"{start_lat},{start_lng}",
                    "end": f"{end_lat},{end_lng}",
                    "routeType": mode,
                    "date": "03-28-2026",
                    "time": now_str,
                    "mode": "TRANSIT",
                    "numItineraries": 1,
                },
                headers={"Authorization": token},
                timeout=15,
            )
            resp.raise_for_status()
            data = resp.json()

            plan = data.get("plan", {})
            itineraries = plan.get("itineraries", [])
            if not itineraries:
                return None

            duration_sec = itineraries[0].get("duration", 0)
            return max(1, round(duration_sec / 60))

        except Exception:
            logger.debug("OneMap: Routing failed", exc_info=True)
            return None
        finally:
            time.sleep(cls.REQUEST_DELAY)

    # ------------------------------------------------------------------
    # Auth token management
    # ------------------------------------------------------------------

    @classmethod
    def _get_token(cls):
        """Obtain or refresh the OneMap API auth token."""
        import time as _time

        if cls._cached_token and _time.time() < cls._token_expiry:
            return cls._cached_token

        email = current_app.config.get("ONEMAP_EMAIL", "")
        password = current_app.config.get("ONEMAP_PASSWORD", "")
        if not email or not password:
            logger.warning(
                "OneMap: ONEMAP_EMAIL / ONEMAP_PASSWORD not configured"
            )
            return None

        try:
            resp = requests.post(
                cls.TOKEN_URL,
                json={"email": email, "password": password},
                timeout=10,
            )
            resp.raise_for_status()
            data = resp.json()

            cls._cached_token = data.get("access_token")
            # Tokens are valid for 3 days; refresh after 2 days
            cls._token_expiry = _time.time() + (2 * 24 * 3600)
            return cls._cached_token

        except Exception:
            logger.error("OneMap: Token request failed", exc_info=True)
            return None

    # ------------------------------------------------------------------
    # Demo mode fallback (NFR3)
    # ------------------------------------------------------------------

    @staticmethod
    def _demo_coordinates(search_val):
        """Return cached coordinates for known demo addresses."""
        demo_cache = {
            "298981": (1.3048, 103.8198),   # Raffles Girls'
            "267923": (1.3150, 103.8050),   # Nanyang
            "428903": (1.3067, 103.9020),   # Tao Nan
            "278120": (1.3230, 103.7850),   # Henry Park
            "579646": (1.3540, 103.8380),   # Ai Tong
            "571402": (1.3530, 103.8488),   # CHIJ St Nicholas
            "579767": (1.3559, 103.8350),   # Catholic High
            "546417": (1.3575, 103.8810),   # Rosyth
            "279747": (1.3180, 103.7990),   # Pei Hwa
            "369117": (1.3260, 103.8830),   # Red Swastika
        }
        return demo_cache.get(str(search_val))

    @staticmethod
    def _demo_commute_time():
        """Return a fixed commute time for demo mode."""
        return 15
