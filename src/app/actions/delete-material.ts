'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import type { TeacherActionResult } from './upload-material';

export async function deleteCourseMaterial(
  materialId: string,
  fileUrl?: string
): Promise<TeacherActionResult> {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return { error: 'Unauthorized: You must be logged in to delete materials.' };
    }

    // Fetch existing material
    const { data: material, error: fetchError } = await supabase
      .from('course_materials')
      .select('id, teacher_id, file_url')
      .eq('id', materialId)
      .single();

    if (fetchError || !material) {
      return { error: 'Material not found or already deleted.' };
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    const role = profile?.role || user.user_metadata?.role;
    const uploadedBy = (material as any).uploaded_by || material.teacher_id;
    if (uploadedBy !== user.id && role !== 'ADMIN') {
      return { error: 'Unauthorized: You can only delete materials that you uploaded.' };
    }

    const targetUrl = fileUrl || material.file_url;
    let storagePath = '';
    if (targetUrl.includes('/course_materials/')) {
      storagePath = decodeURIComponent(targetUrl.split('/course_materials/')[1]);
    } else {
      storagePath = targetUrl;
    }

    if (storagePath) {
      await supabase.storage.from('course_materials').remove([storagePath]);
    }

    const { error: deleteError } = await supabase
      .from('course_materials')
      .delete()
      .eq('id', materialId);

    if (deleteError) {
      return { error: `Failed to delete database record: ${deleteError.message}` };
    }

    revalidatePath('/teacher/materials');
    return { success: true, message: 'Material deleted successfully.' };
  } catch (err: any) {
    return { error: err.message || 'An unexpected error occurred while deleting material.' };
  }
}

export const deleteMaterialAction = deleteCourseMaterial;
