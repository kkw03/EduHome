# TODO: Commute Optimizer — Flask blueprint for commute endpoints
# TODO: POST /api/commute — accept origin address + school, return best alternative block (UC10, FR8)
# TODO: Error response for invalid address (ErrorInvalidAddress)
# TODO: Error response for routing service unavailable (ErrorRoutingService)

from flask import Blueprint, request, jsonify

# Controller layer (business logic)
from backend.control.commute_controller import CommuteController


# Commute Optimizer — Flask blueprint for commute endpoints
commute_bp = Blueprint("commute", __name__)


# POST /api/commute — accept origin address + school, return best alternative block (UC10, FR8)
@commute_bp.route("/commute", methods=["POST"])
def get_best_commute_block():
    # Get JSON data from frontend request body
    data = request.get_json()

    # Validate that request body exists and is JSON
    if not data:
        return jsonify({
            "success": False,
            "error": "Request body must be JSON"
        }), 400

    # Extract fields from request
    # Note: current controller only uses school_id.
    origin_address = data.get("origin_address")
    school_id = data.get("school_id")
    top_n = data.get("top_n", 3)

    # Validate school_id
    if not school_id:
        return jsonify({
            "success": False,
            "error": "school_id is required"
        }), 400

    # Error response for invalid address (ErrorInvalidAddress)
    # Since the current controller does not process origin_address,
    # we only validate it if provided as an empty string.
    if origin_address is not None and not str(origin_address).strip():
        return jsonify({
            "success": False,
            "error": "Invalid address"
        }), 400

    try:
        # Convert top_n to integer if frontend passes it as string
        top_n = int(top_n)

        # Call controller to rank alternative blocks by shortest commute time
        results = CommuteController.find_best_alternative_blocks(
            school_id=school_id,
            top_n=top_n
        )

        # Error response for routing service unavailable (ErrorRoutingService)
        # Current controller returns an empty list when:
        # - school not found
        # - no silver-zone blocks found
        # - routing service fails for all blocks
        if results == []:
            return jsonify({
                "success": False,
                "error": "No alternative blocks found for the given school"
            }), 503

        # Return best block plus ranked alternatives
        return jsonify({
            "success": True,
            "message": "Best alternative blocks retrieved successfully",
            "best_block": results[0],
            "alternative_blocks": results
        }), 200

    except ValueError:
        return jsonify({
            "success": False,
            "error": "top_n must be an integer"
        }), 400

    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500