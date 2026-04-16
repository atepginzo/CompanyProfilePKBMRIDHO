import { NextResponse } from 'next/server';
import { verifyToken, getTokenFromRequest } from './auth';
import prisma from './prisma';

export async function withAuth(request) {
  const token = getTokenFromRequest(request);

  if (!token) {
    return {
      error: NextResponse.json(
        { success: false, error: { code: 'UNAUTHORIZED', message: 'Token tidak ditemukan' } },
        { status: 401 }
      ),
      user: null,
    };
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return {
      error: NextResponse.json(
        { success: false, error: { code: 'INVALID_TOKEN', message: 'Token tidak valid atau sudah kedaluwarsa' } },
        { status: 401 }
      ),
      user: null,
    };
  }

  // MOCK USER karena tidak ada PostgreSQL server berjalan
  if (decoded.username === 'admin') {
    return { 
      error: null, 
      user: { id: 1, username: 'admin', namaLengkap: 'Super Admin', email: 'admin@institusi.ac.id', avatar: null, isActive: true } 
    };
  }

  return {
    error: NextResponse.json(
      { success: false, error: { code: 'USER_NOT_FOUND', message: 'User tidak ditemukan atau tidak aktif' } },
      { status: 401 }
    ),
    user: null,
  };
}
