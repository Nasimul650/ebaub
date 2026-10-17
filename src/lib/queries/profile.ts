import { createClient } from '@/utils/supabase/server';
import { createAdminClient } from '@/utils/supabase/admin';

export interface UserProfileData {
  id: string;
  email: string;
  role: string;
  full_name?: string | null;
  first_name?: string | null;
  last_name?: string | null;
  avatar_url?: string | null;
  phone?: string | null;
  bio?: string | null;
  department_id?: string | null;
  institutional_id?: string | null;
  batch?: string | null;
}

/**
 * Fetch profile by User ID (single source of truth)
 */
export async function getProfileById(userId: string): Promise<UserProfileData | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (error || !data) return null;
    return data as UserProfileData;
  } catch (err) {
    console.error('getProfileById error:', err);
    return null;
  }
}

/**
 * Fetch student profile data
 */
export async function getStudentProfileData(userId: string) {
  try {
    const supabase = await createClient();
    const { data: profile } = await supabase
      .from('profiles')
      .select('*, departments(id, name, faculties(id, name))')
      .eq('id', userId)
      .maybeSingle();

    return profile;
  } catch (err) {
    console.error('getStudentProfileData error:', err);
    return null;
  }
}

/**
 * Fetch teacher profile data
 */
export async function getTeacherProfileData(userId: string) {
  try {
    const supabase = await createClient();
    const { data: profile } = await supabase
      .from('profiles')
      .select('*, departments(id, name, faculties(id, name))')
      .eq('id', userId)
      .maybeSingle();

    return profile;
  } catch (err) {
    console.error('getTeacherProfileData error:', err);
    return null;
  }
}
