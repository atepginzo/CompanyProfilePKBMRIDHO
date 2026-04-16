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
  const kategori = searchParams.get('kategori') || '';

  const where = {};
  if (search) {
    where.namaFasilitas = { contains: search, mode: 'insensitive' };
  }
  if (status) {
    where.status = status;
  }
  if (kategori) {
    where.kategori = { equals: kategori, mode: 'insensitive' };
  }

  try {
    const [data, total] = await Promise.all([
      prisma.fasilitas.findMany({
        where,
        orderBy: [{ urutan: 'asc' }, { createdAt: 'desc' }],
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.fasilitas.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: { code: 'SERVER_ERROR', message: 'Gagal mengambil data fasilitas' },
      },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  const { error } = await withAuth(request);
  if (error) return error;

  try {
    const body = await request.json();
    const namaFasilitas = (body.nama_fasilitas || '').trim();

    if (namaFasilitas.length < 3) {
      return NextResponse.json(
        {
          success: false,
          error: { code: 'VALIDATION_ERROR', message: 'Nama fasilitas minimal 3 karakter' },
        },
        { status: 400 }
      );
    }

    const fasilitas = await prisma.fasilitas.create({
      data: {
        namaFasilitas,
        deskripsi: (body.deskripsi || '').trim() || null,
        kategori: (body.kategori || '').trim() || null,
        lokasi: (body.lokasi || '').trim() || null,
        urutan: Number.isInteger(body.urutan) ? body.urutan : parseInt(body.urutan || '0', 10) || 0,
        status: body.status === 'nonaktif' ? 'nonaktif' : 'aktif',
      },
    });

    return NextResponse.json(
      { success: true, data: fasilitas, message: 'Fasilitas berhasil ditambahkan' },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: { code: 'SERVER_ERROR', message: 'Gagal menambahkan fasilitas' },
      },
      { status: 500 }
    );
  }
}
