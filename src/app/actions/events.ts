'use server';

import { requireAdmin, generateSlug } from '@/lib/cms-utils';
import { revalidatePath } from 'next/cache';

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
    const { supabase, user, profile } = await requireAdmin();

    const { data: item } = await supabase.from('events').select('created_by, organizer_id').eq('id', id).maybeSingle();
    if (!item) {
      return { error: 'Event not found.' };
    }
    const creatorId = item.created_by || item.organizer_id;
    if (creatorId !== user.id && profile?.role !== 'ADMIN') {
      return { error: 'Unauthorized' };
    }

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

export async function deleteEvent(id: string) {
  try {
    const { supabase, user, profile } = await requireAdmin();

    const { data: item } = await supabase.from('events').select('created_by, organizer_id').eq('id', id).maybeSingle();
    if (!item) {
      return { error: 'Event not found.' };
    }
    const creatorId = item.created_by || item.organizer_id;
    if (creatorId !== user.id && profile?.role !== 'ADMIN') {
      return { error: 'Unauthorized' };
    }

    const { error } = await supabase.from('events').delete().eq('id', id);
    if (error) throw new Error(error.message);

    revalidatePath('/');
    revalidatePath('/events');
    revalidatePath('/admin/events');

    return { success: true, message: 'Event deleted successfully!' };
  } catch (error: any) {
    return { error: error.message || 'Failed to delete event.' };
  }
}

export async function createCalendarEvent(prevState: any, formData: FormData) {
  try {
    const { supabase } = await requireAdmin();
    const title = formData.get('title') as string;
    const start_date = formData.get('start_date') as string;
    const end_date = formData.get('end_date') as string;
    const category = formData.get('category') as string;
    const description = formData.get('description') as string;

    if (!title || !start_date) {
      return { error: 'Title and Start Date are required.' };
    }

    const { error } = await supabase.from('academic_calendar').insert({
      title,
      start_date,
      end_date: end_date || null,
      category,
      description
    });

    if (error) throw new Error(error.message);

    revalidatePath('/academic-calendar');
    revalidatePath('/admin/calendar');
    
    return { success: true, message: 'Calendar event added successfully!' };
  } catch (error: any) {
    return { error: error.message || 'Failed to create calendar event.' };
  }
}

export async function updateCalendarEvent(id: string, prevState: any, formData: FormData) {
  try {
    const { supabase } = await requireAdmin();
    const title = formData.get('title') as string;
    const start_date = formData.get('start_date') as string;
    const end_date = formData.get('end_date') as string;
    const category = formData.get('category') as string;
    const description = formData.get('description') as string;

    const updates: any = {};
    if (title) updates.title = title;
    if (start_date) updates.start_date = start_date;
    if (end_date !== undefined) updates.end_date = end_date || null;
    if (category !== undefined) updates.category = category;
    if (description !== undefined) updates.description = description;

    const { error } = await supabase.from('academic_calendar').update(updates).eq('id', id);
    if (error) throw new Error(error.message);

    revalidatePath('/academic-calendar');
    revalidatePath('/admin/calendar');
    
    return { success: true, message: 'Calendar event updated successfully!' };
  } catch (error: any) {
    return { error: error.message || 'Failed to update calendar event.' };
  }
}
