"""
AccountController — authentication and session management (UC4).

Handles login credential verification, session creation/destruction,
and integrates with Flask-Login for session persistence.
"""

import logging

from flask_login import login_user, logout_user
from werkzeug.security import generate_password_hash

from backend.entity import db
from backend.entity.user import User

logger = logging.getLogger(__name__)


class AccountController:

    @staticmethod
    def verify_credentials(email, password):
        """Verify login credentials against stored User record.

        Returns the User object on success, None on failure.
        """
        if not email or not password:
            return None

        user = User.query.filter_by(email=email).first()
        if user is None:
            return None

        if user.authenticate(password):
            return user

        return None

    @staticmethod
    def create_session(user):
        """Create a Flask-Login session for the authenticated user.

        Returns True on success.
        """
        login_user(user)
        logger.info("UC4: Session created for user %s", user.email)
        return True

    @staticmethod
    def destroy_session():
        """Invalidate the current user session.

        Returns True on success.
        """
        logout_user()
        logger.info("UC4: Session destroyed")
        return True

    @staticmethod
    def register_user(email, password, contact_no=None):
        """Create a new user account.

        Returns the new User object, or None if email already taken.
        """
        if User.query.filter_by(email=email).first():
            return None

        user = User(
            email=email,
            password_hash=generate_password_hash(password),
            contact_no=contact_no,
        )
        db.session.add(user)
        db.session.commit()

        logger.info("UC4: New user registered: %s", email)
        return user
