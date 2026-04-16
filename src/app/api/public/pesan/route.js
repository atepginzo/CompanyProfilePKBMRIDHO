import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function getClientIp(request) {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'unknown'
  );
}

export async function POST(request) {
  try {
    const body = await request.json();
    const nama = String(body.nama || '').trim();
    const email = String(body.email || '').trim();
    const subjek = String(body.subjek || '').trim();
    const pesan = String(body.pesan || '').trim();

    if (nama.length < 3) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Nama minimal 3 karakter',
          },
        },
        { status: 400 }
      );
    }

    if (!EMAIL_PATTERN.test(email)) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Format email tidak valid',
          },
        },
        { status: 400 }
      );
    }

    if (subjek.length < 5) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Subjek minimal 5 karakter',
          },
        },
        { status: 400 }
      );
    }

    if (pesan.length < 10) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Pesan minimal 10 karakter',
          },
        },
        { status: 400 }
      );
    }

    await prisma.pesanMasuk.create({
      data: {
        namaPengirim: nama,
        emailPengirim: email,
        subjek,
        pesan,
        ipAddress: getClientIp(request),
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Pesan berhasil dikirim. Tim kami akan segera menghubungi Anda.',
    });
  } catch (error) {
    console.error('Public pesan create error:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'SERVER_ERROR',
          message: 'Gagal mengirim pesan',
        },
      },
      { status: 500 }
    );
  }
}
