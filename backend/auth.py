from flask import Blueprint, request, jsonify, make_response
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
import requests
from config import Config

# Defining auth blueprint
auth_bp = Blueprint('auth', __name__)

# Post google/login api endpoint
"""
when the frontend sends the oauth code this api exchanges it for the token and attaches
a jwt token for each subsequent request––this helps prevent token tampering
and prevents the user from manipulating tokens at client side via localStorage
"""
@auth_bp.route('/google_login', methods=['POST'])
def login():
    """
    Handle Google OAuth login.
    """
    # Get the authorization code from the request
    data = request.get_json()
    if not data or 'code' not in data:
        return jsonify({"error": "Missing authorization code"}), 400

    auth_code = data['code']

    token_data = {
        'code': auth_code,
        'client_id': Config.GOOGLE_CLIENT_ID,
        'client_secret': Config.GOOGLE_CLIENT_SECRET,
        'redirect_uri': 'postmessage',
        'grant_type': 'authorization_code'
    }

    try:
        # Exchange code for tokens
        token_response = requests.post(
            'https://oauth2.googleapis.com/token',
            data=token_data
        ).json()

        if 'error' in token_response:
            return jsonify({"error": token_response['error']}), 400

        # Get user info with the access token
        user_info = requests.get(
            'https://www.googleapis.com/oauth2/v3/userinfo',
            headers={'Authorization': f'Bearer {token_response["access_token"]}'}
        ).json()

        # Create a JWT token
        jwt_token = create_access_token(identity=user_info['email'])

        # Prepare response
        response = make_response(jsonify({
            "success": True,
            "user": {
                "email":   user_info.get('email', ''),
                "name":    user_info.get('name', ''),
                "picture": user_info.get('picture', '')
            }
        }))

        # Setting JWT as an HTTP-only cookie
        response.set_cookie(
            'access_token_cookie',
            value=jwt_token,
            httponly=True,
            secure=True,
            samesite='None',
            max_age=3600,  # 1 hour
            path='/'       # Make cookie available for all paths
        )

        return response, 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@auth_bp.route('/check-auth', methods=['GET'])
@jwt_required()  # ensures a valid jwt is present
def check_auth():
    """
    Check if the user is authenticated.
    """
    current_user = get_jwt_identity()  # extract the data from the token
    return jsonify({"authenticated": True, "user": current_user}), 200


@auth_bp.route('/logout', methods=['POST'])
def logout():
    """
    Handle user logout by clearing the JWT cookie.
    """
    response = make_response(jsonify({"success": True}))

    # Must match the cookie attributes used in set_cookie
    response.delete_cookie(
        'access_token_cookie',
        path='/',
        secure=True,         # same as when you set it
        samesite='None'      # same as when you set it
        # domain='.your-domain.com'  # include if you set a domain on the cookie
    )

    return response
