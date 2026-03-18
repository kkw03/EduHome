# TODO: PrimarySchool model — SQLAlchemy (db.Model)
# TODO: __tablename__ = "primary_schools"
# TODO: Columns: school_id (Integer, PK), official_name (String), postal_code (Integer),
#       location (Geography(Point, 4326) via GeoAlchemy2), vacancies (Integer)
# TODO: Relationship: zones = db.relationship("PriorityZone", backref="school")
# TODO: getDetails() — return formatted school info string
# TODO: updateVacancies(count) — set vacancies and commit
