# TODO: PersistentStore — repository helper wrapping SQLAlchemy session operations
# TODO: saveTransaction(t) — db.session.add(t); db.session.commit()
# TODO: loadTransactions(dateRange=None) — Transaction.query with optional date filter
# TODO: saveWatchlist(w) — db.session.add(w); db.session.commit()
# TODO: loadWatchlist(userID) — Watchlist.query.filter_by(user_id=userID).first()
# TODO: saveUser(user) — db.session.add(user); db.session.commit()
# TODO: Bulk insert support for data sync (UC5, NFR4 — handle ~150k rows)
