import { NextResponse } from 'next/server';

const TELEGRAM_BOT_TOKEN = process.env.NEXT_PUBLIC_TELEGRAM_BOT_TOKEN!;

export const runtime = 'edge';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ path: string[] }> }
) {
  if (!TELEGRAM_BOT_TOKEN) {
    return NextResponse.json(
      { error: 'Telegram bot token not configured' },
      { status: 500 }
    );
  }

  try {
    // Wait for params to resolve
    const resolvedParams = await params;
    const filePath = resolvedParams.path.join('/');
    
    if (!filePath) {
      return NextResponse.json(
        { error: 'Invalid file path' },
        { status: 400 }
      );
    }

    const telegramUrl = `https://api.telegram.org/file/bot${TELEGRAM_BOT_TOKEN}/${filePath}`;

    const response = await fetch(telegramUrl, {
      next: { revalidate: 3600 }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch file: ${response.statusText}`);
    }

    const contentType = response.headers.get('content-type') || 'application/octet-stream';
    const contentLength = response.headers.get('content-length');

    const headers = new Headers({
      'Content-Type': contentType,
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'public, max-age=3600',
    });

    if (contentLength) {
      headers.set('Content-Length', contentLength);
    }

    return new NextResponse(response.body, {
      status: 200,
      headers,
      statusText: 'OK'
    });

  } catch (error) {
    console.error('Proxy error:', error);
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Failed to proxy file' 
      },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400',
    },
  });
}