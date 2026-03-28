"""
WatchlistController — subscription and alert logic (UC4, FR7).

Manages watchlist items and matches new transactions against
active subscriptions to send email alerts.
"""

import logging
from datetime import date, timedelta

from backend.entity import db
from backend.entity.user import User
from backend.entity.watchlist import Watchlist
from backend.entity.watchlist_item import WatchlistItem
from backend.entity.primary_school import PrimarySchool
from backend.entity.transaction import Transaction
from backend.entity.hdb_block import HDBBlock

from sqlalchemy import func

logger = logging.getLogger(__name__)


class WatchlistController:

    # ------------------------------------------------------------------
    # UC4 — Manage Watchlist
    # ------------------------------------------------------------------

    @staticmethod
    def add_watchlist_item(user_id, school_id, min_budget, max_budget):
        """Subscribe a user to a school zone.

        Creates the user's watchlist if it doesn't exist yet.
        Returns the new WatchlistItem, or None on error.
        """
        user = User.query.get(user_id)
        if user is None:
            return None

        # Validate contact — alerts require contact details
        if not user.contact_no:
            logger.warning("UC4: User %d has no contact — alerts disabled", user_id)

        # Ensure watchlist exists
        watchlist = Watchlist.query.filter_by(user_id=user_id).first()
        if watchlist is None:
            watchlist = Watchlist(user_id=user_id)
            db.session.add(watchlist)
            db.session.flush()

        item = WatchlistItem(
            watchlist_id=watchlist.watchlist_id,
            school_id=school_id,
            min_budget=min_budget,
            max_budget=max_budget,
            is_active=True,
        )
        db.session.add(item)
        db.session.commit()
        return item

    @staticmethod
    def remove_watchlist_item(watch_id, user_id):
        """Remove a watchlist item. Verifies ownership via user_id.

        Returns True if removed, False if not found or not owned.
        """
        item = WatchlistItem.query.get(watch_id)
        if item is None:
            return False

        watchlist = Watchlist.query.get(item.watchlist_id)
        if watchlist is None or watchlist.user_id != user_id:
            return False

        db.session.delete(item)
        db.session.commit()
        return True

    @staticmethod
    def get_user_watchlist(user_id):
        """Return all watchlist items for a user.

        Returns list of dicts with school info and budget criteria.
        """
        watchlist = Watchlist.query.filter_by(user_id=user_id).first()
        if watchlist is None:
            return []

        items = []
        for item in watchlist.items:
            school = PrimarySchool.query.get(item.school_id)
            items.append({
                "watch_id": item.watch_id,
                "school_id": item.school_id,
                "school_name": school.official_name if school else None,
                "min_budget": float(item.min_budget) if item.min_budget else None,
                "max_budget": float(item.max_budget) if item.max_budget else None,
                "is_active": item.is_active,
            })

        return items

    # ------------------------------------------------------------------
    # Alert checking (called by DataSyncController after new data)
    # ------------------------------------------------------------------

    @staticmethod
    def check_triggers_and_send_alerts():
        """Match recent transactions against all active watchlist items.

        A match occurs when a transaction's block is within 2km of the
        watchlist school and the resale price falls within the budget range.
        """
        # Transactions from the last 7 days
        cutoff = date.today() - timedelta(days=7)
        recent_transactions = (
            Transaction.query
            .filter(Transaction.transaction_date >= cutoff)
            .all()
        )

        if not recent_transactions:
            logger.info("UC5: No recent transactions to match")
            return

        active_items = (
            WatchlistItem.query
            .filter_by(is_active=True)
            .all()
        )

        for item in active_items:
            school = PrimarySchool.query.get(item.school_id)
            if school is None:
                continue

            for tx in recent_transactions:
                block = HDBBlock.query.get(tx.block_id)
                if block is None:
                    continue

                # Check if block is within 2km of the school.
                # Use column references so PostGIS applies geography
                # semantics (metres) instead of geometry (degrees).
                within = db.session.query(
                    func.ST_DWithin(
                        HDBBlock.location, PrimarySchool.location, 2000,
                    )
                ).filter(
                    HDBBlock.block_id == tx.block_id,
                    PrimarySchool.school_id == item.school_id,
                ).scalar()

                if not within:
                    continue

                # Check budget range
                price = float(tx.resale_price)
                min_b = float(item.min_budget) if item.min_budget else 0
                max_b = float(item.max_budget) if item.max_budget else float("inf")

                if min_b <= price <= max_b:
                    WatchlistController._send_alert(item, tx, block, school)

    @staticmethod
    def _send_alert(item, transaction, block, school):
        """Dispatch an email alert for a matched transaction.

        Gracefully skips if Flask-Mail is not configured.
        """
        watchlist = Watchlist.query.get(item.watchlist_id)
        if watchlist is None:
            return

        user = User.query.get(watchlist.user_id)
        if user is None or not user.email:
            return

        logger.info(
            "UC5: Alert → %s | %s Blk %s @ $%s near %s",
            user.email,
            block.street_name,
            block.block_num,
            transaction.resale_price,
            school.official_name,
        )

        try:
            from flask_mail import Message
            from flask import current_app

            mail = current_app.extensions.get("mail")
            if mail is None:
                logger.info("UC5: Flask-Mail not configured — alert logged only")
                return

            msg = Message(
                subject=f"EduHome Alert: New transaction near {school.official_name}",
                recipients=[user.email],
                body=(
                    f"A new HDB resale transaction was recorded near "
                    f"{school.official_name}:\n\n"
                    f"  Block: {block.block_num} {block.street_name}\n"
                    f"  Price: ${transaction.resale_price:,.0f}\n"
                    f"  Flat Type: {transaction.flat_type}\n"
                    f"  Floor Area: {transaction.floor_area_sqm} sqm\n"
                    f"  Date: {transaction.transaction_date}\n\n"
                    f"Your budget: ${float(item.min_budget):,.0f} – "
                    f"${float(item.max_budget):,.0f}\n\n"
                    f"— EduHome P1 Registration Strategist"
                ),
            )
            mail.send(msg)
        except Exception:
            logger.debug("UC5: Email send failed", exc_info=True)
