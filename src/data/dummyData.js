// ==========================================
// DUMMY DATA - Fallback saat API kosong
// ==========================================

export const DUMMY_BERITA = [
  {
    id: 'dummy-1',
    slug: 'kegiatan-tahfidz-alquran-semester-genap',
    judul: 'Kegiatan Tahfidz Al-Quran Semester Genap Resmi Dimulai',
    ringkasan: 'Program unggulan Tahfidz Al-Quran PKBM RIDHO kembali bergulir di semester genap tahun ajaran 2025/2026. Sebanyak 45 peserta didik mengikuti program ini dengan penuh semangat.',
    thumbnail: null,
    kategori: { id: 1, nama: 'Kegiatan', slug: 'kegiatan' },
    tanggalPublikasi: '2026-04-10T08:00:00Z',
    viewsCount: 128,
  },
  {
    id: 'dummy-2',
    slug: 'wisuda-peserta-didik-angkatan-2025',
    judul: 'Wisuda Peserta Didik Angkatan 2025: 120 Lulusan Siap Berkarya',
    ringkasan: 'PKBM RIDHO menggelar wisuda untuk 120 peserta didik dari program Paket A, Paket B, dan Paket C. Acara berlangsung khidmat di Aula Bumi Ridho.',
    thumbnail: null,
    kategori: { id: 2, nama: 'Akademik', slug: 'akademik' },
    tanggalPublikasi: '2026-04-05T10:00:00Z',
    viewsCount: 256,
  },
  {
    id: 'dummy-3',
    slug: 'kunjungan-dinas-pendidikan-kabupaten-bandung',
    judul: 'Kunjungan Dinas Pendidikan Kabupaten Bandung ke PKBM RIDHO',
    ringkasan: 'Kepala Dinas Pendidikan Kabupaten Bandung melakukan kunjungan kerja ke PKBM RIDHO untuk meninjau fasilitas dan program pendidikan kesetaraan.',
    thumbnail: null,
    kategori: { id: 3, nama: 'Institusi', slug: 'institusi' },
    tanggalPublikasi: '2026-03-28T09:00:00Z',
    viewsCount: 189,
  },
  {
    id: 'dummy-4',
    slug: 'pelatihan-kewirausahaan-dan-bisnis-digital',
    judul: 'Pelatihan Kewirausahaan dan Bisnis Digital untuk Peserta Didik',
    ringkasan: 'Dalam rangka membekali kemandirian ekonomi, PKBM RIDHO mengadakan pelatihan kewirausahaan dan pengenalan bisnis digital bagi seluruh peserta didik.',
    thumbnail: null,
    kategori: { id: 1, nama: 'Kegiatan', slug: 'kegiatan' },
    tanggalPublikasi: '2026-03-20T07:30:00Z',
    viewsCount: 97,
  },
  {
    id: 'dummy-5',
    slug: 'donor-darah-bersama-pmi-kabupaten-bandung',
    judul: 'Aksi Kemanusiaan: Donor Darah Bersama PMI Kabupaten Bandung',
    ringkasan: 'Warga belajar dan tenaga pendidik PKBM RIDHO turut berpartisipasi dalam kegiatan donor darah yang diselenggarakan bekerja sama dengan PMI.',
    thumbnail: null,
    kategori: { id: 4, nama: 'Sosial', slug: 'sosial' },
    tanggalPublikasi: '2026-03-15T08:00:00Z',
    viewsCount: 145,
  },
  {
    id: 'dummy-6',
    slug: 'lomba-peringatan-hari-kemerdekaan',
    judul: 'Semarak Lomba Peringatan Hari Kemerdekaan di PKBM RIDHO',
    ringkasan: 'Berbagai perlombaan tradisional dan modern digelar dalam rangka memperingati Hari Kemerdekaan RI. Seluruh warga belajar antusias mengikuti kegiatan ini.',
    thumbnail: null,
    kategori: { id: 1, nama: 'Kegiatan', slug: 'kegiatan' },
    tanggalPublikasi: '2026-03-08T09:00:00Z',
    viewsCount: 203,
  },
];

export const DUMMY_PENGUMUMAN = [
  {
    id: 'ann-1', slug: 'jadwal-ujian-akhir-semester-genap-2026',
    judul: 'Jadwal Ujian Akhir Semester Genap 2025/2026',
    konten: 'Ujian Akhir Semester Genap tahun ajaran 2025/2026 akan dilaksanakan pada tanggal 15-20 Juni 2026. Seluruh peserta didik diwajibkan hadir 30 menit sebelum ujian dimulai. Bawa kartu peserta dan alat tulis lengkap.',
    prioritas: 'penting', tanggalBerlakuMulai: '2026-04-12T00:00:00Z', createdAt: '2026-04-12T08:00:00Z',
  },
  {
    id: 'ann-2', slug: 'pendaftaran-siswa-baru-gelombang-2',
    judul: 'Dibuka! Pendaftaran Peserta Didik Baru Gelombang II',
    konten: 'Pendaftaran peserta didik baru gelombang II untuk program Paket A, B, dan C resmi dibuka mulai 1 Mei 2026. Pendaftaran GRATIS.',
    prioritas: 'penting', tanggalBerlakuMulai: '2026-04-08T00:00:00Z', createdAt: '2026-04-08T10:00:00Z',
  },
  {
    id: 'ann-3', slug: 'libur-nasional-hari-raya-idul-fitri',
    judul: 'Pemberitahuan Libur Nasional Hari Raya Idul Fitri 1447 H',
    konten: 'Kegiatan belajar mengajar diliburkan pada tanggal 28 Maret - 7 April 2026 dalam rangka Hari Raya Idul Fitri 1447 H.',
    prioritas: 'normal', tanggalBerlakuMulai: '2026-03-25T00:00:00Z', createdAt: '2026-03-25T08:00:00Z',
  },
  {
    id: 'ann-4', slug: 'perubahan-jadwal-kelas-karyawan',
    judul: 'Perubahan Jadwal Kelas Karyawan Mulai April 2026',
    konten: 'Mulai bulan April 2026, jadwal kelas karyawan (non-reguler) diubah. Perubahan berlaku untuk seluruh program Paket B dan Paket C kelas karyawan.',
    prioritas: 'normal', tanggalBerlakuMulai: '2026-03-20T00:00:00Z', createdAt: '2026-03-20T07:30:00Z',
  },
  {
    id: 'ann-5', slug: 'pengumuman-kelulusan-peserta-didik-2025',
    judul: 'Pengumuman Kelulusan Peserta Didik Tahun 2025',
    konten: 'Selamat kepada seluruh peserta didik yang telah dinyatakan LULUS pada program Paket A, Paket B, dan Paket C tahun 2025.',
    prioritas: 'penting', tanggalBerlakuMulai: '2026-03-15T00:00:00Z', createdAt: '2026-03-15T10:00:00Z',
  },
];

export const DUMMY_STRUKTUR = [
  {
    id: 'str-1', jabatan: 'Ketua PKBM', namaPejabat: 'H. Ahmad Ridho, S.Pd', foto: null, periode: '2020 - Sekarang',
    children: [
      { id: 'str-2', jabatan: 'Sekretaris', namaPejabat: 'Siti Nurhaliza, S.Pd', foto: null, periode: '2020 - Sekarang', children: [] },
      { id: 'str-3', jabatan: 'Bendahara', namaPejabat: 'Dewi Sartika, S.E', foto: null, periode: '2020 - Sekarang', children: [] },
      { id: 'str-4', jabatan: 'Koordinator Paket A', namaPejabat: 'Budi Santoso, S.Pd', foto: null, periode: '2021 - Sekarang', children: [] },
      { id: 'str-5', jabatan: 'Koordinator Paket B', namaPejabat: 'Rina Marlina, S.Pd', foto: null, periode: '2021 - Sekarang', children: [] },
      { id: 'str-6', jabatan: 'Koordinator Paket C', namaPejabat: 'Joko Widodo, M.Pd', foto: null, periode: '2022 - Sekarang', children: [] },
    ],
  },
];

export const DUMMY_GALERI = [
  { id: 'gal-1', slug: 'upacara-pembukaan-tahun-ajaran-baru', judulFoto: 'Upacara Pembukaan Tahun Ajaran Baru 2025/2026', keterangan: 'Suasana khidmat upacara pembukaan tahun ajaran baru di halaman PKBM RIDHO.', foto: null, kategori: { id: 1, nama: 'Upacara', slug: 'upacara' }, tanggalKegiatan: '2026-04-01T07:00:00Z' },
  { id: 'gal-2', slug: 'praktik-komputer-lab-multimedia', judulFoto: 'Praktik Komputer di Lab Multimedia', keterangan: 'Peserta didik program keterampilan komputer melakukan praktik langsung.', foto: null, kategori: { id: 2, nama: 'Pembelajaran', slug: 'pembelajaran' }, tanggalKegiatan: '2026-03-25T09:00:00Z' },
  { id: 'gal-3', slug: 'pelatihan-menjahit-tata-busana', judulFoto: 'Pelatihan Menjahit dan Tata Busana', keterangan: 'Program keterampilan menjahit memberikan bekal keterampilan hidup.', foto: null, kategori: { id: 3, nama: 'Keterampilan', slug: 'keterampilan' }, tanggalKegiatan: '2026-03-18T10:00:00Z' },
  { id: 'gal-4', slug: 'kegiatan-pramuka-berkemah', judulFoto: 'Kegiatan Pramuka dan Berkemah', keterangan: 'Ekstrakurikuler pramuka mengadakan kegiatan berkemah untuk melatih kemandirian.', foto: null, kategori: { id: 4, nama: 'Ekstrakurikuler', slug: 'ekstrakurikuler' }, tanggalKegiatan: '2026-03-10T06:00:00Z' },
  { id: 'gal-5', slug: 'wisuda-paket-c-angkatan-2025', judulFoto: 'Momen Wisuda Paket C Angkatan 2025', keterangan: 'Momen bahagia para lulusan Paket C angkatan 2025.', foto: null, kategori: { id: 5, nama: 'Wisuda', slug: 'wisuda' }, tanggalKegiatan: '2026-03-05T08:00:00Z' },
  { id: 'gal-6', slug: 'sholawatan-rutin-hari-sabtu', judulFoto: 'Kegiatan Sholawatan Rutin Hari Sabtu', keterangan: 'Kegiatan rutin sholawatan bersama setiap hari Sabtu.', foto: null, kategori: { id: 6, nama: 'Keagamaan', slug: 'keagamaan' }, tanggalKegiatan: '2026-02-28T07:30:00Z' },
];

export const DUMMY_DOSEN = [
  { id: 'dosen-1', namaLengkap: 'H. Ahmad Ridho, S.Pd', jabatanFungsional: 'Ketua PKBM', bidangKeahlian: 'Manajemen Pendidikan Non Formal', foto: null },
  { id: 'dosen-2', namaLengkap: 'Siti Nurhaliza, S.Pd', jabatanFungsional: 'Tutor Paket B', bidangKeahlian: 'Bahasa Indonesia', foto: null },
  { id: 'dosen-3', namaLengkap: 'Budi Santoso, S.Pd', jabatanFungsional: 'Tutor Paket A', bidangKeahlian: 'Pendidikan Dasar', foto: null },
  { id: 'dosen-4', namaLengkap: 'Rina Marlina, S.Pd', jabatanFungsional: 'Tutor Paket B', bidangKeahlian: 'Matematika', foto: null },
  { id: 'dosen-5', namaLengkap: 'Dedi Kurniawan, S.Kom', jabatanFungsional: 'Instruktur Komputer', bidangKeahlian: 'Teknologi Informasi', foto: null },
  { id: 'dosen-6', namaLengkap: 'Joko Widodo, M.Pd', jabatanFungsional: 'Tutor Paket C', bidangKeahlian: 'IPA', foto: null },
];

export const DUMMY_KALENDER = [
  { id: 'evt-1', judulEvent: 'Ujian Akhir Semester Genap', jenisEvent: 'akademik', tanggalMulai: '2026-06-15T07:00:00Z', tanggalSelesai: '2026-06-20T15:00:00Z', lokasi: 'Bumi Ridho', deskripsi: 'Ujian akhir semester genap untuk seluruh program.', warnaLabel: '#EF4444' },
  { id: 'evt-2', judulEvent: 'Wisuda Angkatan 2026', jenisEvent: 'akademik', tanggalMulai: '2026-07-10T08:00:00Z', lokasi: 'Aula Bumi Ridho', deskripsi: 'Upacara wisuda peserta didik yang telah lulus.', warnaLabel: '#3B82F6' },
  { id: 'evt-3', judulEvent: 'Peringatan HUT RI', jenisEvent: 'non_akademik', tanggalMulai: '2026-08-17T07:00:00Z', lokasi: 'Halaman PKBM RIDHO', deskripsi: 'Upacara dan lomba peringatan kemerdekaan.', warnaLabel: '#F59E0B' },
  { id: 'evt-4', judulEvent: 'Rapat Koordinasi Tutor', jenisEvent: 'umum', tanggalMulai: '2026-05-05T09:00:00Z', lokasi: 'Ruang Rapat', deskripsi: 'Rapat koordinasi rutin tenaga pendidik.', warnaLabel: '#10B981' },
];

export const DUMMY_DOKUMEN = [
  { id: 'doc-1', judulDokumen: 'Kalender Akademik 2025/2026', deskripsi: 'Jadwal lengkap kegiatan akademik selama tahun ajaran 2025/2026.', tipeFile: 'pdf', ukuranFile: 245000, kategori: 'Akademik', filePath: '#', createdAt: '2026-03-01T00:00:00Z' },
  { id: 'doc-2', judulDokumen: 'Formulir Pendaftaran Peserta Didik Baru', deskripsi: 'Formulir yang harus diisi untuk mendaftar sebagai peserta didik baru.', tipeFile: 'pdf', ukuranFile: 120000, kategori: 'Pendaftaran', filePath: '#', createdAt: '2026-02-15T00:00:00Z' },
  { id: 'doc-3', judulDokumen: 'Silabus Paket C Semester Genap', deskripsi: 'Silabus lengkap untuk program Paket C semester genap.', tipeFile: 'pdf', ukuranFile: 380000, kategori: 'Akademik', filePath: '#', createdAt: '2026-01-10T00:00:00Z' },
  { id: 'doc-4', judulDokumen: 'Brosur Informasi PKBM RIDHO', deskripsi: 'Informasi ringkas tentang program, fasilitas, dan keunggulan PKBM RIDHO.', tipeFile: 'pdf', ukuranFile: 500000, kategori: 'Umum', filePath: '#', createdAt: '2025-12-01T00:00:00Z' },
];
