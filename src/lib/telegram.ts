import { StudyMaterial } from '@/types';

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
    const response = await fetch(
      `${BOT_API_URL}/getUpdates?chat_id=${TELEGRAM_GROUP_ID}&limit=100&allowed_updates=["message"]`,
      { cache: 'no-store' }
    );
    const data = await response.json();

    if (!data.ok) return [];

    const materials: StudyMaterial[] = [];
    const seenIds = new Set<string>(); // Track unique IDs
    
    for (const update of data.result) {
      if (update.message?.document) {
        const doc = update.message.document;
        const caption = update.message.caption || '';
        
        // Skip if we've seen this ID before
        if (seenIds.has(doc.file_unique_id)) continue;
        seenIds.add(doc.file_unique_id);
        
        try {
          const [semester = 'Unknown', department = 'Unknown', subject = 'Unknown', type = 'notes'] = 
            caption.split('_').map((part: string) => part.trim());

          // Get status from memory or default to pending
          const status = materialStatuses.get(doc.file_unique_id) || 'pending';

          // Skip deleted materials
          if (status === 'deleted') continue;

          materials.push({
            id: doc.file_unique_id,
            title: doc.file_name || caption,
            type: type.toLowerCase().includes('note') ? 'notes' : 'question_paper',
            department,
            semester,
            subject,
            uploadedBy: update.message.from?.username || 'Anonymous',
            uploadDate: new Date(update.message.date * 1000).toISOString(),
            fileUrl: doc.file_id,
            messageId: update.message.message_id.toString(),
            status,
            slug: {
              dept: department.toLowerCase(),
              sem: semester.toLowerCase(),
              sub: subject.toLowerCase()
            }
          });
        } catch {
          continue;
        }
      }
    }
    
    return materials.reverse(); // Show newest first
  } catch {
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