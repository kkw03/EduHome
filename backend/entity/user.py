# TODO: User model — SQLAlchemy (db.Model) + Flask-Login (UserMixin)
# TODO: __tablename__ = "users"
# TODO: Columns: user_id (Integer, PK), email (String, unique), password_hash (String), contact_no (String)
# TODO: Relationship: watchlist = db.relationship("Watchlist", backref="owner", uselist=False)
# TODO: authenticate(pw) — check_password_hash(self.password_hash, pw)
# TODO: updateContact(email, no) — update fields and db.session.commit()
