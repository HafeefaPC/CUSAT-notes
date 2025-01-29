import { StudyMaterial } from '@/types';

const TELEGRAM_BOT_TOKEN = process.env.NEXT_PUBLIC_TELEGRAM_BOT_TOKEN!;
const TELEGRAM_GROUP_ID = process.env.NEXT_PUBLIC_TELEGRAM_GROUP_ID!;
const BOT_API_URL = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}`;

export interface TelegramFile {
  file_id: string;
  file_unique_id: string;
  file_size: number;
  file_path?: string;
}

export async function getFilesFromGroup(): Promise<StudyMaterial[]> {
  try {
    // First, test bot access
    const testResponse = await fetch(`${BOT_API_URL}/getMe`);
    const testData = await testResponse.json();
    console.log('Bot Test Response:', testData);

    // Get messages from the group with offset
    const response = await fetch(
      `${BOT_API_URL}/getUpdates?chat_id=${TELEGRAM_GROUP_ID}&limit=100&allowed_updates=["message"]`
    );
    const data = await response.json();
    
    console.log('Bot Token:', TELEGRAM_BOT_TOKEN);
    console.log('Group ID:', TELEGRAM_GROUP_ID);
    console.log('Full API URL:', `${BOT_API_URL}/getUpdates?chat_id=${TELEGRAM_GROUP_ID}`);
    console.log('Telegram API Response:', data);

    if (!data.ok) {
      console.error('Telegram API Error:', data);
      return [];
    }

    const materials: StudyMaterial[] = [];
    
    // Process messages to find documents
    for (const update of data.result) {
      if (update.message?.document) {
        const doc = update.message.document;
        const caption = update.message.caption || doc.file_name || 'Untitled';
        
        // For testing, we'll create a material entry for every document
        materials.push({
          id: doc.file_unique_id,
          title: caption,
          type: caption.toLowerCase().includes('note') ? 'notes' : 'question_paper',
          department: 'Test Dept',
          semester: 'Test Sem',
          subject: 'Test Subject',
          uploadedBy: update.message.from?.username || 'Anonymous',
          uploadDate: new Date(update.message.date * 1000).toISOString(),
          fileUrl: doc.file_id,
          slug: {
            dept: 'test',
            sem: 'test',
            sub: 'test'
          }
        });

        console.log('Processed document:', {
          fileId: doc.file_id,
          caption,
          fileName: doc.file_name
        });
      }
    }
    
    return materials;
  } catch (error) {
    console.error('Error fetching files:', error);
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