# 📰 KabarSatu — "Semua Kabar, Satu Tujuan"

Progressive Web App (PWA) Full-Stack Web Aggregator modern dan mobile-first yang menyatukan feed portal berita nasional utama Indonesia (Kompas, Detik, Antara, CNN Indonesia, Tempo) dan lini masa media sosial publik (YouTube & Medsos) ke dalam satu Unified Feed terpadu.

---

## 🌟 Fitur Utama

1. **Futuristic Splash Screen & Audio Chime:**
   - Animasi transisi masuk 1.5 - 2 detik dengan logo kustom dan slogan *"Semua Kabar, Satu Tujuan"*.
   - Efek suara intro / chime futuristik lembut menggunakan synthesizer Web Audio API tanpa ketergantungan file luar, serta mendukung file audio eksternal.
2. **Unified Feed Terpadu:**
   - Desain kartu responsif (*Card UI*) bernuansa **Modern Tech Dark Mode** (`#0F172A`).
   - Normalisasi data seragam: `{ id, source, source_icon, title, content, author, timestamp, image_url, original_link, category }`.
3. **Guest-First Architecture (Tanpa Barikade Login):**
   - Pengguna bebas membaca seluruh berita secara instan tanpa registrasi.
   - Fitur bookmark artikel dan filter kategori favorit tersimpan otomatis di browser menggunakan `localStorage`.
   - Tersedia tombol/modal login opsional di pojok kanan atas untuk mockup sinkronisasi di masa depan.
4. **Pencarian Real-Time & Filter Kategori:**
   - Filter cepat kategori: *Semua*, *Berita*, *YouTube*, *Medsos*, dan *Tren*.
   - Filter per portal media (Kompas, Detik, Antara, CNN, Tempo).
   - Pencarian instan berdasarkan judul, ringkasan, atau jurnalis.
5. **PWA & Offline Capability:**
   - Web App Manifest (`manifest.webmanifest`) dengan fitur *Add to Home Screen*.
   - Service Worker (`sw.js`) untuk strategi *stale-while-revalidate* offline cache.
6. **Footer Resmi & Hak Cipta:**
   - "© 2026 KabarSatu. Created by Muhammad Arya. All rights reserved."

---

## 🎨 Skema Warna (Modern Tech Dark Mode)

| Elemen | Kode Warna |
| :--- | :--- |
| **Background Utama (Body)** | Slate Dark (`#0F172A`) |
| **Background Kartu / Card UI** | Dark Charcoal (`#1E293B`) |
| **Warna Aksen / Tombol Utama** | Electric Blue (`#3B82F6` / `#2563EB`) |
| **Teks Utama** | Off-White (`#F8FAFC`) |
| **Teks Sekunder / Timestamp** | Slate Gray (`#94A3B8`) |
| **Borders / Dividers** | Subtle Gray (`#334155`) |

---

## 🛠️ Menjalankan Projek di Lokal

### 1. Prasyarat
Pastikan Node.js (v18+) telah terpasang.

### 2. Instalasi Dependensi
```bash
npm install
```

### 3. Menjalankan Server Pengembangan (Dev)
```bash
npm run dev
```
Buka browser pada URL yang tampil di terminal (biasanya `http://localhost:3000` atau `http://localhost:5173`).

### 4. Build untuk Produksi
```bash
npm run build
```
Hasil build produksi siap rilis akan disimpan di dalam folder `dist/`.

---

## 🚀 Panduan Deployment ke Cloudflare Pages

Projek ini telah dioptimalkan secara penuh untuk deployment instan di **Cloudflare Pages**:

### Langkah Deploy via Cloudflare Dashboard / GitHub:
1. Push repositori ini ke akun GitHub Anda.
2. Masuk ke [Cloudflare Dashboard](https://dash.cloudflare.com/) > **Workers & Pages** > **Create application** > **Pages** > **Connect to Git**.
3. Pilih repositori `KabarSatu`.
4. Pada bagian **Build settings**:
   - **Framework preset:** `Vite` (atau `None`)
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
5. Klik **Save and Deploy**.
6. Cloudflare Pages akan otomatis memproses build dan mendistribusikan aplikasi secara global melalui CDN Edge dengan file `_redirects` dan `_headers` yang telah terkonfigurasi.

---

## 📄 Hak Cipta

© 2026 KabarSatu. Created by Muhammad Arya. All rights reserved.
