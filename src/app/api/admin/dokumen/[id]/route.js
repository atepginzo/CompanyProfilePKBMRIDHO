import { NextResponse } from 'next/server';
import { withAuth } from '@/lib/middleware';
import prisma from '@/lib/prisma';

export async function GET(request, { params }) {
  const { error } = await withAuth(request);
  if (error) return error;
  const { id } = await params;

  try {
    const data = await prisma.dokumen.findUnique({ where: { id: parseInt(id, 10) } });
    if (!data) return NextResponse.json({ success: false, error: { code: 'NOT_FOUND', message: 'Dokumen tidak ditemukan' } }, { status: 404 });
    return NextResponse.json({ success: true, data });
  } catch {
    return NextResponse.json({ success: false, error: { code: 'SERVER_ERROR', message: 'Gagal mengambil data dokumen' } }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  const { error } = await withAuth(request);
  if (error) return error;
  const { id } = await params;

  try {
    const body = await request.json();
    const judulDokumen = (body.judul_dokumen || '').trim();
    const filePath = (body.file_path || '').trim();

    if (!judulDokumen) return NextResponse.json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'Judul dokumen wajib diisi' } }, { status: 400 });
    if (!filePath) return NextResponse.json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'Path file wajib diisi' } }, { status: 400 });

    const data = await prisma.dokumen.update({
      where: { id: parseInt(id, 10) },
      data: {
        judulDokumen,
        deskripsi: (body.deskripsi || '').trim() || null,
        filePath,
        kategori: (body.kategori || '').trim() || null,
        ukuranFile: parseInt(body.ukuran_file || '0', 10) || 0,
        tipeFile: (body.tipe_file || 'pdf').trim(),
        visibilitas: body.visibilitas === 'internal' ? 'internal' : 'publik',
        status: body.status === 'nonaktif' ? 'nonaktif' : 'aktif',
      },
    });

    return NextResponse.json({ success: true, data, message: 'Dokumen berhasil diperbarui' });
  } catch {
    return NextResponse.json({ success: false, error: { code: 'SERVER_ERROR', message: 'Gagal memperbarui dokumen' } }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const { error } = await withAuth(request);
  if (error) return error;
  const { id } = await params;

  try {
    await prisma.dokumen.delete({ where: { id: parseInt(id, 10) } });
    return NextResponse.json({ success: true, message: 'Dokumen berhasil dihapus' });
  } catch {
    return NextResponse.json({ success: false, error: { code: 'SERVER_ERROR', message: 'Gagal menghapus dokumen' } }, { status: 500 });
  }
}
