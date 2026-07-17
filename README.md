# 🎓 Gradfolio

**Build Today. Showcase Tomorrow.**

Platform portfolio akademik lintas institusi yang membantu mahasiswa mendokumentasikan setiap karya sejak awal perkuliahan, lalu membagikannya dalam satu tautan profesional saat dibutuhkan (magang, MBKM, beasiswa, atau pekerjaan).

Lihat `PROJECT_SPEC.md` untuk spesifikasi produk lengkap (business rules, database planning, API planning, tech stack, dsb).

## Tech Stack

- **Framework:** Next.js (App Router, Server Actions, TypeScript)
- **Database & Auth:** Supabase (PostgreSQL + Row Level Security)
- **Media Storage:** Cloudinary (cover portfolio & foto profil)
- **Validation:** Zod + React Hook Form
- **UI:** Tailwind CSS, shadcn/ui, Framer Motion, next-themes (dark mode)
- **Deployment:** Vercel

## Menjalankan Secara Lokal

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Siapkan environment variables**

   Salin `.env.example` menjadi `.env.local`, lalu isi:

   ```bash
   cp .env.example .env.local
   ```

   | Variabel | Keterangan |
   | --- | --- |
   | `NEXT_PUBLIC_SUPABASE_URL` | URL project Supabase Anda |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Anon/publishable key Supabase |
   | `CLOUDINARY_CLOUD_NAME` | Nama cloud Cloudinary |
   | `CLOUDINARY_API_KEY` | API key Cloudinary |
   | `CLOUDINARY_API_SECRET` | API secret Cloudinary — **jangan pernah** diberi prefix `NEXT_PUBLIC_` |
   | `NEXT_PUBLIC_APP_URL` | URL aplikasi (`http://localhost:3000` saat development) |

   > ⚠️ File `.env.local` berisi kredensial rahasia dan **tidak boleh** dikirim ke repository publik (sudah masuk `.gitignore`).

3. **Setup database**

   Buka Supabase SQL Editor pada project Anda, lalu jalankan **kedua** file migrasi berikut **secara berurutan**:

   ```
   supabase/migrations/001_initial_schema.sql
   supabase/migrations/002_portfolio_collections.sql
   ```

   Migrasi `001` membuat tabel inti (`profiles`, `institutions`, `portfolio_items`, `portfolio_resources`), RLS, trigger auto-create profile, dan seed data institusi. Migrasi `002` menambahkan fitur **Bagikan Portofolio** — tabel `portfolio_collections` dan `collection_items` yang memungkinkan mahasiswa membuat satu link berisi beberapa karya sekaligus untuk dikirim ke HRD/recruiter.

4. **Jalankan development server**

   ```bash
   npm run dev
   ```

   Buka [http://localhost:3000](http://localhost:3000).

## Perintah yang Tersedia

| Perintah | Fungsi |
| --- | --- |
| `npm run dev` | Menjalankan development server |
| `npm run build` | Build production (menjalankan type-check penuh) |
| `npm run start` | Menjalankan hasil build production |
| `npm run lint` | Menjalankan ESLint |

## Struktur Folder Singkat

```
src/
├── actions/       # Server Actions (auth, portfolio, profile, resource)
├── app/           # Routes (App Router)
├── components/    # UI components (portfolio, profile, layout, ui/shadcn)
├── constants/      # Konstanta terpusat (kategori, jenis, resource types, dll)
├── hooks/          # Custom hooks
├── lib/            # Supabase client/server, Cloudinary, utils
├── schemas/        # Zod validation schemas
└── types/          # Tipe database & aplikasi
supabase/
└── migrations/     # SQL schema + RLS policies
```

## Deploy ke Vercel

1. Push repository ke GitHub.
2. Import project di [Vercel](https://vercel.com/new).
3. Tambahkan seluruh environment variables pada bagian **Settings → Environment Variables** (sama seperti `.env.local`).
4. Deploy — Vercel akan otomatis mendeteksi Next.js dan menjalankan build.

## Fitur Utama

- Autentikasi (registrasi, login, logout) dengan Supabase Auth
- Onboarding profil (institusi searchable, program studi, angkatan, bio)
- CRUD Portfolio Item (draft/published) dengan upload cover ke Cloudinary
- Project Resources (GitHub, Live Demo, Google Drive, Figma, YouTube, Dokumentasi, PDF)
- Project Showcase publik dengan pencarian & filter kategori
- Portfolio Share — halaman detail lengkap satu karya yang bisa dibagikan lewat satu tautan
- **Bagikan Portofolio** — pilih beberapa karya published sekaligus, buat satu link (`/share/[id]`), kirim ke HRD/recruiter yang bisa langsung melihat semua karya pilihan tanpa login
- Dashboard dengan statistik & aksi cepat (edit, publish/unpublish, hapus)
- Dark mode & tampilan responsif penuh (mobile-first)
