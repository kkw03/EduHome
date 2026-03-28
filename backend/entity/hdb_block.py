# TODO: HDBBlock model — SQLAlchemy (db.Model) with PostGIS point
# TODO: __tablename__ = "hdb_blocks"
# TODO: Columns: block_id (Integer, PK), street_name (String), block_num (String),
#       lease_start_year (Integer), total_units (Integer),
#       location (Geography(Point, 4326) via GeoAlchemy2)
# TODO: Relationship: transactions = db.relationship("Transaction", backref="block")
# TODO: getRemainingLease(currentYear) — return 99 - (currentYear - lease_start_year)
# TODO: getLatestTransactions() — query Transaction ordered by date desc
# TODO: GIST index on location column for < 2s radius queries (NFR1)

from backend.entity import db


class HDBBlock(db.Model):
    __tablename__ = "hdb_blocks"

    block_id         = db.Column(db.Integer, primary_key=True)
    street_name      = db.Column(db.String(255))
    block_num        = db.Column(db.String(10))
    lease_start_year = db.Column(db.Integer)
    total_units      = db.Column(db.Integer)
    latitude         = db.Column(db.Float, nullable=False)
    longitude        = db.Column(db.Float, nullable=False)

    transactions = db.relationship("Transaction", backref="block")

    def get_remaining_lease(self, current_year):
        return 99 - (current_year - self.lease_start_year)

    def get_latest_transactions(self):
        from backend.entity.transaction import Transaction
        return Transaction.query.filter_by(block_id=self.block_id)\
            .order_by(Transaction.transaction_date.desc()).all()
