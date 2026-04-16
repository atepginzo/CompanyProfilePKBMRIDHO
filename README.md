# Website Company Profile + CMS Admin

Project Next.js full-stack untuk website profil institusi pendidikan dan panel CMS admin.

## Tech Stack

- Next.js App Router
- Prisma ORM + PostgreSQL
- JWT auth (cookie httpOnly)
- CSS design system + CSS Modules

## Setup Lokal

1. Install dependency

```bash
npm install
```

2. Siapkan environment

```bash
copy .env.example .env
```

3. Generate Prisma Client

```bash
npm run db:generate
```

4. Jalankan migration

```bash
npm run db:migrate
```

5. Seed data awal

```bash
npm run db:seed
```

6. Jalankan aplikasi

```bash
npm run dev
```

## Kredensial Admin Seed

- Username: `admin`
- Password: `admin123`

Segera ganti kredensial ini setelah environment pertama selesai.

## Status Implementasi

Sudah tersedia:

- Fondasi auth admin: login, logout, me, helper JWT, middleware auth
- Layout admin: sidebar, header, toast, context auth
- Dashboard admin + API agregasi statistik
- Reusable admin CRUD components:
	- `CrudListPage`, `CrudFormPage`
	- `DataTable`, `SearchFilter`, `StatusBadge`
	- `FormInput`, `FormTextarea`, `FormSelect`, `FormFileUpload`, `RichTextEditor`
	- `ConfirmDialog`, `EmptyState`, `LoadingSkeleton`
- Modul admin dengan CRUD (list/create/edit):
	- Berita
	- Galeri
	- Pengumuman
	- Kalender
	- Dosen
	- Dokumen
	- Struktur
	- Fasilitas
	- Alumni
	- Pesan (list + aksi baca/hapus)
	- Pengaturan situs
- Public API endpoints untuk beranda dan halaman publik utama
- Halaman publik utama (beranda, profil, program, pendaftaran, berita, galeri, pengumuman, kalender, kontak, dll)

Catatan penting saat ini:

- Auth route saat ini memiliki fallback mock login `admin/admin123` ketika DB user belum dipakai penuh.
- Upload file tersedia lewat `POST /api/admin/upload` dan juga upload per-modul sesuai route masing-masing.

## Endpoint Utama

Auth:

- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`

Admin:

- `GET /api/admin/dashboard`
- `CRUD /api/admin/berita`
- `CRUD /api/admin/galeri`
- `CRUD /api/admin/pengumuman`
- `CRUD /api/admin/kalender`
- `CRUD /api/admin/dosen`
- `CRUD /api/admin/alumni`
- `CRUD /api/admin/struktur`
- `CRUD /api/admin/fasilitas`
- `CRUD /api/admin/dokumen`
- `GET /api/admin/pesan`, `PATCH /api/admin/pesan/[id]`, `DELETE /api/admin/pesan/[id]`
- `GET/PUT /api/admin/pengaturan`

## Catatan Tambahan

- Pastikan `DATABASE_URL` valid sebelum menjalankan migration/seed.
- Prisma client output diarahkan ke `src/generated/prisma`.
