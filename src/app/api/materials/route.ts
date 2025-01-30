import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { getFilesFromGroup } from '@/lib/telegram';

export async function GET() {
  try {
    // First fetch new files from Telegram
    await getFilesFromGroup();

    // Then get materials from Supabase
    const { data: materials, error } = await supabase
      .from('materials')
      .select('*')
      .eq('status', 'accepted')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json(materials.map(m => ({
      id: m.telegram_file_id,
      title: m.title,
      type: m.type,
      department: m.department,
      semester: m.semester,
      subject: m.subject,
      uploadedBy: m.uploaded_by,
      uploadDate: m.upload_date,
      fileUrl: m.file_id || m.telegram_file_id, // Use file_id if available
      messageId: m.telegram_message_id,
      slug: {
        dept: m.department.toLowerCase(),
        sem: m.semester.toLowerCase(),
        sub: m.subject.toLowerCase()
      }
    })));
  } catch (error) {
    console.error('Error fetching materials:', error);
    return NextResponse.json(
      { error: 'Failed to fetch materials' },
      { status: 500 }
    );
  }
} 