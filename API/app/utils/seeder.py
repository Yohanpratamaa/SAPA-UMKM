"""
Database Seeder - Sample data for development
"""
from app.models import FAQ, FAQCategory, Product, Profile, Training, User

from app import db


def seed_users():
    """Seed sample users"""
    users = [
        {
            'email': 'admin@sapaumkm.com',
            'username': 'admin',
            'full_name': 'Administrator',
            'phone_number': '081234567890',
            'role': 'admin',
            'password': 'admin123'
        },
        {
            'email': 'demo@sapaumkm.com',
            'username': 'demo',
            'full_name': 'Demo User UMKM',
            'phone_number': '081234567891',
            'role': 'umkm',
            'password': 'demo123'
        }
    ]
    
    for user_data in users:
        existing = User.query.filter_by(email=user_data['email']).first()
        if not existing:
            user = User(
                email=user_data['email'],
                username=user_data['username'],
                full_name=user_data['full_name'],
                phone_number=user_data['phone_number'],
                role=user_data['role']
            )
            user.set_password(user_data['password'])
            db.session.add(user)
    
    db.session.commit()
    print('Users seeded!')


def seed_faq_categories():
    """Seed FAQ categories"""
    categories = [
        {'nama': 'Perizinan', 'icon': 'document-text', 'color': '#3B82F6', 'urutan': 1},
        {'nama': 'Keuangan', 'icon': 'cash', 'color': '#10B981', 'urutan': 2},
        {'nama': 'Pemasaran', 'icon': 'megaphone', 'color': '#F59E0B', 'urutan': 3},
        {'nama': 'Digitalisasi', 'icon': 'phone-portrait', 'color': '#8B5CF6', 'urutan': 4},
        {'nama': 'Produksi', 'icon': 'construct', 'color': '#EF4444', 'urutan': 5},
    ]
    
    for cat_data in categories:
        existing = FAQCategory.query.filter_by(nama=cat_data['nama']).first()
        if not existing:
            category = FAQCategory(**cat_data)
            db.session.add(category)
    
    db.session.commit()
    print('FAQ Categories seeded!')


def seed_faqs():
    """Seed sample FAQs"""
    faqs = [
        {
            'category_nama': 'Perizinan',
            'pertanyaan': 'Apa itu NIB dan bagaimana cara mendapatkannya?',
            'jawaban': 'NIB (Nomor Induk Berusaha) adalah identitas pelaku usaha yang diterbitkan oleh Lembaga OSS. Cara mendapatkannya: 1) Kunjungi oss.go.id, 2) Daftar akun menggunakan NIK, 3) Isi data usaha, 4) NIB akan terbit otomatis.',
            'keywords': 'nib, izin usaha, oss, perizinan'
        },
        {
            'category_nama': 'Keuangan',
            'pertanyaan': 'Bagaimana cara mengajukan KUR untuk UMKM?',
            'jawaban': 'Kredit Usaha Rakyat (KUR) dapat diajukan melalui bank penyalur seperti BRI, BNI, Mandiri. Syarat: 1) KTP & KK, 2) Usaha minimal 6 bulan, 3) Belum pernah dapat kredit program pemerintah, 4) Surat keterangan usaha.',
            'keywords': 'kur, kredit, pinjaman, modal usaha'
        },
        {
            'category_nama': 'Pemasaran',
            'pertanyaan': 'Tips memasarkan produk UMKM secara online?',
            'jawaban': 'Strategi pemasaran online: 1) Buat akun media sosial bisnis, 2) Foto produk berkualitas, 3) Deskripsi menarik, 4) Gunakan marketplace (Tokopedia, Shopee), 5) Manfaatkan Google My Business, 6) Konsisten posting konten.',
            'keywords': 'marketing, pemasaran, online, digital, sosial media'
        },
        {
            'category_nama': 'Digitalisasi',
            'pertanyaan': 'Aplikasi apa saja yang berguna untuk UMKM?',
            'jawaban': 'Aplikasi berguna untuk UMKM: 1) Pembukuan: BukuKas, BukuWarung, 2) Desain: Canva, 3) Invoice: Paper.id, 4) Marketplace: Tokopedia, Shopee, 5) Payment: QRIS, GoPay, OVO, 6) Manajemen: Moka POS.',
            'keywords': 'aplikasi, digital, teknologi, software'
        },
        {
            'category_nama': 'Produksi',
            'pertanyaan': 'Bagaimana cara mendapatkan sertifikat halal untuk produk UMKM?',
            'jawaban': 'Sertifikasi halal melalui BPJPH: 1) Daftar di ptsp.halal.go.id, 2) Upload dokumen (NIB, daftar bahan, proses produksi), 3) Bayar biaya sertifikasi, 4) Audit oleh LPH, 5) Terbit sertifikat halal.',
            'keywords': 'halal, sertifikasi, bpjph, produksi'
        }
    ]
    
    for faq_data in faqs:
        category = FAQCategory.query.filter_by(nama=faq_data['category_nama']).first()
        existing = FAQ.query.filter_by(pertanyaan=faq_data['pertanyaan']).first()
        if not existing and category:
            faq = FAQ(
                category_id=category.id,
                pertanyaan=faq_data['pertanyaan'],
                jawaban=faq_data['jawaban'],
                keywords=faq_data['keywords']
            )
            db.session.add(faq)
    
    db.session.commit()
    print('FAQs seeded!')


def seed_trainings():
    """Seed sample trainings"""
    trainings = [
        {
            'judul': 'Digital Marketing untuk UMKM Pemula',
            'deskripsi': 'Pelatihan dasar digital marketing meliputi sosial media marketing, content creation, dan strategi online.',
            'kategori': 'Digital Marketing',
            'level': 'pemula',
            'instruktur': 'Budi Santoso',
            'durasi': '3 jam',
            'format_pelatihan': 'online',
            'is_free': True,
            'kuota': 100
        },
        {
            'judul': 'Manajemen Keuangan UMKM',
            'deskripsi': 'Pelajari cara mengelola keuangan bisnis, pembukuan sederhana, dan perencanaan cash flow.',
            'kategori': 'Keuangan',
            'level': 'pemula',
            'instruktur': 'Siti Rahayu',
            'durasi': '2 jam',
            'format_pelatihan': 'online',
            'is_free': True,
            'kuota': 50
        },
        {
            'judul': 'Food Photography untuk Bisnis Kuliner',
            'deskripsi': 'Teknik foto makanan profesional menggunakan smartphone untuk meningkatkan penjualan online.',
            'kategori': 'Pemasaran',
            'level': 'menengah',
            'instruktur': 'Andi Pratama',
            'durasi': '4 jam',
            'format_pelatihan': 'hybrid',
            'is_free': False,
            'harga': 150000,
            'kuota': 30
        }
    ]
    
    for training_data in trainings:
        existing = Training.query.filter_by(judul=training_data['judul']).first()
        if not existing:
            training = Training(**training_data)
            db.session.add(training)
    
    db.session.commit()
    print('Trainings seeded!')


def seed_all():
    """Seed all sample data"""
    seed_users()
    seed_faq_categories()
    seed_faqs()
    seed_trainings()
    print('All data seeded successfully!')
