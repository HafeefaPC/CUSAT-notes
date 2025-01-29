import { StudyMaterial } from '@/types';
import categories from './catogories.json';

const departments = categories["/"].resources[0].departments;

export const mockMaterials: StudyMaterial[] = departments.flatMap(dept =>
  dept.semesters.flatMap(sem =>
    sem.subjects.flatMap(sub => {
      // Create 2 entries for each subject (1 note, 1 question paper)
      return Array.from({ length: 2 }, (_, i) => ({
        id: `${dept.slug}-${sem.slug}-${sub.slug}-${i}`,
        title: `${sem.name}_${dept.name}_${sub.name}_${i === 0 ? 'Note' : 'Question'}_Aazim`,
        type: i === 0 ? 'notes' : 'question_paper',
        department: dept.name,
        semester: sem.name,
        subject: sub.name,
        uploadedBy: 'Aazim',
        uploadDate: new Date().toISOString(),
        fileUrl: '#',
        slug: {
          dept: dept.slug,
          sem: sem.slug,
          sub: sub.slug
        },
        messageId: `${dept.slug}-${sem.slug}-${sub.slug}`,
        status: 'pending'
      }))
    })
  )
); 