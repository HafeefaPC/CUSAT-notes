import { getFileFromTelegram } from '@/lib/telegram';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const fileId = searchParams.get('fileId');

    if (!fileId) {
      return NextResponse.json({ error: 'File ID is required' }, { status: 400 });
    }

    const url = await getFileFromTelegram(fileId);
    return NextResponse.json({ url });
  } catch (err) {
    console.error('Error in download route:', err);
    return NextResponse.json({ error: 'Failed to get file' }, { status: 500 });
  }
} 