import { getFileFromTelegram } from '@/lib/telegram';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const fileId = request.nextUrl.searchParams.get('fileId');

    if (!fileId) {
      return NextResponse.json(
        { error: 'File ID is required' }, 
        { status: 400 }
      );
    }

    const fileUrl = await getFileFromTelegram(fileId);
    
    if (!fileUrl) {
      throw new Error('Failed to get file URL');
    }

    return NextResponse.json({ url: fileUrl });
  } catch (error) {
    console.error('Error in download route:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to get file URL' },
      { status: 500 }
    );
  }
} 