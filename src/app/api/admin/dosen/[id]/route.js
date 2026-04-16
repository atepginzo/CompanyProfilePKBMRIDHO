import { NextResponse } from 'next/server';
import { withAuth } from '@/lib/middleware';
import prisma from '@/lib/prisma';

export async function GET(request, { params }) {
  const { error } = await withAuth(request);
  if (error) return error;
  const { id } = await params;

  try {
    const data = await prisma.dosen.findUnique({ where: { id: parseInt(id, 10) } });
    if (!data) return NextResponse.json({ success: false, error: { code: 'NOT_FOUND', message: 'Dosen tidak ditemukan' } }, { status: 404 });
    return NextResponse.json({ success: true, data });
  } catch {
    return NextResponse.json({ success: false, error: { code: 'SERVER_ERROR', message: 'Gagal mengambil data dosen' } }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  const { error } = await withAuth(request);
  if (error) return error;
  const { id } = await params;

  try {
    const body = await request.json();
    const namaLengkap = (body.nama_lengkap || '').trim();
    if (namaLengkap.length < 3) {
      return NextResponse.json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'Nama dosen minimal 3 karakter' } }, { status: 400 });
    }

    const data = await prisma.dosen.update({
      where: { id: parseInt(id, 10) },
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

    return NextResponse.json({ success: true, data, message: 'Dosen berhasil diperbarui' });
  } catch {
    return NextResponse.json({ success: false, error: { code: 'SERVER_ERROR', message: 'Gagal memperbarui dosen' } }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const { error } = await withAuth(request);
  if (error) return error;
  const { id } = await params;

  try {
    await prisma.dosen.delete({ where: { id: parseInt(id, 10) } });
    return NextResponse.json({ success: true, message: 'Dosen berhasil dihapus' });
  } catch {
    return NextResponse.json({ success: false, error: { code: 'SERVER_ERROR', message: 'Gagal menghapus dosen' } }, { status: 500 });
  }
}
