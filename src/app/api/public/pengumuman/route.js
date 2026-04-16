import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '10', 10);
  const search = searchParams.get('search') || '';
  const prioritas = searchParams.get('prioritas') || '';

  const safePage = Number.isFinite(page) && page > 0 ? page : 1;
  const safeLimit = Number.isFinite(limit) && limit > 0 && limit <= 30 ? limit : 10;

  const where = {
    status: 'published',
    ...(search
      ? {
          OR: [
            { judul: { contains: search, mode: 'insensitive' } },
            { konten: { contains: search, mode: 'insensitive' } },
          ],
        }
      : {}),
    ...(prioritas ? { prioritas } : {}),
  };

  try {
    const [items, total] = await Promise.all([
      prisma.pengumuman.findMany({
        where,
        select: {
          id: true,
          judul: true,
          slug: true,
          konten: true,
          prioritas: true,
          tanggalBerlakuMulai: true,
          tanggalBerlakuSelesai: true,
          createdAt: true,
        },
        orderBy: [{ tanggalBerlakuMulai: 'desc' }, { createdAt: 'desc' }],
        skip: (safePage - 1) * safeLimit,
        take: safeLimit,
      }),
      prisma.pengumuman.count({ where }),
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
    console.error('Public pengumuman list error:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'SERVER_ERROR',
          message: 'Gagal mengambil daftar pengumuman',
        },
      },
      { status: 500 }
    );
  }
}
