import { getFileFromTelegram } from '@/lib/telegram';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const fileId = request.nextUrl.searchParams.get('fileId');
  
  if (!fileId) {
    return NextResponse.json({ error: 'File ID is required' }, { status: 400 });
  }

  try {
    const downloadUrl = await getFileFromTelegram(fileId);
    return NextResponse.json({ url: downloadUrl });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to get file' }, { status: 500 });
  }
} 