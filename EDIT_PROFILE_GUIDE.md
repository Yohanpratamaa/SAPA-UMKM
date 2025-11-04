# 🔧 Edit Profile Feature Guide

## 📋 Overview

Fitur Edit Profile memungkinkan pengguna untuk mengedit informasi akun mereka langsung dari halaman home dengan antarmuka yang user-friendly.

## ✨ Features

### 🏠 Home Screen Integration

- **Edit Button**: Tombol "Edit" berwarna biru di bagian kanan header "Informasi Akun"
- **Smart Display**: Informasi akun menampilkan nama lengkap, email, dan role pengguna
- **Quick Access**: Akses langsung tanpa navigasi kompleks

### 📝 Edit Profile Form

- **Full Name**: Edit nama lengkap dengan validasi minimal 2 karakter
- **Phone Number**: Edit nomor telepon dengan validasi format internasional
- **Role**: Pilih role (UMKM, Admin, Pendamping)
- **Profile Image**: Upload/change foto profil dengan ImagePicker
- **Read-only Fields**: Email dan username tidak dapat diubah untuk keamanan

### 🖼️ Image Upload

- **Gallery Support**: Pilih foto dari galeri
- **Camera Support**: Ambil foto langsung dari kamera
- **Image Preview**: Preview gambar yang dipilih
- **Format Support**: JPG, PNG dengan maksimal 5MB

## 🚀 How to Use

### 1. Access Edit Profile

```typescript
// Di halaman home, klik tombol "Edit" di bagian Informasi Akun
<TouchableOpacity onPress={() => setShowEditProfile(true)}>
  <Text>Edit</Text>
</TouchableOpacity>
```

### 2. Edit Information

1. **Open Form**: Klik tombol "Edit" di Informasi Akun
2. **Update Fields**: Ubah nama lengkap, nomor telepon, atau role
3. **Change Photo**: Tap area foto untuk memilih/mengambil gambar baru
4. **Save Changes**: Klik "Simpan Perubahan" untuk menyimpan
5. **Cancel**: Klik "Batal" untuk membatalkan perubahan

### 3. Form Validation

- ✅ **Full Name**: Minimal 2 karakter, tidak boleh kosong
- ✅ **Phone Number**: Format valid (+628xxx atau 08xxx)
- ✅ **Role**: Harus dipilih salah satu
- ✅ **Real-time Validation**: Error hilang saat field diperbaiki

## 🔧 Technical Implementation

### Components Structure

```
EditProfileModal (Modal Container)
└── EditProfileForm (Main Form)
    ├── ImageUpload (Profile Photo)
    ├── Input (Full Name, Phone)
    ├── Select (Role)
    └── Button (Save/Cancel)
```

### File Architecture

```
📁 components/
├── auth/
│   ├── EditProfileForm.tsx       # Main edit form
│   └── index.ts                  # Export
├── EditProfileModal.tsx          # Modal wrapper
└── index.ts                      # Main exports

📁 app/(tabs)/
└── home.tsx                     # Home screen integration
```

### Data Flow

```typescript
1. Home Screen → Set showEditProfile(true)
2. Modal Opens → EditProfileForm loads user data
3. User Edits → Form validation in real-time
4. Submit → Update AuthService & refresh context
5. Success → Close modal & show confirmation
```

## 🎨 UI/UX Features

### 📱 Modal Presentation

- **Slide Animation**: Smooth slide-up animation
- **Page Sheet**: Native iOS-style presentation
- **Close Button**: Easy-to-find close button di header

### 🖼️ Profile Photo Section

- **Large Preview**: Area besar untuk preview foto
- **Placeholder**: Icon cloud-upload untuk foto kosong
- **Edit Indicator**: Icon pensil di corner foto existing
- **Instructions**: Panduan ukuran dan format file

### 📋 Form Design

- **Clean Layout**: Spacing yang konsisten
- **Input Validation**: Error message yang jelas
- **Required Fields**: Asterisk (\*) untuk field wajib
- **Read-only Style**: Visual berbeda untuk field yang tidak bisa diedit

### ℹ️ Account Info Card

- **System Information**: ID akun, tanggal bergabung, login terakhir
- **Verification Status**: Status verifikasi email
- **Blue Theme**: Konsisten dengan design system

## 🔒 Security & Validation

### Input Validation

```typescript
// Full Name Validation
if (!formData.fullName.trim()) {
  errors.fullName = "Nama lengkap harus diisi";
} else if (formData.fullName.trim().length < 2) {
  errors.fullName = "Nama lengkap minimal 2 karakter";
}

// Phone Number Validation
if (!/^[\+]?[0-9]{10,15}$/.test(formData.phoneNumber.replace(/\s/g, ""))) {
  errors.phoneNumber = "Format nomor telepon tidak valid";
}
```

### Data Security

- **Read-only Email**: Email tidak dapat diubah untuk keamanan
- **Read-only Username**: Username tetap untuk identitas unik
- **Password Protection**: Password tidak ditampilkan dalam form
- **Input Sanitization**: Trim whitespace dan validasi format

### Image Security

- **File Size Limit**: Maksimal 5MB untuk mencegah abuse
- **Format Restriction**: Hanya JPG dan PNG yang diizinkan
- **Permission Handling**: Request permission untuk camera dan gallery

## 📱 Platform Compatibility

### iOS Features

- **Camera Permission**: Automatic request saat menggunakan kamera
- **Photo Library Access**: Smooth integration dengan Photos app
- **Haptic Feedback**: Native touch feedback

### Android Features

- **Storage Permission**: Handle storage access untuk gallery
- **Camera Integration**: Native camera app integration
- **Back Button**: Support hardware back button

## 🐛 Error Handling

### Form Errors

```typescript
// Error Display
{
  errors.general && (
    <View className="bg-red-50 border border-red-200 rounded-lg p-3">
      <Text className="text-red-700">{errors.general}</Text>
    </View>
  );
}
```

### Image Upload Errors

- **Permission Denied**: Alert untuk request permission
- **File Too Large**: Peringatan ukuran file
- **Unsupported Format**: Error format file tidak didukung
- **Network Error**: Handle error saat upload

### Server Errors

- **Save Failed**: Alert jika gagal menyimpan ke storage
- **Network Timeout**: Handling timeout errors
- **Data Corruption**: Validasi data integrity

## 🎯 User Experience

### Loading States

- **Save Button**: Disabled dengan text "Menyimpan..." saat proses
- **Image Upload**: Loading indicator saat memilih foto
- **Form Submission**: Prevent double submission

### Feedback Messages

- **Success Alert**: Konfirmasi berhasil menyimpan
- **Error Alerts**: Pesan error yang jelas dan actionable
- **Real-time Validation**: Immediate feedback saat typing

### Accessibility

- **Keyboard Navigation**: Support tab navigation
- **Screen Reader**: Proper labels untuk screen reader
- **Touch Targets**: Minimum 44px touch area
- **Color Contrast**: Accessible color combinations

## 🚀 Future Enhancements

### Planned Features

- [ ] **Email Verification**: Fitur verifikasi email baru
- [ ] **Password Change**: Form untuk ganti password
- [ ] **2FA Setup**: Two-factor authentication
- [ ] **Profile Themes**: Customizable color themes
- [ ] **Social Links**: Add social media links
- [ ] **Bio Section**: Personal/business description

### Technical Improvements

- [ ] **Image Compression**: Automatic image optimization
- [ ] **Cloud Storage**: Upload ke cloud storage
- [ ] **Offline Support**: Edit offline dengan sync
- [ ] **Advanced Validation**: More sophisticated validation rules
- [ ] **Audit Trail**: Log perubahan profil

## 📊 Usage Analytics

### Track User Behavior

- Profile edit frequency
- Most edited fields
- Image upload success rate
- Form completion rate
- Error occurrence patterns

## 🔧 Maintenance

### Regular Tasks

- Monitor error rates
- Update validation rules
- Optimize image handling
- Review security measures
- Update UI components

### Code Quality

- TypeScript strict mode
- ESLint configuration
- Automated testing
- Code documentation
- Performance monitoring

---

## 💡 Quick Tips

1. **Fast Access**: Tombol edit selalu visible di home screen
2. **Smart Validation**: Errors hilang otomatis saat diperbaiki
3. **Image Preview**: Tap foto untuk melihat preview penuh
4. **Auto-save**: Consider menambahkan auto-save draft
5. **Keyboard Handling**: Form scroll otomatis saat keyboard muncul

**🎉 Enjoy editing your profile with ease!**
