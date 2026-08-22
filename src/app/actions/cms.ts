'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

// Helper to generate unique slugs
function generateSlug(title: string) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') + '-' + Date.now();
}

// Helper to authenticate and authorize CMS actions
async function requireAdmin() {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError || !user) {
    throw new Error('Unauthorized: You must be logged in.');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profile?.role !== 'ADMIN') {
    throw new Error('Forbidden: Only administrators can perform this action.');
  }

  return { supabase, user };
}

// ==========================================
// NEWS ACTIONS
// ==========================================

export async function createNews(prevState: any, formData: FormData) {
  try {
    const { supabase, user } = await requireAdmin();

    const title = formData.get('title') as string;
    const summary = formData.get('summary') as string;
    const category = formData.get('category') as string;
    const content = formData.get('content') as string;

    if (!title || !content) {
      return { error: 'Title and article content are required.' };
    }

    const slug = generateSlug(title);

    const { error } = await supabase.from('news').insert({
      title,
      slug,
      summary,
      category,
      content,
      author_id: user.id,
      published_at: new Date().toISOString(), // Auto-publish for now
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
    const { supabase } = await requireAdmin();

    const title = formData.get('title') as string;
    const summary = formData.get('summary') as string;
    const category = formData.get('category') as string;
    const content = formData.get('content') as string;

    const updates: any = { updated_at: new Date().toISOString() };
    if (title) updates.title = title;
    if (summary !== null) updates.summary = summary;
    if (category !== null) updates.category = category;
    if (content) updates.content = content;

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

// ==========================================
// NOTICES ACTIONS
// ==========================================

export async function createNotice(prevState: any, formData: FormData) {
  try {
    const { supabase, user } = await requireAdmin();

    const title = formData.get('title') as string;
    const category = formData.get('category') as string;
    const priority = formData.get('priority') as string;
    const date = formData.get('date') as string;
    const description = formData.get('description') as string;

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
      content: description || 'No content provided.', // Fallback for DB constraint
      author_id: user.id,
      published_at: new Date().toISOString(),
    });

    if (error) throw new Error(error.message);

    revalidatePath('/');
    revalidatePath('/notices');
    
    return { success: true, message: 'Notice created successfully!' };
  } catch (error: any) {
    console.error('Failed to create notice:', error);
    return { error: error.message || 'An unexpected error occurred.' };
  }
}

export async function updateNotice(id: string, prevState: any, formData: FormData) {
  try {
    const { supabase } = await requireAdmin();

    const title = formData.get('title') as string;
    const category = formData.get('category') as string;
    const priority = formData.get('priority') as string;
    const date = formData.get('date') as string;
    const description = formData.get('description') as string;

    const updates: any = {};
    if (title) updates.title = title;
    if (category !== null) updates.category = category;
    if (priority !== null) updates.priority = priority;
    if (date !== null) updates.date = date;
    if (description !== null) {
      updates.description = description;
      updates.content = description; // Sync with content required field
    }

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
