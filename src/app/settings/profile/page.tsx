import React from 'react';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { getUserFullProfile, type FullUserProfileDetails } from '@/utils/supabase/queries';
import ProfileSettingsForm from '@/components/settings/ProfileSettingsForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Profile Settings | EBAUB Digital Campus',
  description: 'Manage your avatar, contact phone, and biography on the EBAUB digital workspace.',
};

export default async function ProfileSettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login?redirectTo=/settings/profile');
  }

  // Fetch complete profile details (with department and faculty joined)
  const profile = await getUserFullProfile(user.id);

  const initialProfile: FullUserProfileDetails = profile || {
    id: user.id,
    email: user.email || '',
    role: (user.user_metadata?.role || 'STUDENT').toUpperCase(),
    full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
    first_name: null,
    last_name: null,
    institutional_id: user.user_metadata?.institutional_id || null,
    department_id: null,
    faculty_id: null,
    batch: user.user_metadata?.batch || null,
    username: user.user_metadata?.username || null,
    avatar_url: user.user_metadata?.avatar_url || null,
    bio: user.user_metadata?.bio || null,
    phone: user.user_metadata?.phone || null,
    created_at: user.created_at || new Date().toISOString(),
    department_name: null,
    faculty_name: null,
  };

  return <ProfileSettingsForm initialProfile={initialProfile} />;
}
