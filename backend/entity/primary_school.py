# TODO: PrimarySchool model — SQLAlchemy (db.Model)
# TODO: __tablename__ = "primary_schools"
# TODO: Columns: school_id (Integer, PK), official_name (String), postal_code (Integer),
#       location (Geography(Point, 4326) via GeoAlchemy2), vacancies (Integer)
# TODO: Relationship: zones = db.relationship("PriorityZone", backref="school")
# TODO: getDetails() — return formatted school info string
# TODO: updateVacancies(count) — set vacancies and commit

from backend.entity import db


class PrimarySchool(db.Model):
    __tablename__ = "primary_schools"

    school_id     = db.Column(db.Integer, primary_key=True)
    official_name = db.Column(db.String(255), nullable=False)
    postal_code   = db.Column(db.Integer)
    latitude      = db.Column(db.Float, nullable=False)
    longitude     = db.Column(db.Float, nullable=False)
    vacancies     = db.Column(db.Integer, default=0)

    def get_details(self):
        return f"{self.official_name} ({self.postal_code})"

    def update_vacancies(self, count):
        self.vacancies = count
        db.session.commit()
