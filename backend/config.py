import os 
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configuration class
class Config:
    # Flask settings
    SECRET_KEY = os.environ.get('SECRET_KEY', 'default-dev-key')
    
    # JWT settings
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY', 'default-jwt-key')
    JWT_ACCESS_TOKEN_EXPIRES = 3600  # 1 hour
    
    # Google OAuth settings
    GOOGLE_CLIENT_ID = os.environ.get('GOOGLE_CLIENT_ID')
    GOOGLE_CLIENT_SECRET = os.environ.get('GOOGLE_CLIENT_SECRET')
    JWT_TOKEN_LOCATION = ['cookies']  # Look for JWT in cookies
    JWT_COOKIE_CSRF_PROTECT = False   # Disable CSRF protection for APIs