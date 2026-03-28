"""ExternalGovDataAPI — data.gov.sg client for HDB resale and MOE school data.

Endpoints:
  - Datastore search: GET https://data.gov.sg/api/action/datastore_search

Resource IDs:
  - HDB resale:  d_8b84c4ee58e3cfc0ece0d773c8ca6abc
  - MOE schools: d_688b934f82c1059ed0a6993d2a829089
"""

import logging

import requests
from flask import current_app

logger = logging.getLogger(__name__)

PAGE_SIZE = 10_000


class ExternalGovDataAPI:

    HDB_RESALE_RESOURCE_ID = "d_8b84c4ee58e3cfc0ece0d773c8ca6abc"
    MOE_SCHOOL_RESOURCE_ID = "d_688b934f82c1059ed0a6993d2a829089"

    # ------------------------------------------------------------------
    # HDB Resale Transactions
    # ------------------------------------------------------------------

    @classmethod
    def fetch_latest_resale_data(cls, months_back=None):
        """Download HDB resale transaction records from data.gov.sg.

        Args:
            months_back: If set, only fetch records from this many months ago
                         onwards (uses the API's filter param on "month").
                         None fetches all available data.

        Returns:
            List of record dicts, or None on failure.
        """
        if current_app.config.get("DEMO_MODE"):
            logger.info("GovData: DEMO_MODE — returning cached resale data")
            return cls._demo_resale_data()

        base_url = current_app.config["GOVDATA_HDB_URL"]

        filters = None
        if months_back:
            from datetime import datetime, timedelta
            cutoff = datetime.utcnow() - timedelta(days=months_back * 30)
            cutoff_str = cutoff.strftime("%Y-%m")
            filters = f'{{"month": {{">": "{cutoff_str}"}}}}'

        all_records = []
        offset = 0

        try:
            while True:
                params = {
                    "resource_id": cls.HDB_RESALE_RESOURCE_ID,
                    "limit": PAGE_SIZE,
                    "offset": offset,
                }
                if filters:
                    params["filters"] = filters

                resp = requests.get(base_url, params=params, timeout=60)
                resp.raise_for_status()

                body = resp.json()
                if not body.get("success"):
                    logger.error("GovData: API returned success=false")
                    return None

                result = body.get("result", {})
                records = result.get("records", [])
                if not records:
                    break

                all_records.extend(records)
                total = result.get("total", 0)
                offset += PAGE_SIZE

                logger.info(
                    "GovData: Fetched %d / %d resale records",
                    len(all_records), total,
                )
                if offset >= total:
                    break

            logger.info(
                "GovData: Retrieved %d resale records total", len(all_records)
            )
            return all_records

        except requests.RequestException as exc:
            logger.error("GovData: HTTP error fetching resale data: %s", exc)
            return None

    # ------------------------------------------------------------------
    # MOE School Vacancies
    # ------------------------------------------------------------------

    @classmethod
    def fetch_school_vacancies(cls, year=None):
        """Download MOE primary school vacancy data from data.gov.sg.

        Args:
            year: Filter by academic year (e.g. 2026). None fetches all.

        Returns:
            List of record dicts, or None on failure.
        """
        if current_app.config.get("DEMO_MODE"):
            logger.info("GovData: DEMO_MODE — returning cached vacancy data")
            return cls._demo_vacancy_data()

        base_url = current_app.config["GOVDATA_MOE_URL"]

        filters = None
        if year:
            filters = f'{{"year": "{year}"}}'

        all_records = []
        offset = 0

        try:
            while True:
                params = {
                    "resource_id": cls.MOE_SCHOOL_RESOURCE_ID,
                    "limit": PAGE_SIZE,
                    "offset": offset,
                }
                if filters:
                    params["filters"] = filters

                resp = requests.get(base_url, params=params, timeout=60)
                resp.raise_for_status()

                body = resp.json()
                if not body.get("success"):
                    logger.error("GovData: API returned success=false")
                    return None

                result = body.get("result", {})
                records = result.get("records", [])
                if not records:
                    break

                all_records.extend(records)
                total = result.get("total", 0)
                offset += PAGE_SIZE

                if offset >= total:
                    break

            logger.info(
                "GovData: Retrieved %d school records", len(all_records)
            )
            return all_records

        except requests.RequestException as exc:
            logger.error("GovData: HTTP error fetching vacancy data: %s", exc)
            return None

    # ------------------------------------------------------------------
    # Demo mode fallback (NFR3)
    # ------------------------------------------------------------------

    @staticmethod
    def _demo_resale_data():
        """Cached sample HDB resale records for offline demonstration."""
        return [
            {
                "month": "2026-04",
                "town": "BUKIT MERAH",
                "flat_type": "4 ROOM",
                "block": "115",
                "street_name": "JALAN BUKIT MERAH",
                "storey_range": "10 TO 12",
                "floor_area_sqm": "92",
                "flat_model": "New Generation",
                "lease_commence_date": "1985",
                "remaining_lease": "57 years 09 months",
                "resale_price": "580000",
            },
            {
                "month": "2026-04",
                "town": "QUEENSTOWN",
                "flat_type": "3 ROOM",
                "block": "45",
                "street_name": "QUEENSWAY",
                "storey_range": "04 TO 06",
                "floor_area_sqm": "67",
                "flat_model": "Improved",
                "lease_commence_date": "1988",
                "remaining_lease": "60 years 11 months",
                "resale_price": "420000",
            },
            {
                "month": "2026-04",
                "town": "MARINE PARADE",
                "flat_type": "5 ROOM",
                "block": "82",
                "street_name": "MARINE PARADE CENTRAL",
                "storey_range": "07 TO 09",
                "floor_area_sqm": "110",
                "flat_model": "Improved",
                "lease_commence_date": "1980",
                "remaining_lease": "52 years 06 months",
                "resale_price": "710000",
            },
        ]

    @staticmethod
    def _demo_vacancy_data():
        """Cached sample MOE school vacancy records for offline demonstration."""
        return [
            {"school_name": "RAFFLES GIRLS' PRIMARY SCHOOL", "vacancy": "30", "phase": "2C"},
            {"school_name": "NANYANG PRIMARY SCHOOL", "vacancy": "45", "phase": "2C"},
            {"school_name": "TAO NAN SCHOOL", "vacancy": "60", "phase": "2C"},
            {"school_name": "HENRY PARK PRIMARY SCHOOL", "vacancy": "25", "phase": "2C"},
            {"school_name": "AI TONG SCHOOL", "vacancy": "50", "phase": "2C"},
            {"school_name": "CHIJ ST. NICHOLAS GIRLS' SCHOOL", "vacancy": "40", "phase": "2C"},
            {"school_name": "CATHOLIC HIGH SCHOOL (PRIMARY)", "vacancy": "35", "phase": "2C"},
            {"school_name": "ROSYTH SCHOOL", "vacancy": "55", "phase": "2C"},
            {"school_name": "PEI HWA PRESBYTERIAN PRIMARY SCHOOL", "vacancy": "38", "phase": "2C"},
            {"school_name": "RED SWASTIKA SCHOOL", "vacancy": "42", "phase": "2C"},
        ]
