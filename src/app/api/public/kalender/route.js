import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '12', 10);
  const search = searchParams.get('search') || '';
  const jenisEvent = searchParams.get('jenis_event') || '';

  const safePage = Number.isFinite(page) && page > 0 ? page : 1;
  const safeLimit = Number.isFinite(limit) && limit > 0 && limit <= 30 ? limit : 12;

  const where = {
    status: 'published',
    ...(search
      ? {
          OR: [
            { judulEvent: { contains: search, mode: 'insensitive' } },
            { deskripsi: { contains: search, mode: 'insensitive' } },
            { lokasi: { contains: search, mode: 'insensitive' } },
          ],
        }
      : {}),
    ...(jenisEvent ? { jenisEvent } : {}),
  };

  try {
    const [items, total] = await Promise.all([
      prisma.kalenderEvent.findMany({
        where,
        select: {
          id: true,
          judulEvent: true,
          deskripsi: true,
          tanggalMulai: true,
          tanggalSelesai: true,
          lokasi: true,
          jenisEvent: true,
          warnaLabel: true,
        },
        orderBy: [{ tanggalMulai: 'asc' }],
        skip: (safePage - 1) * safeLimit,
        take: safeLimit,
      }),
      prisma.kalenderEvent.count({ where }),
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
    console.error('Public kalender list error:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'SERVER_ERROR',
          message: 'Gagal mengambil data kalender',
        },
      },
      { status: 500 }
    );
  }
}
