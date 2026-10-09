-- Migration: 0014_user_profile_settings
-- Description: Profile settings fields (avatar_url, bio, phone) and avatars storage bucket with RLS policies

-- 1. Ensure profile columns exist
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS avatar_url TEXT;

ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS bio TEXT;

ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS phone TEXT;

-- 2. Ensure RLS on profiles allows users to update their own profile
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile"
ON public.profiles FOR UPDATE
USING (
    auth.uid() = id 
    OR EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role = 'ADMIN'
    )
)
WITH CHECK (
    auth.uid() = id 
    OR EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role = 'ADMIN'
    )
);

-- 3. Create or configure avatars storage bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'avatars',
    'avatars',
    true,
    5242880, -- 5 MB in bytes
    ARRAY[
        'image/png',
        'image/jpeg',
        'image/jpg',
        'image/webp',
        'image/gif'
    ]
)
ON CONFLICT (id) DO UPDATE SET
    public = EXCLUDED.public,
    file_size_limit = EXCLUDED.file_size_limit,
    allowed_mime_types = EXCLUDED.allowed_mime_types;

-- 4. Storage Policies for avatars bucket

-- SELECT: Public (everyone can view avatars)
DROP POLICY IF EXISTS "Avatars are viewable by everyone" ON storage.objects;
CREATE POLICY "Avatars are viewable by everyone"
ON storage.objects FOR SELECT
USING (bucket_id = 'avatars');

-- INSERT: Authenticated users can only upload files in their own folder: ${auth.uid()}/...
DROP POLICY IF EXISTS "Authenticated users can upload own avatar" ON storage.objects;
CREATE POLICY "Authenticated users can upload own avatar"
ON storage.objects FOR INSERT
WITH CHECK (
    bucket_id = 'avatars' 
    AND auth.role() = 'authenticated'
    AND (name LIKE (auth.uid()::text || '/%'))
);

-- UPDATE: Authenticated users can update files in their own folder
DROP POLICY IF EXISTS "Authenticated users can update own avatar" ON storage.objects;
CREATE POLICY "Authenticated users can update own avatar"
ON storage.objects FOR UPDATE
USING (
    bucket_id = 'avatars' 
    AND (
        (name LIKE (auth.uid()::text || '/%'))
        OR EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'ADMIN'
        )
    )
);

-- DELETE: Authenticated users can delete files in their own folder
DROP POLICY IF EXISTS "Authenticated users can delete own avatar" ON storage.objects;
CREATE POLICY "Authenticated users can delete own avatar"
ON storage.objects FOR DELETE
USING (
    bucket_id = 'avatars' 
    AND (
        (name LIKE (auth.uid()::text || '/%'))
        OR EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'ADMIN'
        )
    )
);
