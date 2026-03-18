# TODO: HDBBlock model — SQLAlchemy (db.Model) with PostGIS point
# TODO: __tablename__ = "hdb_blocks"
# TODO: Columns: block_id (Integer, PK), street_name (String), block_num (String),
#       lease_start_year (Integer), total_units (Integer),
#       location (Geography(Point, 4326) via GeoAlchemy2)
# TODO: Relationship: transactions = db.relationship("Transaction", backref="block")
# TODO: getRemainingLease(currentYear) — return 99 - (currentYear - lease_start_year)
# TODO: getLatestTransactions() — query Transaction ordered by date desc
# TODO: GIST index on location column for < 2s radius queries (NFR1)
