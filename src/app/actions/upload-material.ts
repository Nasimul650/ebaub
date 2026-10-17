'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import { verifyTeacherOrAdmin } from '@/lib/teacher-utils';

export interface TeacherActionResult {
  success?: boolean;
  error?: string;
  message?: string;
}

export async function uploadCourseMaterial(formData: FormData): Promise<TeacherActionResult> {
  try {
    const { supabase, user } = await verifyTeacherOrAdmin();

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

    const MAX_FILE_SIZE = 50 * 1024 * 1024;
    if (file.size > MAX_FILE_SIZE) {
      return { error: 'File size exceeds maximum allowed limit of 50MB.' };
    }

    const fileName = file.name;
    const fileExt = fileName.split('.').pop()?.toLowerCase() || '';
    const allowedExtensions = ['pdf', 'doc', 'docx', 'ppt', 'pptx', 'xls', 'xlsx', 'zip', 'rar', 'txt', 'rtf'];

    if (!allowedExtensions.includes(fileExt)) {
      return { error: `File type .${fileExt} is not permitted. Please upload PDF, DOCX, PPTX, or ZIP files.` };
    }

    const timestamp = Date.now();
    const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9._-]/g, '_');
    const storagePath = `${user.id}/${courseCode}/${timestamp}-${sanitizedFileName}`;

    const arrayBuffer = await file.arrayBuffer();
    const fileBuffer = Buffer.from(arrayBuffer);

    const { error: uploadError } = await supabase.storage
      .from('course_materials')
      .upload(storagePath, fileBuffer, {
        contentType: file.type || 'application/octet-stream',
        upsert: false
      });

    if (uploadError) {
      return { error: `Failed to upload file to storage: ${uploadError.message}` };
    }

    const { data: publicUrlData } = supabase.storage
      .from('course_materials')
      .getPublicUrl(storagePath);

    const fileUrl = publicUrlData.publicUrl;

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
          departmentIds = Array.isArray(parsed) ? parsed : [rawDeptStr];
        } catch {
          departmentIds = rawDeptStr.split(',').map(s => s.trim()).filter(Boolean);
        }
      }
    }

    if (departmentIds.length === 0) {
      return { error: 'Please select at least one department tag.' };
    }

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
      await supabase.storage.from('course_materials').remove([storagePath]);
      return { error: `Database insert failed: ${insertError?.message || 'Failed to save record'}` };
    }

    const junctionRows = departmentIds.map((deptId) => ({
      material_id: newMaterial.id,
      department_id: deptId,
    }));

    await supabase.from('course_material_departments').insert(junctionRows);

    revalidatePath('/teacher/materials');
    revalidatePath('/student/materials');
    revalidatePath('/student/files');
    return { success: true, message: 'Course material uploaded successfully with department tags!' };
  } catch (err: any) {
    return { error: err.message || 'An unexpected error occurred during upload.' };
  }
}

export const uploadMaterialAction = uploadCourseMaterial;
