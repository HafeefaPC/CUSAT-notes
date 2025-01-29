import { NextResponse } from 'next/server';
import { getFilesFromGroup } from '@/lib/telegram';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function GET() {
  try {
    // First sync Telegram files to Supabase
    await getFilesFromGroup();
    
    // Then fetch all materials
    const { data: materials, error } = await supabaseAdmin
      .from('materials')
      .select('*')
      .neq('status', 'deleted')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching materials:', error);
      throw error;
    }

    console.log('Found materials:', materials?.length || 0);

    return NextResponse.json(materials?.map(m => ({
      id: m.telegram_file_id,
      title: m.title,
      type: m.type,
      department: m.department,
      semester: m.semester,
      subject: m.subject,
      uploadedBy: m.uploaded_by,
      uploadDate: m.upload_date,
      fileUrl: m.telegram_file_id,
      messageId: m.telegram_message_id,
      status: m.status,
      slug: {
        dept: m.department.toLowerCase(),
        sem: m.semester.toLowerCase(),
        sub: m.subject.toLowerCase()
      }
    })) || []);
  } catch (error) {
    console.error('Error in /api/admin/materials:', error);
    return NextResponse.json({ error: 'Failed to fetch materials' }, { status: 500 });
  }
} 