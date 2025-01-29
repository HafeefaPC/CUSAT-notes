import { NextResponse } from 'next/server';

const TELEGRAM_BOT_TOKEN = process.env.NEXT_PUBLIC_TELEGRAM_BOT_TOKEN!;
const TELEGRAM_GROUP_ID = process.env.NEXT_PUBLIC_TELEGRAM_GROUP_ID!;

export async function GET() {
  try {
    // 1. Test Bot Info
    const botResponse = await fetch(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getMe`
    );
    const botData = await botResponse.json();

    // 2. Test Group Access
    const chatResponse = await fetch(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getChat?chat_id=${TELEGRAM_GROUP_ID}`
    );
    const chatData = await chatResponse.json();

    return NextResponse.json({
      botInfo: botData,
      chatInfo: chatData,
      token: TELEGRAM_BOT_TOKEN,
      groupId: TELEGRAM_GROUP_ID
    });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
} 