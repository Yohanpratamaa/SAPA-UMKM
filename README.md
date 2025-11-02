# SAPA UMKM - Sistem Aplikasi Pendampingan Adaptasi UMKM

Aplikasi mobile untuk membantu pengelolaan dan pendampingan UMKM (Usaha Mikro, Kecil, dan Menengah) di Indonesia.

## 🚀 Fitur Utama

### 1. 📋 Manajemen Profil UMKM ✅ (Tersedia)

Fitur pertama yang telah diimplementasi untuk mengelola data profil UMKM:

**Fungsi:**

- ✅ Menyimpan data usaha lengkap (nama usaha, jenis produk/jasa, alamat, NIB, nomor kontak)
- ✅ Upload dan preview foto/logo usaha
- ✅ Validasi data input dengan error handling
- ✅ Pencarian dan filter profil UMKM
- ✅ Statistik jumlah UMKM berdasarkan status
- ✅ Storage lokal menggunakan AsyncStorage

**Detail Input:**

- Nama Usaha (wajib)
- Jenis Usaha: Kuliner, Fashion, Kerajinan, Teknologi, Pertanian, Jasa, Perdagangan, Lainnya
- Deskripsi Usaha (opsional)
- Alamat Lengkap (wajib)
- Kota, Provinsi, Kode Pos (wajib)
- NIB (Nomor Induk Berusaha) - 13 digit (wajib)
- Nomor Kontak (wajib)
- Email (opsional)
- Website (opsional)
- Foto/Logo Usaha (opsional)

### 2. 🤝 Bantuan & Pendampingan (Segera Hadir)

Program bantuan dan pendampingan untuk UMKM

### 3. 🛒 Marketplace Digital (Segera Hadir)

Platform jual beli produk UMKM secara online

### 4. 🎓 Pelatihan & Edukasi (Segera Hadir)

Materi pelatihan dan workshop untuk UMKM

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

| Fitur                  | Status           | Progress |
| ---------------------- | ---------------- | -------- |
| Manajemen Profil UMKM  | ✅ Selesai       | 100%     |
| Bantuan & Pendampingan | 🚧 Dalam Rencana | 0%       |
| Marketplace Digital    | 🚧 Dalam Rencana | 0%       |
| Pelatihan & Edukasi    | 🚧 Dalam Rencana | 0%       |

## 🔜 Rencana Pengembangan Selanjutnya

1. **Fitur Bantuan & Pendampingan**

   - Daftar program bantuan pemerintah
   - Tracking status pengajuan bantuan
   - Kontak pendamping UMKM

2. **Marketplace Digital**

   - Katalog produk UMKM
   - Sistem order dan pembayaran
   - Review dan rating

3. **Pelatihan & Edukasi**
   - Video tutorial bisnis
   - Webinar dan workshop
   - Sertifikat pelatihan

## 🤝 Kontribusi

Aplikasi ini dikembangkan untuk membantu ekosistem UMKM di Indonesia. Kontribusi dan feedback sangat diterima untuk pengembangan lebih lanjut.

## 📄 Lisensi

MIT License - Lihat file LICENSE untuk detail lengkap.

---

**SAPA UMKM** - Membangun Ekonomi Digital untuk UMKM Indonesia 🇮🇩
