# TODO: LoginUI — Flask blueprint for authentication endpoints
# TODO: POST /api/auth/login  — verify credentials, create session (UC4)
# TODO: POST /api/auth/logout — destroy session
# TODO: Error response for invalid credentials (ErrorAuthFailed)


from flask import Blueprint, request, jsonify
from flask_login import current_user, login_required

# Controller layer (business logic)
from backend.control.account_controller import AccountController


# LoginUI – Flask blueprint for authentication endpoints
auth_bp = Blueprint("auth", __name__)


# POST /api/auth/login – verify credentials, create session (UC4)
@auth_bp.route("/auth/login", methods=["POST"])
def login():
    # Get JSON data from the frontend request body
    data = request.get_json()

    # Validate that request body exists and is JSON
    if not data:
        return jsonify({
            "success": False,
            "error": "Request body must be JSON"
        }), 400

    # Extract login credentials from request
    email = data.get("email")
    password = data.get("password")

    # Check that both required fields are provided
    if not email or not password:
        return jsonify({
            "success": False,
            "error": "Email and password are required"
        }), 400

    try:
        # Verify credentials using the controller
        user = AccountController.verify_credentials(email, password)

        # Error response for invalid credentials (ErrorAuthFailed)
        if user is None:
            return jsonify({
                "success": False,
                "error": "Invalid credentials"
            }), 401

        # Create login session through controller
        AccountController.create_session(user)

        # Return success response
        return jsonify({
            "success": True,
            "message": "Login successful",
            "user": {
                "id": user.user_id,
                "email": user.email,
                "contact_no": user.contact_no
            }
        }), 200

    except Exception as e:
        # Catch unexpected backend/server errors
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500


# POST /api/auth/register – create a new user account
@auth_bp.route("/auth/register", methods=["POST"])
def register():
    data = request.get_json()

    if not data:
        return jsonify({
            "success": False,
            "error": "Request body must be JSON"
        }), 400

    email = data.get("email")
    password = data.get("password")
    contact_no = data.get("contact_no")

    if not email or not password:
        return jsonify({
            "success": False,
            "error": "Email and password are required"
        }), 400

    try:
        user = AccountController.register_user(email, password, contact_no)

        if user is None:
            return jsonify({
                "success": False,
                "error": "Email already registered"
            }), 409

        AccountController.create_session(user)

        return jsonify({
            "success": True,
            "message": "Registration successful",
            "user": {
                "id": user.user_id,
                "email": user.email,
                "contact_no": user.contact_no
            }
        }), 201

    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500


# GET /api/auth/me – return current authenticated user
@auth_bp.route("/auth/me", methods=["GET"])
@login_required
def me():
    return jsonify({
        "success": True,
        "user": {
            "id": current_user.user_id,
            "email": current_user.email,
            "contact_no": current_user.contact_no
        }
    }), 200


# POST /api/auth/logout – destroy session
@auth_bp.route("/auth/logout", methods=["POST"])
def logout():
    try:
        # Only allow logout if a user is currently authenticated
        if not current_user.is_authenticated:
            return jsonify({
                "success": False,
                "error": "No user is currently logged in"
            }), 401

        # Destroy session through controller
        AccountController.destroy_session()

        return jsonify({
            "success": True,
            "message": "Logout successful"
        }), 200

    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500