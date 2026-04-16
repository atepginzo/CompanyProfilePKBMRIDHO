import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '12', 10);
  const search = searchParams.get('search') || '';
  const angkatan = searchParams.get('angkatan') || '';

  const safePage = Number.isFinite(page) && page > 0 ? page : 1;
  const safeLimit = Number.isFinite(limit) && limit > 0 && limit <= 30 ? limit : 12;

  const where = {
    status: 'aktif',
    ...(search
      ? {
          OR: [
            { nama: { contains: search, mode: 'insensitive' } },
            { pekerjaanSaatIni: { contains: search, mode: 'insensitive' } },
            { perusahaan: { contains: search, mode: 'insensitive' } },
            { testimoni: { contains: search, mode: 'insensitive' } },
          ],
        }
      : {}),
    ...(angkatan ? { angkatan } : {}),
  };

  try {
    const [items, total] = await Promise.all([
      prisma.alumni.findMany({
        where,
        select: {
          id: true,
          nama: true,
          angkatan: true,
          programStudi: true,
          tahunLulus: true,
          pekerjaanSaatIni: true,
          perusahaan: true,
          testimoni: true,
          foto: true,
          isFeatured: true,
          createdAt: true,
        },
        orderBy: [{ isFeatured: 'desc' }, { createdAt: 'desc' }],
        skip: (safePage - 1) * safeLimit,
        take: safeLimit,
      }),
      prisma.alumni.count({ where }),
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
    console.error('Public alumni list error:', error);
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: 'Gagal mengambil data alumni' } },
      { status: 500 }
    );
  }
}
