import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const [pengaturan, beritaTerbaru, pengumumanAktif, fasilitasUnggulan, totalDosen, totalAlumni] =
      await Promise.all([
        prisma.pengaturanSitus.findMany(),
        prisma.berita.findMany({
          where: { status: 'published' },
          select: {
            id: true,
            judul: true,
            slug: true,
            ringkasan: true,
            thumbnail: true,
            tanggalPublikasi: true,
            createdAt: true,
            kategori: { select: { nama: true, slug: true } },
          },
          orderBy: [{ tanggalPublikasi: 'desc' }, { createdAt: 'desc' }],
          take: 3,
        }),
        prisma.pengumuman.findMany({
          where: { status: 'published' },
          select: {
            id: true,
            judul: true,
            slug: true,
            konten: true,
            prioritas: true,
            tanggalBerlakuMulai: true,
            createdAt: true,
          },
          orderBy: { createdAt: 'desc' },
          take: 3,
        }),
        prisma.fasilitas.findMany({
          where: { status: 'aktif' },
          select: {
            id: true,
            namaFasilitas: true,
            deskripsi: true,
            foto: true,
            kategori: true,
          },
          orderBy: { urutan: 'asc' },
          take: 6,
        }),
        prisma.dosen.count({ where: { status: 'aktif' } }),
        prisma.alumni.count({ where: { status: 'aktif' } }),
      ]);

    // Transform pengaturan array ke object key-value
    const settings = {};
    for (const row of pengaturan) {
      settings[row.kunci] = row.nilai;
    }

    return NextResponse.json({
      success: true,
      data: {
        settings,
        beritaTerbaru,
        pengumumanAktif,
        fasilitasUnggulan,
        stats: {
          jumlahPesertaDidik: settings.jumlah_peserta_didik || settings.jumlah_mahasiswa || '0',
          totalAlumniDB: totalAlumni,
          totalAlumniSetting: settings.total_alumni || '0',
          totalDosen: totalDosen,
          tahunBerdiri: settings.tahun_berdiri || '2015',
          akreditasi: settings.akreditasi || '-',
        },
      },
    });
  } catch (error) {
    console.error('Beranda API error:', error);
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: 'Gagal memuat data beranda' } },
      { status: 500 }
    );
  }
}
