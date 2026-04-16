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
      { namaPejabat: { contains: search, mode: 'insensitive' } },
      { jabatan: { contains: search, mode: 'insensitive' } },
    ];
  }
  if (status) where.status = status;

  try {
    const [data, total] = await Promise.all([
      prisma.strukturOrganisasi.findMany({ where, orderBy: [{ level: 'asc' }, { urutan: 'asc' }], skip: (page - 1) * limit, take: limit }),
      prisma.strukturOrganisasi.count({ where }),
    ]);

    return NextResponse.json({ success: true, data, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } });
  } catch {
    return NextResponse.json({ success: false, error: { code: 'SERVER_ERROR', message: 'Gagal mengambil data struktur organisasi' } }, { status: 500 });
  }
}

export async function POST(request) {
  const { error } = await withAuth(request);
  if (error) return error;

  try {
    const body = await request.json();
    const namaPejabat = (body.nama_pejabat || '').trim();
    const jabatan = (body.jabatan || '').trim();

    if (!namaPejabat || !jabatan) {
      return NextResponse.json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'Nama pejabat dan jabatan wajib diisi' } }, { status: 400 });
    }

    const data = await prisma.strukturOrganisasi.create({
      data: {
        namaPejabat,
        jabatan,
        level: parseInt(body.level || '1', 10) || 1,
        parentId: body.parent_id ? parseInt(body.parent_id, 10) : null,
        urutan: parseInt(body.urutan || '0', 10) || 0,
        periode: (body.periode || '').trim() || null,
        status: body.status === 'nonaktif' ? 'nonaktif' : 'aktif',
      },
    });

    return NextResponse.json({ success: true, data, message: 'Struktur organisasi berhasil ditambahkan' }, { status: 201 });
  } catch {
    return NextResponse.json({ success: false, error: { code: 'SERVER_ERROR', message: 'Gagal menambahkan struktur organisasi' } }, { status: 500 });
  }
}
