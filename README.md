# 📅 Website Jadwal Pelajaran Personal (Karin - XII C) & Widget iOS

Aplikasi Web Jadwal Pelajaran personal yang modern, responsif, mendukung Dark Mode, dilengkapi fitur CRUD lengkap, serta memiliki Endpoint JSON API publik yang terhubung langsung dengan **Widget Home Screen iPhone (iOS)** menggunakan aplikasi **Scriptable**.

---

## 📋 Jadwal Default Karin (Kelas XII C)

Jadwal ini telah terpasang secara default pada sistem & database:

- **Senin**:
  1. `07:00 - 08:30` : Bahasa Inggris
  2. `08:30 - 10:00` : Sejarah
  3. `10:30 - 12:00` : Informatika
  4. `12:30 - 14:00` : Matematika

- **Selasa**:
  1. `07:00 - 08:30` : Agama
  2. `08:30 - 10:00` : Matematika
  3. `10:30 - 12:00` : Bahasa Jerman
  4. `12:30 - 14:00` : Bahasa Indonesia

- **Rabu**:
  1. `07:00 - 08:30` : Biologi
  2. `08:30 - 10:00` : Olahraga
  3. `10:30 - 11:30` : Bimbingan Konseling (BK)
  4. `11:30 - 12:30` : Bahasa Inggris
  5. `13:00 - 14:30` : Kimia

- **Kamis**:
  1. `07:00 - 08:30` : Matematika Lanjut
  2. `08:30 - 10:00` : Biologi
  3. `10:30 - 12:00` : Seni Budaya
  4. `12:30 - 14:00` : PPKn

- **Jumat**:
  1. `07:00 - 08:30` : Kimia
  2. `08:30 - 10:00` : Matematika Lanjut

---

## 🚀 Fitur Utama

1. **Website Frontend (React + Next.js App Router + Tailwind CSS)**
   - **Fitur CRUD Full**: Tambah, Edit, dan Hapus mata pelajaran dengan modal yang interaktif.
   - **Informasi Lengkap**: Nama Pelajaran, Ruangan/Kelas, Nama Guru, Jam Mulai, Jam Selesai, Hari (Senin - Sabtu), Aksen Warna, dan Catatan Opsional.
   - **Tampilan Hari Ini (Today's View)**: 
     - Menyorot pelajaran yang **Sedang Berlangsung** dengan indikator pulsing & progress bar.
     - Menyorot pelajaran **Berikutnya**.
     - Timeline daftar pelajaran hari ini.
   - **Tampilan Mingguan (Weekly View)**: Filter tab berdasarkan hari (Senin - Sabtu / Semua) dan fitur Pencarian Real-time (Mata Pelajaran, Guru, Ruangan).
   - **Desain Modern**: Dark Mode toggle, glassmorphism, responsive mobile-first UI.

2. **Endpoint API Publik untuk iOS Widget**
   - GET `/api/jadwal/today`: Mengembalikan data JSON jadwal khusus hari ini (atau hari tertentu via `?day=Senin`).

3. **Integrasi Widget iOS (Scriptable)**
   - Script Javascript khusus untuk aplikasi **Scriptable (iOS)**.
   - Menampilkan tanggal hari ini, jumlah pelajaran, status kelas aktif, serta daftar pelajaran berikutnya langsung di Home Screen iPhone.

---

## 📁 Struktur Folder Proyek

```text
karin-jadwal/
├── data/
│   └── schedules.json            # File penyimpanan database JSON lokal
├── public/
│   ├── scriptable-widget.js       # Script JavaScript untuk aplikasi Scriptable (iOS)
│   └── favicon.ico
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── jadwal/
│   │   │       ├── route.ts      # API GET (List) & POST (Tambah)
│   │   │       ├── [id]/
│   │   │       │   └── route.ts  # API PUT (Edit) & DELETE (Hapus)
│   │   │       └── today/
│   │   │           └── route.ts  # API GET khusus Widget iOS (Today View)
│   │   ├── globals.css           # Styling global & Tailwind CSS v4
│   │   ├── layout.tsx            # Root layout Next.js
│   │   └── page.tsx              # Halaman utama aplikasi (Today, Weekly, Widget Guide)
│   ├── components/
│   │   ├── Navbar.tsx            # Header & navigasi tab
│   │   ├── TodayView.tsx         # Tampilan Jadwal Hari Ini
│   │   ├── WeeklyView.tsx        # Tampilan Mingguan & Filter
│   │   ├── ScheduleModal.tsx     # Form Modal Tambah / Edit Pelajaran
│   │   ├── DeleteConfirmModal.tsx# Modal konfirmasi hapus
│   │   └── WidgetGuideView.tsx   # Halaman Panduan & Mockup Widget iOS
│   ├── lib/
│   │   ├── scheduleConstants.ts  # Data awal sample & helper hari
│   │   ├── scheduleStore.ts      # Logika persitensi data server
│   │   └── scriptableScript.ts   # Export constant script Scriptable
│   └── types/
│       └── schedule.ts           # Definisi interface TypeScript
├── package.json
├── tsconfig.json
├── next.config.ts
└── README.md
```

---

## 🛠️ Cara Menjalankan Secara Lokal

```bash
# 1. Install Dependencies
npm install

# 2. Jalankan Mode Development
npm run dev

# Buka http://localhost:3000 di browser Anda.
```

---

## 📲 Cara Memasang Widget di iPhone (Scriptable)

1. **Install Scriptable**: Download gratis aplikasi **Scriptable** dari App Store iPhone.
2. **Buat Script Baru**: Buka Scriptable, tekan tombol **+**, lalu paste kode dari file `public/scriptable-widget.js`.
3. **Atur API_URL**: Ubah variabel `API_URL` di dalam script ke URL deploy Vercel/Netlify Anda (contoh: `https://jadwal-pelajaran.vercel.app/api/jadwal/today`).
4. **Pasang Widget**: 
   - Tahan layar utama (Home Screen) iPhone hingga bergoyang.
   - Tekan tombol **+** di kiri atas.
   - Cari **Scriptable** dan pilih ukuran widget **Medium**.
   - Tekan widget tersebut dan pilih script yang telah Anda buat.
