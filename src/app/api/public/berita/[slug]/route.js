import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(_request, { params }) {
  const { slug } = await params;

  try {
    const existing = await prisma.berita.findFirst({
      where: {
        slug,
        status: 'published',
      },
      select: {
        id: true,
      },
    });

    if (!existing) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Berita tidak ditemukan',
          },
        },
        { status: 404 }
      );
    }

    const data = await prisma.berita.update({
      where: { id: existing.id },
      data: {
        viewsCount: {
          increment: 1,
        },
      },
      select: {
        id: true,
        judul: true,
        slug: true,
        ringkasan: true,
        konten: true,
        thumbnail: true,
        penulis: true,
        viewsCount: true,
        tanggalPublikasi: true,
        createdAt: true,
        kategori: {
          select: {
            nama: true,
            slug: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error('Public berita detail error:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'SERVER_ERROR',
          message: 'Gagal mengambil detail berita',
        },
      },
      { status: 500 }
    );
  }
}
