'use server';

import { createClient } from '@/utils/supabase/server';
import { requireAdmin } from '@/app/actions/cms';
import { revalidatePath } from 'next/cache';

export async function submitContactForm(prevState: any, formData: FormData) {
  try {
    const supabase = await createClient(); 
    
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const subject = formData.get('subject') as string;
    const message = formData.get('message') as string;

    if (!name || !email || !subject || !message) {
      return { error: 'All fields are required.' };
    }

    // Insert as anon user (allowed by RLS policy)
    const { error } = await supabase.from('contact_messages').insert({
      name, 
      email, 
      subject, 
      message
    });

    if (error) throw new Error(error.message);

    return { success: true, message: 'Your message has been sent successfully! We will get back to you soon.' };
  } catch (error: any) {
    console.error('Contact form error:', error);
    return { error: error.message || 'Failed to submit form. Please try again later.' };
  }
}

export async function updateMessageStatus(id: string, status: string) {
  try {
    const { supabase } = await requireAdmin();
    const { error } = await supabase.from('contact_messages').update({ status }).eq('id', id);
    if (error) throw new Error(error.message);

    revalidatePath('/admin/messages');
    return { success: true };
  } catch (error: any) {
    console.error('Update message error:', error);
    return { error: error.message };
  }
}
