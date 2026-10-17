'use server';

import { createClient } from '@/utils/supabase/server';
import { supabaseAdmin } from '@/utils/supabase/admin';

export interface AvatarUploadResult {
  success?: boolean;
  avatarUrl?: string | null;
  error?: string;
}

/**
 * Server Action: uploadAvatarAction
 * Dedicated avatar upload action handling file validation and Supabase storage upload.
 */
export async function uploadAvatarAction(formData: FormData): Promise<AvatarUploadResult> {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return { error: 'Unauthorized: Authentication required to upload avatar.' };
    }

    const avatarFile = formData.get('avatar') as File | null;
    const removeAvatar = formData.get('remove_avatar') === 'true';

    if (removeAvatar) {
      await supabase.from('profiles').update({ avatar_url: null }).eq('id', user.id);
      return { success: true, avatarUrl: null };
    }

    if (!avatarFile || typeof avatarFile !== 'object' || avatarFile.size === 0) {
      return { error: 'Please select an image file to upload.' };
    }

    // 5MB limit
    const MAX_FILE_SIZE = 5 * 1024 * 1024;
    if (avatarFile.size > MAX_FILE_SIZE) {
      return { error: 'Avatar image must not exceed 5MB in size.' };
    }

    const allowedMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedMimes.includes(avatarFile.type)) {
      return { error: 'Unsupported image format. Please upload JPG, PNG, WEBP, or GIF.' };
    }

    const fileExt = avatarFile.name.split('.').pop()?.toLowerCase() || 'jpg';
    const storagePath = `${user.id}/avatar-${Date.now()}.${fileExt}`;
    const arrayBuffer = await avatarFile.arrayBuffer();
    const fileBuffer = Buffer.from(arrayBuffer);

    let uploadRes = await supabase.storage
      .from('avatars')
      .upload(storagePath, fileBuffer, {
        contentType: avatarFile.type || 'image/jpeg',
        upsert: true,
      });

    if (uploadRes.error && uploadRes.error.message.includes('bucket not found')) {
      await supabaseAdmin.storage.createBucket('avatars', {
        public: true,
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
      return { error: `Failed to upload avatar: ${uploadRes.error.message}` };
    }

    const { data: publicUrlData } = supabase.storage
      .from('avatars')
      .getPublicUrl(storagePath);

    const avatarUrl = publicUrlData.publicUrl;
    await supabase.from('profiles').update({ avatar_url: avatarUrl }).eq('id', user.id);

    return { success: true, avatarUrl };
  } catch (err: any) {
    return { error: err.message || 'Failed to upload avatar.' };
  }
}
