'use server';

import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/app/actions/cms';

export interface SettingsActionResult {
  success?: boolean;
  message?: string;
  error?: string;
}

/**
 * Server action to update static page settings for a specific page:
 * ('global_footer', 'home', 'academics', 'admissions', 'faculty', 'student_life', 'contact').
 * Requires Admin authentication.
 * Automatically triggers cache revalidation for the targeted public route.
 */
export async function updateSiteSettings(
  pageId: string,
  payload: Record<string, any>
): Promise<SettingsActionResult> {
  try {
    const { supabase } = await requireAdmin();

    if (!pageId || !payload || typeof payload !== 'object') {
      return { error: 'Invalid page identifier or settings data provided.' };
    }

    const { error } = await supabase
      .from('site_settings')
      .upsert(
        {
          id: pageId,
          data: payload,
          updated_at: new Date().toISOString()
        },
        { onConflict: 'id' }
      );

    if (error) {
      console.error(`Error updating site settings for page '${pageId}':`, error.message);
      return { error: `Failed to update settings for ${pageId}: ${error.message}` };
    }

    // Revalidate specific public paths
    switch (pageId) {
      case 'global_footer':
        revalidatePath('/', 'layout');
        break;
      case 'home':
        revalidatePath('/');
        break;
      case 'academics':
        revalidatePath('/academics');
        break;
      case 'admissions':
        revalidatePath('/admissions');
        break;
      case 'faculty':
        revalidatePath('/faculty');
        break;
      case 'student_life':
        revalidatePath('/events');
        break;
      case 'contact':
        revalidatePath('/contact');
        break;
      default:
        revalidatePath('/', 'layout');
        break;
    }

    revalidatePath('/admin/settings');

    const formattedName = pageId
      .split('_')
      .map(w => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');

    return {
      success: true,
      message: `${formattedName} settings saved successfully! Public page updated.`
    };
  } catch (error: any) {
    console.error(`Unexpected error updating ${pageId} settings:`, error);
    return { error: error.message || 'An unexpected error occurred.' };
  }
}
