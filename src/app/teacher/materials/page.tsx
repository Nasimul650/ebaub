import React from 'react';
import { createClient } from '@/utils/supabase/server';
import { 
  getTeacherMaterials, 
  getAllDepartments, 
  getTeacherDefaultDepartment 
} from '@/utils/supabase/queries';
import TeacherMaterialsTable from '@/components/teacher/TeacherMaterialsTable';
import type { CourseMaterial } from '@/types';

export default async function TeacherMaterialsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let materials: CourseMaterial[] = [];
  let defaultDepartmentId: string | null = null;

  const departments = await getAllDepartments();

  if (user?.id) {
    materials = await getTeacherMaterials(user.id);
    defaultDepartmentId = await getTeacherDefaultDepartment(user.id);
  } else {
    materials = await getTeacherMaterials('');
  }

  return (
    <div className="max-w-6xl mx-auto pb-12">
      <TeacherMaterialsTable 
        initialMaterials={materials} 
        departments={departments}
        defaultDepartmentId={defaultDepartmentId}
      />
    </div>
  );
}
