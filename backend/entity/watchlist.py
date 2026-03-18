# TODO: Watchlist model — SQLAlchemy (db.Model)
# TODO: __tablename__ = "watchlists"
# TODO: Columns: watchlist_id (Integer, PK), user_id (Integer, FK → users, unique)
# TODO: Relationship: items = db.relationship("WatchlistItem", backref="watchlist", cascade="all, delete-orphan")
# TODO: addItem(item) — append WatchlistItem and commit
# TODO: removeItem(watchID) — delete WatchlistItem by ID and commit
# TODO: getItems() — return items filtered by is_active=True
