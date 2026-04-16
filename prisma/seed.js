const { PrismaClient } = require('../src/generated/prisma');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Seed admin user
  const passwordHash = await bcrypt.hash('admin123', 12);
  const admin = await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      passwordHash: passwordHash,
      namaLengkap: 'Super Admin',
      email: 'admin@institusi.ac.id',
      isActive: true,
    },
  });
  console.log('Admin user created:', admin.username);

  // Seed kategori berita
  const kategoriBeritaData = [
    { nama: 'Akademik', slug: 'akademik' },
    { nama: 'Kegiatan', slug: 'kegiatan' },
    { nama: 'Prestasi', slug: 'prestasi' },
    { nama: 'Pengabdian', slug: 'pengabdian' },
    { nama: 'Umum', slug: 'umum' },
  ];

  for (const data of kategoriBeritaData) {
    await prisma.kategoriBerita.upsert({
      where: { slug: data.slug },
      update: {},
      create: data,
    });
  }
  console.log('Kategori berita seeded');

  // Seed kategori galeri
  const kategoriGaleriData = [
    { nama: 'Seminar', slug: 'seminar' },
    { nama: 'Workshop', slug: 'workshop' },
    { nama: 'Wisuda', slug: 'wisuda' },
    { nama: 'Lomba', slug: 'lomba' },
    { nama: 'Kunjungan', slug: 'kunjungan' },
    { nama: 'Kegiatan Kampus', slug: 'kegiatan-kampus' },
  ];

  for (const data of kategoriGaleriData) {
    await prisma.kategoriGaleri.upsert({
      where: { slug: data.slug },
      update: {},
      create: data,
    });
  }
  console.log('Kategori galeri seeded');

  // Seed pengaturan situs
  const pengaturanData = [
    { kunci: 'nama_institusi', nilai: 'Politeknik Nusantara', tipe: 'text', grup: 'umum' },
    { kunci: 'tagline', nilai: 'Mencetak Lulusan Berkompeten dan Berkarakter', tipe: 'text', grup: 'umum' },
    { kunci: 'alamat', nilai: 'Jl. Pendidikan No. 1, Kota Contoh, Provinsi 12345', tipe: 'text', grup: 'kontak' },
    { kunci: 'telepon', nilai: '(021) 1234-5678', tipe: 'text', grup: 'kontak' },
    { kunci: 'email_institusi', nilai: 'info@politeknusantara.ac.id', tipe: 'text', grup: 'kontak' },
    { kunci: 'google_maps_embed', nilai: '', tipe: 'text', grup: 'kontak' },
    { kunci: 'logo', nilai: '', tipe: 'image', grup: 'umum' },
    { kunci: 'instagram', nilai: 'https://instagram.com/politeknusantara', tipe: 'text', grup: 'sosial_media' },
    { kunci: 'youtube', nilai: 'https://youtube.com/@politeknusantara', tipe: 'text', grup: 'sosial_media' },
    { kunci: 'facebook', nilai: 'https://facebook.com/politeknusantara', tipe: 'text', grup: 'sosial_media' },
    { kunci: 'jumlah_mahasiswa', nilai: '2500', tipe: 'number', grup: 'statistik' },
    { kunci: 'total_alumni', nilai: '10000', tipe: 'number', grup: 'statistik' },
    { kunci: 'akreditasi', nilai: 'B', tipe: 'text', grup: 'statistik' },
    { kunci: 'mitra_industri', nilai: '50', tipe: 'number', grup: 'statistik' },
    { kunci: 'video_profil_url', nilai: '', tipe: 'text', grup: 'umum' },
    { kunci: 'hero_headline', nilai: 'Selamat Datang di Politeknik Nusantara', tipe: 'text', grup: 'beranda' },
    { kunci: 'hero_sub_headline', nilai: 'Membangun Masa Depan Melalui Pendidikan Vokasi Berkualitas', tipe: 'text', grup: 'beranda' },
    { kunci: 'hero_background', nilai: '', tipe: 'image', grup: 'beranda' },
  ];

  for (const data of pengaturanData) {
    await prisma.pengaturanSitus.upsert({
      where: { kunci: data.kunci },
      update: {},
      create: data,
    });
  }
  console.log('Pengaturan situs seeded');

  console.log('Seeding complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
