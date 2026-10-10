'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export interface TeacherActionResult {
  success?: boolean;
  error?: string;
  message?: string;
}

/**
 * Server Action: uploadCourseMaterial
 * Verifies user authentication & Teacher/Admin role.
 * Uploads file buffer to 'course_materials' bucket under ${teacher_id}/${course_code}/${timestamp}-${sanitizedFileName}.
 * Inserts a metadata row into 'course_materials' table.
 */
export async function uploadCourseMaterial(formData: FormData): Promise<TeacherActionResult> {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return { error: 'Unauthorized: You must be logged in to upload course materials.' };
    }

    // Check teacher or admin role
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    const role = profile?.role || user.user_metadata?.role;
    if (role !== 'TEACHER' && role !== 'ADMIN') {
      return { error: 'Forbidden: Only teachers or administrators can upload course materials.' };
    }

    const file = formData.get('file') as File | null;
    const title = (formData.get('title') as string || '').trim();
    const courseCode = (formData.get('course_code') as string || '').trim().toUpperCase();

    if (!file || typeof file === 'string' || file.size === 0) {
      return { error: 'Please select a valid file to upload.' };
    }

    if (!title) {
      return { error: 'Material title is required.' };
    }

    if (!courseCode) {
      return { error: 'Course code is required (e.g. CSE-101).' };
    }

    // Enforce 50MB maximum size limit
    const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
    if (file.size > MAX_FILE_SIZE) {
      return { error: 'File size exceeds maximum allowed limit of 50MB.' };
    }

    // Validate file extensions
    const fileName = file.name;
    const fileExt = fileName.split('.').pop()?.toLowerCase() || '';
    const allowedExtensions = [
      'pdf',
      'doc',
      'docx',
      'ppt',
      'pptx',
      'xls',
      'xlsx',
      'zip',
      'rar',
      'txt',
      'rtf'
    ];

    if (!allowedExtensions.includes(fileExt)) {
      return {
        error: `File type .${fileExt} is not permitted. Please upload PDF, DOCX, PPTX, or ZIP files.`
      };
    }

    // Structure storage folder path: ${teacher_id}/${course_code}/${timestamp}-${sanitizedFileName}
    const timestamp = Date.now();
    const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9._-]/g, '_');
    const storagePath = `${user.id}/${courseCode}/${timestamp}-${sanitizedFileName}`;

    const arrayBuffer = await file.arrayBuffer();
    const fileBuffer = Buffer.from(arrayBuffer);

    // Upload to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from('course_materials')
      .upload(storagePath, fileBuffer, {
        contentType: file.type || 'application/octet-stream',
        upsert: false
      });

    if (uploadError) {
      console.error('Course material upload error:', uploadError);
      return { error: `Failed to upload file to storage: ${uploadError.message}` };
    }

    // Obtain Public URL
    const { data: publicUrlData } = supabase.storage
      .from('course_materials')
      .getPublicUrl(storagePath);

    const fileUrl = publicUrlData.publicUrl;

    // Extract department_ids
    const rawDeptIds = formData.getAll('department_ids');
    let departmentIds: string[] = [];
    if (rawDeptIds.length > 0) {
      departmentIds = rawDeptIds
        .flatMap(item => typeof item === 'string' ? item.split(',') : [])
        .map(id => id.trim())
        .filter(Boolean);
    } else {
      const rawDeptStr = formData.get('department_ids') as string | null;
      if (rawDeptStr) {
        try {
          const parsed = JSON.parse(rawDeptStr);
          if (Array.isArray(parsed)) {
            departmentIds = parsed;
          } else {
            departmentIds = [rawDeptStr];
          }
        } catch {
          departmentIds = rawDeptStr.split(',').map(s => s.trim()).filter(Boolean);
        }
      }
    }

    if (departmentIds.length === 0) {
      return { error: 'Please select at least one department tag.' };
    }

    // Insert record into course_materials table
    const { data: newMaterial, error: insertError } = await supabase
      .from('course_materials')
      .insert({
        teacher_id: user.id,
        course_code: courseCode,
        title,
        file_url: fileUrl,
        file_name: fileName,
        file_size: file.size,
        file_type: file.type || fileExt,
      })
      .select('id')
      .single();

    if (insertError || !newMaterial) {
      console.error('Course materials database insert error:', insertError);
      // Clean up orphaned storage file
      await supabase.storage.from('course_materials').remove([storagePath]);
      return { error: `Database insert failed: ${insertError?.message || 'Failed to save record'}` };
    }

    // Insert junction rows into course_material_departments
    const junctionRows = departmentIds.map((deptId) => ({
      material_id: newMaterial.id,
      department_id: deptId,
    }));

    const { error: junctionError } = await supabase
      .from('course_material_departments')
      .insert(junctionRows);

    if (junctionError) {
      console.warn('Junction insert warning (check if migration applied):', junctionError.message);
    }

    revalidatePath('/teacher/materials');
    revalidatePath('/student/materials');
    revalidatePath('/student/files');
    return { success: true, message: 'Course material uploaded successfully with department tags!' };
  } catch (err: any) {
    console.error('UploadCourseMaterial error:', err);
    return { error: err.message || 'An unexpected error occurred during upload.' };
  }
}

/**
 * Server Action: deleteCourseMaterial
 * Verifies ownership (teacher_id = auth.uid() or ADMIN).
 * Removes file from 'course_materials' bucket and deletes the database row.
 */
export async function deleteCourseMaterial(
  materialId: string,
  fileUrl: string
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

    // Role and ownership check
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    const role = profile?.role || user.user_metadata?.role;
    const isOwner = material.teacher_id === user.id;
    const isAdmin = role === 'ADMIN';

    if (!isOwner && !isAdmin) {
      return { error: 'Forbidden: You can only delete materials that you uploaded.' };
    }

    // Extract storage relative path
    const targetUrl = fileUrl || material.file_url;
    let storagePath = '';
    if (targetUrl.includes('/course_materials/')) {
      storagePath = decodeURIComponent(targetUrl.split('/course_materials/')[1]);
    } else {
      storagePath = targetUrl;
    }

    // Remove file from storage
    if (storagePath) {
      const { error: storageError } = await supabase.storage
        .from('course_materials')
        .remove([storagePath]);
      if (storageError) {
        console.warn('Storage deletion warning (file may already be removed):', storageError.message);
      }
    }

    // Delete database row
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
    console.error('DeleteCourseMaterial error:', err);
    return { error: err.message || 'An unexpected error occurred while deleting material.' };
  }
}
