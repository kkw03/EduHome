# TODO: Watchlist model — SQLAlchemy (db.Model)
# TODO: __tablename__ = "watchlists"
# TODO: Columns: watchlist_id (Integer, PK), user_id (Integer, FK → users, unique)
# TODO: Relationship: items = db.relationship("WatchlistItem", backref="watchlist", cascade="all, delete-orphan")
# TODO: addItem(item) — append WatchlistItem and commit
# TODO: removeItem(watchID) — delete WatchlistItem by ID and commit
# TODO: getItems() — return items filtered by is_active=True

from backend.entity import db


class Watchlist(db.Model):
    __tablename__ = "watchlists"

    watchlist_id = db.Column(db.Integer, primary_key=True)
    user_id      = db.Column(db.Integer, db.ForeignKey("users.user_id"), unique=True)

    items = db.relationship("WatchlistItem", backref="watchlist", cascade="all, delete-orphan")

    def add_item(self, item):
        self.items.append(item)
        db.session.commit()

    def remove_item(self, watch_id):
        from backend.entity.watchlist_item import WatchlistItem
        item = WatchlistItem.query.get(watch_id)
        if item and item.watchlist_id == self.watchlist_id:
            db.session.delete(item)
            db.session.commit()

    def get_items(self):
        return [item for item in self.items if item.is_active]
