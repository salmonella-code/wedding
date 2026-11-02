# 🌸 Undangan Pernikahan Online - Edisi Sasak Lombok (GitHub Pages Ready)

Undangan pernikahan digital berbasis web statis yang elegan, responsif, dan ringan. Didesain khusus dengan sentuhan ornamen budaya suku Sasak Lombok (seperti motif tenun songket Subahnale Desa Sukarara, siluet lumbung adat, serta nuansa wisata pulau Lombok).

Website ini siap di-host langsung secara gratis di **GitHub Pages**.

---

## ✨ Fitur Unggulan

1. **Dynamic Guest Audience Name (`for=...`)**:
   - Mendukung format URL yang diminta:
     - `{base_url}/?for=Salman&Ajeng`
     - `{base_url}/for=Salman&Ajeng` *(didukung otomatis dengan `404.html` SPA routing GitHub Pages)*
     - `{base_url}/?for=Bapak%20Salman%20%26%20Keluarga`
   - Nama tamu otomatis tampil di:
     - Sampul amplop (*Cover Modal*)
     - Bagian utama (*Hero Section*)
     - Judul tab browser (*Meta Title*)
     - Form buku tamu (*RSVP*) terisi otomatis.
2. **Sentuhan Budaya Sasak & Wisata Lombok**:
   - **Section Khusus Gunung Rinjani**: Menggunakan panorama megah Gunung Rinjani (Sembalun 3.726 MDPL) berlatar awan dan kawah sebagai background dengan efek paralaks.
   - **Section Jadwal & Lokasi Acara**: Menggunakan background otentik arsitektur **Rumah Adat Suku Sasak (*Bale Tani / Desa Sade Lombok*)** dengan perpaduan kartu kaca modern (*glassmorphism*).
   - Motif tenun songket Subahnale khas Sukarara.
   - Ikon arsitektur tradisional Lumbung Sasak.
   - Peribahasa Sasak: *"Solah gawe, pade marang, rempug patut"*.
   - Cerita adat Nyongkolan, iringan Gendang Beleq, dan pesona pantai Mandalika & Senggigi.
3. **Modal Pembuka Interaktif ("Buka Undangan")**:
   - Menghindari pemblokiran *Autoplay* audio oleh browser.
   - Efek taburan konfeti bernuansa warna terracotta, emas, dan sage.
4. **Alunan Musik Latar (Background Music)**:
   - Tombol putar/jeda melayang (*floating player*) dengan ikon piringan berputar.
5. **Hitung Mundur Acara (Countdown Timer)**:
   - Menghitung hari, jam, menit, dan detik menuju akad & resepsi.
6. **Integrasi Peta & Kalender**:
   - Tombol langsung ke Google Maps & Google Calendar untuk Akad & Resepsi.
7. **Amplop Digital (Kado Digital)**:
   - Salin nomor rekening bank (BCA, BSI) hanya dengan satu klik (dilengkapi notifikasi toast).
8. **Buku Tamu & RSVP Terintegrasi Google Spreadsheet**:
   - Terhubung langsung ke Google Spreadsheet Anda: [Buka Spreadsheet](https://docs.google.com/spreadsheets/d/10AhTkXuDNHDtlffzi7BkIjj5SCIZnY08L7al8PAgudY/edit?usp=sharing).
   - Data doa dari Google Spreadsheet otomatis ditarik dan ditampilkan di daftar ucapan secara *real-time*.
   - Dilengkapi tombol sinkronisasi manual dan pencadangan lokal.
9. **Generator Tautan Undangan & WhatsApp**:
   - Terdapat alat di bagian bawah web untuk mengetikkan nama tamu dan langsung membuat format pesan WhatsApp yang rapi dan siap kirim.

---

## 🚀 Panduan Upload ke GitHub Pages

Ikuti langkah mudah ini untuk meng-online-kan undangan Anda:

### Langkah 1: Buat Repository di GitHub
1. Buka [github.com](https://github.com) dan login ke akun Anda.
2. Klik tombol **New** untuk membuat repository baru.
3. Beri nama repository, misalnya: `wedding` atau `undangan-nikah`.
4. Pilih **Public**.
5. Klik **Create repository**.

### Langkah 2: Upload File ke Repository
Buka terminal / PowerShell di folder proyek ini (`d:\Projek\LaragonApp\wedding`), lalu jalankan:

```bash
git init
git add .
git commit -m "Initial commit - Lombok Sasak Wedding Invitation"
git branch -M main
git remote add origin https://github.com/USERNAME_ANDA/wedding.git
git push -u origin main
```
*(Ganti `USERNAME_ANDA` dengan username GitHub Anda).*

> **Atau cara tanpa git CLI:** Anda juga bisa langsung drag-and-drop semua file (`index.html`, `404.html`, folder `css`, folder `js`) melalui tombol **Add file -> Upload files** di halaman repository GitHub Anda.

### Langkah 3: Aktifkan GitHub Pages
1. Di halaman repository GitHub Anda, klik tab **Settings** (ikon gerigi).
2. Pada menu sebelah kiri, pilih **Pages**.
3. Di bawah bagian **Build and deployment -> Branch**:
   - Pilih branch: **`main`**
   - Pilih folder: **`/(root)`**
   - Klik **Save**.
4. Tunggu sekitar 1 - 2 menit, lalu refresh halaman. Anda akan melihat link website Anda aktif, misalnya:
   `https://USERNAME_ANDA.github.io/wedding/`

---

## 💌 Cara Membagikan Link ke Tamu

Setelah website aktif di GitHub Pages:

### 1. Format URL:
- Untuk Salman & Ajeng:
  ```text
  https://USERNAME.github.io/wedding/?for=Salman&Ajeng
  ```
  atau
  ```text
  https://USERNAME.github.io/wedding/for=Salman&Ajeng
  ```
- Untuk tamu dengan gelar atau keluarga:
  ```text
  https://USERNAME.github.io/wedding/?for=Bpk.+Lalu+Fathur+%26+Keluarga
  ```

### 2. Gunakan Fitur Generator di Website:
Di bagian bawah halaman website terdapat menu **"Generator Link Tamu"**:
1. Ketik nama tamu (contoh: `Salman & Ajeng`).
2. Klik **Generate Link**.
3. Klik tombol **Bagikan WA** untuk langsung membuka WhatsApp dengan format pesan resmi yang sopan.

---

## 🛠️ Cara Kustomisasi Data Pribadi

Semua konten dapat diedit dengan mudah:

1. **Nama Mempelai & Orang Tua**: Buka [index.html](index.html) dan cari teks `Arya Danuarta` atau `Sekar Kinanthi`.
2. **Tanggal & Lokasi Acara**: Cari bagian id `event` di [index.html](index.html).
3. **Nomor Rekening**: Cari bagian id `gift` di [index.html](index.html).
4. **Target Tanggal Countdown**: Buka [js/app.js](js/app.js), cari baris:
   ```javascript
   const targetDate = new Date('2026-12-10T08:00:00+08:00').getTime();
   ```
5. **Musik Latar**: Ganti link `src` audio di tag `<audio id="wedding-audio">` pada [index.html](index.html) dengan URL file mp3 pilihan Anda.

---

## 📊 Cara Menghubungkan Form ke Google Spreadsheet

Agar form RSVP di website dapat otomatis menulis data ke Google Spreadsheet Anda:

1. Buka spreadsheet Anda: [https://docs.google.com/spreadsheets/d/10AhTkXuDNHDtlffzi7BkIjj5SCIZnY08L7al8PAgudY/edit](https://docs.google.com/spreadsheets/d/10AhTkXuDNHDtlffzi7BkIjj5SCIZnY08L7al8PAgudY/edit)
2. Klik menu **Ekstensi** (*Extensions*) -> **Apps Script**.
3. Buka file `google-apps-script.js` yang ada di folder proyek ini, lalu salin (*copy*) semua kodenya dan tempel (*paste*) ke editor Apps Script.
4. Klik tombol **Simpan** (Ctrl + S).
5. Klik tombol **Terapkan** (*Deploy*) di pojok kanan atas -> pilih **Penerapan Baru** (*New deployment*).
6. Pada kolom jenis, pilih **Aplikasi Web** (*Web app*).
7. Konfigurasi:
   - **Jalankan sebagai**: *Saya* (*Me*)
   - **Siapa yang memiliki akses**: *Siapa saja* (*Anyone*) -> **Wajib dipilih agar tamu dapat mengirim doa tanpa login**.
8. Klik **Terapkan** (*Deploy*) dan berikan izin (*Authorize*).
9. Salin **URL Aplikasi Web** yang berakhiran `/exec`.
10. Tempelkan URL tersebut ke:
    - Langsung di website melalui tombol ikon gerigi ⚙️ di samping judul *Ucapan & Doa Sahabat*, **ATAU**
    - Di file [js/app.js](js/app.js) pada variabel `GOOGLE_SCRIPT_URL = 'URL_ANDA_DISINI';`.


