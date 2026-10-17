'use server';

import { requireAdmin, generateSlug } from '@/lib/cms-utils';
import { revalidatePath } from 'next/cache';

export async function createNotice(prevState: any, formData: FormData) {
  try {
    const { supabase, user } = await requireAdmin();

    const title = formData.get('title') as string;
    const category = formData.get('category') as string;
    const priority = formData.get('priority') as string;
    const date = formData.get('date') as string;
    const description = formData.get('description') as string;
    const attachment_url = formData.get('attachment_url') as string;

    if (!title) {
      return { error: 'Notice title is required.' };
    }

    const slug = generateSlug(title);

    const { error } = await supabase.from('notices').insert({
      title,
      slug,
      category,
      priority,
      date: date || new Date().toISOString().split('T')[0],
      description,
      attachment_url,
      author_id: user.id,
    });

    if (error) throw new Error(error.message);

    revalidatePath('/');
    revalidatePath('/notices');
    
    return { success: true, message: 'Notice published successfully!' };
  } catch (error: any) {
    console.error('Failed to create notice:', error);
    return { error: error.message || 'An unexpected error occurred.' };
  }
}

export async function updateNotice(id: string, prevState: any, formData: FormData) {
  try {
    const { supabase, user, profile } = await requireAdmin();

    const { data: item } = await supabase.from('notices').select('created_by, author_id').eq('id', id).maybeSingle();
    if (!item) {
      return { error: 'Notice not found.' };
    }
    const creatorId = item.created_by || item.author_id;
    if (creatorId !== user.id && profile?.role !== 'ADMIN') {
      return { error: 'Unauthorized' };
    }

    const title = formData.get('title') as string;
    const category = formData.get('category') as string;
    const priority = formData.get('priority') as string;
    const date = formData.get('date') as string;
    const description = formData.get('description') as string;
    const attachment_url = formData.get('attachment_url') as string;

    const updates: any = { updated_at: new Date().toISOString() };
    if (title) updates.title = title;
    if (category) updates.category = category;
    if (priority) updates.priority = priority;
    if (date) updates.date = date;
    if (description !== null) updates.description = description;
    if (attachment_url !== null) updates.attachment_url = attachment_url;

    const { error } = await supabase.from('notices').update(updates).eq('id', id);

    if (error) throw new Error(error.message);

    revalidatePath('/');
    revalidatePath('/notices');
    
    return { success: true, message: 'Notice updated successfully!' };
  } catch (error: any) {
    console.error('Failed to update notice:', error);
    return { error: error.message || 'An unexpected error occurred.' };
  }
}

export async function deleteNotice(formData: FormData): Promise<void> {
  try {
    const { supabase, user, profile } = await requireAdmin();
    const id = formData.get('id') as string;
    if (!id) return;

    const { data: item } = await supabase.from('notices').select('created_by, author_id').eq('id', id).maybeSingle();
    if (!item) return;
    const creatorId = item.created_by || item.author_id;
    if (creatorId !== user.id && profile?.role !== 'ADMIN') {
      return;
    }

    const { error } = await supabase.from('notices').delete().eq('id', id);
    if (error) throw new Error(error.message);

    revalidatePath('/');
    revalidatePath('/notices');
    revalidatePath('/admin/notices');
  } catch (error: any) {
    console.error('Failed to delete notice:', error);
  }
}
