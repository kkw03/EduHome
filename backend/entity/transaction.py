# TODO: Transaction model — SQLAlchemy (db.Model)
# TODO: __tablename__ = "transactions"
# TODO: Columns: transaction_id (Integer, PK), block_id (Integer, FK → hdb_blocks),
#       resale_price (Numeric), floor_area_sqm (Integer),
#       transaction_date (Date), flat_type (String)
# TODO: calculatePSF() — return resale_price / (floor_area_sqm * 10.764)
# TODO: Indexes: transaction_date (for trend queries, NFR4), block_id (for block lookups)
