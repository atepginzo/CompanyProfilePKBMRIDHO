import { NextResponse } from 'next/server';
import { withAuth } from '@/lib/middleware';
import prisma from '@/lib/prisma';

export async function GET(request) {
  const { error } = await withAuth(request);
  if (error) return error;

  try {
    const data = await prisma.kategoriGaleri.findMany({
      orderBy: { nama: 'asc' },
      select: { id: true, nama: true, slug: true },
    });

    return NextResponse.json({ success: true, data });
  } catch {
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: 'Gagal mengambil kategori galeri' } },
      { status: 500 }
    );
  }
}
