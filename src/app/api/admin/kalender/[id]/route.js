import { NextResponse } from 'next/server';
import { withAuth } from '@/lib/middleware';
import prisma from '@/lib/prisma';

export async function GET(request, { params }) {
  const { error } = await withAuth(request);
  if (error) return error;
  const { id } = await params;

  try {
    const data = await prisma.kalenderEvent.findUnique({ where: { id: parseInt(id, 10) } });
    if (!data) return NextResponse.json({ success: false, error: { code: 'NOT_FOUND', message: 'Event tidak ditemukan' } }, { status: 404 });
    return NextResponse.json({ success: true, data });
  } catch {
    return NextResponse.json({ success: false, error: { code: 'SERVER_ERROR', message: 'Gagal mengambil data event' } }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  const { error } = await withAuth(request);
  if (error) return error;
  const { id } = await params;

  try {
    const body = await request.json();
    const judulEvent = (body.judul_event || '').trim();

    if (judulEvent.length < 5) {
      return NextResponse.json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'Judul event minimal 5 karakter' } }, { status: 400 });
    }
    if (!body.tanggal_mulai) {
      return NextResponse.json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'Tanggal mulai wajib diisi' } }, { status: 400 });
    }

    const data = await prisma.kalenderEvent.update({
      where: { id: parseInt(id, 10) },
      data: {
        judulEvent,
        deskripsi: (body.deskripsi || '').trim() || null,
        tanggalMulai: new Date(body.tanggal_mulai),
        tanggalSelesai: body.tanggal_selesai ? new Date(body.tanggal_selesai) : null,
        lokasi: (body.lokasi || '').trim() || null,
        jenisEvent: body.jenis_event || 'umum',
        warnaLabel: (body.warna_label || '').trim() || null,
        status: body.status === 'published' ? 'published' : 'draft',
      },
    });

    return NextResponse.json({ success: true, data, message: 'Event berhasil diperbarui' });
  } catch {
    return NextResponse.json({ success: false, error: { code: 'SERVER_ERROR', message: 'Gagal memperbarui event' } }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const { error } = await withAuth(request);
  if (error) return error;
  const { id } = await params;

  try {
    await prisma.kalenderEvent.delete({ where: { id: parseInt(id, 10) } });
    return NextResponse.json({ success: true, message: 'Event berhasil dihapus' });
  } catch {
    return NextResponse.json({ success: false, error: { code: 'SERVER_ERROR', message: 'Gagal menghapus event' } }, { status: 500 });
  }
}
