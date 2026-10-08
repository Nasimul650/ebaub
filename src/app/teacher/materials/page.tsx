import React from 'react';
import { createClient } from '@/utils/supabase/server';
import { 
  getTeacherMaterials,
  getAllCourseMaterials,
  getDepartmentsWithFaculty, 
  getTeacherDefaultDepartment 
} from '@/utils/supabase/queries';
import TeacherMaterialsTable from '@/components/teacher/TeacherMaterialsTable';
import type { CourseMaterial } from '@/types';

export default async function TeacherMaterialsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let myMaterials: CourseMaterial[] = [];
  let allMaterials: CourseMaterial[] = [];
  let defaultDepartmentId: string | null = null;

  const [departments, allCourseMaterials] = await Promise.all([
    getDepartmentsWithFaculty(),
    getAllCourseMaterials()
  ]);

  allMaterials = allCourseMaterials;

  if (user?.id) {
    myMaterials = allCourseMaterials.filter((m) => m.teacher_id === user.id);
    defaultDepartmentId = await getTeacherDefaultDepartment(user.id);
  }

  return (
    <div className="max-w-7xl mx-auto pb-12 px-4 sm:px-6">
      <TeacherMaterialsTable 
        myMaterials={myMaterials}
        allMaterials={allMaterials}
        departments={departments}
        defaultDepartmentId={defaultDepartmentId}
        currentUserId={user?.id || ''}
      />
    </div>
  );
}
