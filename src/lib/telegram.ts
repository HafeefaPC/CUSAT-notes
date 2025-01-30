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
    // Fetch updates from Telegram
    const response = await fetch(
      `${BOT_API_URL}/getUpdates?chat_id=${TELEGRAM_GROUP_ID}&limit=100`,
      { 
        cache: 'no-store',
        headers: { 'Content-Type': 'application/json' }
      }
    );
    
    const data = await response.json();
    if (!data.ok || !data.result) {
      throw new Error('Failed to fetch messages from Telegram');
    }

    // Process new materials from Telegram
    for (const update of data.result) {
      if (!update.message?.document) continue;

      const doc = update.message.document;
      const caption = update.message.caption || '';
      
      try {
        // Check if material already exists
        const { data: existing } = await supabaseAdmin
          .from('materials')
          .select('telegram_file_id, file_id')
          .eq('telegram_file_id', doc.file_unique_id)
          .single();

        if (existing) {
          // Update file_id if it's null
          if (!existing.file_id) {
            await supabaseAdmin
              .from('materials')
              .update({ file_id: doc.file_id })
              .eq('telegram_file_id', doc.file_unique_id);
          }
          continue;
        }

        // Parse metadata from caption
        const metadata = parseFileMetadata(caption, doc.file_name || 'Untitled');

        // Insert new material
        const { error: insertError } = await supabaseAdmin
          .from('materials')
          .insert({
            telegram_file_id: doc.file_unique_id,
            file_id: doc.file_id, // Store the file_id for downloads
            telegram_message_id: update.message.message_id.toString(),
            title: doc.file_name || caption,
            type: metadata.type,
            department: metadata.department,
            semester: metadata.semester,
            subject: metadata.subject,
            uploaded_by: update.message.from?.username || 'Anonymous',
            upload_date: new Date(update.message.date * 1000).toISOString(),
            status: 'pending'
          });

        if (insertError) {
          throw new Error(`Failed to insert material: ${insertError.message}`);
        }
      } catch (error) {
        console.error('Error processing material:', error);
        continue;
      }
    }

    // Update existing null file_ids
    const { data: nullFileIds } = await supabaseAdmin
      .from('materials')
      .select('telegram_file_id')
      .is('file_id', null);

    if (nullFileIds?.length) {
      for (const material of nullFileIds) {
        try {
          // Get file info from Telegram
          const response = await fetch(
            `${BOT_API_URL}/getFile?file_id=${material.telegram_file_id}`
          );
          const data = await response.json();
          
          if (data.ok && data.result?.file_id) {
            await supabaseAdmin
              .from('materials')
              .update({ file_id: data.result.file_id })
              .eq('telegram_file_id', material.telegram_file_id);
          }
        } catch (error) {
          console.error('Error updating file_id:', error);
        }
      }
    }

    // Return all materials
    const { data: materials, error } = await supabaseAdmin
      .from('materials')
      .select('*')
      .neq('status', 'deleted')
      .order('created_at', { ascending: false });

    if (error) throw new Error(`Failed to fetch materials: ${error.message}`);

    return materials.map(m => ({
      id: m.telegram_file_id,
      title: m.title,
      type: m.type,
      department: m.department,
      semester: m.semester,
      subject: m.subject,
      uploadedBy: m.uploaded_by,
      uploadDate: m.upload_date,
      fileUrl: m.file_id || m.telegram_file_id, // Use file_id if available, fallback to telegram_file_id
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
    // Validate environment variables
    if (!process.env.NEXT_PUBLIC_TELEGRAM_BOT_TOKEN) {
      throw new Error('Telegram bot token not configured');
    }

    const response = await fetch(
      `https://api.telegram.org/bot${process.env.NEXT_PUBLIC_TELEGRAM_BOT_TOKEN}/getFile?file_id=${fileId}`,
      {
        headers: { 'Content-Type': 'application/json' },
        next: { revalidate: 0 } // Don't cache this request
      }
    );

    const data = await response.json();
    
    if (!data.ok || !data.result?.file_path) {
      console.error('Telegram getFile response:', data);
      throw new Error(data.description || 'Failed to get file path from Telegram');
    }

    // Return the proxy URL instead of direct Telegram URL
    return `/api/proxy/${data.result.file_path}`;
  } catch (error) {
    console.error('Error getting file:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to get file URL');
  }
}

function parseFileMetadata(caption: string, fileName: string) {
  const DEFAULT_VALUES = {
    semester: 'Unknown',
    department: 'General',
    subject: 'Uncategorized',
    type: 'notes'
  };

  if (caption.includes('_')) {
    const parts = caption.split('_').map(part => part.trim());
    return {
      semester: parts[0] || DEFAULT_VALUES.semester,
      department: parts[1] || DEFAULT_VALUES.department,
      subject: parts[2] || DEFAULT_VALUES.subject,
      type: (parts[3] || '').toLowerCase().includes('qp') ? 'question_paper' : 'notes'
    };
  }

  return {
    ...DEFAULT_VALUES,
    type: fileName.toLowerCase().includes('qp') ? 'question_paper' : 'notes'
  };
}

export async function deleteMaterialFromGroup(messageId: string): Promise<boolean> {
  try {
    const response = await fetch(
      `${BOT_API_URL}/deleteMessage`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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