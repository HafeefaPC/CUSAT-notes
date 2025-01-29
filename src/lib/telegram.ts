import { StudyMaterial } from '@/types';
import { supabaseAdmin } from '@/lib/supabase-admin';

const TELEGRAM_BOT_TOKEN = process.env.NEXT_PUBLIC_TELEGRAM_BOT_TOKEN!;
const TELEGRAM_GROUP_ID = process.env.NEXT_PUBLIC_TELEGRAM_GROUP_ID!;
const BOT_API_URL = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}`;

// In-memory storage for material statuses (replace with database in production)
const materialStatuses = new Map<string, 'pending' | 'accepted' | 'rejected' | 'deleted'>();

export interface TelegramFile {
  file_id: string;
  file_unique_id: string;
  file_size: number;
  file_path?: string;
}

export async function getFilesFromGroup(): Promise<StudyMaterial[]> {
  try {
    console.log('Fetching messages from Telegram...');
    
    const response = await fetch(
      `${BOT_API_URL}/getUpdates?chat_id=${TELEGRAM_GROUP_ID}&limit=100`,
      { 
        cache: 'no-store',
        headers: {
          'Content-Type': 'application/json',
        }
      }
    );
    
    const data = await response.json();
    console.log('Telegram Response:', data);

    if (!data.ok) {
      console.error('Telegram API Error:', data);
      return [];
    }

    // Process new materials from Telegram
    for (const update of data.result) {
      if (update.message?.document) {
        const doc = update.message.document;
        const caption = update.message.caption || doc.file_name || 'Untitled';
        
        try {
          // Check if material already exists
          const { data: existing } = await supabaseAdmin
            .from('materials')
            .select('telegram_file_id')
            .eq('telegram_file_id', doc.file_unique_id)
            .single();

          if (existing) continue;

          // Parse caption for metadata
          let semester = 'Unknown';
          let department = 'Unknown';
          let subject = 'Unknown';
          let type = 'notes';

          if (caption.includes('_')) {
            const parts = caption.split('_').map((part: string) => part.trim());
            semester = parts[0] || 'Unknown';
            department = parts[1] || 'Unknown';
            subject = parts[2] || 'Unknown';
            type = (parts[3] || '').toLowerCase().includes('note') ? 'notes' : 'question_paper';
          }

          console.log('Processing document:', {
            id: doc.file_unique_id,
            title: doc.file_name,
            metadata: { semester, department, subject, type }
          });

          // Insert new material into Supabase
          const { error: insertError } = await supabaseAdmin
            .from('materials')
            .insert({
              telegram_file_id: doc.file_unique_id,
              telegram_message_id: update.message.message_id.toString(),
              title: doc.file_name || caption,
              type,
              department,
              semester,
              subject,
              uploaded_by: update.message.from?.username || 'Anonymous',
              upload_date: new Date(update.message.date * 1000).toISOString(),
              status: 'pending'
            });

          if (insertError) {
            console.error('Error inserting material:', insertError);
          }
        } catch (error) {
          console.error('Error processing material:', error);
          continue;
        }
      }
    }
    
    // Return all non-deleted materials from Supabase
    const { data: materials, error } = await supabaseAdmin
      .from('materials')
      .select('*')
      .neq('status', 'deleted')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase fetch error:', error);
      return [];
    }

    console.log('Fetched materials:', materials);

    return materials.map(m => ({
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
    }));
  } catch (error) {
    console.error('Error in getFilesFromGroup:', error);
    return [];
  }
}

export async function getFileFromTelegram(fileId: string): Promise<string> {
  try {
    console.log('Getting file path for:', fileId);
    const response = await fetch(`${BOT_API_URL}/getFile?file_id=${fileId}`);
    const data = await response.json();
    
    console.log('GetFile Response:', data);
    
    if (!data.ok) throw new Error('Failed to get file path');
    
    const filePath = data.result.file_path;
    return `https://api.telegram.org/file/bot${TELEGRAM_BOT_TOKEN}/${filePath}`;
  } catch (error) {
    console.error('Error getting file:', error);
    throw error;
  }
}

// Add this function to test bot commands
export async function sendTestMessage() {
  try {
    const response = await fetch(
      `${BOT_API_URL}/sendMessage`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: TELEGRAM_GROUP_ID,
          text: 'Test message from bot'
        })
      }
    );
    const data = await response.json();
    console.log('Send Message Response:', data);
    return data;
  } catch (error) {
    console.error('Error sending message:', error);
    return null;
  }
}

export async function updateMaterialStatus(
  fileId: string,
  status: 'accepted' | 'rejected' | 'deleted'
): Promise<boolean> {
  try {
    materialStatuses.set(fileId, status);
    return true;
  } catch {
    return false;
  }
}

export async function deleteMaterialFromGroup(messageId: string): Promise<boolean> {
  try {
    const response = await fetch(
      `${BOT_API_URL}/deleteMessage`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: TELEGRAM_GROUP_ID,
          message_id: parseInt(messageId)
        })
      }
    );

    const data = await response.json();
    return data.ok;
  } catch {
    return false;
  }
} 