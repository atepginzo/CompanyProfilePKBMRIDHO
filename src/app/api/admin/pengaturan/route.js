import { NextResponse } from 'next/server';
import { withAuth } from '@/lib/middleware';
import prisma from '@/lib/prisma';

// GET - List semua pengaturan, grouped by grup
export async function GET(request) {
  const { error } = await withAuth(request);
  if (error) return error;

  try {
    const data = await prisma.pengaturanSitus.findMany({
      orderBy: [{ grup: 'asc' }, { kunci: 'asc' }],
    });

    // Group by grup
    const grouped = {};
    for (const item of data) {
      const g = item.grup || 'lainnya';
      if (!grouped[g]) grouped[g] = [];
      grouped[g].push(item);
    }

    return NextResponse.json({ success: true, data, grouped });
  } catch (err) {
    console.error('Admin pengaturan list error:', err);
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: 'Gagal memuat pengaturan' } },
      { status: 500 }
    );
  }
}

// PUT - Batch update pengaturan
export async function PUT(request) {
  const { error } = await withAuth(request);
  if (error) return error;

  try {
    const body = await request.json();
    const { settings } = body; // Expect: { settings: [{ kunci: 'key', nilai: 'value' }, ...] }

    if (!Array.isArray(settings)) {
      return NextResponse.json(
        { success: false, error: { code: 'VALIDATION_ERROR', message: 'Format data tidak valid' } },
        { status: 400 }
      );
    }

    // Batch upsert
    const results = await Promise.all(
      settings.map((item) =>
        prisma.pengaturanSitus.upsert({
          where: { kunci: item.kunci },
          update: { nilai: item.nilai || '' },
          create: {
            kunci: item.kunci,
            nilai: item.nilai || '',
            tipe: item.tipe || 'text',
            grup: item.grup || 'umum',
          },
        })
      )
    );

    return NextResponse.json({
      success: true,
      message: `${results.length} pengaturan berhasil diperbarui`,
    });
  } catch (err) {
    console.error('Admin pengaturan update error:', err);
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: 'Gagal menyimpan pengaturan' } },
      { status: 500 }
    );
  }
}
