"""PrimarySchool entity — maps to primary_schools table with PostGIS geography column."""

from geoalchemy2 import Geography
from geoalchemy2.elements import WKTElement
from geoalchemy2.shape import to_shape

from backend.entity import db


class PrimarySchool(db.Model):
    __tablename__ = "primary_schools"

    school_id     = db.Column(db.Integer, primary_key=True)
    official_name = db.Column(db.String(255), nullable=False)
    postal_code   = db.Column(db.Integer)
    location      = db.Column(
        Geography(geometry_type="POINT", srid=4326), nullable=False
    )
    vacancies     = db.Column(db.Integer, default=0)

    zones = db.relationship("PriorityZone", backref="school")

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

    def get_details(self):
        return f"{self.official_name} ({self.postal_code})"

    def update_vacancies(self, count):
        self.vacancies = count
        db.session.commit()
