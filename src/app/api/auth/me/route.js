import { NextResponse } from 'next/server';
import { withAuth } from '@/lib/middleware';

export async function GET(request) {
  const { error, user } = await withAuth(request);
  if (error) return error;

  return NextResponse.json({ success: true, data: user });
}
