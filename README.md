# SAPA UMKM - Sistem Aplikasi Pendampingan Adaptasi UMKM

Aplikasi mobile untuk membantu pengelolaan dan pendampingan UMKM (Usaha Mikro, Kecil, dan Menengah) di Indonesia.

## � Struktur Project

```
SAPA-UMKM/
├── app/                    # React Native App (Expo Router)
├── components/             # React Components
├── services/               # Frontend Services + API Client
├── API/                    # Flask Backend
│   ├── app/               # Flask Application
│   ├── requirements.txt   # Python Dependencies
│   └── README.md          # Backend Documentation
└── README.md              # This file
```

## 🚀 Quick Start

### Backend (Flask API)

```bash
cd API
python -m venv venv
.\venv\Scripts\Activate.ps1  # Windows PowerShell
pip install -r requirements.txt
flask init-db
flask seed-db
flask run
```

Backend: **http://localhost:5000**

📖 [Backend Documentation](./API/README.md)

### Frontend (React Native)

```bash
npm install
npx expo start
```

---

## 🚀 Fitur Utama

### 1. 📋 Manajemen Profil UMKM ✅

Kelola data profil bisnis UMKM dengan lengkap:

- ✅ Menyimpan data usaha lengkap (nama usaha, jenis produk/jasa, alamat, NIB, nomor kontak)
- ✅ Upload dan preview foto/logo usaha
- ✅ Validasi data input dengan error handling
- ✅ Pencarian dan filter profil UMKM
- ✅ Statistik jumlah UMKM berdasarkan status

### 2. 🎓 Pelatihan & Edukasi UMKM ✅

Materi pelatihan dan edukasi untuk pengembangan UMKM:

- ✅ Modul pelatihan terstruktur
- ✅ Kategori: Bisnis, Marketing, Keuangan, Kreatif
- ✅ Tracking progress pembelajaran
- ✅ Sertifikat kelulusan

### 3. 🛒 Katalog Produk UMKM ✅

Marketplace digital untuk showcase dan jual produk:

- ✅ Tambah produk dengan multi foto (max 5)
- ✅ Kategori produk lengkap
- ✅ Manajemen harga dan stok
- ✅ Filter dan pencarian produk

### 4. 💬 Konsultasi FAQ UMKM ✅

Bantuan dan panduan penggunaan aplikasi:

- ✅ FAQ terorganisir per kategori
- ✅ Fitur pencarian FAQ
- ✅ Form konsultasi langsung
- ✅ Feedback helpful/not helpful

## 🏗️ Struktur Aplikasi

```
├── app/
│   ├── (tabs)/
│   │   ├── index.tsx          # Halaman beranda
│   │   └── profile/
│   │       └── index.tsx      # Daftar profil UMKM
│   ├── profile/
│   │   └── create.tsx         # Form tambah profil
│   ├── _layout.tsx            # Layout utama
│   └── index.tsx              # Redirect ke tabs
├── components/
│   ├── ui/
│   │   ├── Button.tsx         # Komponen tombol
│   │   ├── Input.tsx          # Komponen input field
│   │   ├── Select.tsx         # Komponen dropdown
│   │   └── ImageUpload.tsx    # Komponen upload gambar
│   ├── UMKMProfileForm.tsx    # Form profil UMKM
│   └── ProfileCard.tsx        # Card tampilan profil
├── types/
│   └── profile.ts             # TypeScript interfaces
└── services/
    └── ProfileStorageService.ts # Service untuk AsyncStorage
```

## 🛠️ Teknologi yang Digunakan

- **React Native** dengan **Expo**
- **TypeScript** untuk type safety
- **Expo Router** untuk navigasi
- **NativeWind** (TailwindCSS) untuk styling
- **Expo Image Picker** untuk upload foto
- **AsyncStorage** untuk storage lokal
- **React Navigation** untuk tab navigation

## 📱 Cara Menjalankan Aplikasi

### Prerequisites

- Node.js (v16 atau lebih baru)
- npm atau yarn
- Expo CLI
- Aplikasi Expo Go di smartphone (untuk testing)

### Instalasi

```bash
# Clone repository
git clone <repository-url>
cd SAPA-UMKM

# Install dependencies
npm install

# Jalankan aplikasi
npm start
```

### Testing di Device

1. Install aplikasi **Expo Go** di smartphone
2. Scan QR code yang muncul di terminal
3. Atau buka di web browser: `http://localhost:8082`

## 📸 Screenshot

### Halaman Beranda

- Menampilkan overview aplikasi dan fitur yang tersedia
- Quick stats dan akses ke semua fitur

### Halaman Profil UMKM

- Daftar semua profil UMKM yang terdaftar
- Pencarian dan filter profil
- Statistik berdasarkan status (Aktif, Pending, Non-Aktif)

### Form Tambah Profil

- Form lengkap dengan validasi
- Upload foto/logo usaha
- Simpan data ke storage lokal

## 🎯 Tujuan Aplikasi

1. **Database Terpusat**: Menyediakan database utama seluruh pengguna UMKM
2. **Monitoring**: Memudahkan pemerintah/pendamping dalam memantau data pelaku usaha
3. **Identifikasi**: Sebagai dasar identifikasi UMKM yang terdaftar
4. **Pemberdayaan**: Platform untuk pemberdayaan dan pengembangan UMKM

## 📈 Status Development

| Fitur                 | Status     | Progress |
| --------------------- | ---------- | -------- |
| Manajemen Profil UMKM | ✅ Selesai | 100%     |
| Pelatihan & Edukasi   | ✅ Selesai | 100%     |
| Katalog Produk        | ✅ Selesai | 100%     |
| Konsultasi FAQ        | ✅ Selesai | 100%     |
| Backend API           | ✅ Selesai | 100%     |

## 🔗 API Endpoints

| Resource  | Endpoint           | Description              |
| --------- | ------------------ | ------------------------ |
| Auth      | `/api/auth/*`      | Login, Register, Profile |
| Profiles  | `/api/profiles/*`  | UMKM Profiles            |
| Products  | `/api/products/*`  | Marketplace Products     |
| Trainings | `/api/trainings/*` | Training Materials       |
| FAQ       | `/api/faq/*`       | FAQ & Consultations      |

📖 Lihat [API Documentation](./API/README.md) untuk detail lengkap.

## 🛠️ Tech Stack

### Frontend

- **React Native** + **Expo**
- **TypeScript** untuk type safety
- **Expo Router** untuk navigasi
- **NativeWind** (TailwindCSS) untuk styling

### Backend

- **Python 3.9+** + **Flask**
- **SQLAlchemy** (ORM)
- **MySQL** (via Laragon)
- **JWT Authentication**

## 🤝 Kontribusi

Aplikasi ini dikembangkan untuk membantu ekosistem UMKM di Indonesia. Kontribusi dan feedback sangat diterima untuk pengembangan lebih lanjut.

## 📄 Lisensi

MIT License - Lihat file LICENSE untuk detail lengkap.

---

**SAPA UMKM** - Membangun Ekonomi Digital untuk UMKM Indonesia 🇮🇩
