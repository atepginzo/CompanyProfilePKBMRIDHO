import { NextResponse } from 'next/server';
import { withAuth } from '@/lib/middleware';
import prisma from '@/lib/prisma';

export async function GET(request) {
  const { error } = await withAuth(request);
  if (error) return error;

  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '10', 10);
  const search = searchParams.get('search') || '';
  const status = searchParams.get('status') || '';

  const where = {};
  if (search) {
    where.OR = [
      { namaPengirim: { contains: search, mode: 'insensitive' } },
      { subjek: { contains: search, mode: 'insensitive' } },
    ];
  }
  if (status === 'read') where.isRead = true;
  if (status === 'unread') where.isRead = false;

  try {
    const [data, total] = await Promise.all([
      prisma.pesanMasuk.findMany({ where, orderBy: { createdAt: 'desc' }, skip: (page - 1) * limit, take: limit }),
      prisma.pesanMasuk.count({ where }),
    ]);

    return NextResponse.json({ success: true, data, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } });
  } catch {
    return NextResponse.json({ success: false, error: { code: 'SERVER_ERROR', message: 'Gagal mengambil data pesan' } }, { status: 500 });
  }
}
