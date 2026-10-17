'use server';

import { requireAdmin, generateSlug } from '@/lib/cms-utils';
import { revalidatePath } from 'next/cache';

export async function createNews(prevState: any, formData: FormData) {
  try {
    const { supabase, user } = await requireAdmin();

    const title = formData.get('title') as string;
    const category = formData.get('category') as string;
    const date = formData.get('date') as string;
    const summary = formData.get('summary') as string;
    const content = formData.get('content') as string;
    const image_url = formData.get('image_url') as string;

    if (!title || !content) {
      return { error: 'Title and content are required.' };
    }

    const slug = generateSlug(title);

    const { error } = await supabase.from('news').insert({
      title,
      slug,
      category,
      date: date || new Date().toISOString().split('T')[0],
      summary,
      content,
      image_url,
      author_id: user.id,
      published: true,
    });

    if (error) throw new Error(error.message);

    revalidatePath('/');
    revalidatePath('/news');
    
    return { success: true, message: 'News article created successfully!' };
  } catch (error: any) {
    console.error('Failed to create news:', error);
    return { error: error.message || 'An unexpected error occurred.' };
  }
}

export async function updateNews(id: string, prevState: any, formData: FormData) {
  try {
    const { supabase, user, profile } = await requireAdmin();

    const { data: item } = await supabase.from('news').select('created_by, author_id').eq('id', id).maybeSingle();
    if (!item) {
      return { error: 'News article not found.' };
    }
    const creatorId = item.created_by || item.author_id;
    if (creatorId !== user.id && profile?.role !== 'ADMIN') {
      return { error: 'Unauthorized' };
    }

    const title = formData.get('title') as string;
    const summary = formData.get('summary') as string;
    const category = formData.get('category') as string;
    const content = formData.get('content') as string;
    const image_url = formData.get('image_url') as string;

    const updates: any = { updated_at: new Date().toISOString() };
    if (title) updates.title = title;
    if (summary !== null) updates.summary = summary;
    if (category !== null) updates.category = category;
    if (content) updates.content = content;
    if (image_url) updates.image_url = image_url;

    const { error } = await supabase.from('news').update(updates).eq('id', id);

    if (error) throw new Error(error.message);

    revalidatePath('/');
    revalidatePath('/news');
    
    return { success: true, message: 'News article updated successfully!' };
  } catch (error: any) {
    console.error('Failed to update news:', error);
    return { error: error.message || 'An unexpected error occurred.' };
  }
}

export async function deleteNews(formData: FormData): Promise<void> {
  try {
    const { supabase, user, profile } = await requireAdmin();
    const id = formData.get('id') as string;
    if (!id) return;

    const { data: item } = await supabase.from('news').select('created_by, author_id').eq('id', id).maybeSingle();
    if (!item) return;
    const creatorId = item.created_by || item.author_id;
    if (creatorId !== user.id && profile?.role !== 'ADMIN') {
      return;
    }

    const { error } = await supabase.from('news').delete().eq('id', id);
    if (error) throw new Error(error.message);

    revalidatePath('/');
    revalidatePath('/news');
    revalidatePath('/admin/news');
  } catch (error: any) {
    console.error('Failed to delete news:', error);
  }
}
