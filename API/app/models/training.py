"""
Training Model - UMKM Training/Education Management
"""
from datetime import datetime

from app import db


class Training(db.Model):
    """Training model for UMKM education"""
    __tablename__ = 'trainings'
    
    id = db.Column(db.Integer, primary_key=True)
    
    # Basic Information
    judul = db.Column(db.String(300), nullable=False)
    deskripsi = db.Column(db.Text, nullable=True)
    kategori = db.Column(db.String(100), nullable=True)
    level = db.Column(db.String(50), default='pemula')  # pemula, menengah, lanjutan
    
    # Instructor
    instruktur = db.Column(db.String(150), nullable=True)
    instruktur_bio = db.Column(db.Text, nullable=True)
    instruktur_foto = db.Column(db.String(255), nullable=True)
    
    # Schedule
    tanggal_mulai = db.Column(db.DateTime, nullable=True)
    tanggal_selesai = db.Column(db.DateTime, nullable=True)
    durasi = db.Column(db.String(50), nullable=True)  # e.g., "2 jam", "3 hari"
    jadwal = db.Column(db.Text, nullable=True)  # JSON schedule details
    
    # Location/Format
    format_pelatihan = db.Column(db.String(50), default='online')  # online, offline, hybrid
    lokasi = db.Column(db.String(255), nullable=True)
    link_meeting = db.Column(db.String(500), nullable=True)
    
    # Pricing
    harga = db.Column(db.Numeric(15, 2), default=0)
    is_free = db.Column(db.Boolean, default=True)
    
    # Capacity
    kuota = db.Column(db.Integer, default=100)
    peserta_terdaftar = db.Column(db.Integer, default=0)
    
    # Content
    materi = db.Column(db.Text, nullable=True)  # JSON array of materials
    benefit = db.Column(db.Text, nullable=True)  # JSON array of benefits
    syarat = db.Column(db.Text, nullable=True)  # JSON array of requirements
    
    # Media
    thumbnail = db.Column(db.String(255), nullable=True)
    video_preview = db.Column(db.String(500), nullable=True)
    
    # Status
    status = db.Column(db.String(20), default='upcoming')  # upcoming, ongoing, completed, cancelled
    is_featured = db.Column(db.Boolean, default=False)
    
    # Statistics
    rating = db.Column(db.Float, default=0.0)
    total_reviews = db.Column(db.Integer, default=0)
    
    # Timestamps
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    enrollments = db.relationship('TrainingEnrollment', backref='training', lazy='dynamic', cascade='all, delete-orphan')
    
    def to_dict(self):
        """Convert to dictionary"""
        return {
            'id': self.id,
            'judul': self.judul,
            'deskripsi': self.deskripsi,
            'kategori': self.kategori,
            'level': self.level,
            'instruktur': self.instruktur,
            'instrukturBio': self.instruktur_bio,
            'instrukturFoto': self.instruktur_foto,
            'tanggalMulai': self.tanggal_mulai.isoformat() if self.tanggal_mulai else None,
            'tanggalSelesai': self.tanggal_selesai.isoformat() if self.tanggal_selesai else None,
            'durasi': self.durasi,
            'jadwal': self.jadwal,
            'formatPelatihan': self.format_pelatihan,
            'lokasi': self.lokasi,
            'linkMeeting': self.link_meeting,
            'harga': float(self.harga) if self.harga else 0,
            'isFree': self.is_free,
            'kuota': self.kuota,
            'pesertaTerdaftar': self.peserta_terdaftar,
            'materi': self.materi,
            'benefit': self.benefit,
            'syarat': self.syarat,
            'thumbnail': self.thumbnail,
            'videoPreview': self.video_preview,
            'status': self.status,
            'isFeatured': self.is_featured,
            'rating': self.rating,
            'totalReviews': self.total_reviews,
            'createdAt': self.created_at.isoformat() if self.created_at else None,
            'updatedAt': self.updated_at.isoformat() if self.updated_at else None
        }
    
    def __repr__(self):
        return f'<Training {self.judul}>'


class TrainingEnrollment(db.Model):
    """Training enrollment model"""
    __tablename__ = 'training_enrollments'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False, index=True)
    training_id = db.Column(db.Integer, db.ForeignKey('trainings.id'), nullable=False, index=True)
    
    # Progress
    status = db.Column(db.String(20), default='enrolled')  # enrolled, in_progress, completed, dropped
    progress = db.Column(db.Float, default=0.0)  # 0-100%
    
    # Completion
    completed_at = db.Column(db.DateTime, nullable=True)
    certificate_url = db.Column(db.String(500), nullable=True)
    
    # Review
    rating = db.Column(db.Integer, nullable=True)  # 1-5
    review = db.Column(db.Text, nullable=True)
    
    # Timestamps
    enrolled_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationship
    user = db.relationship('User', backref='enrollments')
    
    def to_dict(self):
        """Convert to dictionary"""
        return {
            'id': self.id,
            'userId': self.user_id,
            'trainingId': self.training_id,
            'status': self.status,
            'progress': self.progress,
            'completedAt': self.completed_at.isoformat() if self.completed_at else None,
            'certificateUrl': self.certificate_url,
            'rating': self.rating,
            'review': self.review,
            'enrolledAt': self.enrolled_at.isoformat() if self.enrolled_at else None,
            'updatedAt': self.updated_at.isoformat() if self.updated_at else None
        }
    
    def __repr__(self):
        return f'<TrainingEnrollment {self.user_id}-{self.training_id}>'
