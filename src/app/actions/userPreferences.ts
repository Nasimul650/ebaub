'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export async function updateUserPreferences(preferences: Record<string, any>) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { error: 'Unauthorized: User authentication required.' };
    }

    const { error } = await supabase.auth.updateUser({
      data: { preferences }
    });

    if (error) {
      return { error: error.message };
    }

    revalidatePath('/student/settings');
    revalidatePath('/teacher/settings');
    return { success: true, message: 'Preferences updated successfully.' };
  } catch (err: any) {
    return { error: err?.message || 'Failed to update preferences.' };
  }
}
