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
    const galeri = await prisma.galeri.findUnique({
      where: { id: parseInt(id) },
      include: { kategori: true, creator: { select: { namaLengkap: true } } },
    });

    if (!galeri) {
      return NextResponse.json({ success: false, error: { code: 'NOT_FOUND', message: 'Galeri tidak ditemukan' } }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: galeri });
  } catch (err) {
    return NextResponse.json({ success: false, error: { code: 'SERVER_ERROR', message: 'Gagal mengambil data galeri' } }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  const { error, user } = await withAuth(request);
  if (error) return error;

  const { id } = await params;
  const idInt = parseInt(id);

  try {
    const existing = await prisma.galeri.findUnique({ where: { id: idInt } });
    if (!existing) {
      return NextResponse.json({ success: false, error: { code: 'NOT_FOUND', message: 'Galeri tidak ditemukan' } }, { status: 404 });
    }

    const formData = await request.formData();
    const judulFoto = formData.get('judul_foto');
    const keterangan = formData.get('keterangan') || '';
    const kategoriId = parseInt(formData.get('kategori_id'));
    const linkGdrive = formData.get('link_gdrive') || '';
    const tanggalKegiatan = formData.get('tanggal_kegiatan') || null;
    const status = formData.get('status') || 'draft';
    const file = formData.get('foto');

    if (!judulFoto || judulFoto.length < 5) {
      return NextResponse.json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'Judul foto wajib diisi (min 5 karakter)' } }, { status: 400 });
    }

    let fotoPath = existing.foto;
    if (file && file.size > 0) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const ext = file.name.split('.').pop().toLowerCase();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`;
      const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'galeri');
      await mkdir(uploadDir, { recursive: true });
      await writeFile(path.join(uploadDir, fileName), buffer);
      fotoPath = `/uploads/galeri/${fileName}`;

      // Delete old file
      if (existing.foto) {
        try { await unlink(path.join(process.cwd(), 'public', existing.foto)); } catch {}
      }
    }

    const slug = judulFoto !== existing.judulFoto
      ? await generateUniqueSlug(judulFoto, prisma.galeri, prisma, idInt)
      : existing.slug;

    const galeri = await prisma.galeri.update({
      where: { id: idInt },
      data: {
        judulFoto,
        slug,
        keterangan,
        kategoriId,
        linkGdrive: linkGdrive || null,
        foto: fotoPath,
        tanggalKegiatan: tanggalKegiatan ? new Date(tanggalKegiatan) : null,
        status,
      },
      include: { kategori: true },
    });

    return NextResponse.json({ success: true, data: galeri, message: 'Galeri berhasil diperbarui' });
  } catch (err) {
    console.error('Galeri update error:', err);
    return NextResponse.json({ success: false, error: { code: 'SERVER_ERROR', message: 'Gagal memperbarui galeri' } }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const { error } = await withAuth(request);
  if (error) return error;

  const { id } = await params;
  try {
    const galeri = await prisma.galeri.findUnique({ where: { id: parseInt(id) } });
    if (!galeri) {
      return NextResponse.json({ success: false, error: { code: 'NOT_FOUND', message: 'Galeri tidak ditemukan' } }, { status: 404 });
    }

    // Delete file
    if (galeri.foto) {
      try { await unlink(path.join(process.cwd(), 'public', galeri.foto)); } catch {}
    }

    await prisma.galeri.delete({ where: { id: parseInt(id) } });
    return NextResponse.json({ success: true, message: 'Galeri berhasil dihapus' });
  } catch (err) {
    console.error('Galeri delete error:', err);
    return NextResponse.json({ success: false, error: { code: 'SERVER_ERROR', message: 'Gagal menghapus galeri' } }, { status: 500 });
  }
}
