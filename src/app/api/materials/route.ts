import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
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
      fileUrl: m.telegram_file_id,
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