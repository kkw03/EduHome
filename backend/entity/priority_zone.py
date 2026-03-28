"""PriorityZone entity — maps to priority_zones table with PostGIS polygon boundary."""

from geoalchemy2 import Geography
from sqlalchemy import func

from backend.entity import db


class PriorityZone(db.Model):
    __tablename__ = "priority_zones"

    zone_id     = db.Column(db.Integer, primary_key=True)
    school_id   = db.Column(
        db.Integer, db.ForeignKey("primary_schools.school_id"), nullable=False
    )
    radius_tier = db.Column(db.String(20))  # 'GOLD_1KM' or 'SILVER_2KM'
    boundary    = db.Column(
        Geography(geometry_type="POLYGON", srid=4326), nullable=False
    )

    def contains_coordinate(self, lat, lng):
        """Check if a lat/lng point falls within this zone boundary."""
        point = func.ST_SetSRID(func.ST_MakePoint(lng, lat), 4326)
        return db.session.query(
            func.ST_Covers(self.boundary, point.cast(Geography))
        ).scalar()

    @classmethod
    def get_blocks_in_zone(cls, zone_id):
        """Return all HDB blocks whose location falls within this zone."""
        from backend.entity.hdb_block import HDBBlock
        zone = cls.query.get(zone_id)
        if zone is None:
            return []
        return (
            HDBBlock.query
            .filter(func.ST_Covers(zone.boundary, HDBBlock.location))
            .all()
        )
