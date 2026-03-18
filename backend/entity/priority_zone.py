# TODO: PriorityZone model — SQLAlchemy (db.Model) with PostGIS geometry
# TODO: __tablename__ = "priority_zones"
# TODO: Columns: zone_id (Integer, PK), school_id (Integer, FK → primary_schools),
#       radius_tier (String: 'GOLD_1KM' / 'SILVER_2KM'),
#       boundary (Geography(Polygon, 4326) via GeoAlchemy2)
# TODO: containsCoordinate(lat, lng) — ST_Contains / ST_DWithin query
# TODO: Spatial index on boundary column for NFR1 performance
