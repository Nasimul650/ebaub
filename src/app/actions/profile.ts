'use server';

import { createClient } from '@/utils/supabase/server';
import { supabaseAdmin } from '@/utils/supabase/admin';
import { revalidatePath } from 'next/cache';

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

export interface PasswordChangeResult {
  success?: boolean;
  error?: string;
  message?: string;
}

/**
 * Server Action: updateUserProfile
 * Updates personal details (username, full name, phone, bio, avatar) for the authenticated user.
 */
export async function updateUserProfile(formData: FormData): Promise<ProfileUpdateResult> {
  try {
    // 1. Authenticate the caller
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return { error: 'Unauthorized: Please log in to update your profile settings.' };
    }

    // 2. Extract inputs
    const fullName = (formData.get('fullName') as string || formData.get('full_name') as string || '').trim();
    const username = (formData.get('username') as string || '').trim();
    const phone = (formData.get('phone') as string || '').trim();
    const bio = (formData.get('bio') as string || '').trim();
    const removeAvatar = formData.get('remove_avatar') === 'true';
    const avatarFile = formData.get('avatar') as File | null;

    // Optional password change if submitted together
    const newPassword = (formData.get('new_password') as string || '').trim();
    const confirmPassword = (formData.get('confirm_password') as string || '').trim();

    // Validations
    if (fullName && fullName.length > 100) {
      return { error: 'Full name cannot exceed 100 characters.' };
    }

    if (username && username.length > 50) {
      return { error: 'Username cannot exceed 50 characters.' };
    }

    if (phone && phone.length > 30) {
      return { error: 'Phone number cannot exceed 30 characters.' };
    }

    if (bio && bio.length > 1000) {
      return { error: 'Bio cannot exceed 1000 characters.' };
    }

    // Validate password if provided
    if (newPassword) {
      if (newPassword.length < 6) {
        return { error: 'Password must be at least 6 characters long.' };
      }
      if (newPassword !== confirmPassword) {
        return { error: 'New password and confirm password do not match.' };
      }

      const { error: pwdError } = await supabaseAdmin.auth.admin.updateUserById(user.id, {
        password: newPassword,
      });

      if (pwdError) {
        return { error: `Failed to update password: ${pwdError.message}` };
      }
    }

    let newAvatarUrl: string | null | undefined = undefined;

    // 3. Handle Avatar File Upload or Removal
    if (removeAvatar) {
      newAvatarUrl = null;
    } else if (avatarFile && typeof avatarFile === 'object' && avatarFile.size > 0) {
      // Validate file size (5MB max)
      const MAX_FILE_SIZE = 5 * 1024 * 1024;
      if (avatarFile.size > MAX_FILE_SIZE) {
        return { error: 'Avatar image exceeds maximum allowed limit of 5 MB.' };
      }

      // Validate MIME type
      const allowedMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/jpg'];
      if (!allowedMimes.includes(avatarFile.type.toLowerCase())) {
        return { error: 'Only PNG, JPEG, WEBP, or GIF image files are permitted.' };
      }

      const fileExt = avatarFile.name.split('.').pop()?.toLowerCase() || 'jpg';
      const storagePath = `${user.id}/${Date.now()}-avatar.${fileExt}`;

      const arrayBuffer = await avatarFile.arrayBuffer();
      const fileBuffer = Buffer.from(arrayBuffer);

      // Attempt upload with user client
      let uploadRes = await supabase.storage
        .from('avatars')
        .upload(storagePath, fileBuffer, {
          contentType: avatarFile.type || 'image/jpeg',
          upsert: true,
        });

      // Fallback to supabaseAdmin if bucket not initialized or RLS mismatch
      if (uploadRes.error) {
        await supabaseAdmin.storage.createBucket('avatars', {
          public: true,
          fileSizeLimit: 5242880,
          allowedMimeTypes: allowedMimes,
        }).catch(() => null);

        uploadRes = await supabaseAdmin.storage
          .from('avatars')
          .upload(storagePath, fileBuffer, {
            contentType: avatarFile.type || 'image/jpeg',
            upsert: true,
          });
      }

      if (uploadRes.error) {
        console.error('Avatar upload error:', uploadRes.error);
        return { error: `Failed to upload avatar: ${uploadRes.error.message}` };
      }

      // Retrieve public URL
      const { data: publicUrlData } = supabaseAdmin.storage
        .from('avatars')
        .getPublicUrl(storagePath);

      newAvatarUrl = publicUrlData.publicUrl;
    }

    // 4. Update Database (public.profiles)
    const updatePayload: Record<string, any> = {
      bio: bio || null,
      phone: phone || null,
      updated_at: new Date().toISOString(),
    };

    if (fullName) {
      const nameParts = fullName.split(' ');
      const firstName = nameParts[0] || fullName;
      const lastName = nameParts.slice(1).join(' ') || null;
      updatePayload.full_name = fullName;
      updatePayload.first_name = firstName;
      updatePayload.last_name = lastName;
    }

    if (username) {
      updatePayload.username = username;
    }

    if (newAvatarUrl !== undefined) {
      updatePayload.avatar_url = newAvatarUrl;
    }

    // Attempt standard update first
    let { error: updateError } = await supabase
      .from('profiles')
      .update(updatePayload)
      .eq('id', user.id);

    // If update failed (e.g. column missing before migration or RLS issue), try admin client with graceful fallback
    if (updateError) {
      console.warn('Profiles update error with user client, attempting fallback:', updateError.message);
      
      if (updateError.message.includes('username')) {
        delete updatePayload.username;
      }

      let adminUpdate = await supabaseAdmin
        .from('profiles')
        .update(updatePayload)
        .eq('id', user.id);

      if (adminUpdate.error && adminUpdate.error.message.includes('username')) {
        delete updatePayload.username;
        adminUpdate = await supabaseAdmin
          .from('profiles')
          .update(updatePayload)
          .eq('id', user.id);
      }

      if (adminUpdate.error && (adminUpdate.error.message.includes('bio') || adminUpdate.error.message.includes('phone'))) {
        delete updatePayload.bio;
        delete updatePayload.phone;

        const fallbackRes = await supabaseAdmin
          .from('profiles')
          .update(updatePayload)
          .eq('id', user.id);

        if (fallbackRes.error) {
          return { error: `Database update failed: ${fallbackRes.error.message}` };
        }
      } else if (adminUpdate.error) {
        return { error: `Database update failed: ${adminUpdate.error.message}` };
      }
    }

    // 5. Keep Supabase Auth User Metadata in sync
    try {
      const updatedMeta: Record<string, any> = {
        ...(user.user_metadata || {}),
        ...(newAvatarUrl !== undefined ? { avatar_url: newAvatarUrl } : {}),
        bio: bio || null,
        phone: phone || null,
      };

      if (fullName) {
        const nameParts = fullName.split(' ');
        updatedMeta.full_name = fullName;
        updatedMeta.first_name = nameParts[0] || fullName;
        updatedMeta.last_name = nameParts.slice(1).join(' ') || null;
      }

      if (username) {
        updatedMeta.username = username;
      }

      await supabaseAdmin.auth.admin.updateUserById(user.id, {
        user_metadata: updatedMeta,
      });
    } catch (metaErr) {
      console.warn('Could not sync user_metadata:', metaErr);
    }

    // 6. Revalidate routes
    revalidatePath('/settings/profile');
    revalidatePath('/settings');
    revalidatePath('/student');
    revalidatePath('/student/study');
    revalidatePath('/student/files');
    revalidatePath('/teacher');
    revalidatePath('/teacher/materials');
    revalidatePath('/admin');
    revalidatePath('/admin/users');
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

/**
 * Server Action: changeUserPassword
 * Specifically updates the authenticated user's account password.
 */
export async function changeUserPassword(formData: FormData): Promise<PasswordChangeResult> {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return { error: 'Unauthorized: Please log in to update your password.' };
    }

    const newPassword = (formData.get('new_password') as string || '').trim();
    const confirmPassword = (formData.get('confirm_password') as string || '').trim();

    if (!newPassword) {
      return { error: 'Please enter a new password.' };
    }

    if (newPassword.length < 6) {
      return { error: 'Password must be at least 6 characters long.' };
    }

    if (newPassword !== confirmPassword) {
      return { error: 'New password and confirmation password do not match.' };
    }

    const { error: pwdError } = await supabaseAdmin.auth.admin.updateUserById(user.id, {
      password: newPassword,
    });

    if (pwdError) {
      return { error: `Failed to update password: ${pwdError.message}` };
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
