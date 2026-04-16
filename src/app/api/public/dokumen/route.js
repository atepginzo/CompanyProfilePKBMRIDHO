import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '12', 10);
  const search = searchParams.get('search') || '';
  const kategori = searchParams.get('kategori') || '';

  const safePage = Number.isFinite(page) && page > 0 ? page : 1;
  const safeLimit = Number.isFinite(limit) && limit > 0 && limit <= 30 ? limit : 12;

  const where = {
    status: 'aktif',
    visibilitas: 'publik',
    ...(search
      ? {
          OR: [
            { judulDokumen: { contains: search, mode: 'insensitive' } },
            { deskripsi: { contains: search, mode: 'insensitive' } },
          ],
        }
      : {}),
    ...(kategori ? { kategori: { equals: kategori, mode: 'insensitive' } } : {}),
  };

  try {
    const [items, total] = await Promise.all([
      prisma.dokumen.findMany({
        where,
        select: {
          id: true,
          judulDokumen: true,
          deskripsi: true,
          filePath: true,
          kategori: true,
          ukuranFile: true,
          tipeFile: true,
          jumlahDownload: true,
          createdAt: true,
        },
        orderBy: [{ createdAt: 'desc' }],
        skip: (safePage - 1) * safeLimit,
        take: safeLimit,
      }),
      prisma.dokumen.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: items,
      pagination: {
        page: safePage,
        limit: safeLimit,
        total,
        totalPages: Math.ceil(total / safeLimit),
      },
    });
  } catch (error) {
    console.error('Public dokumen list error:', error);
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: 'Gagal mengambil data dokumen' } },
      { status: 500 }
    );
  }
}
