-- =====================================================
-- SAPA-UMKM Database Setup Script
-- Run this script in HeidiSQL or phpMyAdmin
-- =====================================================

-- Buat Database
CREATE DATABASE IF NOT EXISTS sapa_umkm 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

-- Gunakan Database
USE sapa_umkm;

-- =====================================================
-- TABEL USERS
-- =====================================================
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    role VARCHAR(20) DEFAULT 'umkm',
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_role (role)
) ENGINE=InnoDB;

-- =====================================================
-- TABEL PROFILES (UMKM)
-- =====================================================
CREATE TABLE IF NOT EXISTS profiles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL UNIQUE,
    business_name VARCHAR(255) NOT NULL,
    business_type VARCHAR(100),
    description TEXT,
    address TEXT,
    city VARCHAR(100),
    province VARCHAR(100),
    phone VARCHAR(20),
    whatsapp VARCHAR(20),
    email VARCHAR(255),
    website VARCHAR(255),
    instagram VARCHAR(255),
    facebook VARCHAR(255),
    profile_image VARCHAR(255),
    is_verified BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_business_type (business_type),
    INDEX idx_city (city)
) ENGINE=InnoDB;

-- =====================================================
-- TABEL PRODUCTS
-- =====================================================
CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(15, 2) NOT NULL DEFAULT 0,
    category VARCHAR(100),
    images JSON,
    stock INT DEFAULT 0,
    unit VARCHAR(50),
    is_available BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_category (category),
    INDEX idx_is_available (is_available),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB;

-- =====================================================
-- TABEL TRAININGS
-- =====================================================
CREATE TABLE IF NOT EXISTS trainings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    content LONGTEXT,
    category VARCHAR(100),
    instructor VARCHAR(255),
    duration VARCHAR(50),
    level VARCHAR(50),
    thumbnail VARCHAR(255),
    video_url VARCHAR(500),
    is_published BOOLEAN DEFAULT TRUE,
    order_index INT DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_category (category),
    INDEX idx_level (level),
    INDEX idx_is_published (is_published),
    INDEX idx_order_index (order_index)
) ENGINE=InnoDB;

-- =====================================================
-- TABEL TRAINING_ENROLLMENTS
-- =====================================================
CREATE TABLE IF NOT EXISTS training_enrollments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    training_id INT NOT NULL,
    progress INT DEFAULT 0,
    completed BOOLEAN DEFAULT FALSE,
    completed_at DATETIME,
    enrolled_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (training_id) REFERENCES trainings(id) ON DELETE CASCADE,
    UNIQUE KEY unique_enrollment (user_id, training_id),
    INDEX idx_user_id (user_id),
    INDEX idx_training_id (training_id)
) ENGINE=InnoDB;

-- =====================================================
-- TABEL FAQ_CATEGORIES
-- =====================================================
CREATE TABLE IF NOT EXISTS faq_categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    icon VARCHAR(100),
    order_index INT DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_order_index (order_index)
) ENGINE=InnoDB;

-- =====================================================
-- TABEL FAQS
-- =====================================================
CREATE TABLE IF NOT EXISTS faqs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    category_id INT,
    question TEXT NOT NULL,
    answer LONGTEXT NOT NULL,
    keywords VARCHAR(500),
    is_published BOOLEAN DEFAULT TRUE,
    view_count INT DEFAULT 0,
    helpful_count INT DEFAULT 0,
    order_index INT DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES faq_categories(id) ON DELETE SET NULL,
    INDEX idx_category_id (category_id),
    INDEX idx_is_published (is_published),
    INDEX idx_view_count (view_count)
) ENGINE=InnoDB;

-- =====================================================
-- TABEL CONSULTATIONS
-- =====================================================
CREATE TABLE IF NOT EXISTS consultations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    subject VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    admin_reply TEXT,
    replied_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB;

-- =====================================================
-- INSERT SAMPLE DATA
-- =====================================================

-- Admin User (password: admin123)
INSERT INTO users (email, password_hash, name, phone, role) VALUES
('admin@sapaumkm.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4g5A9c6X6i8s5Kxi', 'Admin SAPA', '081234567890', 'admin');

-- Demo User (password: demo123)  
INSERT INTO users (email, password_hash, name, phone, role) VALUES
('demo@sapaumkm.com', '$2b$12$wYkj5HdQM9yI5BHdOCeM9u9e0x5X5X5X5X5X5X5X5X5X5X5X5X5Xq', 'Demo UMKM', '081234567891', 'umkm');

-- FAQ Categories
INSERT INTO faq_categories (name, description, icon, order_index) VALUES
('Pendaftaran', 'Pertanyaan seputar pendaftaran dan akun', 'account-circle', 1),
('Profil UMKM', 'Cara mengelola profil bisnis', 'store', 2),
('Marketplace', 'Panduan jual beli produk', 'shopping-cart', 3),
('Pelatihan', 'Informasi seputar pelatihan', 'school', 4),
('Teknis', 'Bantuan teknis aplikasi', 'help-circle', 5);

-- Sample FAQs
INSERT INTO faqs (category_id, question, answer, keywords, is_published, order_index) VALUES
(1, 'Bagaimana cara mendaftar akun SAPA-UMKM?', 'Untuk mendaftar akun SAPA-UMKM:\n1. Buka aplikasi SAPA-UMKM\n2. Klik tombol "Daftar"\n3. Isi form dengan data yang valid\n4. Verifikasi email Anda\n5. Login dan lengkapi profil UMKM', 'daftar,register,akun,baru', TRUE, 1),
(1, 'Lupa password, bagaimana cara resetnya?', 'Untuk reset password:\n1. Klik "Lupa Password" di halaman login\n2. Masukkan email yang terdaftar\n3. Cek email untuk link reset\n4. Buat password baru', 'lupa,password,reset,forgot', TRUE, 2),
(2, 'Bagaimana cara membuat profil UMKM?', 'Setelah login, ikuti langkah berikut:\n1. Buka menu Profil\n2. Klik "Buat Profil UMKM"\n3. Isi informasi bisnis Anda\n4. Upload foto profil\n5. Klik Simpan', 'profil,umkm,bisnis,buat', TRUE, 1),
(2, 'Apa saja yang perlu diisi di profil?', 'Informasi yang perlu diisi:\n- Nama bisnis\n- Jenis usaha\n- Deskripsi bisnis\n- Alamat lengkap\n- Kontak (WhatsApp, Email)\n- Media sosial (opsional)', 'profil,isi,lengkap,informasi', TRUE, 2),
(3, 'Bagaimana cara menambah produk?', 'Untuk menambah produk:\n1. Buka menu Marketplace\n2. Klik tombol + atau "Tambah Produk"\n3. Isi detail produk\n4. Upload foto produk (max 5)\n5. Set harga dan stok\n6. Klik Simpan', 'produk,tambah,jual,marketplace', TRUE, 1),
(3, 'Berapa batas maksimal foto produk?', 'Anda dapat mengupload maksimal 5 foto untuk setiap produk dengan ukuran maksimal 2MB per foto.', 'foto,gambar,upload,maksimal', TRUE, 2),
(4, 'Apakah pelatihan berbayar?', 'Semua pelatihan di SAPA-UMKM GRATIS untuk pengguna terdaftar. Cukup login dan ikuti pelatihan yang tersedia.', 'pelatihan,gratis,bayar,biaya', TRUE, 1),
(4, 'Bagaimana cara mengikuti pelatihan?', 'Cara mengikuti pelatihan:\n1. Buka menu Pelatihan\n2. Pilih materi yang ingin dipelajari\n3. Klik "Mulai Pelatihan"\n4. Ikuti modul sampai selesai\n5. Dapatkan sertifikat', 'pelatihan,ikut,belajar,materi', TRUE, 2),
(5, 'Aplikasi tidak bisa dibuka?', 'Coba langkah berikut:\n1. Tutup aplikasi sepenuhnya\n2. Clear cache aplikasi\n3. Restart device\n4. Update aplikasi ke versi terbaru\n5. Jika masih bermasalah, hubungi support', 'error,tidak bisa,crash,bug', TRUE, 1);

-- Sample Trainings
INSERT INTO trainings (title, description, content, category, instructor, duration, level, is_published, order_index) VALUES
('Dasar-dasar Memulai UMKM', 'Pelajari langkah-langkah fundamental untuk memulai bisnis UMKM yang sukses', 'Modul 1: Menentukan Ide Bisnis\nModul 2: Riset Pasar\nModul 3: Membuat Business Plan\nModul 4: Legalitas Usaha', 'Bisnis', 'Tim SAPA-UMKM', '2 jam', 'Pemula', TRUE, 1),
('Digital Marketing untuk UMKM', 'Strategi pemasaran digital yang efektif untuk mengembangkan bisnis', 'Modul 1: Social Media Marketing\nModul 2: Content Marketing\nModul 3: WhatsApp Business\nModul 4: Google My Business', 'Marketing', 'Tim SAPA-UMKM', '3 jam', 'Menengah', TRUE, 2),
('Manajemen Keuangan UMKM', 'Cara mengelola keuangan bisnis dengan baik dan benar', 'Modul 1: Pembukuan Sederhana\nModul 2: Cash Flow Management\nModul 3: Pricing Strategy\nModul 4: Laporan Keuangan', 'Keuangan', 'Tim SAPA-UMKM', '2.5 jam', 'Pemula', TRUE, 3),
('Fotografi Produk dengan Smartphone', 'Tips dan trik foto produk yang menarik menggunakan HP', 'Modul 1: Pencahayaan\nModul 2: Komposisi\nModul 3: Editing dengan Apps\nModul 4: Props & Styling', 'Kreatif', 'Tim SAPA-UMKM', '1.5 jam', 'Pemula', TRUE, 4);

-- =====================================================
-- VERIFICATION
-- =====================================================
SELECT 'Database sapa_umkm berhasil dibuat!' AS status;
SELECT table_name, table_rows FROM information_schema.tables WHERE table_schema = 'sapa_umkm';
