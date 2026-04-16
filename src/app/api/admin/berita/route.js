import { NextResponse } from 'next/server';
import { withAuth } from '@/lib/middleware';
import prisma from '@/lib/prisma';
import { generateUniqueSlug } from '@/lib/slug';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function GET(request) {
  const { error } = await withAuth(request);
  if (error) return error;

  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page')) || 1;
  const limit = parseInt(searchParams.get('limit')) || 10;
  const search = searchParams.get('search') || '';
  const status = searchParams.get('status') || '';
  const kategoriId = searchParams.get('kategori_id') || '';

  const where = {};
  if (search) where.judul = { contains: search, mode: 'insensitive' };
  if (status) where.status = status;
  if (kategoriId) where.kategoriId = parseInt(kategoriId);

  try {
    const [data, total] = await Promise.all([
      prisma.berita.findMany({
        where,
        include: { kategori: true, creator: { select: { namaLengkap: true } } },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.berita.count({ where }),
    ]);

    return NextResponse.json({ success: true, data, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } });
  } catch (err) {
    console.error('Berita list error:', err);
    return NextResponse.json({ success: false, error: { code: 'SERVER_ERROR', message: 'Gagal mengambil data berita' } }, { status: 500 });
  }
}

export async function POST(request) {
  const { error, user } = await withAuth(request);
  if (error) return error;

  try {
    const formData = await request.formData();
    const judul = formData.get('judul');
    const ringkasan = formData.get('ringkasan');
    const konten = formData.get('konten');
    const kategoriId = parseInt(formData.get('kategori_id'));
    const penulis = formData.get('penulis') || user.namaLengkap;
    const status = formData.get('status') || 'draft';
    const tanggalPublikasi = formData.get('tanggal_publikasi') || null;
    const file = formData.get('thumbnail');

    if (!judul || judul.length < 10) {
      return NextResponse.json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'Judul wajib diisi (min 10 karakter)' } }, { status: 400 });
    }
    if (!ringkasan) {
      return NextResponse.json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'Ringkasan wajib diisi' } }, { status: 400 });
    }
    if (!konten || konten.length < 50) {
      return NextResponse.json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'Konten wajib diisi (min 50 karakter)' } }, { status: 400 });
    }

    let thumbnailPath = '';
    if (file && file.size > 0) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const ext = file.name.split('.').pop().toLowerCase();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`;
      const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'berita');
      await mkdir(uploadDir, { recursive: true });
      await writeFile(path.join(uploadDir, fileName), buffer);
      thumbnailPath = `/uploads/berita/${fileName}`;
    }

    const slug = await generateUniqueSlug(judul, prisma.berita, prisma);

    const berita = await prisma.berita.create({
      data: {
        judul,
        slug,
        ringkasan,
        konten,
        thumbnail: thumbnailPath || null,
        kategoriId,
        penulis,
        status,
        tanggalPublikasi: tanggalPublikasi ? new Date(tanggalPublikasi) : status === 'published' ? new Date() : null,
        createdBy: user.id,
      },
      include: { kategori: true },
    });

    return NextResponse.json({ success: true, data: berita, message: 'Berita berhasil ditambahkan' }, { status: 201 });
  } catch (err) {
    console.error('Berita create error:', err);
    return NextResponse.json({ success: false, error: { code: 'SERVER_ERROR', message: 'Gagal menambahkan berita' } }, { status: 500 });
  }
}
