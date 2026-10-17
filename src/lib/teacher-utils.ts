import { createClient } from '@/utils/supabase/server';

export async function verifyTeacherOrAdmin() {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error('Unauthorized: You must be logged in.');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  const role = (profile?.role || user.user_metadata?.role || '').toUpperCase();
  if (role !== 'TEACHER' && role !== 'ADMIN') {
    throw new Error('Forbidden: Only faculty members or administrators can perform this action.');
  }

  return { supabase, user, profile, role };
}
