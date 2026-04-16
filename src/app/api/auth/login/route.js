import { NextResponse } from 'next/server';
import { signToken } from '@/lib/auth';

export async function POST(request) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { success: false, error: { code: 'VALIDATION_ERROR', message: 'Username dan password wajib diisi' } },
        { status: 400 }
      );
    }

    // MOCK LOGIN karena tidak ada PostgreSQL server berjalan secara lokal
    if (username === 'admin' && password === 'admin123') {
      const token = signToken({ userId: 1, username: 'admin' });

      const response = NextResponse.json({
        success: true,
        data: { id: 1, username: 'admin', namaLengkap: 'Super Admin', email: 'admin@institusi.ac.id', avatar: null },
        message: 'Login berhasil',
      });

      response.cookies.set('auth_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24, // 24 hours
        path: '/',
      });

      return response;
    }

    return NextResponse.json(
      { success: false, error: { code: 'INVALID_CREDENTIALS', message: 'Username atau password salah' } },
      { status: 401 }
    );
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: 'Terjadi kesalahan pada server' } },
      { status: 500 }
    );
  }
}

