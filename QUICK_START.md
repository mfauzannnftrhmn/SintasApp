# Quick Start - Testing Fitur Absen

## 🚀 Langkah Cepat (5 Menit)

### 1. Jalankan Aplikasi
```bash
npm start
```

### 2. Buka Browser
Buka: `http://localhost:4200`

### 3. Login
- Isi form login (bisa sembarang)
- Klik "Login"

### 4. Test Absen
1. Scroll ke bawah, cari **tombol fingerprint bulat** di tengah bottom navigation
2. Klik tombol fingerprint
3. **Allow** permission lokasi saat diminta
4. Lihat status lokasi di modal
5. Klik "Absen Masuk" atau "Absen Pulang"

## ⚠️ Catatan Penting

### Lokasi Kantor (Default: Jakarta)
Jika lokasi Anda **bukan Jakarta**, sistem akan selalu bilang "Lokasi di luar radius".

### Solusi untuk Testing:

#### Opsi A: Update Lokasi Kantor di Code
Edit file: `src/app/services/location.service.ts`
```typescript
private officeLocation: LocationSettings = {
  latitude: -6.2088,  // GANTI dengan latitude lokasi Anda
  longitude: 106.8456, // GANTI dengan longitude lokasi Anda
  radius: 100
};
```

Cara dapatkan koordinat:
- Buka Google Maps
- Klik kanan di lokasi yang diinginkan
- Copy koordinat (lat, lng)

#### Opsi B: Gunakan Chrome DevTools (Paling Mudah!)
1. Buka Chrome DevTools (F12)
2. Klik **More tools** > **Sensors**
3. Di bagian **Location**, pilih "Custom location"
4. Masukkan koordinat kantor (default: -6.2088, 106.8456)
5. Refresh halaman
6. Test absen lagi

#### Opsi C: Set Lokasi dari Browser Console
1. Buka DevTools Console (F12)
2. Ketik:
```javascript
// Set lokasi kantor ke lokasi Anda saat ini
// (menggunakan koordinat dari browser)
navigator.geolocation.getCurrentPosition((pos) => {
  console.log('Lokasi Anda:', pos.coords.latitude, pos.coords.longitude);
  // Copy koordinat ini dan update di location.service.ts
});
```

## 📱 Testing di Mobile

### Android
```bash
npm run build
npx cap sync
npx cap open android
```

### iOS
```bash
npm run build
npx cap sync
npx cap open ios
```

**Pastikan** permission lokasi sudah diaktifkan di device settings!

## 🎯 Fitur yang Bisa Ditest

✅ **Check-in** - Absen masuk (hanya muncul jika belum check-in hari ini)
✅ **Check-out** - Absen pulang (hanya muncul jika sudah check-in)
✅ **Validasi Lokasi** - Sistem cek apakah dalam radius 100m
✅ **Riwayat Absensi** - Lihat di section "Absensi Terakhir" atau klik "Lihat Semua"

## 🐛 Troubleshooting

**"Izin lokasi tidak diberikan"**
→ Buka browser settings, allow location untuk localhost:4200

**"Gagal mendapatkan lokasi"**
→ Pastikan GPS aktif, atau gunakan Chrome DevTools untuk simulate location

**"Lokasi di luar radius" (selalu)**
→ Update lokasi kantor di code, atau gunakan Chrome DevTools untuk set lokasi

**Tombol fingerprint disabled**
→ Pastikan sudah login dan ada shift yang terassign

## 💡 Tips

- Gunakan **Chrome DevTools Sensors** untuk testing lokasi (paling mudah!)
- Radius default 100m, bisa diubah di `location.service.ts`
- Lokasi akan tersimpan saat absen masuk/pulang
- Cek riwayat di section "Absensi Terakhir" setelah absen

