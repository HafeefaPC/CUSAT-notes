export interface StudyMaterial {
  id: string;
  title: string;
  type: 'notes' | 'question_paper';
  department: string;
  semester: string;
  subject: string;
  uploadedBy: string;
  uploadDate: string;
  fileUrl: string;
  messageId: string;
  slug: {
    dept: string;
    sem: string;
    sub: string;
  };
  status?: 'pending' | 'accepted' | 'rejected';
}

export interface FilterOptions {
  department: string;
  semester: string;
  subject: string;
} 