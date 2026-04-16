import { NextResponse } from 'next/server';
import { withAuth } from '@/lib/middleware';
import prisma from '@/lib/prisma';

export async function GET(request, { params }) {
  const { error } = await withAuth(request);
  if (error) return error;
  const { id } = await params;

  try {
    const data = await prisma.pesanMasuk.findUnique({ where: { id: parseInt(id, 10) } });
    if (!data) return NextResponse.json({ success: false, error: { code: 'NOT_FOUND', message: 'Pesan tidak ditemukan' } }, { status: 404 });
    return NextResponse.json({ success: true, data });
  } catch {
    return NextResponse.json({ success: false, error: { code: 'SERVER_ERROR', message: 'Gagal mengambil data pesan' } }, { status: 500 });
  }
}

export async function PATCH(request, { params }) {
  const { error } = await withAuth(request);
  if (error) return error;
  const { id } = await params;

  try {
    const body = await request.json();
    const data = await prisma.pesanMasuk.update({
      where: { id: parseInt(id, 10) },
      data: { isRead: Boolean(body.isRead) },
    });

    return NextResponse.json({ success: true, data, message: 'Status pesan berhasil diperbarui' });
  } catch {
    return NextResponse.json({ success: false, error: { code: 'SERVER_ERROR', message: 'Gagal memperbarui status pesan' } }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const { error } = await withAuth(request);
  if (error) return error;
  const { id } = await params;

  try {
    await prisma.pesanMasuk.delete({ where: { id: parseInt(id, 10) } });
    return NextResponse.json({ success: true, message: 'Pesan berhasil dihapus' });
  } catch {
    return NextResponse.json({ success: false, error: { code: 'SERVER_ERROR', message: 'Gagal menghapus pesan' } }, { status: 500 });
  }
}
