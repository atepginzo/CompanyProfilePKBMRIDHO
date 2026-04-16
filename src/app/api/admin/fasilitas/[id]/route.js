import { NextResponse } from 'next/server';
import { withAuth } from '@/lib/middleware';
import prisma from '@/lib/prisma';

export async function GET(request, { params }) {
  const { error } = await withAuth(request);
  if (error) return error;

  const { id } = await params;

  try {
    const fasilitas = await prisma.fasilitas.findUnique({
      where: { id: parseInt(id, 10) },
    });

    if (!fasilitas) {
      return NextResponse.json(
        { success: false, error: { code: 'NOT_FOUND', message: 'Fasilitas tidak ditemukan' } },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: fasilitas });
  } catch {
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: 'Gagal mengambil data fasilitas' } },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  const { error } = await withAuth(request);
  if (error) return error;

  const { id } = await params;

  try {
    const existing = await prisma.fasilitas.findUnique({
      where: { id: parseInt(id, 10) },
    });

    if (!existing) {
      return NextResponse.json(
        { success: false, error: { code: 'NOT_FOUND', message: 'Fasilitas tidak ditemukan' } },
        { status: 404 }
      );
    }

    const body = await request.json();
    const namaFasilitas = (body.nama_fasilitas || '').trim();

    if (namaFasilitas.length < 3) {
      return NextResponse.json(
        {
          success: false,
          error: { code: 'VALIDATION_ERROR', message: 'Nama fasilitas minimal 3 karakter' },
        },
        { status: 400 }
      );
    }

    const fasilitas = await prisma.fasilitas.update({
      where: { id: parseInt(id, 10) },
      data: {
        namaFasilitas,
        deskripsi: (body.deskripsi || '').trim() || null,
        kategori: (body.kategori || '').trim() || null,
        lokasi: (body.lokasi || '').trim() || null,
        urutan: Number.isInteger(body.urutan) ? body.urutan : parseInt(body.urutan || '0', 10) || 0,
        status: body.status === 'nonaktif' ? 'nonaktif' : 'aktif',
      },
    });

    return NextResponse.json({ success: true, data: fasilitas, message: 'Fasilitas berhasil diperbarui' });
  } catch {
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: 'Gagal memperbarui fasilitas' } },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  const { error } = await withAuth(request);
  if (error) return error;

  const { id } = await params;

  try {
    const existing = await prisma.fasilitas.findUnique({
      where: { id: parseInt(id, 10) },
    });

    if (!existing) {
      return NextResponse.json(
        { success: false, error: { code: 'NOT_FOUND', message: 'Fasilitas tidak ditemukan' } },
        { status: 404 }
      );
    }

    await prisma.fasilitas.delete({ where: { id: parseInt(id, 10) } });

    return NextResponse.json({ success: true, message: 'Fasilitas berhasil dihapus' });
  } catch {
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: 'Gagal menghapus fasilitas' } },
      { status: 500 }
    );
  }
}
