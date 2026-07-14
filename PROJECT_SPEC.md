# PROJECT_SPEC.md

## Gradfolio — *Build Today. Showcase Tomorrow.*

> **Dokumen ini adalah Single Source of Truth (SSOT) untuk proyek Gradfolio.**
> Seluruh developer (manusia maupun AI) **wajib membaca dokumen ini secara utuh** sebelum menulis, mengubah, atau meninjau kode apapun. Dokumen ini disusun setingkat *Software Requirement Specification* (SRS) profesional dan menjadi acuan tunggal selama seluruh siklus pengembangan.

**Versi Dokumen:** 1.0
**Status:** Final Draft — Siap untuk Development
**Tipe Dokumen:** Software Requirement Specification (SRS) & Technical Blueprint

---

## Daftar Isi

1. [Project Information](#1-project-information)
2. [Business Story](#2-business-story)
3. [Business Rules](#3-business-rules)
4. [User Roles](#4-user-roles)
5. [User Journey](#5-user-journey)
6. [Application Flow](#6-application-flow)
7. [Features](#7-features)
8. [Pages](#8-pages)
9. [Database Planning](#9-database-planning)
10. [API Planning](#10-api-planning)
11. [Folder Structure Recommendation](#11-folder-structure-recommendation)
12. [Recommended Tech Stack](#12-recommended-tech-stack)
13. [UI / UX Guidelines](#13-ui--ux-guidelines)
14. [Coding Standards](#14-coding-standards)
15. [Development Rules](#15-development-rules)
16. [AI Development Instructions](#16-ai-development-instructions)

---

## 1. Project Information

| Atribut | Detail |
| --- | --- |
| **Nama Project** | **Gradfolio** |
| **Tagline** | *Build Today. Showcase Tomorrow.* |
| **Deskripsi** | Gradfolio adalah platform portfolio akademik lintas institusi yang memungkinkan mahasiswa mendokumentasikan setiap karya yang mereka selesaikan — baik akademik maupun non-akademik — secara bertahap sejak awal masa perkuliahan, lalu membagikannya dalam satu tautan profesional saat dibutuhkan. |
| **Tujuan** | Membantu mahasiswa membangun portfolio secara konsisten dan berkelanjutan sepanjang masa studi, sehingga portfolio selalu siap dibagikan kapan pun peluang (magang, MBKM, beasiswa, pekerjaan, freelance) muncul, tanpa harus menyusun ulang dari nol. |
| **Target User** | Mahasiswa aktif dan fresh graduate dari seluruh program studi dan institusi (Teknik Informatika, DKV, Teknik Mesin, Akuntansi, Tata Boga, Keperawatan, dan lain-lain), tanpa batasan bidang keilmuan. |
| **Masalah yang Diselesaikan** | (1) Portfolio baru disusun saat sudah mendesak dibutuhkan; (2) Resource karya tersebar di banyak platform (GitHub, Drive, Figma, YouTube, PDF); (3) Recruiter/dosen harus membuka banyak tautan terpisah untuk memahami satu karya; (4) Karya-karya lama terlupakan karena tidak pernah didokumentasikan secara terstruktur. |
| **Nilai Utama Aplikasi** | Satu halaman yang menghubungkan seluruh resource dari satu karya — bukan pengganti GitHub, Google Drive, Figma, atau LinkedIn, melainkan penghubung (aggregator) yang membuat setiap karya mudah didokumentasikan, ditemukan, dan dibagikan. |
| **Filosofi Produk** | *"Setiap karya memiliki nilai. Dokumentasikan sejak selesai dibuat, sehingga ketika peluang datang, portfolio sudah siap dibagikan."* |
| **Visi** | Menjadi platform portfolio akademik lintas institusi yang membantu mahasiswa mendokumentasikan, mengelola, dan membagikan setiap hasil karya secara profesional dalam satu tempat. |
| **Misi** | Membantu mahasiswa membangun portfolio sejak awal perkuliahan; menjadikan setiap karya terdokumentasi dengan baik; menghubungkan seluruh resource project dalam satu halaman; mempermudah proses berbagi portfolio kepada recruiter/dosen; menjadi galeri karya mahasiswa lintas institusi yang menginspirasi. |

---

## 2. Business Story

### 2.1 Latar Belakang

Setiap mahasiswa memiliki perjalanan akademik yang berbeda-beda. Selama masa perkuliahan, mereka mengerjakan berbagai macam karya sebagai bagian dari proses belajar: tugas mata kuliah, praktikum, penelitian, proyek organisasi, lomba, MBKM, magang, hingga proyek pribadi.

Setiap karya adalah bukti nyata dari kemampuan, pengalaman, dan perkembangan mahasiswa. Namun dalam kenyataannya, sebagian besar karya tersebut hanya berakhir sebagai folder di laptop, atau tersebar di berbagai platform seperti GitHub, Google Drive, Figma, Vercel, maupun media penyimpanan lain.

Selama masa kuliah berjalan normal, kondisi ini jarang menjadi masalah — mahasiswa masih ingat di mana setiap file dan project pernah disimpan. Masalah baru muncul ketika mahasiswa memasuki semester akhir, atau ketika hendak mendaftar magang, MBKM, beasiswa, maupun pekerjaan. Pada momen itulah kebutuhan akan portfolio profesional menjadi mendesak.

Mahasiswa terpaksa membuka kembali folder-folder lama, mencari screenshot project, repository GitHub, laporan di Google Drive, prototype di Figma, hingga demo aplikasi yang mungkin sudah tidak aktif. Tidak jarang dokumentasi hilang karena laptop rusak, file terhapus, atau lokasi penyimpanan lupa. Akibatnya, banyak karya bernilai tinggi tidak pernah masuk ke dalam portfolio — padahal karya tersebut adalah bukti kemampuan yang sangat penting bagi recruiter maupun dosen.

Akar masalahnya bukan karena mahasiswa tidak memiliki karya, melainkan karena **portfolio baru mulai disusun ketika sudah dibutuhkan**, bukan sejak karya tersebut selesai dibuat.

### 2.2 Permasalahan yang Diidentifikasi

1. **Portfolio baru disusun saat mendesak** — mahasiswa harus mengingat kembali seluruh karya bertahun-tahun ke belakang dalam waktu singkat, sehingga banyak karya terlewat.
2. **Resource satu karya tersebar di banyak platform** — screenshot, GitHub repo, live demo, laporan PDF, dokumentasi Drive, dan prototype Figma semuanya berada di tempat berbeda-beda.
3. **Recruiter/dosen harus membuka banyak tautan terpisah** — proses ini tidak praktis dan menurunkan kualitas pengalaman melihat portfolio.
4. **Karya lama terlupakan** — karena tidak pernah didokumentasikan secara teratur, banyak karya hilang dari ingatan dan tidak pernah dimanfaatkan sebagai nilai tambah.

### 2.3 Solusi: Gradfolio

Gradfolio hadir sebagai platform yang membantu mahasiswa membangun portfolio secara bertahap, sejak awal masa perkuliahan. Setiap kali mahasiswa menyelesaikan sebuah karya, mereka cukup menambahkannya ke Gradfolio sebagai satu **Portfolio Item**. Dengan begitu, portfolio tumbuh secara alami mengikuti perjalanan akademik mahasiswa — bukan disusun mendadak di akhir.

Penting untuk dipahami posisi Gradfolio:

- Gradfolio **bukan** pengganti GitHub (tempat source code).
- Gradfolio **bukan** pengganti Google Drive (tempat penyimpanan file).
- Gradfolio **bukan** pengganti LinkedIn (profil profesional & networking).
- Gradfolio **bukan** pengganti Behance (galeri visual).
- Gradfolio adalah **pusat informasi portfolio** yang menghubungkan seluruh resource dari setiap karya ke dalam satu halaman yang mudah dipahami dan mudah dibagikan.

### 2.4 Bagaimana Aplikasi Bekerja

Konsep inti Gradfolio sederhana: setiap karya mahasiswa disebut **Portfolio Item** — satu halaman yang merangkum seluruh informasi tentang satu karya, mulai dari deskripsi, tech stack/tools yang digunakan, hingga tautan ke seluruh resource pendukung (GitHub, live demo, Google Drive, Figma, YouTube, dokumentasi, PDF laporan).

Alur inti aplikasi:

1. Mahasiswa mendaftar dan melengkapi profil (nama, institusi, program studi, angkatan, bio, foto profil).
2. Setiap kali sebuah karya selesai, mahasiswa menambahkan **Portfolio Item** baru melalui Dashboard, lengkap dengan cover, deskripsi, kategori, jenis portfolio, tech stack, dan tautan resource.
3. Portfolio Item yang dipublikasikan otomatis muncul di **Project Showcase** — galeri publik yang bisa dilihat siapa saja tanpa login, namun hanya menampilkan informasi ringkas (tanpa membuka resource internal seperti GitHub/Drive/Figma).
4. Ketika mahasiswa membutuhkan portfolio untuk keperluan profesional (magang, MBKM, beasiswa, lamaran kerja, freelance), mereka cukup membagikan tautan **Portfolio Share** — halaman yang menampilkan informasi lengkap termasuk seluruh resource, kepada siapa pun yang menerima tautan tersebut.
5. Recruiter atau dosen cukup membuka satu tautan untuk mendapatkan gambaran utuh tentang satu karya, tanpa perlu meminta banyak link terpisah.

### 2.5 Pengalaman Pengguna dari Awal hingga Akhir

Seorang mahasiswa bernama contoh "Rani" mendaftar ke Gradfolio di awal semester 3. Ia melengkapi profilnya: nama, institusi (dipilih dari pencarian, atau diketik manual jika institusinya belum terdaftar), program studi, angkatan, dan bio singkat.

Setiap kali Rani menyelesaikan tugas besar, mengikuti lomba, magang, atau proyek pribadi, ia membuka Dashboard Gradfolio dan menambahkan Portfolio Item baru: mengisi judul, kategori, jenis portfolio, semester & tahun pengerjaan, deskripsi singkat dan lengkap, perannya dalam project, status project, tech stack yang dipakai, serta menautkan resource-resource pendukung (repo GitHub, live demo, dokumentasi Figma, dan sebagainya).

Karya tersebut langsung tampil di Project Showcase — galeri publik lintas institusi — sehingga bisa dilihat pengunjung lain sebagai inspirasi, tanpa mengekspos resource internal.

Tiga tahun kemudian, saat Rani hendak melamar magang, ia tidak perlu menyusun portfolio dari nol. Ia tinggal membuka Dashboard, memilih Portfolio Item terbaik yang relevan, lalu membagikan tautan **Portfolio Share** kepada recruiter. Recruiter membuka satu tautan dan langsung melihat deskripsi lengkap, tech stack, serta seluruh resource pendukung karya tersebut — tanpa harus meminta tautan tambahan.

---

## 3. Business Rules

### 3.1 Aturan Akses & Kepemilikan Data

- Setiap Portfolio Item **wajib** memiliki tepat satu pemilik (`user_id`), yaitu mahasiswa yang membuatnya.
- Mahasiswa **hanya** dapat membuat, mengubah, dan menghapus Portfolio Item miliknya sendiri.
- Mahasiswa **tidak dapat** mengubah atau menghapus Portfolio Item milik mahasiswa lain, dalam kondisi apapun.
- Pengunjung (belum login) **hanya** dapat membaca Portfolio Item yang berstatus **published** melalui Project Showcase atau Portfolio Share; pengunjung tidak memiliki akses tulis sama sekali.

### 3.2 Aturan Visibilitas Konten

- Portfolio Item memiliki dua status utama: **draft** dan **published**.
- Portfolio Item berstatus **draft** hanya dapat dilihat oleh pemiliknya sendiri melalui Dashboard.
- Portfolio Item berstatus **published** akan muncul di Project Showcase (ringkas) dan dapat diakses lengkap melalui Portfolio Share.
- Project Showcase **tidak pernah** menampilkan resource internal (GitHub, Google Drive, Figma, YouTube, Dokumentasi, PDF) — resource lengkap hanya tampil di halaman Portfolio Share.
- Portfolio Share dapat diakses oleh siapa pun yang memiliki tautannya, tanpa memerlukan login (tautan bersifat publik namun tidak terindeks/tidak ditampilkan di listing Showcase selain sebagai ringkasan).

### 3.3 Aturan Registrasi & Profil

- Registrasi wajib menggunakan Nama, Email, dan Password yang valid.
- Field Institusi bersifat **searchable** (autocomplete): mahasiswa dapat memilih dari daftar institusi yang sudah ada, atau mengetik nama institusinya sendiri apabila belum tersedia dalam daftar.
- Gradfolio **tidak melakukan validasi keabsahan institusi** — nama institusi murni bersifat informasi profil, karena Gradfolio bukan sistem administrasi kampus.
- Satu akun hanya boleh terhubung dengan satu alamat email yang unik.

### 3.4 Validasi Data Utama

- `title` (Judul Portfolio) wajib diisi, tidak boleh kosong.
- `category` dan `jenis_portfolio` wajib dipilih dari daftar yang telah ditentukan.
- `deskripsi_singkat` wajib diisi dengan batas karakter maksimum tertentu (disarankan ≤ 200 karakter) agar tampil ringkas di Project Showcase.
- `deskripsi_lengkap` wajib diisi untuk memastikan kualitas informasi pada Portfolio Share.
- `tahun_pengerjaan` wajib berupa tahun yang valid (bukan tahun di masa depan yang tidak masuk akal).
- Cover Portfolio wajib diunggah dalam format gambar (jpg/png/webp) dan diproses melalui Cloudinary — **tidak boleh** disimpan sebagai base64 di database.
- Setiap tautan resource (GitHub, Live Demo, Drive, Figma, YouTube, Dokumentasi, PDF, dan lainnya) wajib berupa URL valid (format `https://`).

### 3.5 Kondisi Khusus

- Jika seluruh field Project Resources dikosongkan, Portfolio Item tetap dapat dipublikasikan (resource bersifat opsional, minimal satu Portfolio Item harus memiliki cover dan deskripsi).
- Jika mahasiswa menghapus Portfolio Item, seluruh resource terkait (baris pada tabel resource) ikut terhapus (cascade delete), dan aset gambar cover di Cloudinary sebaiknya turut dihapus.
- Jika mahasiswa mengganti Cover Portfolio, aset gambar lama di Cloudinary sebaiknya dihapus agar tidak menumpuk aset tak terpakai.
- Kredensial rahasia (Cloudinary API Secret, Supabase Service Role Key) **tidak boleh** pernah dikirim ke browser/client — seluruh operasi yang melibatkan kredensial tersebut wajib dijalankan di server (Route Handler / Server Action).

---

## 4. User Roles

Gradfolio memiliki tiga kelompok peran pengguna pada versi utama (MVP), dengan satu peran tambahan sebagai *future scope*.

| Role | Status Login | Hak Akses | Contoh Aktivitas |
| --- | --- | --- | --- |
| **Guest / Pengunjung** | Tidak login | Membaca data publik saja (read-only) | Menjelajahi Project Showcase, membuka halaman Portfolio Share melalui tautan yang dibagikan, melakukan pencarian/filter karya publik. |
| **Mahasiswa (User Terautentikasi)** | Login | CRUD penuh atas data miliknya sendiri | Mendaftar & melengkapi profil, menambah/mengubah/menghapus Portfolio Item, mengatur status publish/draft, mengunggah cover gambar, menautkan resource, membagikan tautan Portfolio Share. |
| **Pemilik Data (Owner)** | Login | Akses dibatasi berdasarkan `user_id` | Tidak dapat melihat data draft mahasiswa lain; tidak dapat mengubah/menghapus Portfolio Item yang bukan miliknya, meskipun mengetahui ID-nya. |
| **Admin** *(Future Scope — tidak termasuk MVP)* | Login (role khusus) | Moderasi konten, pengelolaan institusi master data | Menghapus konten yang melanggar ketentuan, mengelola daftar institusi resmi, melihat statistik penggunaan platform. |

> Catatan: Pada versi MVP, seluruh mahasiswa memiliki hak akses yang identik (tidak ada tingkatan/plan khusus). Perbedaan hak akses murni ditentukan oleh kepemilikan data (`user_id`), bukan oleh jenis akun.

---

## 5. User Journey

Perjalanan pengguna utama (mahasiswa) dari awal menggunakan Gradfolio hingga membagikan portfolio:

```
Landing Page (Project Showcase publik)
        ↓
Registrasi Akun (Nama, Email, Password)
        ↓
Melengkapi Profil (Foto, Institusi, Prodi, Angkatan, Bio)
        ↓
Dashboard (pusat kelola Portfolio Item)
        ↓
Menambahkan Portfolio Item Baru
   (Informasi Dasar → Informasi Portfolio → Tech Stack → Project Resources)
        ↓
Menyimpan sebagai Draft  ATAU  Publish langsung
        ↓
Portfolio Item Published tampil di Project Showcase
        ↓
Mahasiswa terus menambah karya baru sepanjang masa kuliah
        ↓
Saat dibutuhkan (magang/MBKM/beasiswa/kerja/freelance):
   Mahasiswa membuka Portfolio Item terbaik → Generate/Salin tautan Portfolio Share
        ↓
Tautan dibagikan ke Recruiter / Dosen
        ↓
Recruiter membuka tautan Portfolio Share → melihat seluruh detail & resource
        ↓
Mahasiswa dapat memperbarui Portfolio Item kapan pun (edit, tambah resource baru)
        ↓
Logout
```

Perjalanan pengunjung (tanpa login):

```
Landing Page / Project Showcase
        ↓
Menjelajahi karya berdasarkan kategori / pencarian
        ↓
Membuka detail ringkas Portfolio Item di Showcase
        ↓
(Opsional) Membuka tautan Portfolio Share yang dibagikan langsung oleh mahasiswa
        ↓
Melihat seluruh informasi lengkap & resource karya tersebut
```

---

## 6. Application Flow

Alur sistem secara menyeluruh, dari sisi teknis:

- Browser mengakses antarmuka yang dibangun dengan **Next.js App Router**.
- Untuk halaman yang membutuhkan autentikasi (Dashboard dan turunannya), Next.js membaca sesi pengguna dari **Supabase Auth** melalui middleware/server helper; jika sesi tidak valid, pengguna diarahkan ke halaman login.
- Data Portfolio Item, profil, dan resource dibaca/ditulis dari **Supabase PostgreSQL** melalui Server Component (read) dan Server Action/Route Handler (write), dengan proteksi **Row Level Security (RLS)** di level database sebagai lapisan keamanan terakhir.
- Saat mahasiswa mengunggah Cover Portfolio, file dikirim ke **Server Action / Route Handler** Next.js (bukan langsung dari client ke Cloudinary), lalu server meneruskan file tersebut ke **Cloudinary** menggunakan kredensial rahasia yang hanya tersedia di server.
- Cloudinary memproses, mengoptimasi, dan mengembalikan `secure_url` beserta `public_id` dari gambar yang diunggah.
- Next.js menyimpan `secure_url`, `public_id`, dan seluruh metadata Portfolio Item (judul, kategori, deskripsi, tech stack, dsb.) ke tabel `portfolio_items` pada Supabase.
- Resource pendukung (GitHub, Live Demo, Drive, Figma, YouTube, Dokumentasi, PDF) disimpan sebagai baris-baris terpisah pada tabel `portfolio_resources`, masing-masing terkait ke satu `portfolio_item_id`.
- Ketika pengunjung mengakses Project Showcase, Next.js mengambil hanya Portfolio Item berstatus **published** beserta field ringkas (tanpa resource) untuk ditampilkan di galeri publik.
- Ketika seseorang membuka tautan Portfolio Share (`/portfolio/[slug-atau-id]`), Next.js mengambil data lengkap Portfolio Item beserta seluruh resource terkait dan menampilkannya dalam satu halaman.
- **Vercel** menjalankan build & deployment aplikasi, mengelola environment variables produksi, serta menyediakan preview deployment untuk setiap perubahan kode.

Diagram lapisan sistem:

| Frontend | Application Layer | Data & Auth | Media & Hosting |
| --- | --- | --- | --- |
| Next.js UI (App Router, RSC) | Server Actions / Route Handlers | Supabase PostgreSQL + Supabase Auth + RLS | Cloudinary (image) + Vercel (hosting & deployment) |

---

## 7. Features

### 7.1 Core Features (Wajib — MVP)

- **Autentikasi**: registrasi, login, logout, penanganan pesan kesalahan, proteksi halaman Dashboard dari akses tanpa login.
- **Manajemen Profil**: melengkapi & mengubah foto profil, nama lengkap, institusi (searchable input), program studi, angkatan, bio singkat.
- **Manajemen Portfolio Item (CRUD)**: menambah, melihat, mengubah, menghapus Portfolio Item milik sendiri.
- **Upload Cover Portfolio**: unggah gambar ke Cloudinary, penyimpanan `secure_url` & `public_id` ke Supabase.
- **Status Portfolio**: draft dan published, dengan kontrol visibilitas yang jelas.
- **Project Showcase (Publik)**: galeri seluruh Portfolio Item published lintas institusi, dapat dijelajahi tanpa login, dengan filter kategori dan pencarian.
- **Portfolio Share (Publik via tautan)**: halaman detail lengkap satu Portfolio Item termasuk seluruh Project Resources, dapat diakses siapa pun melalui tautan.
- **Project Resources**: menautkan GitHub Repository, Live Demo, Google Drive, Figma, YouTube Demo, Dokumentasi, PDF Laporan pada setiap Portfolio Item.
- **Tech Stack / Tools Tagging**: menandai teknologi/tools yang digunakan pada setiap Portfolio Item (disesuaikan bidang masing-masing mahasiswa).
- **Dashboard Mahasiswa**: pusat kelola seluruh Portfolio Item milik pengguna yang sedang login.
- **Responsive UI**: tampilan nyaman di desktop maupun perangkat seluler.
- **Deployment**: aplikasi dapat diakses melalui URL produksi Vercel tanpa error environment variable.

### 7.2 Optional Features (Nilai Tambah, dikerjakan bila waktu memungkinkan)

- Pencarian dan filter lanjutan pada Project Showcase (kategori, jenis portfolio, institusi, tech stack, tahun).
- Sorting hasil (terbaru, terpopuler, berdasarkan institusi).
- Pagination / infinite scroll pada Project Showcase.
- Dark mode.
- Preview gambar dan progress bar saat upload cover.
- Penghapusan otomatis aset lama di Cloudinary saat cover diganti atau Portfolio Item dihapus.
- Statistik ringan pada Dashboard (jumlah Portfolio Item, jumlah kategori, dsb.).
- Custom slug/username untuk tautan Portfolio Share yang lebih rapi (misalnya `/u/rani/proyek-katalogkita`).

### 7.3 Future Features (Roadmap jangka panjang — di luar cakupan development saat ini)

- Role **Admin** untuk moderasi konten dan pengelolaan master data institusi.
- Verifikasi institusi resmi (kerja sama langsung dengan kampus).
- Sistem komentar/apresiasi (like, bookmark) pada Project Showcase.
- Ekspor Portfolio Item ke PDF/resume otomatis.
- Integrasi API resmi (GitHub API, Figma API) untuk menampilkan preview otomatis tanpa membuka tautan.
- Notifikasi email (misalnya saat resource dianggap sudah tidak aktif).
- Multi-bahasa (Indonesia/Inggris) pada tampilan portfolio.

---

## 8. Pages

| Route | Halaman | Tujuan & Fungsi | Komponen Utama |
| --- | --- | --- | --- |
| `/` | Landing / Project Showcase | Menampilkan galeri publik seluruh Portfolio Item published, sebagai pintu masuk utama pengunjung maupun mahasiswa. | `Navbar`, `HeroSection`, `CategoryFilter`, `SearchBar`, `PortfolioGrid`, `PortfolioCard`, `Pagination` |
| `/portfolio/[id]` | Portfolio Share (Detail Lengkap) | Menampilkan seluruh informasi satu Portfolio Item: cover, deskripsi lengkap, tech stack, dan seluruh Project Resources. Dapat diakses tanpa login. | `PortfolioHeader`, `PortfolioDescription`, `TechStackBadges`, `ResourceLinkList`, `OwnerProfileCard` |
| `/login` | Login | Form autentikasi menggunakan email dan password. | `LoginForm`, `AuthErrorMessage` |
| `/register` | Registrasi | Form pembuatan akun baru (nama, email, password). | `RegisterForm`, `AuthErrorMessage` |
| `/onboarding` | Lengkapi Profil | Ditampilkan setelah registrasi pertama kali untuk melengkapi profil (foto, institusi, prodi, angkatan, bio). | `ProfileForm`, `InstitutionSearchInput`, `AvatarUploader` |
| `/dashboard` | Dashboard | Pusat kelola Portfolio Item milik pengguna login: daftar seluruh item (draft & published) beserta tombol tambah/edit/hapus. | `DashboardStats`, `PortfolioTable/Grid`, `StatusBadge`, `AddPortfolioButton` |
| `/dashboard/portfolio/new` | Tambah Portfolio Item | Form lengkap untuk membuat Portfolio Item baru: Informasi Dasar, Informasi Portfolio, Tech Stack, Project Resources. | `PortfolioForm`, `CoverImageUploader`, `TechStackSelector`, `ResourceLinkFields` |
| `/dashboard/portfolio/[id]/edit` | Edit Portfolio Item | Form serupa dengan Tambah Portfolio Item, namun terisi data sebelumnya untuk diperbarui. | `PortfolioForm` (mode edit), `CoverImageUploader`, `DeletePortfolioButton` |
| `/dashboard/profile` | Pengaturan Profil | Mengubah data profil mahasiswa (foto, institusi, prodi, angkatan, bio). | `ProfileForm`, `InstitutionSearchInput`, `AvatarUploader` |
| `/u/[username]` *(opsional)* | Halaman Profil Publik | Menampilkan profil mahasiswa beserta seluruh Portfolio Item published miliknya, sebagai halaman portfolio pribadi lintas karya. | `ProfileHeader`, `PortfolioGrid` |

---

## 9. Database Planning

Perencanaan entity database (belum dalam bentuk SQL, murni pemodelan konsep).

### 9.1 Entity: `profiles`

- **Tujuan**: menyimpan data profil mahasiswa sebagai perluasan dari akun autentikasi (`auth.users` milik Supabase).
- **Relasi**: One-to-One dengan `auth.users` (Supabase Auth); One-to-Many dengan `portfolio_items`.
- **Atribut Utama**:
  - `id` — mengacu langsung ke `auth.users.id`.
  - `full_name` — nama lengkap mahasiswa.
  - `avatar_url` — URL foto profil (disimpan melalui Cloudinary).
  - `avatar_public_id` — identifier aset Cloudinary untuk foto profil.
  - `institution` — nama institusi (free text, hasil dari searchable input).
  - `program_studi` — program studi mahasiswa.
  - `angkatan` — tahun angkatan.
  - `bio` — deskripsi singkat diri.
  - `username` *(opsional)* — untuk tautan profil publik yang rapi.
  - `created_at`, `updated_at`.

### 9.2 Entity: `institutions` *(opsional, untuk mendukung fitur searchable input)*

- **Tujuan**: menjadi master data referensi nama-nama institusi agar autocomplete dapat menyarankan institusi yang sudah pernah dimasukkan pengguna lain, tanpa memaksa validasi.
- **Relasi**: Tidak memiliki foreign key wajib ke `profiles.institution` (institution tetap disimpan sebagai teks bebas pada profil, tabel ini murni sumber saran/autocomplete).
- **Atribut Utama**:
  - `id`.
  - `name` — nama institusi (unik).
  - `created_at`.

### 9.3 Entity: `portfolio_items`

- **Tujuan**: menyimpan seluruh informasi inti dari satu karya (Portfolio Item) milik mahasiswa.
- **Relasi**: Many-to-One dengan `profiles` (melalui `user_id`); One-to-Many dengan `portfolio_resources`.
- **Atribut Utama**:
  - `id`.
  - `user_id` — pemilik Portfolio Item, mengacu ke `profiles.id` / `auth.users.id`.
  - `cover_image_url` — URL aman dari Cloudinary.
  - `cover_image_public_id` — identifier aset Cloudinary (untuk keperluan hapus/replace).
  - `title` — judul portfolio.
  - `category` — kategori umum karya (mis. Software, Hardware, Design, Riset, Media).
  - `jenis_portfolio` — tipe spesifik karya (Website, Mobile App, UI/UX Design, Poster, Logo, Penelitian, Prototype Mesin, Alat Elektronik, Robot, Video, Fotografi, Praktikum, Tugas Mata Kuliah, MBKM, Magang, Personal Project, dsb.).
  - `semester` — semester saat karya dikerjakan.
  - `tahun_pengerjaan` — tahun pengerjaan karya.
  - `deskripsi_singkat` — ringkasan singkat untuk tampilan Showcase.
  - `deskripsi_lengkap` — deskripsi menyeluruh untuk tampilan Portfolio Share.
  - `peran` — peran mahasiswa dalam project (mis. Frontend Developer, Peneliti Utama, Desainer).
  - `status` — status portfolio (`draft` / `published`).
  - `tech_stack` — daftar teknologi/tools yang digunakan (array teks).
  - `created_at`, `updated_at`.

### 9.4 Entity: `portfolio_resources`

- **Tujuan**: menyimpan seluruh tautan resource pendukung suatu Portfolio Item, sebagai pembeda utama Gradfolio dibanding platform lain.
- **Relasi**: Many-to-One dengan `portfolio_items` (melalui `portfolio_item_id`).
- **Atribut Utama**:
  - `id`.
  - `portfolio_item_id` — Portfolio Item terkait.
  - `resource_type` — jenis resource (`github`, `live_demo`, `google_drive`, `figma`, `youtube`, `documentation`, `pdf`, `other`).
  - `label` — nama tampilan tautan (mis. "Repository Backend", "Demo Produksi").
  - `url` — tautan resource.
  - `created_at`.

### 9.5 Ringkasan Relasi Antar Entity

```
auth.users (Supabase Auth)
      │ 1:1
      ▼
  profiles
      │ 1:N
      ▼
 portfolio_items
      │ 1:N
      ▼
portfolio_resources
```

---

## 10. API Planning

Endpoint dikelompokkan berdasarkan fitur. Diimplementasikan sebagai kombinasi **Server Actions** (untuk mutasi dari form) dan **Route Handlers** (untuk kebutuhan seperti upload file/webhook) pada Next.js App Router.

### 10.1 Autentikasi & Profil

| Endpoint / Action | Metode | Deskripsi |
| --- | --- | --- |
| `auth/register` | Server Action | Registrasi akun baru (nama, email, password) via Supabase Auth. |
| `auth/login` | Server Action | Login menggunakan email & password. |
| `auth/logout` | Server Action | Mengakhiri sesi pengguna. |
| `auth/callback` | Route Handler (`/auth/callback`) | Menangani callback verifikasi/konfirmasi email dari Supabase Auth (jika diaktifkan). |
| `profile/update` | Server Action | Memperbarui data profil (nama, institusi, prodi, angkatan, bio). |
| `profile/upload-avatar` | Route Handler (`/api/upload/avatar`) | Mengunggah foto profil ke Cloudinary dan menyimpan `secure_url` ke `profiles`. |

### 10.2 Portfolio Item (CRUD)

| Endpoint / Action | Metode | Deskripsi |
| --- | --- | --- |
| `portfolio/create` | Server Action | Membuat Portfolio Item baru beserta resource terkait. |
| `portfolio/update/[id]` | Server Action | Memperbarui data Portfolio Item milik sendiri (divalidasi kepemilikan via RLS + pengecekan `user_id`). |
| `portfolio/delete/[id]` | Server Action | Menghapus Portfolio Item beserta seluruh resource terkait (cascade), serta memicu penghapusan aset Cloudinary. |
| `portfolio/publish/[id]` | Server Action | Mengubah status Portfolio Item menjadi `published`. |
| `portfolio/unpublish/[id]` | Server Action | Mengubah status Portfolio Item kembali menjadi `draft`. |
| `api/upload/cover` | Route Handler (`/api/upload/cover`) | Mengunggah Cover Portfolio ke Cloudinary; mengembalikan `secure_url` & `public_id` untuk disimpan ke `portfolio_items`. |

### 10.3 Project Showcase (Publik)

| Endpoint / Action | Metode | Deskripsi |
| --- | --- | --- |
| `showcase/list` | Server Component fetch (RSC) | Mengambil daftar Portfolio Item berstatus `published` untuk ditampilkan di halaman utama, dengan dukungan filter kategori/pencarian. |
| `showcase/[id]` (Portfolio Share) | Server Component fetch (RSC) | Mengambil detail lengkap satu Portfolio Item published beserta seluruh resource-nya. |

### 10.4 Project Resources

| Endpoint / Action | Metode | Deskripsi |
| --- | --- | --- |
| `resources/add` | Server Action | Menambahkan satu atau lebih tautan resource ke suatu Portfolio Item. |
| `resources/update/[id]` | Server Action | Memperbarui label/URL resource tertentu. |
| `resources/delete/[id]` | Server Action | Menghapus satu resource tertentu dari Portfolio Item. |

---

## 11. Folder Structure Recommendation

```
gradfolio/
├── app/
│   ├── page.tsx                              # Project Showcase (Landing)
│   ├── login/
│   │   └── page.tsx
│   ├── register/
│   │   └── page.tsx
│   ├── onboarding/
│   │   └── page.tsx
│   ├── portfolio/
│   │   └── [id]/
│   │       └── page.tsx                      # Portfolio Share
│   ├── dashboard/
│   │   ├── page.tsx                          # Dashboard utama
│   │   ├── profile/
│   │   │   └── page.tsx
│   │   └── portfolio/
│   │       ├── new/
│   │       │   └── page.tsx
│   │       └── [id]/
│   │           └── edit/
│   │               └── page.tsx
│   ├── u/
│   │   └── [username]/
│   │       └── page.tsx                      # Halaman profil publik (opsional)
│   ├── api/
│   │   └── upload/
│   │       ├── cover/route.ts
│   │       └── avatar/route.ts
│   └── auth/
│       └── callback/route.ts
├── actions/
│   ├── auth.actions.ts
│   ├── profile.actions.ts
│   ├── portfolio.actions.ts
│   └── resource.actions.ts
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   └── Footer.tsx
│   ├── portfolio/
│   │   ├── PortfolioCard.tsx
│   │   ├── PortfolioGrid.tsx
│   │   ├── PortfolioForm.tsx
│   │   ├── CoverImageUploader.tsx
│   │   ├── TechStackSelector.tsx
│   │   └── ResourceLinkFields.tsx
│   ├── profile/
│   │   ├── ProfileForm.tsx
│   │   └── InstitutionSearchInput.tsx
│   └── ui/                                   # Reusable UI primitives (button, input, dsb.)
├── lib/
│   ├── supabase/
│   │   ├── client.ts
│   │   └── server.ts
│   ├── cloudinary.ts
│   ├── validations/
│   │   ├── auth.schema.ts
│   │   ├── profile.schema.ts
│   │   └── portfolio.schema.ts
│   └── utils.ts
├── types/
│   ├── portfolio.types.ts
│   └── supabase.types.ts                     # Hasil generate type dari Supabase
├── middleware.ts                              # Proteksi route dashboard
├── public/
├── .env.example
└── package.json
```

---

## 12. Recommended Tech Stack

| Kategori | Teknologi | Alasan Pemilihan |
| --- | --- | --- |
| **Frontend** | Next.js 14+ (App Router) | Mendukung Server Component, Server Actions, dan routing modern; sangat sesuai kebutuhan halaman publik (Showcase, Share) yang membutuhkan SEO baik dan performa cepat. |
| **Bahasa** | TypeScript | Type-safety di seluruh proyek, mengurangi bug runtime, dan mempermudah kolaborasi antar developer/AI. |
| **Backend** | Next.js Server Actions & Route Handlers | Menyatukan logic backend dalam satu proyek Next.js tanpa perlu server terpisah, cocok untuk skala MVP hingga menengah. |
| **Database** | Supabase (PostgreSQL) | Database relasional yang matang, mendukung Row Level Security native, cocok untuk struktur data relasional Portfolio Item ↔ Resources. |
| **Auth** | Supabase Auth | Terintegrasi langsung dengan database, mendukung email/password secara native, mengurangi kompleksitas implementasi auth manual. |
| **ORM / Data Access** | Supabase JS Client + generated types (`supabase gen types typescript`) | Type-safe query tanpa overhead ORM tambahan; opsional ditambah **Drizzle ORM** bila query kompleks meningkat di masa depan. |
| **Media Storage** | Cloudinary | Optimasi otomatis, transformasi gambar (resize/crop cover), serta CDN global untuk menampilkan cover Portfolio Item secara cepat di berbagai institusi/lokasi. |
| **Validasi** | Zod | Validasi schema-based yang type-safe, digunakan konsisten di client (form) maupun server (Server Action) untuk mencegah data tidak valid masuk ke database. |
| **State Management** | React Server Components (default) + Zustand (untuk state UI ringan seperti modal/filter) | Meminimalkan state management kompleks; Zustand dipakai hanya untuk kebutuhan interaktif ringan di sisi client. |
| **Styling** | Tailwind CSS | Utility-first, cepat untuk membangun UI dashboard dan showcase yang konsisten dan responsif. |
| **Komponen UI** | shadcn/ui | Komponen accessible & reusable berbasis Tailwind, mempercepat pembangunan form, card, dan modal. |
| **Animasi** | Framer Motion | Transisi halus pada kartu Portfolio Item dan interaksi Dashboard tanpa mengorbankan performa. |
| **Deployment** | Vercel | Integrasi native dengan Next.js, preview deployment otomatis per pull request, pengelolaan environment variables yang mudah. |
| **Testing** | Vitest (unit) + Playwright (E2E) | Vitest untuk pengujian logic/schema validasi; Playwright untuk menguji alur kritikal (registrasi, tambah portfolio, publish). |
| **Email Service** | Bawaan Supabase Auth (verifikasi email) — opsional Resend untuk notifikasi lanjutan | Cukup untuk kebutuhan MVP; Resend dapat ditambahkan bila fitur notifikasi email dikembangkan lebih lanjut. |
| **Payment** | Tidak diperlukan pada MVP | Gradfolio versi ini tidak memiliki model bisnis berbayar; tidak relevan ditambahkan pada tahap ini. |

---

## 13. UI / UX Guidelines

- **Gaya Desain**: modern, clean, minimal, dengan sudut membulat (*rounded corners*) pada card dan tombol untuk kesan ramah dan approachable — sesuai target pengguna mahasiswa.
- **Gaya Dashboard**: dashboard-style layout dengan sidebar/topbar navigasi sederhana, fokus pada kemudahan menambah dan mengelola Portfolio Item tanpa friksi.
- **Mobile First & Responsive**: seluruh halaman, terutama Project Showcase dan Portfolio Share, wajib nyaman diakses dari perangkat mobile karena banyak recruiter membuka tautan dari HP.
- **Aksesibilitas (Accessibility)**: kontras warna memadai, label form yang jelas, navigasi dapat diakses via keyboard, penggunaan elemen semantik HTML.
- **Dark Mode**: didukung sebagai optional feature, dengan tetap menjaga keterbacaan cover image dan tech stack badge di kedua mode.
- **Warna Utama**: palet akademik-modern — kombinasi biru/indigo sebagai warna utama (melambangkan kepercayaan dan profesionalisme) dengan aksen warna cerah (misalnya kuning/oranye) untuk elemen call-to-action seperti tombol "Tambah Portfolio" atau "Bagikan".
- **Tipografi**: font sans-serif modern (misalnya Inter atau Geist) untuk keterbacaan tinggi di berbagai ukuran layar; hierarki jelas antara judul karya, deskripsi, dan metadata.
- **Spacing**: mengikuti skala konsisten (4px/8px based spacing scale dari Tailwind) agar seluruh komponen — card, form, grid — terasa rapi dan seragam.
- **Komponen Penting**:
  - `PortfolioCard` — menampilkan cover, judul, kategori, institusi, dan deskripsi singkat secara ringkas.
  - `TechStackBadge` — badge kecil untuk menampilkan tiap teknologi/tools.
  - `ResourceLinkButton` — tombol/link dengan ikon sesuai jenis resource (GitHub, Drive, Figma, YouTube, dsb.).
  - `StatusBadge` — indikator visual status draft/published pada Dashboard.
  - `EmptyState` — tampilan ramah ketika mahasiswa belum memiliki Portfolio Item.
  - `LoadingSkeleton` — skeleton loading pada Project Showcase agar transisi data terasa mulus.

---

## 14. Coding Standards

- Gunakan **TypeScript** di seluruh basis kode — tidak ada file `.js` baru pada logic aplikasi.
- Gunakan **App Router** Next.js beserta konvensi Server/Client Component secara tepat (Server Component sebagai default, `"use client"` hanya bila benar-benar dibutuhkan interaktivitas).
- Hindari duplikasi kode — ekstrak logic yang berulang (mis. validasi, formatting tanggal, badge kategori) ke dalam util/helper bersama.
- Gunakan **reusable component** untuk elemen UI yang muncul di banyak tempat (`PortfolioCard`, `TechStackBadge`, dsb.).
- Terapkan prinsip **Clean Architecture** ringan: pisahkan jelas antara *UI (components)*, *logic bisnis (actions/lib)*, dan *akses data (supabase client/server)*.
- Gunakan pendekatan **feature-based structure** dimana relevan (folder `portfolio/`, `profile/`, `auth/` terpisah rapi di `components/` dan `actions/`).
- **Naming Convention**:
  - Komponen React: `PascalCase` (`PortfolioForm.tsx`).
  - Fungsi & variabel: `camelCase`.
  - Konstanta global: `UPPER_SNAKE_CASE`.
  - Tabel & kolom database: `snake_case`.
- **Error Handling**: setiap Server Action wajib membungkus operasi database/eksternal (Supabase, Cloudinary) dalam `try/catch`, mengembalikan pesan error yang jelas dan aman (tidak membocorkan detail teknis sensitif ke client).
- **Validation**: seluruh input dari form divalidasi menggunakan **Zod** baik di client (untuk UX instan) maupun di server (sebagai lapisan keamanan wajib, karena validasi client dapat dilewati).
- **Security**:
  - Seluruh operasi yang melibatkan API secret (Cloudinary, Supabase Service Role) **hanya** dijalankan di server.
  - Row Level Security (RLS) **wajib aktif** pada seluruh tabel yang menyimpan data milik pengguna.
  - Tidak ada kredensial rahasia yang ter-hardcode di kode maupun ter-commit ke repository (`.env` wajib masuk `.gitignore`).
- **Performance**: gunakan komponen `next/image` dengan `remotePatterns` yang dikonfigurasi untuk domain Cloudinary, terapkan lazy loading pada grid Project Showcase, serta pagination/infinite scroll untuk mencegah pengambilan data berlebihan sekaligus.
- Aplikasi harus **berhasil di-build tanpa error TypeScript** sebelum dianggap selesai pada tiap tahap.

---

## 15. Development Rules

1. Jangan membuat fitur di luar spesifikasi yang tertulis dalam dokumen ini tanpa persetujuan eksplisit.
2. Jangan mengganti stack teknologi (Next.js, Supabase, Cloudinary, Vercel) tanpa persetujuan eksplisit.
3. Selalu membaca `PROJECT_SPEC.md` secara utuh sebelum mengubah atau menambah kode.
4. Selalu menjaga konsistensi struktur folder sesuai Bagian 11.
5. Gunakan reusable component — hindari menulis ulang UI yang sama di banyak tempat.
6. Hindari hardcode nilai (kategori, jenis portfolio, resource type) — definisikan sebagai konstanta terpusat yang dapat digunakan ulang di form, filter, dan badge.
7. Setiap fitur baru wajib disertai validasi input (Zod) dan penanganan error yang layak.
8. Setiap perubahan pada skema database wajib diikuti pembaruan pada bagian Database Planning di dokumen ini (bila spesifikasi berubah secara resmi).
9. Kode yang dihasilkan harus **production-ready** — bukan sekadar prototype — termasuk penanganan *loading state*, *empty state*, dan *error state* pada setiap halaman yang mengambil data.
10. Tidak boleh ada kredensial rahasia yang dikirim ke client maupun ter-commit ke repository.

---

## 16. AI Development Instructions

Bagian ini adalah panduan wajib bagi AI Developer (termasuk Claude atau model AI lain) yang akan mengimplementasikan kode berdasarkan dokumen ini.

- **Selalu baca `PROJECT_SPEC.md` terlebih dahulu** secara menyeluruh sebelum menulis, mengubah, atau menghapus kode apapun pada proyek ini.
- **Jangan berasumsi** jika ada requirement yang belum jelas — rujuk kembali ke dokumen ini; jika benar-benar tidak tercakup, tanyakan kepada pemilik proyek sebelum melanjutkan.
- **Jangan membuat fitur di luar spesifikasi** yang telah ditetapkan pada Bagian 7 (Features), kecuali telah disetujui secara eksplisit.
- **Ikuti seluruh Business Rules** pada Bagian 3 secara konsisten, terutama terkait kepemilikan data (`user_id`) dan visibilitas status draft/published.
- **Ikuti Folder Structure** pada Bagian 11 tanpa menyimpang, agar proyek tetap konsisten dan mudah dinavigasi oleh developer/AI lain.
- **Ikuti Coding Standards** pada Bagian 14, termasuk penggunaan TypeScript penuh, validasi Zod di server, dan proteksi RLS di database.
- **Gunakan teknologi yang telah dipilih** pada Bagian 12 — tidak menambahkan library besar baru tanpa alasan kuat dan relevansi terhadap spesifikasi.
- **Selalu buat kode yang scalable**, mempertimbangkan bahwa jumlah mahasiswa, institusi, dan Portfolio Item akan terus bertambah seiring waktu.
- **Selalu menjaga konsistensi proyek** — penamaan, struktur data, dan pola kode harus seragam dengan bagian-bagian yang sudah ada sebelumnya.
- **Prioritaskan keamanan**: kredensial rahasia (Cloudinary API Secret, Supabase Service Role Key) hanya boleh diakses dan digunakan di sisi server, tidak pernah diekspos ke client maupun disertakan dalam kode yang dikirim ke browser.
- **Uji ulang alur kritikal** (registrasi, login, tambah/edit/hapus Portfolio Item, upload cover, publish/unpublish, akses Portfolio Share tanpa login) setiap kali ada perubahan signifikan pada kode.
- Ketika ragu antara menambahkan kompleksitas atau menjaga kesederhanaan, **pilih pendekatan yang paling sesuai dengan spesifikasi MVP** pada dokumen ini, dan catat ide tambahan sebagai *Future Feature* alih-alih langsung diimplementasikan.

---

*Dokumen ini merupakan Single Source of Truth resmi untuk proyek Gradfolio dan wajib menjadi rujukan utama sepanjang proses development.*
