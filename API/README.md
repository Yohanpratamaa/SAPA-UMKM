# SAPA-UMKM Backend API

Backend API untuk aplikasi SAPA-UMKM menggunakan Flask + MySQL.

## 📋 Requirements

- Python 3.9+
- MySQL Server (via Laragon)
- pip (Python package manager)

## 🚀 Quick Start

### 1. Setup Database di Laragon

1. Buka **Laragon** dan Start MySQL
2. Buka **HeidiSQL** atau **phpMyAdmin** dari Laragon
3. Buat database baru:

```sql
CREATE DATABASE sapa_umkm CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 2. Setup Python Environment

```bash
# Masuk ke folder API
cd API

# Buat virtual environment
python -m venv venv

# Aktifkan virtual environment
# Windows (PowerShell):
.\venv\Scripts\Activate.ps1

# Windows (CMD):
.\venv\Scripts\activate.bat

# Linux/Mac:
source venv/bin/activate
```

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

### 4. Konfigurasi Environment

1. Copy file `.env.example` ke `.env`
2. Edit `.env` sesuai konfigurasi lokal:

```env
# Flask Configuration
FLASK_APP=run.py
FLASK_ENV=development
FLASK_DEBUG=True
SECRET_KEY=your-secret-key-here

# JWT Configuration
JWT_SECRET_KEY=your-jwt-secret-here

# Database Configuration (Laragon MySQL)
DB_HOST=localhost
DB_PORT=3306
DB_NAME=sapa_umkm
DB_USER=root
DB_PASSWORD=
```

### 5. Inisialisasi Database

```bash
# Buat tabel database
flask init-db

# (Opsional) Isi data sample
flask seed-db
```

### 6. Jalankan Server

```bash
# Development mode
flask run

# atau
python run.py
```

Server akan berjalan di: **http://localhost:5000**

## 📚 API Endpoints

### Authentication

| Method | Endpoint                    | Deskripsi            |
| ------ | --------------------------- | -------------------- |
| POST   | `/api/auth/register`        | Registrasi user baru |
| POST   | `/api/auth/login`           | Login user           |
| GET    | `/api/auth/me`              | Get current user     |
| PUT    | `/api/auth/me`              | Update profile user  |
| POST   | `/api/auth/change-password` | Ganti password       |
| POST   | `/api/auth/refresh`         | Refresh token        |
| POST   | `/api/auth/logout`          | Logout               |

### Profile UMKM

| Method | Endpoint            | Deskripsi      |
| ------ | ------------------- | -------------- |
| GET    | `/api/profiles`     | List profiles  |
| GET    | `/api/profiles/:id` | Detail profile |
| POST   | `/api/profiles`     | Create profile |
| PUT    | `/api/profiles/:id` | Update profile |
| DELETE | `/api/profiles/:id` | Delete profile |

### Products (Marketplace)

| Method | Endpoint                   | Deskripsi                  |
| ------ | -------------------------- | -------------------------- |
| GET    | `/api/products`            | List products (user)       |
| GET    | `/api/products/all`        | List all products (public) |
| GET    | `/api/products/:id`        | Detail product             |
| POST   | `/api/products`            | Create product             |
| PUT    | `/api/products/:id`        | Update product             |
| DELETE | `/api/products/:id`        | Delete product             |
| GET    | `/api/products/categories` | List categories            |

### Training

| Method | Endpoint                        | Deskripsi       |
| ------ | ------------------------------- | --------------- |
| GET    | `/api/trainings`                | List trainings  |
| GET    | `/api/trainings/:id`            | Detail training |
| POST   | `/api/trainings`                | Create training |
| PUT    | `/api/trainings/:id`            | Update training |
| DELETE | `/api/trainings/:id`            | Delete training |
| POST   | `/api/trainings/:id/enroll`     | Enroll training |
| GET    | `/api/trainings/my-enrollments` | My enrollments  |

### FAQ

| Method | Endpoint                 | Deskripsi           |
| ------ | ------------------------ | ------------------- |
| GET    | `/api/faq`               | List FAQs           |
| GET    | `/api/faq/:id`           | Detail FAQ          |
| POST   | `/api/faq`               | Create FAQ          |
| PUT    | `/api/faq/:id`           | Update FAQ          |
| DELETE | `/api/faq/:id`           | Delete FAQ          |
| GET    | `/api/faq/categories`    | FAQ categories      |
| POST   | `/api/faq/:id/feedback`  | Submit feedback     |
| GET    | `/api/faq/consultations` | List consultations  |
| POST   | `/api/faq/consultations` | Create consultation |

### Health Check

| Method | Endpoint      | Deskripsi         |
| ------ | ------------- | ----------------- |
| GET    | `/api/health` | API health status |

## 🔐 Authentication

API menggunakan JWT (JSON Web Token) untuk authentication.

### Header Format

```
Authorization: Bearer <access_token>
```

### Response Format

```json
{
  "success": true,
  "message": "Success message",
  "data": { ... },
  "pagination": {
    "page": 1,
    "perPage": 10,
    "total": 100,
    "pages": 10
  }
}
```

## 📱 Koneksi dengan React Native

### Untuk iOS Simulator

```typescript
BASE_URL: "http://localhost:5000/api";
```

### Untuk Android Emulator

```typescript
BASE_URL: "http://10.0.2.2:5000/api";
```

### Untuk Device Fisik

```typescript
// Gunakan IP address komputer Anda
BASE_URL: "http://192.168.1.xxx:5000/api";
```

## 🛠️ Development Commands

```bash
# Run development server
flask run

# Initialize database
flask init-db

# Seed sample data
flask seed-db

# Flask shell (debug)
flask shell

# Run with specific port
flask run --port 5001
```

## 📁 Project Structure

```
API/
├── app/
│   ├── __init__.py         # App factory
│   ├── config.py           # Configuration
│   ├── models/             # Database models
│   │   ├── __init__.py
│   │   ├── user.py
│   │   ├── profile.py
│   │   ├── product.py
│   │   ├── training.py
│   │   └── faq.py
│   ├── routes/             # API routes
│   │   ├── __init__.py
│   │   ├── auth.py
│   │   ├── profile.py
│   │   ├── product.py
│   │   ├── training.py
│   │   └── faq.py
│   └── utils/
│       ├── __init__.py
│       └── seeder.py
├── uploads/                # File uploads
├── .env                    # Environment variables
├── .env.example           # Example env file
├── requirements.txt       # Python dependencies
├── run.py                 # Entry point
└── README.md              # This file
```

## 🐛 Troubleshooting

### Database Connection Error

- Pastikan MySQL di Laragon sudah running
- Cek username/password di `.env`
- Pastikan database `sapa_umkm` sudah dibuat

### Port Already in Use

```bash
# Jalankan di port lain
flask run --port 5001
```

### CORS Error

CORS sudah dikonfigurasi untuk semua origin di development mode.

## 📝 Default Users (Setelah Seed)

| Email              | Password | Role  |
| ------------------ | -------- | ----- |
| admin@sapaumkm.com | admin123 | admin |
| demo@sapaumkm.com  | demo123  | umkm  |
