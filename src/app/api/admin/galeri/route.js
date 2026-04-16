import { NextResponse } from 'next/server';
import { withAuth } from '@/lib/middleware';
import prisma from '@/lib/prisma';
import { generateUniqueSlug } from '@/lib/slug';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function GET(request) {
  const { error, user } = await withAuth(request);
  if (error) return error;

  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page')) || 1;
  const limit = parseInt(searchParams.get('limit')) || 10;
  const search = searchParams.get('search') || '';
  const status = searchParams.get('status') || '';
  const kategoriId = searchParams.get('kategori_id') || '';
  const sortBy = searchParams.get('sort') || 'createdAt';
  const order = searchParams.get('order') || 'desc';

  const where = {};
  if (search) where.judulFoto = { contains: search, mode: 'insensitive' };
  if (status) where.status = status;
  if (kategoriId) where.kategoriId = parseInt(kategoriId);

  try {
    const [data, total] = await Promise.all([
      prisma.galeri.findMany({
        where,
        include: { kategori: true, creator: { select: { namaLengkap: true } } },
        orderBy: { [sortBy]: order },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.galeri.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (err) {
    console.error('Galeri list error:', err);
    return NextResponse.json({ success: false, error: { code: 'SERVER_ERROR', message: 'Gagal mengambil data galeri' } }, { status: 500 });
  }
}

export async function POST(request) {
  const { error, user } = await withAuth(request);
  if (error) return error;

  try {
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
    if (!kategoriId) {
      return NextResponse.json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'Kategori wajib dipilih' } }, { status: 400 });
    }

    let fotoPath = '';
    if (file && file.size > 0) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const ext = file.name.split('.').pop().toLowerCase();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`;
      const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'galeri');
      await mkdir(uploadDir, { recursive: true });
      await writeFile(path.join(uploadDir, fileName), buffer);
      fotoPath = `/uploads/galeri/${fileName}`;
    }

    if (!fotoPath) {
      return NextResponse.json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'Foto wajib diupload' } }, { status: 400 });
    }

    const slug = await generateUniqueSlug(judulFoto, prisma.galeri, prisma);

    const galeri = await prisma.galeri.create({
      data: {
        judulFoto,
        slug,
        keterangan,
        kategoriId,
        linkGdrive: linkGdrive || null,
        foto: fotoPath,
        tanggalKegiatan: tanggalKegiatan ? new Date(tanggalKegiatan) : null,
        status,
        createdBy: user.id,
      },
      include: { kategori: true },
    });

    return NextResponse.json({ success: true, data: galeri, message: 'Galeri berhasil ditambahkan' }, { status: 201 });
  } catch (err) {
    console.error('Galeri create error:', err);
    return NextResponse.json({ success: false, error: { code: 'SERVER_ERROR', message: 'Gagal menambahkan galeri' } }, { status: 500 });
  }
}
