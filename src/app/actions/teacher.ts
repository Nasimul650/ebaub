'use server';

import { uploadCourseMaterial as _uploadCourseMaterial, type TeacherActionResult } from './upload-material';
import { deleteCourseMaterial as _deleteCourseMaterial } from './delete-material';

export type { TeacherActionResult };

export async function uploadCourseMaterial(formData: FormData): Promise<TeacherActionResult> {
  return _uploadCourseMaterial(formData);
}

export async function deleteCourseMaterial(materialId: string, fileUrl?: string): Promise<TeacherActionResult> {
  return _deleteCourseMaterial(materialId, fileUrl);
}
