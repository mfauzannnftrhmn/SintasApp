# Panduan Testing Fitur Absen - SintasApp

## Cara Menjalankan Aplikasi

### 1. Install Dependencies (jika belum)
```bash
npm install
```

### 2. Jalankan Aplikasi di Browser
```bash
npm start
```
atau
```bash
ng serve
```

Aplikasi akan berjalan di `http://localhost:4200`

### 3. Akses Halaman Home
- Buka browser dan akses `http://localhost:4200`
- Aplikasi akan otomatis redirect ke `/login`
- Isi form login (bisa isi sembarang, karena masih mock data)
- Klik "Login" untuk masuk ke halaman Home

## Cara Menggunakan Fitur Absen

### Step 1: Pastikan Anda di Halaman Home
Setelah login, Anda akan melihat dashboard dengan:
- Header dengan nama karyawan
- Date Time Card
- Menu Informasi
- Informasi Jadwal Kerja
- Absensi Terakhir

### Step 2: Cari Tombol Fingerprint
- Scroll ke bawah, ada **tombol fingerprint bulat** di bagian tengah bottom navigation
- Tombol ini berada di antara tombol Notifikasi dan Riwayat
- Tombol akan berwarna hijau jika bisa Check-in, atau merah jika bisa Check-out

### Step 3: Klik Tombol Fingerprint
- Klik tombol fingerprint tersebut
- Modal maps akan muncul

### Step 4: Izin Lokasi (Pertama Kali)
- Browser akan meminta izin akses lokasi
- **Klik "Allow"** untuk memberikan izin
- Jika ditolak, fitur tidak akan berfungsi

### Step 5: Lihat Validasi Lokasi
- Sistem akan otomatis mendapatkan lokasi Anda
- Akan muncul status:
  - ✅ **Lokasi valid** jika Anda dalam radius 100m dari lokasi kantor
  - ❌ **Lokasi di luar radius** jika Anda di luar radius

### Step 6: Absen Masuk/Pulang
- Jika lokasi valid, tombol "Absen Masuk" atau "Absen Pulang" akan aktif
- Klik tombol tersebut untuk melakukan absen
- Akan muncul alert konfirmasi
- Modal akan tertutup dan data absensi akan terupdate

## Catatan Penting

### ⚠️ Lokasi Kantor (Default)
Lokasi kantor default saat ini adalah **Jakarta**:
- Latitude: `-6.2088`
- Longitude: `106.8456`
- Radius: `100 meter`

Jika Anda tidak berada di Jakarta, lokasi akan **selalu invalid**. Untuk testing, ada 2 opsi:

### Opsi 1: Update Lokasi Kantor (Recommended)
Edit file `src/app/services/location.service.ts` dan ubah koordinat kantor sesuai lokasi Anda saat ini.

### Opsi 2: Gunakan Mode Development (Untuk Testing)
Buat mode development yang bypass validasi lokasi (untuk testing saja).

## Troubleshooting

### Problem: "Izin lokasi tidak diberikan"
**Solusi:**
1. Buka browser settings
2. Cari "Site settings" atau "Permissions"
3. Cari aplikasi localhost:4200
4. Set Location permission ke "Allow"

### Problem: "Gagal mendapatkan lokasi"
**Solusi:**
1. Pastikan GPS/Location services aktif di device
2. Pastikan browser sudah mendapat izin lokasi
3. Coba refresh halaman dan klik tombol fingerprint lagi

### Problem: "Lokasi di luar radius" (selalu muncul)
**Solusi:**
1. Update lokasi kantor di `location.service.ts` sesuai lokasi Anda
2. Atau gunakan browser developer tools untuk set lokasi manual (Chrome DevTools > More tools > Sensors)

## Testing di Mobile Device

Untuk testing di device mobile:

1. **Build untuk Android/iOS:**
```bash
npm run build
npx cap sync
npx cap open android  # atau ios
```

2. **Pastikan permission lokasi di device:**
- Android: Settings > Apps > SintasApp > Permissions > Location
- iOS: Settings > Privacy > Location Services > SintasApp

## Tips Testing

1. **Test Check-in:**
   - Pastikan belum ada absen masuk hari ini
   - Klik tombol fingerprint
   - Klik "Absen Masuk"

2. **Test Check-out:**
   - Setelah check-in, klik tombol fingerprint lagi
   - Klik "Absen Pulang"

3. **Test Validasi Lokasi:**
   - Coba dengan lokasi yang berbeda
   - Lihat apakah sistem mendeteksi dengan benar

4. **Lihat Riwayat:**
   - Setelah absen, cek di section "Absensi Terakhir"
   - Atau klik "Lihat Semua" untuk ke halaman riwayat lengkap

