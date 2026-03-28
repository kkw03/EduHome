"""
CommuteController — travel-time optimisation logic (UC10, FR8).

For users outside the 1km zone, finds the HDB block with the
shortest direct bus travel time to the school gate.
"""

import logging

from sqlalchemy import func

from backend.entity import db
from backend.entity.hdb_block import HDBBlock
from backend.entity.primary_school import PrimarySchool
from backend.boundary.external.onemap_api import ExternalOneMapAPI

logger = logging.getLogger(__name__)


class CommuteController:

    @staticmethod
    def get_commute_time(school_id, block_id):
        """Get public-transport commute time from a block to a school.

        Returns travel time in minutes (int), or None on failure.
        """
        school = PrimarySchool.query.get(school_id)
        block = HDBBlock.query.get(block_id)
        if school is None or block is None:
            return None

        return ExternalOneMapAPI.request_commute_time(
            start_lat=block.latitude,
            start_lng=block.longitude,
            end_lat=school.latitude,
            end_lng=school.longitude,
            mode="pt",
        )

    @staticmethod
    def find_best_alternative_blocks(school_id, top_n=3):
        """Rank Silver-zone blocks (1km–2km) by shortest commute to school.

        Returns a list of up to top_n dicts:
            [{"block_id", "street_name", "block_num", "travel_time_min",
              "distance_km", "latitude", "longitude"}, ...]

        Returns empty list if school not found or routing unavailable.
        """
        school = PrimarySchool.query.get(school_id)
        if school is None:
            return []

        # Blocks between 1km and 2km (Silver zone)
        silver_blocks = (
            HDBBlock.query
            .filter(
                func.ST_DWithin(HDBBlock.location, school.location, 2000),
                ~func.ST_DWithin(HDBBlock.location, school.location, 1000),
            )
            .all()
        )

        if not silver_blocks:
            return []

        results = []
        for block in silver_blocks:
            travel_time = ExternalOneMapAPI.request_commute_time(
                start_lat=block.latitude,
                start_lng=block.longitude,
                end_lat=school.latitude,
                end_lng=school.longitude,
                mode="pt",
            )

            if travel_time is None:
                continue

            # Approximate straight-line distance in km
            dist = db.session.query(
                func.ST_Distance(block.location, school.location)
            ).scalar()
            distance_km = round((dist or 0) / 1000, 1)

            results.append({
                "block_id": block.block_id,
                "street_name": block.street_name,
                "block_num": block.block_num,
                "latitude": block.latitude,
                "longitude": block.longitude,
                "travel_time_min": travel_time,
                "distance_km": distance_km,
            })

        # Sort by shortest travel time
        results.sort(key=lambda r: r["travel_time_min"])
        return results[:top_n]
