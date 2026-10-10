'use server';

import { createClient } from '@/utils/supabase/server';
import { supabaseAdmin } from '@/utils/supabase/admin';
import { revalidatePath } from 'next/cache';

export interface WhitelistResult {
  success?: boolean;
  error?: string;
  message?: string;
  whitelist?: {
    id: string;
    institutional_id: string;
    role: string;
    department_id?: string | null;
    batch?: string | null;
  };
}

/**
 * Server Action: whitelistCredential
 * Pre-authorizes an official Teacher or Student institutional ID into the credential_whitelist table.
 * Verified to be callable strictly by authenticated Administrators.
 */
export async function whitelistCredential(formData: FormData): Promise<WhitelistResult> {
  try {
    // 1. Authenticate caller and assert Admin role
    const supabase = await createClient();
    const { data: { user: caller }, error: authError } = await supabase.auth.getUser();

    if (authError || !caller) {
      return { error: 'Unauthorized: You must be logged in as an administrator to whitelist credentials.' };
    }

    const { data: callerProfile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', caller.id)
      .maybeSingle();

    const callerRole = (callerProfile?.role || caller.user_metadata?.role || '').toUpperCase();
    if (callerRole !== 'ADMIN') {
      return { error: 'Forbidden: Only administrators have permission to manage the institutional whitelist.' };
    }

    // 2. Extract inputs
    const rawRole = (formData.get('role') as string || '').trim().toLowerCase();
    const institutionalId = (formData.get('institutional_id') as string || '').trim();
    const departmentId = (formData.get('department_id') as string || '').trim() || null;
    const batch = (formData.get('batch') as string || '').trim() || null;

    // 3. Validation
    if (!rawRole || (rawRole !== 'teacher' && rawRole !== 'student')) {
      return { error: 'Invalid role specified. Must be either Teacher or Student.' };
    }

    if (!institutionalId) {
      return { 
        error: rawRole === 'student' 
          ? 'Student Registration Number / Institutional ID is required.' 
          : 'Teacher ID / Institutional ID is required.' 
      };
    }

    // 4. Duplicate checks
    // Check if institutional_id already exists in credential_whitelist
    const { data: existingWhitelist } = await supabaseAdmin
      .from('credential_whitelist')
      .select('id, institutional_id, is_claimed, role')
      .ilike('institutional_id', institutionalId)
      .maybeSingle();

    if (existingWhitelist) {
      if (existingWhitelist.is_claimed) {
        return { 
          error: `Institutional ID "${institutionalId}" is already whitelisted and has already been claimed by a registered user.` 
        };
      }
      return { 
        error: `Institutional ID "${institutionalId}" is already whitelisted (${existingWhitelist.role}) and awaiting registration claim.` 
      };
    }

    // Check if institutional_id already exists in profiles
    const { data: existingProfile } = await supabaseAdmin
      .from('profiles')
      .select('id, institutional_id')
      .ilike('institutional_id', institutionalId)
      .maybeSingle();

    if (existingProfile) {
      return { 
        error: `An active university account with Institutional ID "${institutionalId}" is already registered in the system.` 
      };
    }

    // 5. Insert into credential_whitelist
    const { data: inserted, error: insertError } = await supabaseAdmin
      .from('credential_whitelist')
      .insert({
        institutional_id: institutionalId,
        role: rawRole,
        department_id: departmentId,
        batch: rawRole === 'student' ? batch : null,
        is_claimed: false,
      })
      .select('id, institutional_id, role, department_id, batch')
      .single();

    if (insertError) {
      console.error('Insert Whitelist Error:', insertError);
      if (insertError.code === '23505' || insertError.message?.includes('unique')) {
        return { error: `Institutional ID "${institutionalId}" is already whitelisted in the database.` };
      }
      if (insertError.message?.includes('credential_whitelist') || insertError.code === '42P01') {
        return { 
          error: 'The "credential_whitelist" table is not yet initialized in Supabase. Please apply migration 0018_credential_whitelist.sql in the Supabase SQL Editor.' 
        };
      }
      return { error: insertError.message || 'Failed to whitelist institutional ID.' };
    }

    // 6. Revalidate relevant paths
    revalidatePath('/admin/users/create');
    revalidatePath('/admin/users');
    revalidatePath('/signup');

    return {
      success: true,
      message: `${rawRole === 'teacher' ? 'Teacher' : 'Student'} ID "${institutionalId}" whitelisted successfully! The user can now self-register at /signup.`,
      whitelist: inserted,
    };

  } catch (err: any) {
    console.error('whitelistCredential Exception:', err);
    return { error: err?.message || 'An unexpected error occurred while whitelisting the credential.' };
  }
}

/**
 * Server Action: getWhitelistedCredentials
 * Fetches all whitelisted entries for the Admin review table
 */
export async function getWhitelistedCredentials() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabaseAdmin
      .from('credential_whitelist')
      .select(`
        id,
        institutional_id,
        role,
        department_id,
        batch,
        is_claimed,
        claimed_by,
        created_at,
        departments (
          id,
          name,
          faculties (
            id,
            name
          )
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('getWhitelistedCredentials error:', error);
      return [];
    }
    return data || [];
  } catch (err) {
    console.error('getWhitelistedCredentials exception:', err);
    return [];
  }
}

/**
 * Server Action: deleteWhitelistedCredential
 * Allows admins to revoke an unclaimed whitelist entry
 */
export async function deleteWhitelistedCredential(id: string) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { error: 'Unauthorized: Admin authentication required.' };
    }

    const { error } = await supabaseAdmin
      .from('credential_whitelist')
      .delete()
      .eq('id', id);

    if (error) {
      return { error: error.message };
    }

    revalidatePath('/admin/users/create');
    return { success: true, message: 'Whitelist entry removed successfully.' };
  } catch (err: any) {
    return { error: err?.message || 'Failed to delete whitelist entry.' };
  }
}
