"""
SAPA-UMKM Backend Application Factory
"""
from app.config import config
from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_marshmallow import Marshmallow
from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy

# Initialize extensions
db = SQLAlchemy()
migrate = Migrate()
jwt = JWTManager()
ma = Marshmallow()


def create_app(config_name='development'):
    """Application factory pattern"""
    app = Flask(__name__)
    
    # Load configuration
    app.config.from_object(config[config_name])
    
    # Initialize extensions
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    ma.init_app(app)
    
    # Enable CORS for React Native
    CORS(app, resources={
        r"/api/*": {
            "origins": "*",
            "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization"]
        }
    })
    
    # Register blueprints
    from app.routes.auth import auth_bp
    from app.routes.faq import faq_bp
    from app.routes.product import product_bp
    from app.routes.profile import profile_bp
    from app.routes.training import training_bp
    
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(profile_bp, url_prefix='/api/profiles')
    app.register_blueprint(product_bp, url_prefix='/api/products')
    app.register_blueprint(training_bp, url_prefix='/api/trainings')
    app.register_blueprint(faq_bp, url_prefix='/api/faq')
    
    # Health check route
    @app.route('/api/health')
    def health_check():
        return {'status': 'healthy', 'message': 'SAPA-UMKM API is running'}
    
    # Create upload folder
    import os
    upload_folder = app.config['UPLOAD_FOLDER']
    if not os.path.exists(upload_folder):
        os.makedirs(upload_folder)
    
    return app
