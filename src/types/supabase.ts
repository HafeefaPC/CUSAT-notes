export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      materials: {
        Row: {
          id: string
          telegram_file_id: string
          telegram_message_id: string
          title: string
          type: 'notes' | 'question_paper'
          department: string
          semester: string
          subject: string
          uploaded_by: string
          upload_date: string
          status: 'pending' | 'accepted' | 'rejected' | 'deleted'
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['materials']['Row'], 'id' | 'created_at' | 'updated_at' | 'status'>
        Update: Partial<Database['public']['Tables']['materials']['Row']>
      }
    }
  }
} 