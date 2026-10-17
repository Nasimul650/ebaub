'use server';

import { requireAdmin } from '@/lib/cms-utils';
import { revalidatePath } from 'next/cache';

export async function createProgram(prevState: any, formData: FormData) {
  try {
    const { supabase } = await requireAdmin();
    const name = formData.get('name') as string;
    const degree_level = formData.get('degree_level') as string;
    const duration_years = parseInt(formData.get('duration_years') as string) || 4;
    const description = formData.get('description') as string;
    const department_id = formData.get('department_id') as string;

    if (!name || !department_id || !degree_level) {
      return { error: 'Name, Degree Level, and Department are required.' };
    }

    const { error } = await supabase.from('programs').insert({
      name,
      degree_level,
      duration_years,
      description,
      department_id
    });

    if (error) throw new Error(error.message);

    revalidatePath('/academics');
    revalidatePath('/admin/programs');
    
    return { success: true, message: 'Program added successfully!' };
  } catch (error: any) {
    return { error: error.message || 'Failed to create program.' };
  }
}

export async function updateProgram(id: string, prevState: any, formData: FormData) {
  try {
    const { supabase, user, profile } = await requireAdmin();

    const { data: item } = await supabase.from('programs').select('created_by').eq('id', id).maybeSingle();
    if (item?.created_by && item.created_by !== user.id && profile?.role !== 'ADMIN') {
      return { error: 'Unauthorized' };
    }

    const name = formData.get('name') as string;
    const degree_level = formData.get('degree_level') as string;
    const duration_years = parseInt(formData.get('duration_years') as string);
    const description = formData.get('description') as string;
    const department_id = formData.get('department_id') as string;

    const updates: any = {};
    if (name) updates.name = name;
    if (degree_level) updates.degree_level = degree_level;
    if (duration_years) updates.duration_years = duration_years;
    if (description !== null) updates.description = description;
    if (department_id) updates.department_id = department_id;

    const { error } = await supabase.from('programs').update(updates).eq('id', id);
    if (error) throw new Error(error.message);

    revalidatePath('/academics');
    revalidatePath('/admin/programs');
    
    return { success: true, message: 'Program updated successfully!' };
  } catch (error: any) {
    return { error: error.message || 'Failed to update program.' };
  }
}

export async function createAcademicDepartment(prevState: any, formData: FormData) {
  try {
    const { supabase } = await requireAdmin();
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const faculty_id = formData.get('faculty_id') as string;

    if (!name || !faculty_id) return { error: 'Name and Faculty are required' };

    const { error } = await supabase.from('departments').insert({ name, description, faculty_id });
    if (error) throw new Error(error.message);

    revalidatePath('/admin/structure');
    revalidatePath('/admin/faculty');
    revalidatePath('/admin/faculty/create');
    revalidatePath('/faculty');
    
    return { success: true, message: 'Department added successfully!' };
  } catch (error: any) {
    return { error: error.message || 'Failed to create department' };
  }
}

export async function deleteAcademicDepartment(id: string) {
  try {
    const { supabase, user, profile } = await requireAdmin();

    const { data: item } = await supabase.from('departments').select('created_by').eq('id', id).maybeSingle();
    if (item?.created_by && item.created_by !== user.id && profile?.role !== 'ADMIN') {
      return { error: 'Unauthorized' };
    }

    const { error } = await supabase.from('departments').delete().eq('id', id);
    if (error) throw new Error(error.message);

    revalidatePath('/admin/structure');
    revalidatePath('/admin/faculty');
    revalidatePath('/faculty');
    return { success: true };
  } catch (error: any) {
    console.error('Delete department error:', error);
    return { error: error.message };
  }
}
