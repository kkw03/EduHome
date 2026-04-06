# TODO: Create Flask app instance via Flask(__name__)
# TODO: Load config from config.py (app.config.from_object)
# TODO: Initialise SQLAlchemy db instance and bind to app (db.init_app)
# TODO: Initialise Flask-Login login_manager and bind to app
# TODO: Register blueprints: search_map_routes, filter_panel_routes, watchlist_routes,
#       auth_routes, trend_routes, ballot_risk_routes, commute_routes
# TODO: Enable CORS for React frontend dev server (flask-cors)
# TODO: Create all database tables on first run (db.create_all)
# TODO: Start APScheduler for background data sync (EduHomeSystem.startDataSync / UC5)
# TODO: Configure demo mode fallback if external APIs are offline (NFR3)

from flask import Flask, jsonify
from flask_cors import CORS
from flask_login import LoginManager
from backend.config import Config
from backend.entity import db
from backend.entity.user import User


login_manager = LoginManager()


@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))


@login_manager.unauthorized_handler
def unauthorized():
    return jsonify({"success": False, "error": "Authentication required"}), 401


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Initialise extensions
    db.init_app(app)
    login_manager.init_app(app)
    login_manager.session_protection = "strong"
    CORS(app, supports_credentials=True)

    # Register blueprints
    # TODO: Register boundary route blueprints as they are implemented
    from backend.boundary.search_map_routes import search_bp
    from backend.boundary.filter_panel_routes import filter_bp
    from backend.boundary.watchlist_routes import watchlist_bp
    from backend.boundary.auth_routes import auth_bp
    from backend.boundary.trend_routes import trend_bp
    from backend.boundary.ballot_risk_routes import ballot_bp
    from backend.boundary.commute_routes import commute_bp
    app.register_blueprint(search_bp, url_prefix="/api")
    app.register_blueprint(filter_bp, url_prefix="/api")
    app.register_blueprint(watchlist_bp, url_prefix="/api")
    app.register_blueprint(auth_bp, url_prefix="/api")
    app.register_blueprint(trend_bp, url_prefix="/api")
    app.register_blueprint(ballot_bp, url_prefix="/api")
    app.register_blueprint(commute_bp, url_prefix="/api")

    # Create tables on first run
    with app.app_context():
        db.create_all()

    return app


if __name__ == "__main__":
    app = create_app()
    app.run(debug=True, port=5001)
