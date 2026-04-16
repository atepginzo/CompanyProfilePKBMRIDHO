import { NextResponse } from 'next/server';
import { withAuth } from '@/lib/middleware';
import prisma from '@/lib/prisma';
import { generateUniqueSlug } from '@/lib/slug';

export async function GET(request, { params }) {
  const { error } = await withAuth(request);
  if (error) return error;
  const { id } = await params;

  try {
    const data = await prisma.pengumuman.findUnique({ where: { id: parseInt(id, 10) } });
    if (!data) return NextResponse.json({ success: false, error: { code: 'NOT_FOUND', message: 'Pengumuman tidak ditemukan' } }, { status: 404 });
    return NextResponse.json({ success: true, data });
  } catch {
    return NextResponse.json({ success: false, error: { code: 'SERVER_ERROR', message: 'Gagal mengambil data pengumuman' } }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  const { error } = await withAuth(request);
  if (error) return error;
  const { id } = await params;

  try {
    const existing = await prisma.pengumuman.findUnique({ where: { id: parseInt(id, 10) } });
    if (!existing) return NextResponse.json({ success: false, error: { code: 'NOT_FOUND', message: 'Pengumuman tidak ditemukan' } }, { status: 404 });

    const body = await request.json();
    const judul = (body.judul || '').trim();
    const konten = (body.konten || '').trim();

    if (judul.length < 10) {
      return NextResponse.json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'Judul minimal 10 karakter' } }, { status: 400 });
    }
    if (!konten) {
      return NextResponse.json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'Konten wajib diisi' } }, { status: 400 });
    }

    const slug = judul !== existing.judul ? await generateUniqueSlug(judul, prisma.pengumuman, prisma, parseInt(id, 10)) : existing.slug;

    const data = await prisma.pengumuman.update({
      where: { id: parseInt(id, 10) },
      data: {
        judul,
        slug,
        konten,
        prioritas: body.prioritas || 'normal',
        tanggalBerlakuMulai: body.tanggal_berlaku_mulai ? new Date(body.tanggal_berlaku_mulai) : null,
        tanggalBerlakuSelesai: body.tanggal_berlaku_selesai ? new Date(body.tanggal_berlaku_selesai) : null,
        status: body.status === 'published' ? 'published' : 'draft',
      },
    });

    return NextResponse.json({ success: true, data, message: 'Pengumuman berhasil diperbarui' });
  } catch {
    return NextResponse.json({ success: false, error: { code: 'SERVER_ERROR', message: 'Gagal memperbarui pengumuman' } }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const { error } = await withAuth(request);
  if (error) return error;
  const { id } = await params;

  try {
    await prisma.pengumuman.delete({ where: { id: parseInt(id, 10) } });
    return NextResponse.json({ success: true, message: 'Pengumuman berhasil dihapus' });
  } catch {
    return NextResponse.json({ success: false, error: { code: 'SERVER_ERROR', message: 'Gagal menghapus pengumuman' } }, { status: 500 });
  }
}
