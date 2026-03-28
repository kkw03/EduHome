# TODO: User model — SQLAlchemy (db.Model) + Flask-Login (UserMixin)
# TODO: __tablename__ = "users"
# TODO: Columns: user_id (Integer, PK), email (String, unique), password_hash (String), contact_no (String)
# TODO: Relationship: watchlist = db.relationship("Watchlist", backref="owner", uselist=False)
# TODO: authenticate(pw) — check_password_hash(self.password_hash, pw)
# TODO: updateContact(email, no) — update fields and db.session.commit()

from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin
from backend.entity import db


class User(db.Model, UserMixin):
    __tablename__ = "users"

    user_id       = db.Column(db.Integer, primary_key=True)
    email         = db.Column(db.String(255), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    contact_no    = db.Column(db.String(20))

    watchlist = db.relationship("Watchlist", backref="owner", uselist=False)

    def get_id(self):
        return str(self.user_id)

    def authenticate(self, pw):
        return check_password_hash(self.password_hash, pw)

    def set_password(self, pw):
        self.password_hash = generate_password_hash(pw)

    def update_contact(self, email, no):
        self.email = email
        self.contact_no = no
        db.session.commit()
