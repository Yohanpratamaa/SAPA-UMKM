"""
SAPA-UMKM Backend Application Entry Point
"""
import os

from app.models import (FAQ, Consultation, FAQCategory, Product, Profile,
                        Training, TrainingEnrollment, User)

from app import create_app, db

# Create application
app = create_app(os.getenv('FLASK_ENV', 'development'))


@app.shell_context_processor
def make_shell_context():
    """Make shell context for flask shell"""
    return {
        'db': db,
        'User': User,
        'Profile': Profile,
        'Product': Product,
        'Training': Training,
        'TrainingEnrollment': TrainingEnrollment,
        'FAQ': FAQ,
        'FAQCategory': FAQCategory,
        'Consultation': Consultation
    }


@app.cli.command('init-db')
def init_db():
    """Initialize database tables"""
    db.create_all()
    print('Database tables created successfully!')


@app.cli.command('seed-db')
def seed_db():
    """Seed database with sample data"""
    from app.utils.seeder import seed_all
    seed_all()
    print('Database seeded successfully!')


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
