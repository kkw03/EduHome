# TODO: WatchlistItem model — SQLAlchemy (db.Model)
# TODO: __tablename__ = "watchlist_items"
# TODO: Columns: watch_id (Integer, PK), watchlist_id (Integer, FK → watchlists),
#       school_id (Integer, FK → primary_schools),
#       min_budget (Numeric), max_budget (Numeric), is_active (Boolean, default=True)
# TODO: updateBudget(min, max) — set min_budget, max_budget and commit

from backend.entity import db


class WatchlistItem(db.Model):
    __tablename__ = "watchlist_items"

    watch_id     = db.Column(db.Integer, primary_key=True)
    watchlist_id = db.Column(db.Integer, db.ForeignKey("watchlists.watchlist_id"))
    school_id    = db.Column(db.Integer, db.ForeignKey("primary_schools.school_id"))
    min_budget   = db.Column(db.Numeric(12, 2))
    max_budget   = db.Column(db.Numeric(12, 2))
    is_active    = db.Column(db.Boolean, default=True)

    school = db.relationship("PrimarySchool")

    def update_budget(self, min_val, max_val):
        self.min_budget = min_val
        self.max_budget = max_val
        db.session.commit()
