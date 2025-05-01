from flask import Flask, jsonify ,request
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from config import Config
from auth import auth_bp
from scraper import get_restaurants

# Initializing Flask app
app = Flask(__name__)
app.config.from_object(Config)

# Set up CORS with specific configuration to only allow my frontend to access the backend
CORS(app, 
     resources={r"/api/*": {"origins": "http://localhost:5173", "supports_credentials": True}},
     allow_headers=["Content-Type", "Authorization"],
     expose_headers=["Content-Type", "Authorization"],
     supports_credentials=True)

# Setting up JWT for handling auth and creating tokens
jwt = JWTManager(app)

# Register blueprints to modularize routes
app.register_blueprint(auth_bp, url_prefix='/api/auth')

# test api 
@app.route('/')
def index():
    return jsonify({"message": "Restaurant Scraper API"})

# a get api endpoint calls get_restaurant to start scraping and fetch restaurant data
@app.route('/api/scrape', methods=['GET'])
def get_restaurant_data():
    try:
        restaurants = get_restaurants()
        return jsonify(restaurants)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# any unknown route error
@app.errorhandler(404)
def not_found(e):
    return jsonify({"error": "Not found"}), 404

# internal server error
@app.errorhandler(500)
def server_error(e):
    return jsonify({"error": "Server error"}), 500

# run the server
if __name__ == '__main__':
    app.run(debug=True)