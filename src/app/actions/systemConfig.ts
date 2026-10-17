'use server';

import { requireAdmin } from '@/lib/cms-utils';
import { revalidatePath } from 'next/cache';

export async function updateSystemConfig(configKey: string, configValue: any) {
  try {
    const { supabase } = await requireAdmin();

    const { error } = await supabase
      .from('site_settings')
      .upsert(
        {
          id: `config_${configKey}`,
          data: { value: configValue },
          updated_at: new Date().toISOString()
        },
        { onConflict: 'id' }
      );

    if (error) {
      return { error: error.message };
    }

    revalidatePath('/admin');
    return { success: true, message: `Configuration '${configKey}' updated.` };
  } catch (err: any) {
    return { error: err?.message || 'Failed to update system config.' };
  }
}
