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
      { namaLengkap: { contains: search, mode: 'insensitive' } },
      { nip: { contains: search, mode: 'insensitive' } },
    ];
  }
  if (status) where.status = status;

  try {
    const [data, total] = await Promise.all([
      prisma.dosen.findMany({
        where,
        orderBy: [{ urutan: 'asc' }, { createdAt: 'desc' }],
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.dosen.count({ where }),
    ]);

    return NextResponse.json({ success: true, data, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } });
  } catch {
    return NextResponse.json({ success: false, error: { code: 'SERVER_ERROR', message: 'Gagal mengambil data dosen' } }, { status: 500 });
  }
}

export async function POST(request) {
  const { error } = await withAuth(request);
  if (error) return error;

  try {
    const body = await request.json();
    const namaLengkap = (body.nama_lengkap || '').trim();
    if (namaLengkap.length < 3) {
      return NextResponse.json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'Nama dosen minimal 3 karakter' } }, { status: 400 });
    }

    const data = await prisma.dosen.create({
      data: {
        namaLengkap,
        nip: (body.nip || '').trim() || null,
        nidn: (body.nidn || '').trim() || null,
        jabatanFungsional: (body.jabatan_fungsional || '').trim() || null,
        jabatanStruktural: (body.jabatan_struktural || '').trim() || null,
        programStudi: (body.program_studi || '').trim() || null,
        pendidikanTerakhir: (body.pendidikan_terakhir || '').trim() || null,
        bidangKeahlian: (body.bidang_keahlian || '').trim() || null,
        email: (body.email || '').trim() || null,
        telepon: (body.telepon || '').trim() || null,
        bio: (body.bio || '').trim() || null,
        urutan: parseInt(body.urutan || '0', 10) || 0,
        status: body.status === 'nonaktif' ? 'nonaktif' : 'aktif',
      },
    });

    return NextResponse.json({ success: true, data, message: 'Dosen berhasil ditambahkan' }, { status: 201 });
  } catch {
    return NextResponse.json({ success: false, error: { code: 'SERVER_ERROR', message: 'Gagal menambahkan dosen' } }, { status: 500 });
  }
}
