"""
Product Model - UMKM Product/Marketplace Management
"""
from datetime import datetime

from app import db


class Product(db.Model):
    """Product model for UMKM marketplace"""
    __tablename__ = 'products'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False, index=True)
    profile_id = db.Column(db.Integer, db.ForeignKey('profiles.id'), nullable=True, index=True)
    
    # Basic Information
    nama_produk = db.Column(db.String(200), nullable=False)
    deskripsi = db.Column(db.Text, nullable=True)
    kategori = db.Column(db.String(100), nullable=True)
    sub_kategori = db.Column(db.String(100), nullable=True)
    
    # Pricing
    harga = db.Column(db.Numeric(15, 2), nullable=False)
    harga_diskon = db.Column(db.Numeric(15, 2), nullable=True)
    satuan = db.Column(db.String(50), default='pcs')  # pcs, kg, liter, pack, dll
    
    # Stock
    stok = db.Column(db.Integer, default=0)
    min_order = db.Column(db.Integer, default=1)
    
    # Specifications
    berat = db.Column(db.Float, nullable=True)  # dalam gram
    dimensi = db.Column(db.String(100), nullable=True)  # PxLxT
    bahan = db.Column(db.String(200), nullable=True)
    warna = db.Column(db.String(100), nullable=True)
    ukuran = db.Column(db.String(100), nullable=True)
    
    # Media
    gambar_utama = db.Column(db.String(255), nullable=True)
    gambar_lainnya = db.Column(db.Text, nullable=True)  # JSON array of image URLs
    
    # Status
    status = db.Column(db.String(20), default='aktif')  # aktif, nonaktif, habis
    is_featured = db.Column(db.Boolean, default=False)
    is_bestseller = db.Column(db.Boolean, default=False)
    
    # Statistics
    views = db.Column(db.Integer, default=0)
    sold = db.Column(db.Integer, default=0)
    rating = db.Column(db.Float, default=0.0)
    
    # Timestamps
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationship
    profile = db.relationship('Profile', backref='products')
    
    def to_dict(self):
        """Convert to dictionary"""
        return {
            'id': self.id,
            'userId': self.user_id,
            'profileId': self.profile_id,
            'namaProduk': self.nama_produk,
            'deskripsi': self.deskripsi,
            'kategori': self.kategori,
            'subKategori': self.sub_kategori,
            'harga': float(self.harga) if self.harga else 0,
            'hargaDiskon': float(self.harga_diskon) if self.harga_diskon else None,
            'satuan': self.satuan,
            'stok': self.stok,
            'minOrder': self.min_order,
            'berat': self.berat,
            'dimensi': self.dimensi,
            'bahan': self.bahan,
            'warna': self.warna,
            'ukuran': self.ukuran,
            'gambarUtama': self.gambar_utama,
            'gambarLainnya': self.gambar_lainnya,
            'status': self.status,
            'isFeatured': self.is_featured,
            'isBestseller': self.is_bestseller,
            'views': self.views,
            'sold': self.sold,
            'rating': self.rating,
            'umkmNama': self.profile.nama_umkm if self.profile else None,
            'createdAt': self.created_at.isoformat() if self.created_at else None,
            'updatedAt': self.updated_at.isoformat() if self.updated_at else None
        }
    
    def __repr__(self):
        return f'<Product {self.nama_produk}>'
