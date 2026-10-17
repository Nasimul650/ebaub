'use server';

import { requireAdmin as _requireAdmin, generateSlug } from '@/lib/cms-utils';
import { revalidatePath } from 'next/cache';
import type { ContentBlock } from '@/types';

import {
  createNews as _createNews,
  updateNews as _updateNews,
  deleteNews as _deleteNews
} from './news';

import {
  createNotice as _createNotice,
  updateNotice as _updateNotice,
  deleteNotice as _deleteNotice
} from './notices';

import {
  createEvent as _createEvent,
  updateEvent as _updateEvent,
  createCalendarEvent as _createCalendarEvent,
  updateCalendarEvent as _updateCalendarEvent
} from './events';

import {
  createFaculty as _createFaculty,
  updateFaculty as _updateFaculty,
  createAcademicFaculty as _createAcademicFaculty,
  deleteAcademicFaculty as _deleteAcademicFaculty,
  seedAcademicData as _seedAcademicData
} from './faculty';

import {
  createProgram as _createProgram,
  updateProgram as _updateProgram,
  createAcademicDepartment as _createAcademicDepartment,
  deleteAcademicDepartment as _deleteAcademicDepartment
} from './programs';

export async function requireAdmin() {
  return _requireAdmin();
}

export async function createNews(prevState: any, formData: FormData) {
  return _createNews(prevState, formData);
}

export async function updateNews(id: string, prevState: any, formData: FormData) {
  return _updateNews(id, prevState, formData);
}

export async function deleteNews(formData: FormData): Promise<void> {
  return _deleteNews(formData);
}

export async function createNotice(prevState: any, formData: FormData) {
  return _createNotice(prevState, formData);
}

export async function updateNotice(id: string, prevState: any, formData: FormData) {
  return _updateNotice(id, prevState, formData);
}

export async function deleteNotice(formData: FormData): Promise<void> {
  return _deleteNotice(formData);
}

export async function createEvent(prevState: any, formData: FormData) {
  return _createEvent(prevState, formData);
}

export async function updateEvent(id: string, prevState: any, formData: FormData) {
  return _updateEvent(id, prevState, formData);
}

export async function createCalendarEvent(prevState: any, formData: FormData) {
  return _createCalendarEvent(prevState, formData);
}

export async function updateCalendarEvent(id: string, prevState: any, formData: FormData) {
  return _updateCalendarEvent(id, prevState, formData);
}

export async function createFaculty(prevState: any, formData: FormData) {
  return _createFaculty(prevState, formData);
}

export async function updateFaculty(id: string, prevState: any, formData: FormData) {
  return _updateFaculty(id, prevState, formData);
}

export async function createAcademicFaculty(prevState: any, formData: FormData) {
  return _createAcademicFaculty(prevState, formData);
}

export async function deleteAcademicFaculty(id: string) {
  return _deleteAcademicFaculty(id);
}

export async function seedAcademicData() {
  return _seedAcademicData();
}

export async function createAcademicDepartment(prevState: any, formData: FormData) {
  return _createAcademicDepartment(prevState, formData);
}

export async function deleteAcademicDepartment(id: string) {
  return _deleteAcademicDepartment(id);
}

export async function createProgram(prevState: any, formData: FormData) {
  return _createProgram(prevState, formData);
}

export async function updateProgram(id: string, prevState: any, formData: FormData) {
  return _updateProgram(id, prevState, formData);
}

export async function upsertAdmissionInfo(prevState: any, formData: FormData) {
  try {
    const { supabase } = await requireAdmin();
    const faculty_id = formData.get('faculty_id') as string;
    const requirements = formData.get('requirements') as string;
    const process_steps = formData.get('process_steps') as string;
    const important_dates = formData.get('important_dates') as string;

    if (!faculty_id) throw new Error('Faculty ID is required');

    const { error } = await supabase
      .from('admissions_info')
      .upsert(
        { faculty_id, requirements, process_steps, important_dates },
        { onConflict: 'faculty_id' }
      );

    if (error) throw new Error(error.message);

    revalidatePath('/admissions');
    revalidatePath('/admin/admissions');
    
    return { success: true, message: 'Admissions information saved successfully.' };
  } catch (error: any) {
    console.error('Upsert admission info error:', error);
    return { error: error.message || 'Failed to save admissions info' };
  }
}

export async function updatePageBlocks(slug: string, blocks: ContentBlock[]) {
  try {
    const { supabase } = await requireAdmin();

    const { error } = await supabase
      .from('pages')
      .update({ content_blocks: blocks })
      .eq('slug', slug);

    if (error) {
      return { error: 'Failed to save page blocks: ' + error.message };
    }

    revalidatePath(`/${slug}`);
    revalidatePath(`/admin/pages/${slug}`);

    return { success: true, message: 'Page blocks saved successfully.' };
  } catch (error: any) {
    console.error('Update page blocks error:', error);
    return { error: error.message || 'Failed to save page blocks' };
  }
}
