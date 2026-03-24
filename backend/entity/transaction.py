# TODO: Transaction model — SQLAlchemy (db.Model)
# TODO: __tablename__ = "transactions"
# TODO: Columns: transaction_id (Integer, PK), block_id (Integer, FK → hdb_blocks),
#       resale_price (Numeric), floor_area_sqm (Integer),
#       transaction_date (Date), flat_type (String)
# TODO: calculatePSF() — return resale_price / (floor_area_sqm * 10.764)
# TODO: Indexes: transaction_date (for trend queries, NFR4), block_id (for block lookups)

from backend.entity import db


class Transaction(db.Model):
    __tablename__ = "transactions"

    transaction_id   = db.Column(db.Integer, primary_key=True)
    block_id         = db.Column(db.Integer, db.ForeignKey("hdb_blocks.block_id"))
    resale_price     = db.Column(db.Numeric(12, 2))
    floor_area_sqm   = db.Column(db.Integer)
    transaction_date = db.Column(db.Date)
    flat_type        = db.Column(db.String(50))

    def calculate_psf(self):
        if self.floor_area_sqm and self.floor_area_sqm > 0:
            sqft = self.floor_area_sqm * 10.764
            return float(self.resale_price) / sqft
        return 0.0
