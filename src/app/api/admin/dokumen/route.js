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
  if (search) where.judulDokumen = { contains: search, mode: 'insensitive' };
  if (status) where.status = status;

  try {
    const [data, total] = await Promise.all([
      prisma.dokumen.findMany({ where, orderBy: { createdAt: 'desc' }, skip: (page - 1) * limit, take: limit }),
      prisma.dokumen.count({ where }),
    ]);

    return NextResponse.json({ success: true, data, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } });
  } catch {
    return NextResponse.json({ success: false, error: { code: 'SERVER_ERROR', message: 'Gagal mengambil data dokumen' } }, { status: 500 });
  }
}

export async function POST(request) {
  const { error, user } = await withAuth(request);
  if (error) return error;

  try {
    const body = await request.json();
    const judulDokumen = (body.judul_dokumen || '').trim();
    const filePath = (body.file_path || '').trim();

    if (!judulDokumen) return NextResponse.json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'Judul dokumen wajib diisi' } }, { status: 400 });
    if (!filePath) return NextResponse.json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'Path file wajib diisi' } }, { status: 400 });

    const data = await prisma.dokumen.create({
      data: {
        judulDokumen,
        deskripsi: (body.deskripsi || '').trim() || null,
        filePath,
        kategori: (body.kategori || '').trim() || null,
        ukuranFile: parseInt(body.ukuran_file || '0', 10) || 0,
        tipeFile: (body.tipe_file || 'pdf').trim(),
        visibilitas: body.visibilitas === 'internal' ? 'internal' : 'publik',
        status: body.status === 'nonaktif' ? 'nonaktif' : 'aktif',
        createdBy: user.id,
      },
    });

    return NextResponse.json({ success: true, data, message: 'Dokumen berhasil ditambahkan' }, { status: 201 });
  } catch {
    return NextResponse.json({ success: false, error: { code: 'SERVER_ERROR', message: 'Gagal menambahkan dokumen' } }, { status: 500 });
  }
}
