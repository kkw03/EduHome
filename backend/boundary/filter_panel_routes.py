# TODO: FilterPanelUI — Flask blueprint for filter endpoints
# TODO: POST /api/filter — accept maxBudget, minArea, childStartYear (UC2)
# TODO: Validate numeric inputs (ErrorInvalidInput)
# TODO: Return filtered HDB blocks matching criteria
# TODO: Apply lease decay guard via childStartYear filter (FR6)

from flask import Blueprint, jsonify, request

from backend.control.search_controller import SearchController

# Blueprint for filter endpoints
filter_bp = Blueprint("filter", __name__)


@filter_bp.route("/filter", methods=["POST"])
def apply_filters():
    """
    Apply budget, area, and lease filters to blocks.
    """
    try:
        data = request.get_json(silent=True) or {}

        blocks = data.get("blocks", [])
        max_budget = data.get("maxBudget")
        min_area = data.get("minArea")
        child_start_year = data.get("childStartYear")

        if not isinstance(blocks, list):
            return jsonify({"error": "blocks must be a list"}), 400

        try:
            if max_budget not in (None, ""):
                max_budget = float(max_budget)
                if max_budget < 0:
                    raise ValueError

            if min_area not in (None, ""):
                min_area = int(min_area)
                if min_area < 0:
                    raise ValueError

            if child_start_year not in (None, ""):
                child_start_year = int(child_start_year)
                if child_start_year < 0:
                    raise ValueError

        except (TypeError, ValueError):
            return jsonify({"error": "Invalid numeric input"}), 400

        filtered_blocks = SearchController.filter_by_budget_and_area(
            blocks,
            max_price=max_budget,
            min_area=min_area,
        )

        if child_start_year is not None:
            filtered_blocks = SearchController.apply_lease_decay_guard(
                filtered_blocks,
                child_start_year,
            )

        return jsonify({"blocks": filtered_blocks}), 200

    except Exception as e:
        return jsonify({
            "error": "Service unavailable",
            "details": str(e)
        }), 500