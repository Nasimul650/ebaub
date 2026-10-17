'use server';

import { supabaseAdmin } from '@/utils/supabase/admin';
import { revalidatePath } from 'next/cache';
import { getWhitelistByInstitutionalId } from '@/lib/queries/whitelist';

/**
 * Server Action: instantVerifyWhitelistedUser / whitelistVerifyAction
 * Verifies whitelist credentials and confirms user email if official institutional ID is claimed.
 */
export async function instantVerifyWhitelistedUser(email: string) {
  if (!email || !email.includes('@')) {
    return { error: 'Please enter a valid email address.' };
  }

  try {
    const { data: usersData, error: listErr } = await supabaseAdmin.auth.admin.listUsers();
    if (listErr || !usersData?.users) {
      return { error: 'Unable to access auth user registry.' };
    }

    const targetUser = usersData.users.find(
      (u) => u.email?.toLowerCase().trim() === email.toLowerCase().trim()
    );

    if (!targetUser) {
      return { error: 'No account found with this email address.' };
    }

    // Security check: Only accounts associated with an official claimed whitelist entry can use instant verification
    const { data: whitelistEntry } = await supabaseAdmin
      .from('credential_whitelist')
      .select('id, is_claimed')
      .eq('claimed_by', targetUser.id)
      .eq('is_claimed', true)
      .maybeSingle();

    if (!whitelistEntry) {
      return { error: 'Instant verification is only available for pre-authorized university credentials.' };
    }

    const { error: updateErr } = await supabaseAdmin.auth.admin.updateUserById(targetUser.id, {
      email_confirm: true,
    });

    if (updateErr) {
      return { error: updateErr.message };
    }

    revalidatePath('/login');
    revalidatePath('/verify-email');
    return { success: true, message: 'Account verified successfully! You can now log in.' };
  } catch (err: any) {
    return { error: err?.message || 'Verification failed.' };
  }
}

export const whitelistAction = instantVerifyWhitelistedUser;
export const verifyWhitelistAction = instantVerifyWhitelistedUser;
