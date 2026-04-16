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
      { nama: { contains: search, mode: 'insensitive' } },
      { angkatan: { contains: search, mode: 'insensitive' } },
    ];
  }
  if (status) where.status = status;

  try {
    const [data, total] = await Promise.all([
      prisma.alumni.findMany({ where, orderBy: { createdAt: 'desc' }, skip: (page - 1) * limit, take: limit }),
      prisma.alumni.count({ where }),
    ]);

    return NextResponse.json({ success: true, data, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } });
  } catch {
    return NextResponse.json({ success: false, error: { code: 'SERVER_ERROR', message: 'Gagal mengambil data alumni' } }, { status: 500 });
  }
}

export async function POST(request) {
  const { error } = await withAuth(request);
  if (error) return error;

  try {
    const body = await request.json();
    const nama = (body.nama || '').trim();
    const angkatan = (body.angkatan || '').trim();

    if (nama.length < 3) return NextResponse.json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'Nama minimal 3 karakter' } }, { status: 400 });
    if (!/^\d{4}$/.test(angkatan)) return NextResponse.json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'Angkatan harus 4 digit' } }, { status: 400 });

    const data = await prisma.alumni.create({
      data: {
        nama,
        angkatan,
        programStudi: (body.program_studi || '').trim() || null,
        tahunLulus: (body.tahun_lulus || '').trim() || null,
        pekerjaanSaatIni: (body.pekerjaan_saat_ini || '').trim() || null,
        perusahaan: (body.perusahaan || '').trim() || null,
        testimoni: (body.testimoni || '').trim() || null,
        isFeatured: Boolean(body.is_featured),
        status: body.status === 'nonaktif' ? 'nonaktif' : 'aktif',
      },
    });

    return NextResponse.json({ success: true, data, message: 'Alumni berhasil ditambahkan' }, { status: 201 });
  } catch {
    return NextResponse.json({ success: false, error: { code: 'SERVER_ERROR', message: 'Gagal menambahkan alumni' } }, { status: 500 });
  }
}
