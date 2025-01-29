import { NextResponse } from 'next/server';
import { getAuthToken, verifyAuth } from '@/lib/auth';

export async function GET() {
  const token = await getAuthToken();

  if (!token) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  const user = await verifyAuth(token);
  
  if (!user) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  return NextResponse.json({ authenticated: true });
} 