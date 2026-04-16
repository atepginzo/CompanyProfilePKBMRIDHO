import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const data = await prisma.pengaturanSitus.findMany();

    const settings = {};
    for (const row of data) {
      settings[row.kunci] = row.nilai;
    }

    return NextResponse.json({ success: true, data: settings });
  } catch (err) {
    console.error('Public pengaturan error:', err);
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: 'Gagal memuat pengaturan' } },
      { status: 500 }
    );
  }
}
