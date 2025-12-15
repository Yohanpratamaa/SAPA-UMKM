"""
Profile Model - UMKM Profile Management
"""
from datetime import datetime
from app import db


class Profile(db.Model):
    """UMKM Profile model"""
    __tablename__ = 'profiles'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False, index=True)
    
    # Basic Information
    nama_umkm = db.Column(db.String(200), nullable=False)
    jenis_usaha = db.Column(db.String(100), nullable=True)
    deskripsi = db.Column(db.Text, nullable=True)
    tahun_berdiri = db.Column(db.Integer, nullable=True)
    
    # Legal Information
    nib = db.Column(db.String(50), nullable=True)
    npwp = db.Column(db.String(50), nullable=True)
    
    # Contact Information
    alamat = db.Column(db.Text, nullable=True)
    kota = db.Column(db.String(100), nullable=True)
    provinsi = db.Column(db.String(100), nullable=True)
    kode_pos = db.Column(db.String(10), nullable=True)
    telepon = db.Column(db.String(20), nullable=True)
    email = db.Column(db.String(120), nullable=True)
    website = db.Column(db.String(255), nullable=True)
    
    # Social Media
    instagram = db.Column(db.String(100), nullable=True)
    facebook = db.Column(db.String(100), nullable=True)
    whatsapp = db.Column(db.String(20), nullable=True)
    
    # Business Details
    jumlah_karyawan = db.Column(db.Integer, default=0)
    omset_bulanan = db.Column(db.String(50), nullable=True)  # Range string
    kategori_usaha = db.Column(db.String(100), nullable=True)
    
    # Media
    foto_profil = db.Column(db.String(255), nullable=True)
    foto_usaha = db.Column(db.Text, nullable=True)  # JSON array of image URLs
    
    # Status
    status = db.Column(db.String(20), default='aktif')  # aktif, nonaktif, pending
    is_verified = db.Column(db.Boolean, default=False)
    
    # Timestamps
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def to_dict(self):
        """Convert to dictionary"""
        return {
            'id': self.id,
            'userId': self.user_id,
            'namaUmkm': self.nama_umkm,
            'jenisUsaha': self.jenis_usaha,
            'deskripsi': self.deskripsi,
            'tahunBerdiri': self.tahun_berdiri,
            'nib': self.nib,
            'npwp': self.npwp,
            'alamat': self.alamat,
            'kota': self.kota,
            'provinsi': self.provinsi,
            'kodePos': self.kode_pos,
            'telepon': self.telepon,
            'email': self.email,
            'website': self.website,
            'instagram': self.instagram,
            'facebook': self.facebook,
            'whatsapp': self.whatsapp,
            'jumlahKaryawan': self.jumlah_karyawan,
            'omsetBulanan': self.omset_bulanan,
            'kategoriUsaha': self.kategori_usaha,
            'fotoProfil': self.foto_profil,
            'fotoUsaha': self.foto_usaha,
            'status': self.status,
            'isVerified': self.is_verified,
            'createdAt': self.created_at.isoformat() if self.created_at else None,
            'updatedAt': self.updated_at.isoformat() if self.updated_at else None
        }
    
    def __repr__(self):
        return f'<Profile {self.nama_umkm}>'
