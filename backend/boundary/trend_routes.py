# TODO: Market Trend — Flask blueprint for trend endpoints
# TODO: GET /api/trend/<blockID> — return 12-month moving average data (UC6, FR3)
# TODO: Error response for insufficient historical data (ErrorTrendDataInsufficient)

from flask import Blueprint, jsonify

from backend.control.analytics_controller import AnalyticsController

# Blueprint for trend-related endpoints
trend_bp = Blueprint("trend", __name__)


@trend_bp.route("/trend/<int:block_id>", methods=["GET"])
def get_market_trend(block_id):
    """
    Return trend data for a selected block.
    """
    try:
        result = AnalyticsController.generate_market_trend(block_id)

        if result is None:
            return jsonify({
                "error": "Insufficient historical data for this block"
            }), 404

        return jsonify(result), 200

    except Exception as e:
        return jsonify({
            "error": "Service unavailable",
            "details": str(e)
        }), 500