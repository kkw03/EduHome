"""HDBBlock entity — maps to hdb_blocks table with PostGIS geography column."""

from geoalchemy2 import Geography
from geoalchemy2.elements import WKTElement
from geoalchemy2.shape import to_shape

from backend.entity import db


class HDBBlock(db.Model):
    __tablename__ = "hdb_blocks"

    block_id         = db.Column(db.Integer, primary_key=True)
    street_name      = db.Column(db.String(255))
    block_num        = db.Column(db.String(10))
    lease_start_year = db.Column(db.Integer)
    total_units      = db.Column(db.Integer)
    location         = db.Column(
        Geography(geometry_type="POINT", srid=4326), nullable=False
    )

    transactions = db.relationship("Transaction", backref="block")

    # --- Convenience lat/lng access ---

    @property
    def latitude(self):
        if self.location is not None:
            return to_shape(self.location).y
        return None

    @property
    def longitude(self):
        if self.location is not None:
            return to_shape(self.location).x
        return None

    @staticmethod
    def make_location(lat, lng):
        """Create a PostGIS geography value from lat/lng."""
        return WKTElement(f"POINT({lng} {lat})", srid=4326)

    # --- Domain methods ---

    def get_remaining_lease(self, current_year):
        return 99 - (current_year - self.lease_start_year)

    def get_latest_transactions(self):
        from backend.entity.transaction import Transaction
        return (
            Transaction.query
            .filter_by(block_id=self.block_id)
            .order_by(Transaction.transaction_date.desc())
            .all()
        )
