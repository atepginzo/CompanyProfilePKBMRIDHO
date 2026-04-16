import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '12', 10);
  const search = searchParams.get('search') || '';
  const programStudi = searchParams.get('program_studi') || '';

  const safePage = Number.isFinite(page) && page > 0 ? page : 1;
  const safeLimit = Number.isFinite(limit) && limit > 0 && limit <= 30 ? limit : 12;

  const where = {
    status: 'aktif',
    ...(search
      ? {
          OR: [
            { namaLengkap: { contains: search, mode: 'insensitive' } },
            { nip: { contains: search, mode: 'insensitive' } },
            { nidn: { contains: search, mode: 'insensitive' } },
            { bidangKeahlian: { contains: search, mode: 'insensitive' } },
          ],
        }
      : {}),
    ...(programStudi ? { programStudi: { equals: programStudi, mode: 'insensitive' } } : {}),
  };

  try {
    const [items, total] = await Promise.all([
      prisma.dosen.findMany({
        where,
        select: {
          id: true,
          namaLengkap: true,
          nip: true,
          nidn: true,
          jabatanFungsional: true,
          jabatanStruktural: true,
          programStudi: true,
          pendidikanTerakhir: true,
          bidangKeahlian: true,
          email: true,
          telepon: true,
          foto: true,
          bio: true,
          urutan: true,
        },
        orderBy: [{ urutan: 'asc' }, { namaLengkap: 'asc' }],
        skip: (safePage - 1) * safeLimit,
        take: safeLimit,
      }),
      prisma.dosen.count({ where }),
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
    console.error('Public dosen list error:', error);
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: 'Gagal mengambil data dosen' } },
      { status: 500 }
    );
  }
}
