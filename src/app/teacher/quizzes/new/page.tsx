import React from 'react';
import { createClient } from '@/utils/supabase/server';
import { 
  getTeacherMaterials, 
  getAllCourseMaterials, 
  getTeacherDefaultDepartment 
} from '@/utils/supabase/queries';
import QuizGeneratorWizard from '@/components/teacher/QuizGeneratorWizard';
import type { CourseMaterial } from '@/types';

export const dynamic = 'force-dynamic';

export default async function NewQuizPage() {
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

    // Give teacher their own materials, or all university materials if none uploaded yet
    materials = teacherMaterials.length > 0 ? teacherMaterials : allMaterials;

    // Determine default faculty preset from teacher's profile/department
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
    />
  );
}
