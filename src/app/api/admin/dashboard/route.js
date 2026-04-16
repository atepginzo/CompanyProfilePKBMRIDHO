import { NextResponse } from 'next/server';
import { withAuth } from '@/lib/middleware';
import prisma from '@/lib/prisma';

export async function GET(request) {
  const { error } = await withAuth(request);
  if (error) return error;

  try {
    const [
      totalBerita,
      totalDosen,
      totalGaleri,
      totalAlumni,
      totalPengumuman,
      pesanBelumDibaca,
      totalDokumen,
      totalFasilitas,
      recentBerita,
      recentPesan,
      recentPengumuman,
    ] = await Promise.all([
      prisma.berita.count(),
      prisma.dosen.count(),
      prisma.galeri.count(),
      prisma.alumni.count(),
      prisma.pengumuman.count(),
      prisma.pesanMasuk.count({ where: { isRead: false } }),
      prisma.dokumen.count(),
      prisma.fasilitas.count(),
      prisma.berita.findMany({
        select: { id: true, judul: true, slug: true, status: true, createdAt: true },
        orderBy: { createdAt: 'desc' },
        take: 5,
      }),
      prisma.pesanMasuk.findMany({
        select: { id: true, namaPengirim: true, subjek: true, isRead: true, createdAt: true },
        orderBy: { createdAt: 'desc' },
        take: 5,
      }),
      prisma.pengumuman.findMany({
        select: { id: true, judul: true, status: true, prioritas: true, createdAt: true },
        orderBy: { createdAt: 'desc' },
        take: 5,
      }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        totalBerita,
        totalDosen,
        totalGaleri,
        totalAlumni,
        totalPengumuman,
        pesanBelumDibaca,
        totalDokumen,
        totalFasilitas,
        recentBerita,
        recentPesan,
        recentPengumuman,
      },
    });
  } catch (err) {
    console.error('Dashboard error:', err);
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: 'Gagal mengambil data dashboard' } },
      { status: 500 }
    );
  }
}
