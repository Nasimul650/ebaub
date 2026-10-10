'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export interface StudySessionRecord {
  id: string;
  student_id: string;
  title: string;
  source_material_id?: string | null;
  personal_file_url?: string | null;
  notes_content?: string | null;
  created_at: string;
  updated_at: string;
  source_material?: {
    id: string;
    title: string;
    course_code: string;
    file_name: string;
    file_url: string;
  } | null;
}

/**
 * Get all study sessions for the authenticated student
 */
export async function getStudySessions(): Promise<{ success: boolean; sessions?: StudySessionRecord[]; error?: string }> {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: 'Unauthorized' };
    }

    const { data, error } = await supabase
      .from('study_sessions')
      .select(`
        id,
        student_id,
        title,
        source_material_id,
        personal_file_url,
        notes_content,
        created_at,
        updated_at,
        course_materials (
          id,
          title,
          course_code,
          file_name,
          file_url
        )
      `)
      .eq('student_id', user.id)
      .order('updated_at', { ascending: false });

    if (error) {
      console.warn('Error fetching study_sessions (table may need migration):', error.message);
      return { success: true, sessions: [] };
    }

    const formattedSessions: StudySessionRecord[] = (data || []).map((s: any) => ({
      id: s.id,
      student_id: s.student_id,
      title: s.title,
      source_material_id: s.source_material_id,
      personal_file_url: s.personal_file_url,
      notes_content: s.notes_content,
      created_at: s.created_at,
      updated_at: s.updated_at,
      source_material: s.course_materials ? (Array.isArray(s.course_materials) ? s.course_materials[0] : s.course_materials) : null,
    }));

    return { success: true, sessions: formattedSessions };
  } catch (err: any) {
    console.error('getStudySessions exception:', err);
    return { success: false, error: err.message, sessions: [] };
  }
}

/**
 * Get a single study session by ID with its material or personal file
 */
export async function getStudySession(id: string): Promise<{ success: boolean; session?: StudySessionRecord | null; error?: string }> {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: 'Unauthorized' };
    }

    const { data, error } = await supabase
      .from('study_sessions')
      .select(`
        id,
        student_id,
        title,
        source_material_id,
        personal_file_url,
        notes_content,
        created_at,
        updated_at,
        course_materials (
          id,
          title,
          course_code,
          file_name,
          file_url
        )
      `)
      .eq('id', id)
      .eq('student_id', user.id)
      .maybeSingle();

    if (error) {
      return { success: false, error: error.message };
    }

    if (!data) {
      return { success: false, error: 'Session not found' };
    }

    const formatted: StudySessionRecord = {
      id: data.id,
      student_id: data.student_id,
      title: data.title,
      source_material_id: data.source_material_id,
      personal_file_url: data.personal_file_url,
      notes_content: data.notes_content || '',
      created_at: data.created_at,
      updated_at: data.updated_at,
      source_material: data.course_materials ? (Array.isArray(data.course_materials) ? data.course_materials[0] : data.course_materials) : null,
    };

    return { success: true, session: formatted };
  } catch (err: any) {
    console.error('getStudySession exception:', err);
    return { success: false, error: err.message };
  }
}

/**
 * Create a new study session from course material or personal file
 */
export async function createStudySession(payload: {
  title: string;
  sourceMaterialId?: string | null;
  personalFileUrl?: string | null;
}): Promise<{ success: boolean; sessionId?: string; error?: string }> {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: 'Please log in to start a study session.' };
    }

    const { data, error } = await supabase
      .from('study_sessions')
      .insert({
        student_id: user.id,
        title: payload.title || 'Untitled Study Session',
        source_material_id: payload.sourceMaterialId || null,
        personal_file_url: payload.personalFileUrl || null,
        notes_content: '',
      })
      .select('id')
      .single();

    if (error) {
      console.error('createStudySession error:', error);
      return { success: false, error: error.message };
    }

    revalidatePath('/student/study-hub');
    return { success: true, sessionId: data.id };
  } catch (err: any) {
    console.error('createStudySession exception:', err);
    return { success: false, error: err.message };
  }
}

/**
 * Update notes and title for an active study session (debounced auto-save)
 */
export async function saveStudySessionNotes(payload: {
  id: string;
  notesContent: string;
  title?: string;
}): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: 'Unauthorized' };
    }

    const updateData: any = {
      notes_content: payload.notesContent,
      updated_at: new Date().toISOString(),
    };

    if (payload.title && payload.title.trim()) {
      updateData.title = payload.title.trim();
    }

    const { error } = await supabase
      .from('study_sessions')
      .update(updateData)
      .eq('id', payload.id)
      .eq('student_id', user.id);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: any) {
    console.error('saveStudySessionNotes exception:', err);
    return { success: false, error: err.message };
  }
}

/**
 * Delete a study session
 */
export async function deleteStudySession(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: 'Unauthorized' };
    }

    const { error } = await supabase
      .from('study_sessions')
      .delete()
      .eq('id', id)
      .eq('student_id', user.id);

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath('/student/study-hub');
    return { success: true };
  } catch (err: any) {
    console.error('deleteStudySession exception:', err);
    return { success: false, error: err.message };
  }
}

/**
 * Upload a personal PDF to personal_study_files bucket and create session
 */
export async function uploadPersonalStudyFile(formData: FormData): Promise<{
  success: boolean;
  sessionId?: string;
  error?: string;
}> {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: 'Please log in to upload study files.' };
    }

    const file = formData.get('file') as File | null;
    if (!file || !(file instanceof File)) {
      return { success: false, error: 'No file provided.' };
    }

    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      return { success: false, error: 'Only PDF documents are supported in the Interactive PDF Viewer.' };
    }

    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const filePath = `${user.id}/${Date.now()}-${sanitizedName}`;

    const { error: uploadError } = await supabase.storage
      .from('personal_study_files')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true,
        contentType: 'application/pdf',
      });

    if (uploadError) {
      console.error('Storage upload error:', uploadError);
      return { success: false, error: `Upload failed: ${uploadError.message}` };
    }

    const { data: publicUrlData } = supabase.storage
      .from('personal_study_files')
      .getPublicUrl(filePath);

    const publicUrl = publicUrlData.publicUrl;
    const sessionTitle = file.name.replace(/\.pdf$/i, '').replace(/_/g, ' ');

    const createRes = await createStudySession({
      title: sessionTitle || 'Personal Study Notes',
      personalFileUrl: publicUrl,
    });

    if (!createRes.success) {
      return { success: false, error: createRes.error };
    }

    revalidatePath('/student/study-hub');
    return { success: true, sessionId: createRes.sessionId };
  } catch (err: any) {
    console.error('uploadPersonalStudyFile exception:', err);
    return { success: false, error: err.message };
  }
}
