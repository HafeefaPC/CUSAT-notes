import { NextRequest, NextResponse } from 'next/server';
import { getAuthToken, verifyAuth } from '@/lib/auth';
import { deleteMaterialFromGroup } from '@/lib/telegram';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function POST(request: NextRequest) {
  try {
    // Authentication
    const token = await getAuthToken();
    const user = token ? await verifyAuth(token) : null;
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Extract route parameters from URL
    const pathSegments = request.nextUrl.pathname.split('/');
    const id = pathSegments[4]; // [api, admin, materials, :id, :action]
    const action = pathSegments[5];

    // Validate action type
    if (!['accept', 'reject', 'delete'].includes(action)) {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    // Extract messageId from request body
    const { messageId } = await request.json();

    console.log('Processing action:', { id, action, messageId });

    // Handle different actions
    switch (action) {
      case 'accept':
      case 'reject': {
        const status = action === 'accept' ? 'accepted' : 'rejected';
        const { error } = await supabaseAdmin
          .from('materials')
          .update({ status })
          .eq('telegram_file_id', id);

        if (error) throw new Error(`Database update failed: ${error.message}`);
        break;
      }

      case 'delete': {
        const deleted = await deleteMaterialFromGroup(messageId);
        if (!deleted) throw new Error('Telegram deletion failed');

        const { error } = await supabaseAdmin
          .from('materials')
          .update({ status: 'deleted' })
          .eq('telegram_file_id', id);

        if (error) throw new Error(`Deletion status update failed: ${error.message}`);
        break;
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Action handler error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Action failed' },
      { status: 500 }
    );
  }
}