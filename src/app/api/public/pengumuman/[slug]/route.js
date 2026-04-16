import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(_request, { params }) {
  const { slug } = await params;

  try {
    const data = await prisma.pengumuman.findFirst({
      where: {
        slug,
        status: 'published',
      },
      select: {
        id: true,
        judul: true,
        slug: true,
        konten: true,
        prioritas: true,
        lampiran: true,
        tanggalBerlakuMulai: true,
        tanggalBerlakuSelesai: true,
        createdAt: true,
      },
    });

    if (!data) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Pengumuman tidak ditemukan',
          },
        },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Public pengumuman detail error:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'SERVER_ERROR',
          message: 'Gagal mengambil detail pengumuman',
        },
      },
      { status: 500 }
    );
  }
}
