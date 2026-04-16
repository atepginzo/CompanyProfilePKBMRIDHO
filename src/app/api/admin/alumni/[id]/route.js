import { NextResponse } from 'next/server';
import { withAuth } from '@/lib/middleware';
import prisma from '@/lib/prisma';

export async function GET(request, { params }) {
  const { error } = await withAuth(request);
  if (error) return error;
  const { id } = await params;

  try {
    const data = await prisma.alumni.findUnique({ where: { id: parseInt(id, 10) } });
    if (!data) return NextResponse.json({ success: false, error: { code: 'NOT_FOUND', message: 'Alumni tidak ditemukan' } }, { status: 404 });
    return NextResponse.json({ success: true, data });
  } catch {
    return NextResponse.json({ success: false, error: { code: 'SERVER_ERROR', message: 'Gagal mengambil data alumni' } }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  const { error } = await withAuth(request);
  if (error) return error;
  const { id } = await params;

  try {
    const body = await request.json();
    const nama = (body.nama || '').trim();
    const angkatan = (body.angkatan || '').trim();

    if (nama.length < 3) return NextResponse.json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'Nama minimal 3 karakter' } }, { status: 400 });
    if (!/^\d{4}$/.test(angkatan)) return NextResponse.json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'Angkatan harus 4 digit' } }, { status: 400 });

    const data = await prisma.alumni.update({
      where: { id: parseInt(id, 10) },
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

    return NextResponse.json({ success: true, data, message: 'Alumni berhasil diperbarui' });
  } catch {
    return NextResponse.json({ success: false, error: { code: 'SERVER_ERROR', message: 'Gagal memperbarui alumni' } }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const { error } = await withAuth(request);
  if (error) return error;
  const { id } = await params;

  try {
    await prisma.alumni.delete({ where: { id: parseInt(id, 10) } });
    return NextResponse.json({ success: true, message: 'Alumni berhasil dihapus' });
  } catch {
    return NextResponse.json({ success: false, error: { code: 'SERVER_ERROR', message: 'Gagal menghapus alumni' } }, { status: 500 });
  }
}
