# TODO: Balloting Risk — Flask blueprint for ballot risk endpoints
# TODO: GET /api/ballot-risk/<schoolID> — return overcrowding risk score (UC8, FR5)
# TODO: GET /api/ballot-risk/<schoolID>/detail — return unit vs vacancy breakdown
# TODO: Error response for data unavailable (ErrorBallotData)

from flask import Blueprint, jsonify

from backend.control.analytics_controller import AnalyticsController

# Blueprint for ballot risk related endpoints
ballot_bp = Blueprint("ballot", __name__)


@ballot_bp.route("/ballot-risk/<int:school_id>", methods=["GET"])
def get_ballot_risk(school_id):
    """
    Return ballot risk for a selected school.
    """
    try:
        result = AnalyticsController.calculate_balloting_risk(school_id)

        if result is None:
            return jsonify({
                "error": "Ballot data unavailable for this school"
            }), 404

        return jsonify(result), 200

    except Exception as e:
        return jsonify({
            "error": "Service unavailable",
            "details": str(e)
        }), 500


@ballot_bp.route("/ballot-risk/<int:school_id>/detail", methods=["GET"])
def get_ballot_risk_detail(school_id):
    """
    Return the detailed unit vs vacancy breakdown for a school.
    """
    try:
        result = AnalyticsController.calculate_balloting_risk(school_id)

        if result is None:
            return jsonify({
                "error": "Ballot data unavailable for this school"
            }), 404

        detail = {
            "units_1km": result["units_1km"],
            "vacancies": result["vacancies"],
            "ratio": result["ratio"],
            "risk": result["risk"],
            "score": result["score"],
        }

        return jsonify(detail), 200

    except Exception as e:
        return jsonify({
            "error": "Service unavailable",
            "details": str(e)
        }), 500