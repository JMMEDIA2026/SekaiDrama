# SekaiDrama

[![License](https://img.shields.io/github/license/Sansekai/SekaiDrama)](https://github.com/Sansekai/SekaiDrama/blob/main/LICENSE)
[![Repository](https://img.shields.io/badge/GitHub-Repository-blue?logo=github)](https://github.com/Sansekai/SekaiDrama)

![Preview](public/preview.png)

SekaiDrama adalah platform streaming drama pendek (vertical drama) modern yang menampilkan konten dari bebebrapa platform populer. Dibangun dengan teknologi web terkini untuk performa maksimal dan pengalaman pengguna yang premium.

## Persyaratan Sistem
Sebelum memulai, pastikan komputer Anda sudah terinstall:
- [Node.js](https://nodejs.org/) (Versi 18 LTS atau 20 LTS disarankan)
- Git (Opsional)

## Panduan Instalasi (Localhost)

Ikuti langkah-langkah berikut untuk menjalankan project ini di komputer Anda:

### 1. Clone Repository
1.  Buka terminal (Command Prompt/PowerShell).
2.  Clone repository ini ke komputer Anda:
    ```bash
    git clone https://github.com/Sansekai/SekaiDrama.git
    ```
3.  Masuk ke folder project:
    ```bash
    cd SekaiDrama
    ```

### 2. Install Dependencies
Install semua library yang dibutuhkan project ini:
```bash
npm install
# atau jika menggunakan yarn
yarn install
# atau pnpm
pnpm install
```

### 3. Konfigurasi Environment Variable
Salin file bernama `.env.example` menjadi `.env`

### 4. Jalankan Development Server
Mulai server lokal untuk pengembangan:
```bash
npm run dev
```

Buka browser dan kunjungi [http://localhost:3000](http://localhost:3000).

## Script Perintah
| Command | Fungsi |
|---------|--------|
| `npm run dev` | Menjalankan server development |
| `npm run build` | Membuat build production |
| `npm run start` | Menjalankan build production |
| `npm run lint` | Cek error coding style (Linting) |

## Struktur Folder
```text
src/
├── app/                    # Halaman & Routing (Next.js App Router)
│   ├── (auth)/             # Route Group untuk fitur Login/Register
│   ├── (main)/             # Route Group untuk konten utama (Home, Search)
│   ├── api/                # API Routes untuk integrasi backend
│   ├── drama/              # Halaman detail & Video player
│   └── layout.tsx          # Root layout aplikasi
├── components/             # Reusable UI Components
│   ├── ui/                 # Base components (Shadcn UI)
│   ├── player/             # Komponen khusus video player
│   ├── cards/              # Komponen card drama/koleksi
│   └── layouts/            # Navbar, Sidebar, Footer
├── hooks/                  # Custom React Hooks (useAuth, usePlayer, dll)
├── lib/                    # Helper functions & konfigurasi library (Prisma, Axios)
├── services/               # Logic fetching data & business logic
├── types/                  # TypeScript interfaces & types definitions
└── styles/                 # Global CSS & Tailwind configuration
```

## Member & Admin (Manajemen Iklan)

Website ini sekarang mendukung:
- Pendaftaran & login pengunjung (`/signup`, `/login`)
- Dashboard admin di `/admin/ads` untuk mengelola: pop-up donasi QRIS (judul/deskripsi/gambar/on-off), banner gambar, dan slot iklan umum (mis. Google AdSense — cukup tempel script/HTML-nya)

Fitur ini butuh database Postgres, jadi ada langkah setup tambahan:

### 1. Hubungkan Database
Buat/hubungkan **Vercel Postgres** (atau Neon/Postgres kompatibel lainnya) ke project di dashboard Vercel. Vercel akan otomatis mengisi env var `POSTGRES_URL`. Untuk pengembangan lokal, salin nilainya ke `.env` (lihat `.env.example`).

### 2. Jalankan Migrasi Skema
```bash
npm run db:migrate
```

### 3. Buat Akun Admin
Password **tidak** disimpan di kode — isi lewat environment variable saat menjalankan perintah seed, lalu jalankan sekali saja:
```bash
ADMIN_USERNAME=nkjoy ADMIN_EMAIL=email-anda@contoh.com ADMIN_PASSWORD=isi-password-anda npm run db:seed
```
Password otomatis di-hash sebelum disimpan ke database. Setelah sukses, login di `/login` dengan aidi & password tersebut, lalu buka `/admin/ads` untuk mulai mengatur iklan.

### 4. Set JWT_SECRET
Isi `JWT_SECRET` di environment variables dengan string acak yang panjang (contoh: `openssl rand -base64 32`) — dipakai untuk menandatangani sesi login. Tanpa ini, login/signup akan gagal.

## Kustomisasi

### Menghapus Popup Donasi QRIS

Jika Anda ingin menghapus popup donasi yang muncul di halaman detail, Anda dapat memberikan komentar pada pemanggilan komponen `QrisDonationPopup` di dalam file `src/app/detail/layout.tsx`.

Ubah kode berikut:

```tsx
import QrisDonationPopup from '@/components/QrisDonationPopup';

export default function DetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <QrisDonationPopup />
    </>
  );
}
```

Menjadi seperti ini:

```tsx
import QrisDonationPopup from '@/components/QrisDonationPopup';

export default function DetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      {/* <QrisDonationPopup /> */}
    </>
  );
}
```
