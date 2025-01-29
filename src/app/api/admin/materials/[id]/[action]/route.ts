import { NextRequest, NextResponse } from 'next/server';
import { getAuthToken, verifyAuth } from '@/lib/auth';
import { deleteMaterialFromGroup } from '@/lib/telegram';
import { supabaseAdmin } from '@/lib/supabase-admin';

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

    console.log('Processing action:', { id, action, messageId });

    switch (action) {
      case 'accept':
      case 'reject': {
        // Convert action to correct status
        const status = action === 'accept' ? 'accepted' : 'rejected';
        
        const { error } = await supabaseAdmin
          .from('materials')
          .update({ status })
          .eq('telegram_file_id', id);

        if (error) {
          console.error('Supabase update error:', error);
          throw error;
        }
        break;
      }
      case 'delete': {
        const deleted = await deleteMaterialFromGroup(messageId);
        if (deleted) {
          const { error } = await supabaseAdmin
            .from('materials')
            .update({ status: 'deleted' })
            .eq('telegram_file_id', id);

          if (error) {
            console.error('Supabase delete error:', error);
            throw error;
          }
        } else {
          throw new Error('Failed to delete from Telegram');
        }
        break;
      }
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Action handler error:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Action failed' 
    }, { status: 500 });
  }
} 