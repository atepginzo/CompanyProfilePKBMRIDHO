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
  if (search) where.judulEvent = { contains: search, mode: 'insensitive' };
  if (status) where.status = status;

  try {
    const [data, total] = await Promise.all([
      prisma.kalenderEvent.findMany({ where, orderBy: { tanggalMulai: 'desc' }, skip: (page - 1) * limit, take: limit }),
      prisma.kalenderEvent.count({ where }),
    ]);

    return NextResponse.json({ success: true, data, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } });
  } catch {
    return NextResponse.json({ success: false, error: { code: 'SERVER_ERROR', message: 'Gagal mengambil data kalender' } }, { status: 500 });
  }
}

export async function POST(request) {
  const { error, user } = await withAuth(request);
  if (error) return error;

  try {
    const body = await request.json();
    const judulEvent = (body.judul_event || '').trim();

    if (judulEvent.length < 5) {
      return NextResponse.json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'Judul event minimal 5 karakter' } }, { status: 400 });
    }
    if (!body.tanggal_mulai) {
      return NextResponse.json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'Tanggal mulai wajib diisi' } }, { status: 400 });
    }

    const data = await prisma.kalenderEvent.create({
      data: {
        judulEvent,
        deskripsi: (body.deskripsi || '').trim() || null,
        tanggalMulai: new Date(body.tanggal_mulai),
        tanggalSelesai: body.tanggal_selesai ? new Date(body.tanggal_selesai) : null,
        lokasi: (body.lokasi || '').trim() || null,
        jenisEvent: body.jenis_event || 'umum',
        warnaLabel: (body.warna_label || '').trim() || null,
        status: body.status === 'published' ? 'published' : 'draft',
        createdBy: user.id,
      },
    });

    return NextResponse.json({ success: true, data, message: 'Event berhasil ditambahkan' }, { status: 201 });
  } catch {
    return NextResponse.json({ success: false, error: { code: 'SERVER_ERROR', message: 'Gagal menambahkan event' } }, { status: 500 });
  }
}
