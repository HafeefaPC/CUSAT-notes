// require('dotenv').config();
import axios from 'axios';

// Replace with your actual Telegram bot token (store securely!)
const botToken = process.env.BOT_TOKEN;
const desiredFileName = 'sem 5.pdf';

export async function GET() {
  try {
    const updatesResponse = await axios.get(`https://api.telegram.org/bot${botToken}/getUpdates?limit=10`);
    const messages = updatesResponse.data.result;
    let fileId;

    for (const message of messages) {
      if (message.message && message.message.document && message.message.document.file_name === desiredFileName) {
        fileId = message.message.document.file_id;
        break;
      }
    }

    if (!fileId) {
      return Response.json({ error: 'File with desired name not found' });
    }

    const fileResponse = await axios.get(`https://api.telegram.org/bot${botToken}/getFile?file_id=${fileId}`);
    const filePath = fileResponse.data.result.file_path;

    const downloadLink = `https://api.telegram.org/file/bot${botToken}/${filePath}`;

    return Response.json({ downloadLink });
  } catch (error) {
    console.error(error);
    return Response.json({ error: 'Error retrieving file' });
  }
}
