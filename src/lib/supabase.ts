import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient<Database>(supabaseUrl, supabaseKey);

export async function updateMaterialStatusLocal(
  telegramFileId: string,
  status: 'accepted' | 'rejected' | 'deleted'
): Promise<boolean> {
  const { error } = await supabase
    .from('materials')
    .update({ status })
    .eq('telegram_file_id', telegramFileId);

  return !error;
}

export async function getMaterials() {
  const { data, error } = await supabase
    .from('materials')
    .select()
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function getAcceptedMaterials() {
  const { data, error } = await supabase
    .from('materials')
    .select()
    .eq('status', 'accepted')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function insertMaterial(material: {
  telegram_file_id: string;
  telegram_message_id: string;
  title: string;
  type: 'notes' | 'question_paper';
  department: string;
  semester: string;
  subject: string;
  uploaded_by: string;
  upload_date: string;
}) {
  const { error } = await supabase
    .from('materials')
    .insert(material);

  return !error;
} 