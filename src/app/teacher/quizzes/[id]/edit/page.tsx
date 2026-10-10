import React from 'react';
import { notFound } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import { getQuizById } from '@/app/actions/quiz';
import { 
  getTeacherMaterials, 
  getAllCourseMaterials, 
  getTeacherDefaultDepartment 
} from '@/utils/supabase/queries';
import QuizGeneratorWizard from '@/components/teacher/QuizGeneratorWizard';
import type { CourseMaterial } from '@/types';

export const dynamic = 'force-dynamic';

interface EditQuizPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditQuizPage({ params }: EditQuizPageProps) {
  const { id } = await params;
  const quiz = await getQuizById(id);

  if (!quiz) {
    notFound();
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let materials: CourseMaterial[] = [];
  let defaultFacultyId = 'cse';

  if (user) {
    const [teacherMaterials, allMaterials, defaultDeptId] = await Promise.all([
      getTeacherMaterials(user.id),
      getAllCourseMaterials(),
      getTeacherDefaultDepartment(user.id)
    ]);

    materials = teacherMaterials.length > 0 ? teacherMaterials : allMaterials;

    if (defaultDeptId) {
      const { data: dept } = await supabase
        .from('departments')
        .select('name, faculties(name)')
        .eq('id', defaultDeptId)
        .maybeSingle();

      const facultyName = (dept as any)?.faculties?.name || '';
      if (facultyName.toLowerCase().includes('agriculture')) {
        defaultFacultyId = 'agriculture';
      } else if (facultyName.toLowerCase().includes('business')) {
        defaultFacultyId = 'business';
      } else if (facultyName.toLowerCase().includes('law')) {
        defaultFacultyId = 'law';
      } else {
        defaultFacultyId = 'cse';
      }
    }
  }

  return (
    <QuizGeneratorWizard
      materials={materials}
      defaultFacultyId={defaultFacultyId}
      initialQuiz={quiz}
    />
  );
}
