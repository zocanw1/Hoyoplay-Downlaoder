# HoYoPlay Downloader

Sebuah aplikasi web interaktif untuk menelusuri dan mengunduh latar belakang video dan gambar historis dari peluncur HoYoPlay (Genshin Impact, Honkai: Star Rail, Zenless Zone Zero, dan Honkai Impact 3rd).

Dibuat dengan **Next.js 16 (App Router)** dan **Tailwind CSS**.

## Disclaimer Hak Cipta (Copyright Notice)

**PENTING:** Proyek ini **tidak berafiliasi dengan, tidak disponsori, dan tidak disetujui secara khusus oleh HoYoverse**. 
Semua aset game, desain karakter, video latar belakang, gambar peluncur, dan merek dagang adalah hak milik sepenuhnya dari **COGNOSPHERE PTE. LTD. (HoYoverse)**. 

Proyek ini hanya bersifat edukatif dan pengarsipan penggemar (fan-archiving). Sumber data yang digunakan berasal dari repositori terbuka komunitas [UIGF-org/HoYoPlay-Launcher-Background](https://github.com/UIGF-org/HoYoPlay-Launcher-Background).

## Cara Hosting (Deploy)

Aplikasi ini dapat di-hosting dengan sangat mudah dan gratis menggunakan platform Vercel.

1. **Vercel** (Rekomendasi)
   - Buka [Vercel.com](https://vercel.com) dan login menggunakan akun GitHub kamu.
   - Klik **Add New...** -> **Project**.
   - Pilih repositori `Hoyoplay-Downlaoder` milikmu.
   - Klik **Deploy**. Vercel akan otomatis mendeteksi bahwa ini adalah proyek Next.js dan membangun aplikasinya untukmu.
   
2. **Platform Lain**
   - Aplikasi ini juga bisa di-deploy di Netlify, Railway, Render, atau VPS apa pun yang mendukung Node.js.
   - Cukup jalankan perintah:
     ```bash
     npm install
     npm run build
     npm run start
     ```

## Fitur
- 🎥 Unduh langsung dari server CDN resmi HoYoverse.
- 🖼 Menampilkan gambar dan animasi latar belakang beresolusi tinggi.
- ⚡ Antarmuka gelap dan modern dengan transisi yang halus.
- 📱 Responsif untuk berbagai perangkat.
