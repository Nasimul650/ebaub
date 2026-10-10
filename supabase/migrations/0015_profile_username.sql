-- Migration: 0015_profile_username
-- Description: Add username column to public.profiles

ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS username TEXT;
