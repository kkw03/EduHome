# TODO: SearchMapUI — Flask blueprint for search & map endpoints
# TODO: POST /api/search — accept school name, return HDB blocks in 1km/2km zones (UC1, FR1)
# TODO: GET  /api/search/heatmap — return affordability heatmap overlay data (UC7, FR4)
# TODO: GET  /api/search/hidden-gems — return undervalued blocks (UC3, FR2)
# TODO: Error response for invalid school name (ErrorInvalidSchool)
# TODO: Error response for service unavailable (ErrorServiceDown)

from flask import Blueprint, jsonify, request

from backend.control.search_controller import SearchController
from backend.control.analytics_controller import AnalyticsController
from backend.entity.primary_school import PrimarySchool

# Blueprint for search and map endpoints
search_bp = Blueprint("search", __name__)


@search_bp.route("/schools", methods=["GET"])
def get_all_schools():
    """Return all primary schools for autocomplete and map display."""
    try:
        schools = PrimarySchool.query.all()
        return jsonify([
            {
                "school_id": s.school_id,
                "official_name": s.official_name,
                "postal_code": s.postal_code,
                "latitude": s.latitude,
                "longitude": s.longitude,
                "vacancies": s.vacancies,
            }
            for s in schools
        ]), 200
    except Exception as e:
        return jsonify({
            "error": "Service unavailable",
            "details": str(e)
        }), 500


@search_bp.route("/search", methods=["POST"])
def search_school_zone():
    """
    Search for a school and return 1km/2km block results.
    """
    try:
        data = request.get_json(silent=True) or {}
        school_name = data.get("school_name")

        if not school_name:
            return jsonify({"error": "school_name is required"}), 400

        result = SearchController.search_school_priority_zone(school_name)

        if result is None:
            return jsonify({"error": "Invalid school name"}), 404

        return jsonify(result), 200

    except Exception as e:
        return jsonify({
            "error": "Service unavailable",
            "details": str(e)
        }), 500


@search_bp.route("/search/heatmap", methods=["POST"])
def get_heatmap():
    """
    Return heatmap data for blocks from a school search result.
    """
    try:
        data = request.get_json(silent=True) or {}
        school_name = data.get("school_name")

        if not school_name:
            return jsonify({"error": "school_name is required"}), 400

        result = SearchController.search_school_priority_zone(school_name)

        if result is None:
            return jsonify({"error": "Invalid school name"}), 404

        all_blocks = result["gold"] + result["silver"]
        heatmap_blocks = AnalyticsController.generate_affordability_heatmap(all_blocks)

        return jsonify({"blocks": heatmap_blocks}), 200

    except Exception as e:
        return jsonify({
            "error": "Service unavailable",
            "details": str(e)
        }), 500


@search_bp.route("/search/hidden-gems", methods=["POST"])
def get_hidden_gems():
    """
    Return undervalued blocks from a school search result.
    """
    try:
        data = request.get_json(silent=True) or {}
        school_name = data.get("school_name")

        if not school_name:
            return jsonify({"error": "school_name is required"}), 400

        result = SearchController.search_school_priority_zone(school_name)

        if result is None:
            return jsonify({"error": "Invalid school name"}), 404

        # Hidden gems are based on blocks in the 1km zone
        gold_blocks = result["gold"]
        hidden_gems = AnalyticsController.calculate_valuation_gap(gold_blocks)

        return jsonify({"blocks": hidden_gems}), 200

    except Exception as e:
        return jsonify({
            "error": "Service unavailable",
            "details": str(e)
        }), 500