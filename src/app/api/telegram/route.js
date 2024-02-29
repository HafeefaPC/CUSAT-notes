import axios from 'axios';
require('dotenv').config();

// Replace with your actual Telegram bot token (store securely!)
const botToken = process.env.BOT_TOKEN;
const desiredFileName = 'sem 5.pdf';

export async function GET() {
  try {
    const fileDetails = await getFileDetailsFromTelegramGroup(desiredFileName);
    console.log("fileDetails", fileDetails);

    if (fileDetails.error) {
      return Response.json({ error: 'File with desired name not found' });
    }

    const fileResponse = await axios.get(`https://api.telegram.org/bot${botToken}/getFile?file_id=${fileDetails.fileId}`);
    const filePath = fileResponse.data.result.file_path;
    console.log("filePath", filePath);

    // Generate the download URL
    const downloadLink = `https://api.telegram.org/file/bot${botToken}/${filePath}`;

    return Response.json({ downloadLink });
  } catch (error) {
    console.error(error);
    return Response.json({ error: 'Error retrieving file' });
  }
}

async function getFileDetailsFromTelegramGroup(desiredFileName) {
  try {
    // Fetch only the most recent messages
    const response = await axios.get(`https://api.telegram.org/bot${botToken}/getUpdates?limit=10`);
    const messages = response.data.result;

    for (const message of messages) {
      if (message.message && message.message.document && message.message.document.file_name === desiredFileName) {
        return {
          fileId: message.message.document.file_id,
          caption: message.message.caption
        };
      }
    }

    return { error: 'File with desired name not found' };
  } catch (error) {
    console.error('Error retrieving file details:', error);
    throw error;
  }
}
