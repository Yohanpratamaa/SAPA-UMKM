"""
Routes Package - Export all blueprints
"""
from app.routes.auth import auth_bp
from app.routes.profile import profile_bp
from app.routes.product import product_bp
from app.routes.training import training_bp
from app.routes.faq import faq_bp

__all__ = [
    'auth_bp',
    'profile_bp',
    'product_bp',
    'training_bp',
    'faq_bp'
]
