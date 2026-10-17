'use server';

import { createClient } from '@/utils/supabase/server';
import { supabaseAdmin } from '@/utils/supabase/admin';
import { revalidatePath } from 'next/cache';
import { extractPassword, extractString } from '@/lib/form-parser';
import {
  changeUserPassword as _changeUserPassword,
  adminResetTeacherPassword as _adminResetTeacherPassword,
  type PasswordChangeResult,
} from './change-password';
import { uploadAvatarAction as _uploadAvatarAction, type AvatarUploadResult } from './upload-avatar';

export type { PasswordChangeResult, AvatarUploadResult };

export async function changeUserPassword(formData: FormData): Promise<PasswordChangeResult> {
  return _changeUserPassword(formData);
}

export async function adminResetTeacherPassword(formData: FormData): Promise<PasswordChangeResult> {
  return _adminResetTeacherPassword(formData);
}

export async function updatePassword(formData: FormData): Promise<PasswordChangeResult> {
  return _changeUserPassword(formData);
}

export async function updateTeacherPassword(formData: FormData): Promise<PasswordChangeResult> {
  return _adminResetTeacherPassword(formData);
}

export async function uploadAvatarAction(formData: FormData): Promise<AvatarUploadResult> {
  return _uploadAvatarAction(formData);
}

export interface ProfileUpdateResult {
  success?: boolean;
  error?: string;
  message?: string;
  avatarUrl?: string | null;
  fullName?: string | null;
  username?: string | null;
  bio?: string | null;
  phone?: string | null;
}

const PROFILE_COLUMN_WHITELIST = ['bio', 'phone', 'full_name', 'first_name', 'last_name', 'username', 'avatar_url', 'updated_at'] as const;

/**
 * Server Action: updateUserProfile / updateProfileDetails
 * Updates personal details (username, full name, phone, bio, avatar) for the authenticated user.
 */
export async function updateUserProfile(formData: FormData): Promise<ProfileUpdateResult> {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return { error: 'Unauthorized: Please log in to update your profile settings.' };
    }

    // Ownership check: Ensure caller can only update their own profile
    const targetProfileId = (formData.get('profile_id') as string || formData.get('id') as string || '').trim();
    if (targetProfileId && targetProfileId !== user.id) {
      return { error: 'Cannot update another user profile' };
    }

    // Extract inputs
    const fullName = extractString(formData, 'fullName') || extractString(formData, 'full_name');
    const username = extractString(formData, 'username');
    const phone = extractString(formData, 'phone');
    const bio = extractString(formData, 'bio');
    const removeAvatar = formData.get('remove_avatar') === 'true';
    const avatarFile = formData.get('avatar') as File | null;

    // Optional password change if submitted together
    const newPassword = extractPassword(formData, 'new_password');
    if (newPassword) {
      const pwdRes = await changeUserPassword(formData);
      if (pwdRes.error) {
        return { error: pwdRes.error };
      }
    }

    // Input length validations
    if (fullName && fullName.length > 100) return { error: 'Full name cannot exceed 100 characters.' };
    if (username && username.length > 50) return { error: 'Username cannot exceed 50 characters.' };
    if (phone && phone.length > 30) return { error: 'Phone number cannot exceed 30 characters.' };
    if (bio && bio.length > 1000) return { error: 'Bio cannot exceed 1000 characters.' };

    let newAvatarUrl: string | null | undefined = undefined;

    // Handle avatar upload if present
    if (removeAvatar || (avatarFile && typeof avatarFile === 'object' && avatarFile.size > 0)) {
      const avatarRes = await uploadAvatarAction(formData);
      if (avatarRes.error) return { error: avatarRes.error };
      newAvatarUrl = avatarRes.avatarUrl;
    }

    // Explicitly construct updatePayload using whitelisted fields only
    const updatePayload: Record<string, any> = {};
    if (bio !== undefined) updatePayload.bio = bio || null;
    if (phone !== undefined) updatePayload.phone = phone || null;
    updatePayload.updated_at = new Date().toISOString();

    if (fullName) {
      const nameParts = fullName.split(' ');
      updatePayload.full_name = fullName;
      updatePayload.first_name = nameParts[0] || fullName;
      updatePayload.last_name = nameParts.slice(1).join(' ') || null;
    }

    if (username) {
      updatePayload.username = username;
    }

    if (newAvatarUrl !== undefined) {
      updatePayload.avatar_url = newAvatarUrl;
    }

    // Ensure all payload keys are in the strict whitelist
    for (const key of Object.keys(updatePayload)) {
      if (!PROFILE_COLUMN_WHITELIST.includes(key as any)) {
        delete updatePayload[key];
      }
    }

    // Update database
    let { error: updateError } = await supabase
      .from('profiles')
      .update(updatePayload)
      .eq('id', user.id);

    if (updateError) {
      console.warn('Profiles update error with user client, attempting admin fallback:', updateError.message);
      if (updateError.message.includes('username')) {
        delete updatePayload.username;
      }
      let adminUpdate = await supabaseAdmin
        .from('profiles')
        .update(updatePayload)
        .eq('id', user.id);

      if (adminUpdate.error && adminUpdate.error.message.includes('username')) {
        delete updatePayload.username;
        adminUpdate = await supabaseAdmin.from('profiles').update(updatePayload).eq('id', user.id);
      }
      if (adminUpdate.error) {
        return { error: `Failed to update profile: ${adminUpdate.error.message}` };
      }
    }

    // Update auth user metadata
    await supabase.auth.updateUser({
      data: {
        ...(fullName ? { full_name: fullName } : {}),
        ...(username ? { username } : {}),
        ...(newAvatarUrl !== undefined ? { avatar_url: newAvatarUrl } : {}),
      },
    }).catch((err) => {
      console.warn('Auth user metadata update warning:', err);
    });

    revalidatePath('/student/settings');
    revalidatePath('/teacher/settings');
    revalidatePath('/admin/settings');
    revalidatePath('/', 'layout');

    return {
      success: true,
      message: 'Profile details updated successfully.',
      avatarUrl: newAvatarUrl !== undefined ? newAvatarUrl : (user.user_metadata?.avatar_url || null),
      fullName: fullName || user.user_metadata?.full_name || null,
      username: username || user.user_metadata?.username || null,
      bio: bio || null,
      phone: phone || null,
    };
  } catch (err: any) {
    console.error('Unexpected error updating profile:', err);
    return { error: err.message || 'An unexpected error occurred while saving your profile.' };
  }
}

export const updateProfileDetails = updateUserProfile;
export const updateStudentProfile = updateUserProfile;
export const updateTeacherProfile = updateUserProfile;
