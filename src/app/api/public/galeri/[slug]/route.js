import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(_request, { params }) {
  const { slug } = await params;

  try {
    const data = await prisma.galeri.findFirst({
      where: {
        slug,
        status: 'published',
      },
      select: {
        id: true,
        judulFoto: true,
        slug: true,
        keterangan: true,
        foto: true,
        linkGdrive: true,
        tanggalKegiatan: true,
        createdAt: true,
        kategori: {
          select: {
            nama: true,
            slug: true,
          },
        },
      },
    });

    if (!data) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Galeri tidak ditemukan',
          },
        },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Public galeri detail error:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'SERVER_ERROR',
          message: 'Gagal mengambil detail galeri',
        },
      },
      { status: 500 }
    );
  }
}
