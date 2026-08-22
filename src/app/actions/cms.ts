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
    const image_url = formData.get('image_url') as string;

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
      image_url,
      author_id: user.id,
      published_at: new Date().toISOString(), // Auto-publish for now
    });

    if (error) throw new Error(error.message);

    revalidatePath('/');
    revalidatePath('/news');
    revalidatePath('/admin/news');
    
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
    const attachment_url = formData.get('attachment_url') as string;

    const updates: any = {};
    if (title) updates.title = title;
    if (category !== null) updates.category = category;
    if (priority !== null) updates.priority = priority;
    if (date !== null) updates.date = date;
    if (attachment_url) updates.attachment_url = attachment_url;
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

export async function deleteNews(formData: FormData) {
  try {
    const { supabase } = await requireAdmin();
    const id = formData.get('id') as string;
    if (!id) throw new Error('ID is required');

    const { error } = await supabase.from('news').delete().eq('id', id);
    if (error) throw new Error(error.message);

    revalidatePath('/');
    revalidatePath('/news');
    revalidatePath('/admin/news');
  } catch (error: any) {
    console.error('Failed to delete news:', error);
  }
}

export async function deleteNotice(formData: FormData) {
  try {
    const { supabase } = await requireAdmin();
    const id = formData.get('id') as string;
    if (!id) throw new Error('ID is required');

    const { error } = await supabase.from('notices').delete().eq('id', id);
    if (error) throw new Error(error.message);

    revalidatePath('/');
    revalidatePath('/notices');
    revalidatePath('/admin/notices');
  } catch (error: any) {
    console.error('Failed to delete notice:', error);
  }
}

// ==========================================
// EVENTS ACTIONS
// ==========================================

export async function createEvent(prevState: any, formData: FormData) {
  try {
    const { supabase, user } = await requireAdmin();

    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const event_date = formData.get('event_date') as string;
    const time = formData.get('time') as string;
    const location = formData.get('location') as string;
    const status = formData.get('status') as string;
    const image_url = formData.get('image_url') as string;

    if (!title || !event_date) {
      return { error: 'Event title and date are required.' };
    }

    const slug = generateSlug(title);

    const { error } = await supabase.from('events').insert({
      title,
      slug,
      description: description || '',
      event_date,
      time,
      location,
      status: status || 'Upcoming',
      image_url,
      organizer_id: user.id
    });

    if (error) throw new Error(error.message);

    revalidatePath('/');
    revalidatePath('/events');
    revalidatePath('/admin/events');
    
    return { success: true, message: 'Event created successfully!' };
  } catch (error: any) {
    console.error('Failed to create event:', error);
    return { error: error.message || 'An unexpected error occurred.' };
  }
}

export async function updateEvent(id: string, prevState: any, formData: FormData) {
  try {
    const { supabase } = await requireAdmin();

    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const event_date = formData.get('event_date') as string;
    const time = formData.get('time') as string;
    const location = formData.get('location') as string;
    const status = formData.get('status') as string;
    const image_url = formData.get('image_url') as string;

    const updates: any = {};
    if (title) updates.title = title;
    if (description !== null) updates.description = description;
    if (event_date) updates.event_date = event_date;
    if (time !== null) updates.time = time;
    if (location !== null) updates.location = location;
    if (status !== null) updates.status = status;
    if (image_url) updates.image_url = image_url;

    const { error } = await supabase.from('events').update(updates).eq('id', id);

    if (error) throw new Error(error.message);

    revalidatePath('/');
    revalidatePath('/events');
    revalidatePath('/admin/events');
    
    return { success: true, message: 'Event updated successfully!' };
  } catch (error: any) {
    console.error('Failed to update event:', error);
    return { error: error.message || 'An unexpected error occurred.' };
  }
}

// ==========================================
// FACULTY ACTIONS
// ==========================================

export async function createFaculty(prevState: any, formData: FormData) {
  try {
    const { supabase, user } = await requireAdmin();

    const name = formData.get('name') as string;
    const title = formData.get('title') as string;
    const bio = formData.get('bio') as string;
    const image_url = formData.get('image_url') as string;

    if (!name || !title) {
      return { error: 'Name and title are required.' };
    }

    const { error } = await supabase.from('faculty_members').insert({
      name,
      title,
      bio,
      image_url
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
    const { supabase } = await requireAdmin();

    const name = formData.get('name') as string;
    const title = formData.get('title') as string;
    const bio = formData.get('bio') as string;
    const image_url = formData.get('image_url') as string;

    const updates: any = { updated_at: new Date().toISOString() };
    if (name) updates.name = name;
    if (title) updates.title = title;
    if (bio !== null) updates.bio = bio;
    if (image_url) updates.image_url = image_url;

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

