'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/app/actions/cms';

export interface SettingsActionResult {
  success?: boolean;
  message?: string;
  error?: string;
}

/**
 * Server action to update a specific global site settings section ('hero', 'general', 'contact', 'socials').
 * Requires Admin authentication.
 * Automatically triggers site-wide cache revalidation.
 */
export async function updateSiteSettings(
  section: string,
  payload: Record<string, any>
): Promise<SettingsActionResult> {
  try {
    const { supabase } = await requireAdmin();

    if (!section || !payload || typeof payload !== 'object') {
      return { error: 'Invalid section name or settings data provided.' };
    }

    const { error } = await supabase
      .from('site_settings')
      .upsert(
        {
          id: section,
          data: payload,
          updated_at: new Date().toISOString()
        },
        { onConflict: 'id' }
      );

    if (error) {
      console.error(`Error updating site settings for ${section}:`, error.message);
      return { error: `Failed to update ${section} settings: ${error.message}` };
    }

    // Revalidate layout and home
    revalidatePath('/', 'layout');
    revalidatePath('/admin/settings');

    const formattedSection = section.charAt(0).toUpperCase() + section.slice(1);
    return {
      success: true,
      message: `${formattedSection} settings saved successfully!`
    };
  } catch (error: any) {
    console.error(`Unexpected error updating ${section} settings:`, error);
    return { error: error.message || 'An unexpected error occurred.' };
  }
}
