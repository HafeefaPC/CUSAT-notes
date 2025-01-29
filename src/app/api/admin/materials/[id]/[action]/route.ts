import { NextRequest, NextResponse } from 'next/server';
import { getAuthToken, verifyAuth } from '@/lib/auth';
import { updateMaterialStatus, deleteMaterialFromGroup } from '@/lib/telegram';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string; action: string } }
) {
  try {
    const token = await getAuthToken();
    const user = token ? await verifyAuth(token) : null;

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id, action } = params;
    const body = await request.json();
    const { messageId } = body;

    let success = false;

    switch (action) {
      case 'accept':
      case 'reject':
        success = await updateMaterialStatus(id, action);
        if (!success) {
          throw new Error(`Failed to ${action} material`);
        }
        break;
      case 'delete':
        const deleted = await deleteMaterialFromGroup(messageId);
        if (deleted) {
          success = await updateMaterialStatus(id, 'deleted');
          if (!success) {
            throw new Error('Failed to update status after deletion');
          }
        } else {
          throw new Error('Failed to delete from Telegram');
        }
        break;
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Action failed' 
    }, { status: 500 });
  }
} 