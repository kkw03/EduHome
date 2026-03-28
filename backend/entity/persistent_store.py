# TODO: PersistentStore — repository helper wrapping SQLAlchemy session operations
# TODO: saveTransaction(t) — db.session.add(t); db.session.commit()
# TODO: loadTransactions(dateRange=None) — Transaction.query with optional date filter
# TODO: saveWatchlist(w) — db.session.add(w); db.session.commit()
# TODO: loadWatchlist(userID) — Watchlist.query.filter_by(user_id=userID).first()
# TODO: saveUser(user) — db.session.add(user); db.session.commit()
# TODO: Bulk insert support for data sync (UC5, NFR4 — handle ~150k rows)

from backend.entity import db
from backend.entity.transaction import Transaction
from backend.entity.watchlist import Watchlist
from backend.entity.user import User


class PersistentStore:

    @staticmethod
    def save_transaction(t):
        db.session.add(t)
        db.session.commit()

    @staticmethod
    def load_transactions(date_range=None):
        query = Transaction.query
        if date_range:
            start, end = date_range
            query = query.filter(Transaction.transaction_date.between(start, end))
        return query.all()

    @staticmethod
    def save_watchlist(w):
        db.session.add(w)
        db.session.commit()

    @staticmethod
    def load_watchlist(user_id):
        return Watchlist.query.filter_by(user_id=user_id).first()

    @staticmethod
    def save_user(user):
        db.session.add(user)
        db.session.commit()

    @staticmethod
    def bulk_insert_transactions(transactions):
        db.session.bulk_save_objects(transactions)
        db.session.commit()
