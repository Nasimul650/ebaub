'use server';

import { createClient } from '@/utils/supabase/server';
import { supabaseAdmin } from '@/utils/supabase/admin';
import { extractPassword } from '@/lib/form-parser';
import { formatPasswordError } from '@/lib/error-messages';
import { PASSWORD_MIN_LENGTH } from '@/lib/config';

export interface PasswordChangeResult {
  success?: boolean;
  error?: string;
  message?: string;
}

/**
 * Server Action: changeUserPassword (Self-service password update)
 * Verifies current password before allowing change.
 */
export async function changeUserPassword(formData: FormData): Promise<PasswordChangeResult> {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return { error: 'Unauthorized: Please log in to update your password.' };
    }

    // Ownership check: Ensure caller can only change their own password
    const targetUserId = (formData.get('user_id') as string || formData.get('profile_id') as string || '').trim();
    if (targetUserId && targetUserId !== user.id) {
      return { error: 'Forbidden: Cannot change password for another user' };
    }

    const currentPassword = extractPassword(formData, 'current_password');
    const newPassword = extractPassword(formData, 'new_password');
    const confirmPassword = extractPassword(formData, 'confirm_password');

    if (!currentPassword) {
      return { error: 'Current password is required.' };
    }

    // Verify current password with Supabase auth
    const { error: authErr } = await supabase.auth.signInWithPassword({
      email: user.email!,
      password: currentPassword,
    });
    if (authErr) {
      return { error: 'Current password incorrect' };
    }

    if (!newPassword) {
      return { error: 'Please enter a new password.' };
    }

    if (newPassword.length < PASSWORD_MIN_LENGTH) {
      return { error: `Password must be at least ${PASSWORD_MIN_LENGTH} characters long.` };
    }

    if (newPassword !== confirmPassword) {
      return { error: 'New password and confirmation password do not match.' };
    }

    const { error: pwdError } = await supabaseAdmin.auth.admin.updateUserById(user.id, {
      password: newPassword,
    });

    if (pwdError) {
      return { error: formatPasswordError(pwdError) };
    }

    return {
      success: true,
      message: 'Password changed successfully! Please use your new password next time you sign in.',
    };
  } catch (err: any) {
    console.error('Unexpected error changing password:', err);
    return { error: err.message || 'An unexpected error occurred while changing your password.' };
  }
}

/**
 * Server Action: adminResetTeacherPassword (Privileged operation)
 * Dedicated admin-only action with explicit ADMIN role check at start.
 */
export async function adminResetTeacherPassword(formData: FormData): Promise<PasswordChangeResult> {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return { error: 'Unauthorized: Admin authentication required.' };
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profile?.role !== 'ADMIN') {
      return { error: 'Forbidden: Only administrators can execute teacher password resets.' };
    }

    const targetUserId = (formData.get('user_id') as string || formData.get('teacher_id') as string || '').trim();
    const newPassword = extractPassword(formData, 'new_password');

    if (!targetUserId) {
      return { error: 'Teacher user ID is required.' };
    }

    if (!newPassword || newPassword.length < PASSWORD_MIN_LENGTH) {
      return { error: `New password must be at least ${PASSWORD_MIN_LENGTH} characters long.` };
    }

    const { error: resetErr } = await supabaseAdmin.auth.admin.updateUserById(targetUserId, {
      password: newPassword,
    });

    if (resetErr) {
      return { error: formatPasswordError(resetErr) };
    }

    return {
      success: true,
      message: 'Teacher password reset successfully by administrator.',
    };
  } catch (err: any) {
    return { error: err?.message || 'Failed to reset teacher password.' };
  }
}

// Aliases for compatibility
export const updatePassword = changeUserPassword;
export const updateTeacherPassword = adminResetTeacherPassword;
