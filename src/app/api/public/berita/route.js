import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '9', 10);
  const search = searchParams.get('search') || '';
  const kategori = searchParams.get('kategori') || '';

  const safePage = Number.isFinite(page) && page > 0 ? page : 1;
  const safeLimit = Number.isFinite(limit) && limit > 0 && limit <= 24 ? limit : 9;

  const where = {
    status: 'published',
    ...(search
      ? {
          OR: [
            { judul: { contains: search, mode: 'insensitive' } },
            { ringkasan: { contains: search, mode: 'insensitive' } },
          ],
        }
      : {}),
    ...(kategori ? { kategori: { slug: kategori } } : {}),
  };

  try {
    const [items, total, categories] = await Promise.all([
      prisma.berita.findMany({
        where,
        select: {
          id: true,
          judul: true,
          slug: true,
          ringkasan: true,
          thumbnail: true,
          penulis: true,
          tanggalPublikasi: true,
          createdAt: true,
          viewsCount: true,
          kategori: {
            select: {
              nama: true,
              slug: true,
            },
          },
        },
        orderBy: [{ tanggalPublikasi: 'desc' }, { createdAt: 'desc' }],
        skip: (safePage - 1) * safeLimit,
        take: safeLimit,
      }),
      prisma.berita.count({ where }),
      prisma.kategoriBerita.findMany({
        orderBy: { nama: 'asc' },
        select: { id: true, nama: true, slug: true },
      }),
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
      filters: {
        categories,
      },
    });
  } catch (error) {
    console.error('Public berita list error:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'SERVER_ERROR',
          message: 'Gagal mengambil daftar berita',
        },
      },
      { status: 500 }
    );
  }
}
