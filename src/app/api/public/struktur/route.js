import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const data = await prisma.strukturOrganisasi.findMany({
      where: { status: 'aktif' },
      orderBy: [{ level: 'asc' }, { urutan: 'asc' }],
      select: {
        id: true,
        namaPejabat: true,
        jabatan: true,
        foto: true,
        level: true,
        parentId: true,
        urutan: true,
        periode: true,
      },
    });

    // Build tree structure
    const map = new Map();
    const roots = [];

    for (const item of data) {
      map.set(item.id, { ...item, children: [] });
    }

    for (const item of data) {
      const node = map.get(item.id);
      if (item.parentId && map.has(item.parentId)) {
        map.get(item.parentId).children.push(node);
      } else {
        roots.push(node);
      }
    }

    return NextResponse.json({
      success: true,
      data: roots,
      flat: data,
    });
  } catch (error) {
    console.error('Public struktur error:', error);
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: 'Gagal memuat struktur organisasi' } },
      { status: 500 }
    );
  }
}
