'use server';

import { createClient } from '@/utils/supabase/server';
import { supabaseAdmin } from '@/utils/supabase/admin';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

export async function login(prevState: any, formData: FormData) {
  const email = (formData.get('email') as string || '').trim();
  const password = (formData.get('password') as string || '').trim();
  const portal = (formData.get('portal') as string || '').toLowerCase().trim();
  const redirectTo = (formData.get('redirectTo') as string || '').trim();

  if (!email || !password) {
    return { error: 'Email and password are required' };
  }

  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  // Fetch user profile to determine role
  let { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', data.user.id)
    .single();

  let role = profile?.role;

  // Dynamic profile creation / fallback if missing
  if (!role) {
    const isTeacher = email.toLowerCase().includes('teacher') || portal === 'teacher';
    const isAdmin = email.toLowerCase().includes('admin') || portal === 'admin';
    const fallbackRole = isAdmin ? 'ADMIN' : (isTeacher ? 'TEACHER' : 'STUDENT');
    
    await supabase.from('profiles').upsert({
      id: data.user.id,
      email: data.user.email || email,
      role: fallbackRole,
    });
    role = fallbackRole;
  }

  // If email clearly designates teacher but profile was initialized as STUDENT, align it
  if (email.toLowerCase().includes('teacher') && role === 'STUDENT') {
    await supabase.from('profiles').update({ role: 'TEACHER' }).eq('id', data.user.id);
    role = 'TEACHER';
  }

  // 1. Explicit target portal takes highest priority
  if (portal === 'admin') {
    if (role === 'ADMIN') {
      redirect('/admin');
    }
  } else if (portal === 'teacher') {
    if (role === 'TEACHER' || role === 'ADMIN') {
      redirect('/teacher');
    }
  } else if (portal === 'student') {
    redirect('/student');
  }

  // 2. Generic safe redirectTo if portal was not explicitly chosen
  if (redirectTo && redirectTo.startsWith('/') && !redirectTo.startsWith('//')) {
    if (redirectTo.startsWith('/admin') && role === 'ADMIN') {
      redirect('/admin');
    } else if (redirectTo.startsWith('/teacher') && (role === 'TEACHER' || role === 'ADMIN')) {
      redirect('/teacher');
    } else if (redirectTo.startsWith('/student')) {
      redirect('/student');
    } else if (role !== 'STUDENT') {
      redirect(redirectTo);
    }
  }

  // 3. Fallback based on role
  if (role === 'ADMIN') {
    redirect('/admin');
  } else if (role === 'TEACHER') {
    redirect('/teacher');
  } else if (role === 'STUDENT') {
    redirect('/student');
  } else {
    redirect('/');
  }
}

/**
 * Server Action: registerAccount
 * Whitelist-verified public self-service account registration.
 * Allows Teachers and Students to claim pre-authorized institutional IDs.
 */
export async function registerAccount(prevStateOrFormData: any, formDataArg?: FormData) {
  const formData = formDataArg instanceof FormData ? formDataArg : (prevStateOrFormData instanceof FormData ? prevStateOrFormData : null);

  if (!formData) {
    return { error: 'Invalid form submission.' };
  }

  const institutionalId = (formData.get('institutional_id') as string || '').trim();
  const fullName = (formData.get('full_name') as string || '').trim();
  const email = (formData.get('email') as string || '').toLowerCase().trim();
  const password = (formData.get('password') as string || '').trim();
  const confirmPassword = (formData.get('confirm_password') as string || '').trim();

  // 1. Input Validation
  if (!institutionalId) {
    return { error: 'Institutional ID is required (e.g. Student Reg No or Teacher ID).' };
  }

  if (!fullName) {
    return { error: 'Full legal name is required.' };
  }

  if (!email || !email.includes('@')) {
    return { error: 'A valid email address is required.' };
  }

  if (!password || password.length < 6) {
    return { error: 'Password must be at least 6 characters long.' };
  }

  if (confirmPassword && password !== confirmPassword) {
    return { error: 'Passwords do not match.' };
  }

  // 2. Verify Whitelist: Query credential_whitelist for the provided institutional_id
  const { data: whitelist, error: whitelistError } = await supabaseAdmin
    .from('credential_whitelist')
    .select('id, institutional_id, role, department_id, batch, is_claimed, claimed_by')
    .ilike('institutional_id', institutionalId)
    .maybeSingle();

  if (whitelistError) {
    console.error('Whitelist verification error:', whitelistError);
    if (whitelistError.message?.includes('credential_whitelist') || whitelistError.code === '42P01') {
      return { 
        error: 'The credential whitelist table is not yet initialized in Supabase. Please apply migration 0018_credential_whitelist.sql in the SQL Editor.' 
      };
    }
    return { error: 'An error occurred while verifying your Institutional ID. Please try again.' };
  }

  if (!whitelist) {
    return { error: 'Invalid ID. Please contact university administration.' };
  }

  if (whitelist.is_claimed) {
    return { error: 'This ID has already been claimed.' };
  }

  // Check if email is already taken
  const { data: existingEmailUser } = await supabaseAdmin
    .from('profiles')
    .select('id, email')
    .eq('email', email)
    .maybeSingle();

  if (existingEmailUser) {
    return { error: 'An account with this email address already exists. Please sign in or use a different email.' };
  }

  // 3. Create Auth User: Call supabase.auth.signUp({ email, password })
  const supabase = await createClient();
  const normalizedRole = whitelist.role.toLowerCase() === 'teacher' ? 'TEACHER' : 'STUDENT';

  const { data: authData, error: signUpError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        institutional_id: whitelist.institutional_id,
        role: normalizedRole,
        department_id: whitelist.department_id,
        batch: whitelist.batch,
      }
    }
  });

  if (signUpError) {
    console.error('Supabase signUp error:', signUpError);
    return { error: signUpError.message };
  }

  if (!authData?.user) {
    return { error: 'Unable to create user account. Please check your credentials and try again.' };
  }

  const newUserId = authData.user.id;

  // 4. Create Profile: Insert a record into profiles mapping auth.user.id to institutional_id, full_name, email, and inheriting role and department_id from whitelist
  let facultyId: string | null = null;
  if (whitelist.department_id) {
    const { data: dept } = await supabaseAdmin
      .from('departments')
      .select('faculty_id')
      .eq('id', whitelist.department_id)
      .maybeSingle();
    facultyId = dept?.faculty_id || null;
  }

  const nameParts = fullName.split(' ');
  const firstName = nameParts[0] || fullName;
  const lastName = nameParts.slice(1).join(' ') || null;

  const profilePayload: any = {
    id: newUserId,
    institutional_id: whitelist.institutional_id,
    full_name: fullName,
    first_name: firstName,
    last_name: lastName,
    email,
    role: normalizedRole,
    department_id: whitelist.department_id,
    faculty_id: facultyId,
    batch: whitelist.batch || null,
    updated_at: new Date().toISOString(),
  };

  const { error: profileError } = await supabaseAdmin
    .from('profiles')
    .upsert(profilePayload, { onConflict: 'id' });

  if (profileError) {
    console.error('Error inserting profile row:', profileError);
  }

  // Sync extension tables if applicable
  if (whitelist.department_id) {
    try {
      if (normalizedRole === 'TEACHER') {
        await supabaseAdmin
          .from('teachers')
          .upsert({
            id: newUserId,
            department_id: whitelist.department_id,
            designation: 'Faculty Member',
          }, { onConflict: 'id' });
      } else if (normalizedRole === 'STUDENT') {
        await supabaseAdmin
          .from('students')
          .upsert({
            id: newUserId,
            department_id: whitelist.department_id,
            student_id: whitelist.institutional_id,
            enrollment_year: new Date().getFullYear(),
            status: 'ACTIVE',
            batch: whitelist.batch || null,
          }, { onConflict: 'id' });
      }
    } catch (syncErr: any) {
      console.warn('Extension table sync notice:', syncErr?.message);
    }
  }

  // 5. Mark Claimed: Update credential_whitelist setting is_claimed = true and claimed_by = auth.user.id
  const { error: claimError } = await supabaseAdmin
    .from('credential_whitelist')
    .update({
      is_claimed: true,
      claimed_by: newUserId,
    })
    .eq('id', whitelist.id);

  if (claimError) {
    console.error('Error updating whitelist claim status:', claimError);
  }

  // 6. Revalidate routes
  revalidatePath('/login');
  revalidatePath('/signup');
  revalidatePath('/admin/users');
  revalidatePath('/admin/users/create');

  // 7. Redirect to /login with success parameters
  const portalParam = normalizedRole === 'TEACHER' ? 'teacher' : 'student';
  redirect(`/login?registered=true&portal=${portalParam}&email=${encodeURIComponent(email)}`);
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/');
}
