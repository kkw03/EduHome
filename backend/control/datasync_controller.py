"""
DataSyncController -- scheduled background data ingestion (UC5).

State flow (from Dialog Map):
    IdleState -> RetrievingMarketData -> ValidatingMarketData
    -> UpdatingDatabase -> CheckingWatchlists -> SendingAlerts -> IdleState

Error / skip branches:
    ErrorMarketData     -- download or validation failure -> IdleState
    NoNewDataState      -- database already up to date    -> IdleState
    NoWatchlistMatchState -- no zones matched             -> IdleState
"""

import logging
from datetime import datetime

from flask import current_app
from sqlalchemy import text

from backend.entity import db
from backend.entity.transaction import Transaction
from backend.entity.hdb_block import HDBBlock
from backend.entity.persistent_store import PersistentStore
from backend.boundary.external.govdata_api import ExternalGovDataAPI
from backend.boundary.external.onemap_api import ExternalOneMapAPI

logger = logging.getLogger(__name__)


class DataSyncController:
    """Orchestrates daily data sync from data.gov.sg (UC5).

    Delegates to ExternalGovDataAPI for data retrieval and
    ExternalOneMapAPI for geocoding new HDB blocks.
    """

    REQUIRED_FIELDS = frozenset({
        "month", "town", "flat_type", "block",
        "street_name", "floor_area_sqm", "resale_price",
    })

    def __init__(self, app=None):
        self.app = app
        self._last_sync = None
        self._last_status = None
        self._geocode_cache = {}  # (block_num, street) -> (lat, lng) or None

    # ------------------------------------------------------------------
    # Public API
    # ------------------------------------------------------------------

    def trigger_daily_update(self, months_back=None):
        """Entry point called by APScheduler on each sync interval.

        Args:
            months_back: If set, only fetch records from this many months ago
                         onwards. Useful for initial seeding (e.g. months_back=60
                         for 5 years). None fetches all available data.

        Returns True on success (including "no new data"), False on error.
        """
        logger.info("UC5: Data sync triggered")
        self._last_status = "running"

        try:
            # --- RetrievingMarketData ---
            raw_records = ExternalGovDataAPI.fetch_latest_resale_data(
                months_back=months_back
            )
            if raw_records is None:
                self._last_status = "error_download"
                logger.error("UC5: Failed to retrieve resale data")
                return False

            # --- ValidatingMarketData ---
            valid_records = self._validate_records(raw_records)
            if valid_records is None:
                self._last_status = "error_validation"
                logger.error("UC5: Data validation failed")
                return False

            # --- UpdatingDatabase ---
            new_count = self._persist_transactions(valid_records)
            logger.info("UC5: %d new transactions persisted", new_count)

            if new_count == 0:
                self._last_status = "no_new_data"
                logger.info("UC5: Database already up to date")
                return True

            # --- CheckingWatchlists / SendingAlerts ---
            self._check_watchlists_and_alert()

            self._last_sync = datetime.utcnow()
            self._last_status = "success"
            logger.info("UC5: Sync completed at %s", self._last_sync)
            return True

        except Exception:
            self._last_status = "error"
            logger.exception("UC5: Unexpected error during sync")
            return False

    def get_sync_status(self):
        """Return current sync state for monitoring / health-check."""
        return {
            "last_sync": self._last_sync.isoformat() if self._last_sync else None,
            "status": self._last_status,
        }

    # ------------------------------------------------------------------
    # ValidatingMarketData
    # ------------------------------------------------------------------

    def _validate_records(self, raw_records):
        """Check data format and structural integrity.

        Returns a list of validated records, or None if the schema itself
        is broken (missing required columns).
        """
        if not raw_records:
            return []

        # Schema check on the first record
        first_keys = set(raw_records[0].keys())
        missing = self.REQUIRED_FIELDS - first_keys
        if missing:
            logger.error("UC5: Schema mismatch -- missing fields: %s", missing)
            return None

        valid = []
        skipped = 0

        for rec in raw_records:
            try:
                price = float(rec.get("resale_price", 0))
                area = float(rec.get("floor_area_sqm", 0))
                month = rec.get("month", "")

                if price <= 0 or area <= 0:
                    skipped += 1
                    continue

                # month must be YYYY-MM
                datetime.strptime(month, "%Y-%m")

                valid.append(rec)
            except (ValueError, TypeError):
                skipped += 1

        if skipped:
            logger.warning("UC5: Skipped %d invalid records", skipped)

        return valid

    # ------------------------------------------------------------------
    # UpdatingDatabase
    # ------------------------------------------------------------------

    def _persist_transactions(self, valid_records):
        """Resolve block references, auto-create missing blocks via OneMap
        geocoding, and bulk-insert new transactions.

        Only records whose month is strictly after the latest transaction
        already stored are inserted, preventing duplicates across syncs.
        Returns the number of newly inserted rows.
        """
        if not valid_records:
            return 0

        # Latest month already in DB (None on first run)
        latest_date = db.session.query(
            db.func.max(Transaction.transaction_date)
        ).scalar()

        # Block lookup: (block_num, street_name) -> block_id
        block_lookup = {
            (b.block_num.strip().upper(), b.street_name.strip().upper()): b.block_id
            for b in HDBBlock.query.with_entities(
                HDBBlock.block_id, HDBBlock.block_num, HDBBlock.street_name
            ).all()
        }

        # --- First pass: collect unknown addresses that need geocoding ---
        addresses_to_geocode = set()
        for rec in valid_records:
            tx_date = datetime.strptime(rec["month"], "%Y-%m").date()
            if latest_date and tx_date <= latest_date:
                continue

            block_num = rec.get("block", "").strip().upper()
            street = rec.get("street_name", "").strip().upper()
            if (block_num, street) not in block_lookup:
                addresses_to_geocode.add((
                    block_num,
                    street,
                    rec.get("lease_commence_date", ""),
                ))

        # --- Batch geocode and create blocks ---
        if addresses_to_geocode:
            logger.info(
                "UC5: %d unknown blocks found — geocoding via OneMap",
                len(addresses_to_geocode),
            )
            created = 0
            for block_num, street, lease_str in addresses_to_geocode:
                block_id = self._geocode_and_create_block(
                    block_num, street, lease_str
                )
                if block_id is not None:
                    block_lookup[(block_num, street)] = block_id
                    created += 1
            logger.info("UC5: Created %d new HDB blocks", created)

        # --- Second pass: build transactions ---
        new_transactions = []
        unmatched_blocks = set()

        for rec in valid_records:
            tx_date = datetime.strptime(rec["month"], "%Y-%m").date()

            # Skip months we already have
            if latest_date and tx_date <= latest_date:
                continue

            block_num = rec.get("block", "").strip().upper()
            street = rec.get("street_name", "").strip().upper()
            block_id = block_lookup.get((block_num, street))

            if block_id is None:
                unmatched_blocks.add((block_num, street))
                continue

            new_transactions.append(Transaction(
                block_id=block_id,
                resale_price=float(rec["resale_price"]),
                floor_area_sqm=int(float(rec["floor_area_sqm"])),
                transaction_date=tx_date,
                flat_type=rec.get("flat_type", "").strip(),
            ))

        if unmatched_blocks:
            logger.warning(
                "UC5: %d block addresses could not be geocoded — "
                "transactions skipped",
                len(unmatched_blocks),
            )

        if new_transactions:
            PersistentStore.bulk_insert_transactions(new_transactions)

        return len(new_transactions)

    # ------------------------------------------------------------------
    # Auto-create HDB blocks (geocode via OneMap boundary)
    # ------------------------------------------------------------------

    def _geocode_and_create_block(self, block_num, street_name, lease_str):
        """Geocode an address via ExternalOneMapAPI and insert a new HDB block.

        Returns the new block_id, or None if geocoding fails.
        """
        cache_key = (block_num, street_name)

        # Check geocode cache (avoids re-calling OneMap for retries)
        if cache_key in self._geocode_cache:
            coords = self._geocode_cache[cache_key]
        else:
            coords = ExternalOneMapAPI.request_coordinates(
                f"{block_num} {street_name}"
            )
            self._geocode_cache[cache_key] = coords

        if coords is None:
            return None

        lat, lng = coords
        lease_year = None
        if lease_str:
            try:
                lease_year = int(lease_str)
            except (ValueError, TypeError):
                pass

        try:
            result = db.session.execute(
                text("""
                    INSERT INTO hdb_blocks
                        (street_name, block_num, lease_start_year, location)
                    VALUES
                        (:street, :block, :lease,
                         ST_SetSRID(ST_MakePoint(:lng, :lat), 4326)::geography)
                    RETURNING block_id
                """),
                {
                    "street": street_name,
                    "block": block_num,
                    "lease": lease_year,
                    "lng": lng,
                    "lat": lat,
                },
            )
            db.session.flush()
            block_id = result.scalar()
            return block_id
        except Exception:
            db.session.rollback()
            logger.exception(
                "UC5: Failed to insert block %s %s", block_num, street_name
            )
            return None

    # ------------------------------------------------------------------
    # CheckingWatchlists / SendingAlerts
    # ------------------------------------------------------------------

    def _check_watchlists_and_alert(self):
        """Delegate to WatchlistController to match new data against
        active subscriptions and dispatch email notifications.

        Gracefully skips if the watchlist module is not yet implemented.
        """
        try:
            from backend.control.watchlist_controller import WatchlistController
            WatchlistController.check_triggers_and_send_alerts()
            logger.info("UC5: Watchlist alerts dispatched")
        except (ImportError, AttributeError):
            logger.info(
                "UC5: WatchlistController not available -- skipping alerts"
            )
