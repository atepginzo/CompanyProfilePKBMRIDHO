import { NextResponse } from 'next/server';
import { withAuth } from '@/lib/middleware';
import prisma from '@/lib/prisma';
import { generateUniqueSlug } from '@/lib/slug';

export async function GET(request) {
  const { error } = await withAuth(request);
  if (error) return error;

  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '10', 10);
  const search = searchParams.get('search') || '';
  const status = searchParams.get('status') || '';

  const where = {};
  if (search) where.judul = { contains: search, mode: 'insensitive' };
  if (status) where.status = status;

  try {
    const [data, total] = await Promise.all([
      prisma.pengumuman.findMany({ where, orderBy: { createdAt: 'desc' }, skip: (page - 1) * limit, take: limit }),
      prisma.pengumuman.count({ where }),
    ]);

    return NextResponse.json({ success: true, data, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } });
  } catch {
    return NextResponse.json({ success: false, error: { code: 'SERVER_ERROR', message: 'Gagal mengambil data pengumuman' } }, { status: 500 });
  }
}

export async function POST(request) {
  const { error, user } = await withAuth(request);
  if (error) return error;

  try {
    const body = await request.json();
    const judul = (body.judul || '').trim();
    const konten = (body.konten || '').trim();

    if (judul.length < 10) {
      return NextResponse.json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'Judul minimal 10 karakter' } }, { status: 400 });
    }
    if (!konten) {
      return NextResponse.json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'Konten wajib diisi' } }, { status: 400 });
    }

    const slug = await generateUniqueSlug(judul, prisma.pengumuman, prisma);

    const data = await prisma.pengumuman.create({
      data: {
        judul,
        slug,
        konten,
        prioritas: body.prioritas || 'normal',
        tanggalBerlakuMulai: body.tanggal_berlaku_mulai ? new Date(body.tanggal_berlaku_mulai) : null,
        tanggalBerlakuSelesai: body.tanggal_berlaku_selesai ? new Date(body.tanggal_berlaku_selesai) : null,
        status: body.status === 'published' ? 'published' : 'draft',
        createdBy: user.id,
      },
    });

    return NextResponse.json({ success: true, data, message: 'Pengumuman berhasil ditambahkan' }, { status: 201 });
  } catch {
    return NextResponse.json({ success: false, error: { code: 'SERVER_ERROR', message: 'Gagal menambahkan pengumuman' } }, { status: 500 });
  }
}
