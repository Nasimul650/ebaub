import React from 'react';
import { createClient } from '@/utils/supabase/server';
import { 
  getCourseMaterialsForStudent, 
  getAllDepartments, 
  getStudentDefaultDepartment 
} from '@/utils/supabase/queries';
import StudentMaterialsClient from '@/components/student/StudentMaterialsClient';
import type { CourseMaterial } from '@/types';

export const dynamic = 'force-dynamic';

export default async function StudentFilesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let studentDeptId: string | null = null;
  if (user?.id) {
    studentDeptId = await getStudentDefaultDepartment(user.id);
  }

  const [departments, materials, teachersResult] = await Promise.all([
    getAllDepartments(),
    getCourseMaterialsForStudent({ studentDeptId: studentDeptId || undefined }),
    supabase
      .from('profiles')
      .select('id, full_name, first_name, last_name, department_id, role')
      .in('role', ['TEACHER', 'ADMIN'])
  ]);

  const teachers = (teachersResult.data || []).map((t: any) => ({
    id: t.id,
    name: t.full_name?.trim() || (t.first_name ? `${t.first_name} ${t.last_name || ''}`.trim() : '') || 'Faculty Member',
    department_id: t.department_id || null,
  }));

  return (
    <div className="max-w-6xl mx-auto pb-12">
      <StudentMaterialsClient 
        initialMaterials={materials}
        departments={departments}
        studentDepartmentId={studentDeptId}
        allTeachers={teachers}
      />
    </div>
  );
}
