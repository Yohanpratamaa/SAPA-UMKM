"""
FAQ Model - UMKM FAQ/Consultation Management
"""
from datetime import datetime

from app import db


class FAQCategory(db.Model):
    """FAQ Category model"""
    __tablename__ = 'faq_categories'
    
    id = db.Column(db.Integer, primary_key=True)
    nama = db.Column(db.String(100), nullable=False)
    deskripsi = db.Column(db.Text, nullable=True)
    icon = db.Column(db.String(50), nullable=True)
    color = db.Column(db.String(20), nullable=True)
    urutan = db.Column(db.Integer, default=0)
    is_active = db.Column(db.Boolean, default=True)
    
    # Timestamps
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    faqs = db.relationship('FAQ', backref='category', lazy='dynamic')
    
    def to_dict(self):
        """Convert to dictionary"""
        return {
            'id': self.id,
            'nama': self.nama,
            'deskripsi': self.deskripsi,
            'icon': self.icon,
            'color': self.color,
            'urutan': self.urutan,
            'isActive': self.is_active,
            'createdAt': self.created_at.isoformat() if self.created_at else None,
            'updatedAt': self.updated_at.isoformat() if self.updated_at else None
        }
    
    def __repr__(self):
        return f'<FAQCategory {self.nama}>'


class FAQ(db.Model):
    """FAQ model"""
    __tablename__ = 'faqs'
    
    id = db.Column(db.Integer, primary_key=True)
    category_id = db.Column(db.Integer, db.ForeignKey('faq_categories.id'), nullable=True, index=True)
    
    # Content
    pertanyaan = db.Column(db.Text, nullable=False)
    jawaban = db.Column(db.Text, nullable=False)
    
    # Metadata
    tags = db.Column(db.Text, nullable=True)  # JSON array of tags
    keywords = db.Column(db.Text, nullable=True)  # For search optimization
    
    # Status
    is_active = db.Column(db.Boolean, default=True)
    is_featured = db.Column(db.Boolean, default=False)
    urutan = db.Column(db.Integer, default=0)
    
    # Statistics
    views = db.Column(db.Integer, default=0)
    helpful_count = db.Column(db.Integer, default=0)
    not_helpful_count = db.Column(db.Integer, default=0)
    
    # Timestamps
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def to_dict(self):
        """Convert to dictionary"""
        return {
            'id': self.id,
            'categoryId': self.category_id,
            'pertanyaan': self.pertanyaan,
            'jawaban': self.jawaban,
            'tags': self.tags,
            'keywords': self.keywords,
            'isActive': self.is_active,
            'isFeatured': self.is_featured,
            'urutan': self.urutan,
            'views': self.views,
            'helpfulCount': self.helpful_count,
            'notHelpfulCount': self.not_helpful_count,
            'category': self.category.to_dict() if self.category else None,
            'createdAt': self.created_at.isoformat() if self.created_at else None,
            'updatedAt': self.updated_at.isoformat() if self.updated_at else None
        }
    
    def __repr__(self):
        return f'<FAQ {self.id}>'


class Consultation(db.Model):
    """Consultation/Chat model for user questions"""
    __tablename__ = 'consultations'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False, index=True)
    
    # Content
    subject = db.Column(db.String(300), nullable=False)
    pertanyaan = db.Column(db.Text, nullable=False)
    jawaban = db.Column(db.Text, nullable=True)
    
    # Status
    status = db.Column(db.String(20), default='pending')  # pending, answered, closed
    priority = db.Column(db.String(20), default='normal')  # low, normal, high
    
    # Response
    answered_by = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)
    answered_at = db.Column(db.DateTime, nullable=True)
    
    # Rating
    rating = db.Column(db.Integer, nullable=True)  # 1-5
    feedback = db.Column(db.Text, nullable=True)
    
    # Timestamps
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    user = db.relationship('User', foreign_keys=[user_id], backref='consultations')
    responder = db.relationship('User', foreign_keys=[answered_by])
    
    def to_dict(self):
        """Convert to dictionary"""
        return {
            'id': self.id,
            'userId': self.user_id,
            'subject': self.subject,
            'pertanyaan': self.pertanyaan,
            'jawaban': self.jawaban,
            'status': self.status,
            'priority': self.priority,
            'answeredBy': self.answered_by,
            'answeredAt': self.answered_at.isoformat() if self.answered_at else None,
            'rating': self.rating,
            'feedback': self.feedback,
            'createdAt': self.created_at.isoformat() if self.created_at else None,
            'updatedAt': self.updated_at.isoformat() if self.updated_at else None
        }
    
    def __repr__(self):
        return f'<Consultation {self.id}>'
