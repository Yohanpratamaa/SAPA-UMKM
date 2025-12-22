# 🔧 Troubleshooting Guide - Koneksi Front-End & Back-End

## ✅ Status Saat Ini

**Backend:** ✅ Berjalan dengan baik di `http://192.168.0.14:5000`  
**IP Address:** `192.168.0.14` (sudah terkonfigurasi)  
**Port:** `5000` (sudah listening)  
**CORS:** ✅ Sudah dikonfigurasi untuk React Native

---

## 🎯 Checklist Troubleshooting

### 1️⃣ **Pastikan Backend Berjalan**

```powershell
# Di terminal, masuk ke folder API
cd API

# Aktifkan virtual environment
.\venv\Scripts\Activate.ps1

# Jalankan server Flask
python run.py
```

**Output yang benar:**

```
 * Serving Flask app 'run.py'
 * Debug mode: on
WARNING: This is a development server. Do not use it in a production deployment.
 * Running on all addresses (0.0.0.0)
 * Running on http://127.0.0.1:5000
 * Running on http://192.168.0.14:5000
```

### 2️⃣ **Verifikasi IP Address Komputer**

```powershell
ipconfig | Select-String -Pattern "IPv4"
```

**Yang perlu dicatat:** Gunakan IP yang berada di network yang sama dengan device Anda.  
Contoh: `192.168.0.14` atau `192.168.1.x`

### 3️⃣ **Test Backend dari Browser**

Buka di browser:

```
http://192.168.0.14:5000/api/health
```

**Response yang benar:**

```json
{
  "status": "healthy",
  "message": "SAPA-UMKM API is running"
}
```

### 4️⃣ **Konfigurasi Front-End**

File: `services/api/config.ts`

```typescript
const YOUR_COMPUTER_IP = "192.168.0.14"; // ✅ Sudah benar
```

**Pastikan IP ini sesuai dengan IP komputer Anda!**

---

## 🔥 Masalah Umum & Solusi

### ❌ Problem 1: "Network request failed"

**Penyebab:**

- IP address salah
- Backend tidak berjalan
- Firewall memblokir koneksi

**Solusi:**

```powershell
# 1. Cek apakah port 5000 listening
netstat -ano | Select-String ":5000"

# 2. Nonaktifkan sementara Windows Firewall untuk testing
# Settings → Windows Security → Firewall → Private networks → Off

# 3. Atau izinkan port 5000
New-NetFirewallRule -DisplayName "Flask API" -Direction Inbound -LocalPort 5000 -Protocol TCP -Action Allow
```

### ❌ Problem 2: "CORS policy error"

**Penyebab:** CORS tidak dikonfigurasi dengan benar di backend

**Solusi:** Sudah dikonfigurasi di `app/__init__.py`:

```python
CORS(app, resources={
    r"/api/*": {
        "origins": "*",
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"]
    }
})
```

### ❌ Problem 3: "Connection timeout"

**Penyebab:** Timeout terlalu pendek atau server lambat

**Solusi:** Sudah dikonfigurasi 30 detik di `services/api/config.ts`:

```typescript
TIMEOUT: 30000, // 30 seconds
```

### ❌ Problem 4: Device & Komputer di Network Berbeda

**Penyebab:** Device terhubung ke WiFi berbeda dengan komputer

**Solusi:**

- Pastikan device dan komputer terhubung ke **WiFi yang sama**
- Atau gunakan hotspot dari salah satu device

---

## 📱 Testing di Different Platforms

### **Android Emulator**

```typescript
// Otomatis menggunakan 10.0.2.2
BASE_URL: "http://10.0.2.2:5000/api";
```

### **Android Physical Device / Expo Go**

```typescript
// Gunakan IP komputer
BASE_URL: "http://192.168.0.14:5000/api";
```

### **iOS Simulator**

```typescript
// Localhost works
BASE_URL: "http://localhost:5000/api";
```

### **iOS Physical Device / Expo Go**

```typescript
// Gunakan IP komputer
BASE_URL: "http://192.168.0.14:5000/api";
```

---

## 🧪 Testing API Connection

### Test 1: Health Check

```bash
curl http://192.168.0.14:5000/api/health
```

### Test 2: Register User

```bash
curl -X POST http://192.168.0.14:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "username": "testuser",
    "full_name": "Test User",
    "phone_number": "081234567890",
    "password": "password123"
  }'
```

### Test 3: Login

```bash
curl -X POST http://192.168.0.14:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email_or_username": "testuser",
    "password": "password123"
  }'
```

---

## 🔍 Debugging Front-End

### Enable Debug Logging

Di `services/api/client.ts`, uncomment logging:

```typescript
console.log("🌐 API Request:", {
  url: fullUrl,
  method,
  headers,
  body: requestOptions.body,
});

console.log("📦 API Response:", {
  status: response.status,
  data: result,
});
```

### Check AsyncStorage

```typescript
import AsyncStorage from "@react-native-async-storage/async-storage";

// Check stored data
const checkStorage = async () => {
  const keys = await AsyncStorage.getAllKeys();
  const items = await AsyncStorage.multiGet(keys);
  console.log("Storage:", items);
};
```

---

## 🚀 Quick Start untuk Testing

### Terminal 1: Backend

```powershell
cd API
.\venv\Scripts\Activate.ps1
python run.py
```

### Terminal 2: Frontend

```powershell
# Untuk Expo
npx expo start

# Atau
npm start
```

### Browser: Test API

```
http://192.168.0.14:5000/api/health
```

---

## 📊 Network Configuration Matrix

| Platform | Device Type      | BASE_URL                       |
| -------- | ---------------- | ------------------------------ |
| Android  | Emulator         | `http://10.0.2.2:5000/api`     |
| Android  | Physical/Expo Go | `http://192.168.0.14:5000/api` |
| iOS      | Simulator        | `http://localhost:5000/api`    |
| iOS      | Physical/Expo Go | `http://192.168.0.14:5000/api` |
| Web      | Browser          | `http://localhost:5000/api`    |

---

## 🎯 Final Checklist

- [ ] Backend server running on `http://0.0.0.0:5000`
- [ ] Port 5000 is listening (check with `netstat`)
- [ ] IP address correct in `services/api/config.ts`
- [ ] Device and computer on same WiFi network
- [ ] Firewall allows port 5000
- [ ] CORS configured in backend
- [ ] Test `/api/health` endpoint from browser
- [ ] Clear app cache/storage on device
- [ ] Restart Expo dev server

---

## 📞 Still Having Issues?

### Check These Files:

1. `services/api/config.ts` - API endpoint configuration
2. `services/api/client.ts` - HTTP client implementation
3. `API/app/__init__.py` - Flask CORS configuration
4. `API/run.py` - Server startup configuration

### Enable Verbose Logging:

```typescript
// In services/api/client.ts
private async request<T>(endpoint: string, options: RequestOptions = {}): Promise<ApiResponse<T>> {
  console.log('🔍 DEBUG - Request:', {
    endpoint,
    baseUrl: this.baseUrl,
    fullUrl: `${this.baseUrl}${endpoint}`,
    method: options.method || 'GET',
    hasBody: !!options.body,
    requireAuth: options.requireAuth
  });

  // ... rest of code
}
```

---

## ✅ Success Indicators

Koneksi berhasil jika Anda melihat:

1. **Di Console Browser/Terminal:**

   ```
   ✓ API Request successful
   ✓ 200 OK
   ```

2. **Di Flask Server Log:**

   ```
   192.168.0.14 - - [22/Dec/2025 10:30:45] "POST /api/auth/login HTTP/1.1" 200 -
   ```

3. **Di React Native App:**
   - Login berhasil
   - Data terload
   - Tidak ada error "Network request failed"

---

**Last Updated:** December 22, 2025  
**Status:** ✅ Backend verified working, ready for frontend testing
