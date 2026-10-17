'use server';

import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/lib/cms-utils';
import { validateSettingsPayload } from '@/lib/settings-validator';

export interface SettingsActionResult {
  success?: boolean;
  message?: string;
  error?: string;
}

export async function updateAdminSiteSettings(
  pageId: string,
  payload: Record<string, any>
): Promise<SettingsActionResult> {
  try {
    const { supabase } = await requireAdmin();

    const validation = validateSettingsPayload(pageId, payload);
    if (!validation.isValid) {
      return { error: validation.error };
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
      return { error: `Failed to update settings for ${pageId}: ${error.message}` };
    }

    revalidatePath('/', 'layout');
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
    return { error: error.message || 'An unexpected error occurred.' };
  }
}
