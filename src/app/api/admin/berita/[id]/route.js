import { NextResponse } from 'next/server';
import { withAuth } from '@/lib/middleware';
import prisma from '@/lib/prisma';
import { generateUniqueSlug } from '@/lib/slug';
import { writeFile, mkdir, unlink } from 'fs/promises';
import path from 'path';

export async function GET(request, { params }) {
  const { error } = await withAuth(request);
  if (error) return error;

  const { id } = await params;
  try {
    const berita = await prisma.berita.findUnique({
      where: { id: parseInt(id) },
      include: { kategori: true, creator: { select: { namaLengkap: true } } },
    });
    if (!berita) {
      return NextResponse.json({ success: false, error: { code: 'NOT_FOUND', message: 'Berita tidak ditemukan' } }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: berita });
  } catch (err) {
    return NextResponse.json({ success: false, error: { code: 'SERVER_ERROR', message: 'Gagal mengambil data berita' } }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  const { error, user } = await withAuth(request);
  if (error) return error;

  const { id } = await params;
  const idInt = parseInt(id);

  try {
    const existing = await prisma.berita.findUnique({ where: { id: idInt } });
    if (!existing) {
      return NextResponse.json({ success: false, error: { code: 'NOT_FOUND', message: 'Berita tidak ditemukan' } }, { status: 404 });
    }

    const formData = await request.formData();
    const judul = formData.get('judul');
    const ringkasan = formData.get('ringkasan');
    const konten = formData.get('konten');
    const kategoriId = parseInt(formData.get('kategori_id'));
    const penulis = formData.get('penulis') || user.namaLengkap;
    const status = formData.get('status') || 'draft';
    const tanggalPublikasi = formData.get('tanggal_publikasi');
    const file = formData.get('thumbnail');

    if (!judul || judul.length < 10) {
      return NextResponse.json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'Judul wajib diisi (min 10 karakter)' } }, { status: 400 });
    }

    let thumbnailPath = existing.thumbnail;
    if (file && file.size > 0) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const ext = file.name.split('.').pop().toLowerCase();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`;
      const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'berita');
      await mkdir(uploadDir, { recursive: true });
      await writeFile(path.join(uploadDir, fileName), buffer);
      thumbnailPath = `/uploads/berita/${fileName}`;

      if (existing.thumbnail) {
        try { await unlink(path.join(process.cwd(), 'public', existing.thumbnail)); } catch {}
      }
    }

    const slug = judul !== existing.judul
      ? await generateUniqueSlug(judul, prisma.berita, prisma, idInt)
      : existing.slug;

    const berita = await prisma.berita.update({
      where: { id: idInt },
      data: {
        judul, slug, ringkasan, konten,
        thumbnail: thumbnailPath,
        kategoriId, penulis, status,
        tanggalPublikasi: tanggalPublikasi ? new Date(tanggalPublikasi) : existing.tanggalPublikasi,
      },
      include: { kategori: true },
    });

    return NextResponse.json({ success: true, data: berita, message: 'Berita berhasil diperbarui' });
  } catch (err) {
    console.error('Berita update error:', err);
    return NextResponse.json({ success: false, error: { code: 'SERVER_ERROR', message: 'Gagal memperbarui berita' } }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const { error } = await withAuth(request);
  if (error) return error;

  const { id } = await params;
  try {
    const berita = await prisma.berita.findUnique({ where: { id: parseInt(id) } });
    if (!berita) {
      return NextResponse.json({ success: false, error: { code: 'NOT_FOUND', message: 'Berita tidak ditemukan' } }, { status: 404 });
    }

    if (berita.thumbnail) {
      try { await unlink(path.join(process.cwd(), 'public', berita.thumbnail)); } catch {}
    }

    await prisma.berita.delete({ where: { id: parseInt(id) } });
    return NextResponse.json({ success: true, message: 'Berita berhasil dihapus' });
  } catch (err) {
    console.error('Berita delete error:', err);
    return NextResponse.json({ success: false, error: { code: 'SERVER_ERROR', message: 'Gagal menghapus berita' } }, { status: 500 });
  }
}
