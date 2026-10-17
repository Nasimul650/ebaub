'use server';

import { requireAdmin } from '@/lib/cms-utils';
import { revalidatePath } from 'next/cache';

export async function createFaculty(prevState: any, formData: FormData) {
  try {
    const { supabase } = await requireAdmin();

    const name = formData.get('name') as string;
    const title = formData.get('title') as string;
    const bio = formData.get('bio') as string;
    const image_url = formData.get('image_url') as string;
    const department_id = formData.get('department_id') as string;

    if (!name || !title) {
      return { error: 'Name and title are required.' };
    }

    const { error } = await supabase.from('faculty_members').insert({
      name,
      title,
      bio,
      image_url,
      department_id: department_id || null
    });

    if (error) throw new Error(error.message);

    revalidatePath('/faculty');
    revalidatePath('/admin/faculty');
    
    return { success: true, message: 'Faculty member added successfully!' };
  } catch (error: any) {
    console.error('Failed to create faculty:', error);
    return { error: error.message || 'An unexpected error occurred.' };
  }
}

export async function updateFaculty(id: string, prevState: any, formData: FormData) {
  try {
    const { supabase, user, profile } = await requireAdmin();

    const { data: item } = await supabase.from('faculty_members').select('created_by').eq('id', id).maybeSingle();
    if (!item) {
      return { error: 'Faculty member not found.' };
    }
    if (item.created_by && item.created_by !== user.id && profile?.role !== 'ADMIN') {
      return { error: 'Unauthorized' };
    }

    const name = formData.get('name') as string;
    const title = formData.get('title') as string;
    const bio = formData.get('bio') as string;
    const image_url = formData.get('image_url') as string;
    const department_id = formData.get('department_id') as string;

    const updates: any = { updated_at: new Date().toISOString() };
    if (name) updates.name = name;
    if (title) updates.title = title;
    if (bio !== null) updates.bio = bio;
    if (image_url !== null) updates.image_url = image_url;
    if (department_id !== null) updates.department_id = department_id || null;

    const { error } = await supabase.from('faculty_members').update(updates).eq('id', id);

    if (error) throw new Error(error.message);

    revalidatePath('/faculty');
    revalidatePath('/admin/faculty');
    
    return { success: true, message: 'Faculty member updated successfully!' };
  } catch (error: any) {
    console.error('Failed to update faculty:', error);
    return { error: error.message || 'An unexpected error occurred.' };
  }
}

export async function createAcademicFaculty(prevState: any, formData: FormData) {
  try {
    const { supabase } = await requireAdmin();
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;

    if (!name) return { error: 'Faculty name is required' };

    const { error } = await supabase.from('faculties').insert({ name, description });
    if (error) throw new Error(error.message);

    revalidatePath('/admin/structure');
    revalidatePath('/admin/faculty');
    revalidatePath('/admin/faculty/create');
    revalidatePath('/faculty');
    
    return { success: true, message: 'Faculty added successfully!' };
  } catch (error: any) {
    return { error: error.message || 'Failed to create faculty' };
  }
}

export async function deleteAcademicFaculty(id: string) {
  try {
    const { supabase, user, profile } = await requireAdmin();

    const { data: item } = await supabase.from('faculties').select('created_by').eq('id', id).maybeSingle();
    if (item?.created_by && item.created_by !== user.id && profile?.role !== 'ADMIN') {
      return { error: 'Unauthorized' };
    }

    const { error } = await supabase.from('faculties').delete().eq('id', id);
    if (error) throw new Error(error.message);

    revalidatePath('/admin/structure');
    revalidatePath('/admin/faculty');
    revalidatePath('/faculty');
    return { success: true };
  } catch (error: any) {
    console.error('Delete faculty error:', error);
    return { error: error.message };
  }
}

export async function seedAcademicData() {
  try {
    const { supabase } = await requireAdmin();

    const { data: faculties, error: facError } = await supabase
      .from('faculties')
      .insert([
        { name: 'Faculty of Agriculture', description: 'Agricultural Sciences' },
        { name: 'Faculty of Computer Science & Engineering', description: 'Computing and Engineering' },
        { name: 'Faculty of Business Administration', description: 'Business and Management' }
      ])
      .select();

    if (facError) throw facError;

    const agriId = faculties.find((f: any) => f.name.includes('Agriculture'))?.id;
    const cseId = faculties.find((f: any) => f.name.includes('Computer'))?.id;
    const busId = faculties.find((f: any) => f.name.includes('Business'))?.id;

    const { error: deptError } = await supabase
      .from('departments')
      .insert([
        { faculty_id: agriId, name: 'Agronomy' },
        { faculty_id: agriId, name: 'Soil Science' },
        { faculty_id: cseId, name: 'Computer Science & Engineering' },
        { faculty_id: busId, name: 'Business Administration' }
      ]);

    if (deptError) throw deptError;

    revalidatePath('/admin/structure');
    revalidatePath('/admin/faculty');
    revalidatePath('/faculty');

    return { success: true, message: 'Academic structure seeded successfully!' };
  } catch (error: any) {
    console.error('Seed academic structure error:', error);
    return { error: error.message || 'Failed to seed academic structure.' };
  }
}
