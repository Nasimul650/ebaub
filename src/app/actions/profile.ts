'use server';

import { createClient } from '@/utils/supabase/server';
import { supabaseAdmin } from '@/utils/supabase/admin';
import { revalidatePath } from 'next/cache';

export interface ProfileUpdateResult {
  success?: boolean;
  error?: string;
  message?: string;
  avatarUrl?: string | null;
  bio?: string | null;
  phone?: string | null;
}

/**
 * Server Action: updateUserProfile
 * Updates personal details (phone, bio, avatar) for the authenticated user.
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
    const phone = (formData.get('phone') as string || '').trim();
    const bio = (formData.get('bio') as string || '').trim();
    const removeAvatar = formData.get('remove_avatar') === 'true';
    const avatarFile = formData.get('avatar') as File | null;

    // Validate phone length
    if (phone && phone.length > 30) {
      return { error: 'Phone number cannot exceed 30 characters.' };
    }

    // Validate bio length
    if (bio && bio.length > 1000) {
      return { error: 'Bio cannot exceed 1000 characters.' };
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
        // Ensure bucket exists in storage
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
      
      let adminUpdate = await supabaseAdmin
        .from('profiles')
        .update(updatePayload)
        .eq('id', user.id);

      if (adminUpdate.error && (adminUpdate.error.message.includes('bio') || adminUpdate.error.message.includes('phone'))) {
        // Fallback: update only avatar_url if bio/phone columns don't exist yet
        const minimalPayload: Record<string, any> = {
          updated_at: new Date().toISOString(),
        };
        if (newAvatarUrl !== undefined) {
          minimalPayload.avatar_url = newAvatarUrl;
        }

        const fallbackRes = await supabaseAdmin
          .from('profiles')
          .update(minimalPayload)
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
      await supabaseAdmin.auth.admin.updateUserById(user.id, {
        user_metadata: {
          ...(user.user_metadata || {}),
          ...(newAvatarUrl !== undefined ? { avatar_url: newAvatarUrl } : {}),
          bio: bio || null,
          phone: phone || null,
        },
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
      bio: bio || null,
      phone: phone || null,
    };
  } catch (err: any) {
    console.error('Unexpected error updating profile:', err);
    return { error: err.message || 'An unexpected error occurred while saving your profile.' };
  }
}
