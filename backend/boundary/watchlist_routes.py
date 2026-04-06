# TODO: WatchlistUI — Flask blueprint for watchlist endpoints
# TODO: GET    /api/watchlist          — retrieve user's watchlist (UC4)
# TODO: POST   /api/watchlist          — add school zone to watchlist (FR7)
# TODO: DELETE /api/watchlist/<watchID> — remove watchlist item
# TODO: Require authentication gate before access (LoginGate)
# TODO: Validate contact details before saving (ErrorInvalidContact)


from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user

# Controller layer (business logic)
from backend.control.watchlist_controller import WatchlistController


# WatchlistUI — Flask blueprint for watchlist endpoints
watchlist_bp = Blueprint("watchlist", __name__)


# GET /api/watchlist — retrieve user's watchlist (UC4)
# Require authentication gate before access (LoginGate)
@watchlist_bp.route("/watchlist", methods=["GET"])
@login_required
def get_watchlist():
    try:
        # current_user comes from Flask-Login session
        user_id = current_user.user_id

        items = WatchlistController.get_user_watchlist(user_id)

        return jsonify({
            "success": True,
            "watchlist": items
        }), 200

    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500


# POST /api/watchlist — add school zone to watchlist (FR7)
# Require authentication gate before access (LoginGate)
# Validate contact details before saving (ErrorInvalidContact)
@watchlist_bp.route("/watchlist", methods=["POST"])
@login_required
def add_watchlist():
    # Get JSON request body
    data = request.get_json()

    # Validate request body
    if not data:
        return jsonify({
            "success": False,
            "error": "Request body must be JSON"
        }), 400

    # Extract request fields
    school_id = data.get("school_id")
    min_budget = data.get("min_budget")
    max_budget = data.get("max_budget")

    # Basic required field validation
    if not school_id:
        return jsonify({
            "success": False,
            "error": "school_id is required"
        }), 400

    # Validate contact details before saving (ErrorInvalidContact)
    # Alerts require contact details according to the route 
    if not current_user.contact_no:
        return jsonify({
            "success": False,
            "error": "Valid contact details are required before saving to watchlist"
        }), 400

    try:
        # Create the watchlist item for the authenticated user
        item = WatchlistController.add_watchlist_item(
            user_id=current_user.user_id,
            school_id=school_id,
            min_budget=min_budget,
            max_budget=max_budget
        )

        if item is None:
            return jsonify({
                "success": False,
                "error": "Unable to create watchlist item"
            }), 400

        return jsonify({
            "success": True,
            "message": "Watchlist item added successfully",
            "watch_item": {
                "watch_id": item.watch_id,
                "school_id": item.school_id,
                "min_budget": float(item.min_budget) if item.min_budget else None,
                "max_budget": float(item.max_budget) if item.max_budget else None,
                "is_active": item.is_active
            }
        }), 201

    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500


# DELETE /api/watchlist/<watchID> — remove watchlist item
# Require authentication gate before access (LoginGate)
@watchlist_bp.route("/watchlist/<int:watch_id>", methods=["DELETE"])
@login_required
def delete_watchlist_item(watch_id):
    try:
        # Remove watchlist item only if it belongs to the current user
        removed = WatchlistController.remove_watchlist_item(
            watch_id=watch_id,
            user_id=current_user.user_id
        )

        if not removed:
            return jsonify({
                "success": False,
                "error": "Watchlist item not found or not owned by user"
            }), 404

        return jsonify({
            "success": True,
            "message": "Watchlist item removed successfully"
        }), 200

    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500