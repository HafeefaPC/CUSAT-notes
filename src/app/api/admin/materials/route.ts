import { NextResponse } from 'next/server';
import { getFilesFromGroup } from '@/lib/telegram';

export async function GET() {
  try {
    const materials = await getFilesFromGroup();
    return NextResponse.json(materials);
  } catch (error) {
    console.error('Error fetching materials:', error);
    return NextResponse.json(
      { error: 'Failed to fetch materials' },
      { status: 500 }
    );
  }
} 