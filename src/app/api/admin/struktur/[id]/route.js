import { NextResponse } from 'next/server';
import { withAuth } from '@/lib/middleware';
import prisma from '@/lib/prisma';

export async function GET(request, { params }) {
  const { error } = await withAuth(request);
  if (error) return error;
  const { id } = await params;

  try {
    const data = await prisma.strukturOrganisasi.findUnique({ where: { id: parseInt(id, 10) } });
    if (!data) return NextResponse.json({ success: false, error: { code: 'NOT_FOUND', message: 'Data struktur tidak ditemukan' } }, { status: 404 });
    return NextResponse.json({ success: true, data });
  } catch {
    return NextResponse.json({ success: false, error: { code: 'SERVER_ERROR', message: 'Gagal mengambil data struktur' } }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  const { error } = await withAuth(request);
  if (error) return error;
  const { id } = await params;

  try {
    const body = await request.json();
    const namaPejabat = (body.nama_pejabat || '').trim();
    const jabatan = (body.jabatan || '').trim();

    if (!namaPejabat || !jabatan) {
      return NextResponse.json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'Nama pejabat dan jabatan wajib diisi' } }, { status: 400 });
    }

    const data = await prisma.strukturOrganisasi.update({
      where: { id: parseInt(id, 10) },
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

    return NextResponse.json({ success: true, data, message: 'Struktur organisasi berhasil diperbarui' });
  } catch {
    return NextResponse.json({ success: false, error: { code: 'SERVER_ERROR', message: 'Gagal memperbarui struktur organisasi' } }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const { error } = await withAuth(request);
  if (error) return error;
  const { id } = await params;

  try {
    await prisma.strukturOrganisasi.delete({ where: { id: parseInt(id, 10) } });
    return NextResponse.json({ success: true, message: 'Struktur organisasi berhasil dihapus' });
  } catch {
    return NextResponse.json({ success: false, error: { code: 'SERVER_ERROR', message: 'Gagal menghapus struktur organisasi' } }, { status: 500 });
  }
}
