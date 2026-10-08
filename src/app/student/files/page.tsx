import React from 'react';
import { createClient } from '@/utils/supabase/server';
import { 
  getCourseMaterialsForStudent, 
  getAllDepartments, 
  getStudentDefaultDepartment 
} from '@/utils/supabase/queries';
import StudentMaterialsClient from '@/components/student/StudentMaterialsClient';
import type { CourseMaterial } from '@/types';

export default async function StudentFilesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let studentDeptId: string | null = null;
  if (user?.id) {
    studentDeptId = await getStudentDefaultDepartment(user.id);
  }

  const [departments, materials] = await Promise.all([
    getAllDepartments(),
    getCourseMaterialsForStudent({ studentDeptId: studentDeptId || undefined })
  ]);

  return (
    <div className="max-w-6xl mx-auto pb-12">
      <StudentMaterialsClient 
        initialMaterials={materials}
        departments={departments}
        studentDepartmentId={studentDeptId}
      />
    </div>
  );
}
