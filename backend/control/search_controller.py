"""
SearchController — core search and zone logic (UC1, UC2, UC9).

FR1: Priority Zone Search — HDB blocks within 1km Gold / 2km Silver
FR6: Lease Decay Guard — flag blocks with insufficient remaining lease
"""

from datetime import date

from sqlalchemy import func
from geoalchemy2 import Geography

from backend.entity import db
from backend.entity.primary_school import PrimarySchool
from backend.entity.priority_zone import PriorityZone
from backend.entity.hdb_block import HDBBlock
from backend.entity.transaction import Transaction


class SearchController:

    # ------------------------------------------------------------------
    # UC1 — Search School Priority Zone (FR1)
    # ------------------------------------------------------------------

    @staticmethod
    def validate_school_name(name):
        """Check school name against PrimarySchool dataset.

        Returns the PrimarySchool row if found, else None.
        """
        if not name or not name.strip():
            return None
        return PrimarySchool.query.filter(
            PrimarySchool.official_name.ilike(f"%{name.strip()}%")
        ).first()

    @staticmethod
    def search_school_priority_zone(school_name):
        """Retrieve all HDB blocks within 1km (Gold) and 2km (Silver) of a school.

        Returns dict: {"school": {...}, "gold": [...], "silver": [...]}
        or None if school not found.

        Uses PostGIS ST_DWithin for indexed spatial lookup (NFR1 < 2s).
        """
        school = SearchController.validate_school_name(school_name)
        if school is None:
            return None

        gold_blocks = (
            HDBBlock.query
            .filter(
                func.ST_DWithin(
                    HDBBlock.location,
                    school.location,
                    1000,  # 1km in metres (geography type)
                )
            )
            .all()
        )

        silver_blocks = (
            HDBBlock.query
            .filter(
                func.ST_DWithin(
                    HDBBlock.location,
                    school.location,
                    2000,  # 2km
                ),
                ~func.ST_DWithin(
                    HDBBlock.location,
                    school.location,
                    1000,
                ),
            )
            .all()
        )

        return {
            "school": {
                "school_id": school.school_id,
                "official_name": school.official_name,
                "postal_code": school.postal_code,
                "latitude": school.latitude,
                "longitude": school.longitude,
                "vacancies": school.vacancies,
            },
            "gold": [SearchController._block_to_dict(b, "GOLD_1KM") for b in gold_blocks],
            "silver": [SearchController._block_to_dict(b, "SILVER_2KM") for b in silver_blocks],
        }

    # ------------------------------------------------------------------
    # UC2 — Filter by Budget and Area
    # ------------------------------------------------------------------

    @staticmethod
    def filter_by_budget_and_area(blocks, max_price=None, min_area=None):
        """Filter a list of block dicts by most recent transaction price
        and floor area.

        Args:
            blocks: List of block dicts (from search_school_priority_zone).
            max_price: Maximum resale price filter (float), or None.
            min_area: Minimum floor area in sqm (int), or None.

        Returns filtered list.
        """
        if max_price is None and min_area is None:
            return blocks

        filtered = []
        for block in blocks:
            bid = block["block_id"]
            latest = (
                Transaction.query
                .filter_by(block_id=bid)
                .order_by(Transaction.transaction_date.desc())
                .first()
            )
            if latest is None:
                # No transactions — keep block but it won't match price filter
                if max_price is None:
                    filtered.append(block)
                continue

            if max_price is not None and float(latest.resale_price) > max_price:
                continue
            if min_area is not None and latest.floor_area_sqm < min_area:
                continue

            filtered.append(block)

        return filtered

    # ------------------------------------------------------------------
    # UC9 ��� Lease Decay Guard (FR6)
    # ------------------------------------------------------------------

    @staticmethod
    def apply_lease_decay_guard(blocks, child_start_year):
        """Flag blocks where remaining lease is insufficient for 6 years
        of primary education starting from child_start_year.

        Adds 'lease_warning' boolean and 'remaining_lease' int to each block dict.
        """
        required_years = child_start_year + 6 - date.today().year
        current_year = date.today().year

        for block in blocks:
            remaining = 99 - (current_year - block.get("lease_start_year", current_year))
            block["remaining_lease"] = remaining
            block["lease_warning"] = remaining < required_years

        return blocks

    # ------------------------------------------------------------------
    # Helpers
    # ------------------------------------------------------------------

    @staticmethod
    def _block_to_dict(block, zone):
        """Convert an HDBBlock ORM object to a JSON-serialisable dict."""
        latest = (
            Transaction.query
            .filter_by(block_id=block.block_id)
            .order_by(Transaction.transaction_date.desc())
            .first()
        )
        avg_psf = latest.calculate_psf() if latest else None

        return {
            "block_id": block.block_id,
            "street_name": block.street_name,
            "block_num": block.block_num,
            "latitude": block.latitude,
            "longitude": block.longitude,
            "lease_start_year": block.lease_start_year,
            "total_units": block.total_units,
            "zone": zone,
            "avg_psf": round(avg_psf, 2) if avg_psf else None,
        }
