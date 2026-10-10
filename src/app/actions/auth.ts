'use server';

import { createClient } from '@/utils/supabase/server';
import { supabaseAdmin } from '@/utils/supabase/admin';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { headers } from 'next/headers';

export async function login(prevState: any, formData: FormData) {
  const email = (formData.get('email') as string || '').trim();
  const password = (formData.get('password') as string || '').trim();
  const portal = (formData.get('portal') as string || '').toLowerCase().trim();
  const redirectTo = (formData.get('redirectTo') as string || '').trim();

  if (!email || !password) {
    return { error: 'Email and password are required' };
  }

  const supabase = await createClient();

  let { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    if (error.message.toLowerCase().includes('not confirmed')) {
      try {
        const { data: usersData } = await supabaseAdmin.auth.admin.listUsers();
        const target = usersData?.users?.find(
          (u) => u.email?.toLowerCase().trim() === email.toLowerCase().trim()
        );
        if (target) {
          await supabaseAdmin.auth.admin.updateUserById(target.id, { email_confirm: true });
          const retry = await supabase.auth.signInWithPassword({ email, password });
          if (!retry.error && retry.data) {
            data = retry.data;
            error = null;
          }
        }
      } catch (adminErr) {
        console.warn('Auto-confirm fallback error:', adminErr);
      }
    }
  }

  if (error || !data?.user) {
    return { error: error?.message || 'Login failed' };
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

  // 3. Create or Link Auth User
  const normalizedRole = whitelist.role.toLowerCase() === 'teacher' ? 'TEACHER' : 'STUDENT';
  let newUserId: string;

  // Check if an auth user with this email already exists
  const { data: usersData } = await supabaseAdmin.auth.admin.listUsers();
  const existingAuthUser = usersData?.users?.find(
    (u) => u.email?.toLowerCase().trim() === email.toLowerCase().trim()
  );

  if (existingAuthUser) {
    // Check if this existing auth account has already claimed a DIFFERENT institutional ID
    const { data: alreadyClaimed } = await supabaseAdmin
      .from('credential_whitelist')
      .select('id, institutional_id')
      .eq('claimed_by', existingAuthUser.id)
      .maybeSingle();

    if (alreadyClaimed && alreadyClaimed.institutional_id.toLowerCase().trim() !== institutionalId.toLowerCase().trim()) {
      return {
        error: `This email address is already bound to Institutional ID (${alreadyClaimed.institutional_id}). Please use your official university email.`
      };
    }

    // Update the existing auth user's password, confirmation, and metadata
    const { data: updatedUser, error: updateAuthErr } = await supabaseAdmin.auth.admin.updateUserById(
      existingAuthUser.id,
      {
        password,
        email_confirm: true,
        user_metadata: {
          full_name: fullName,
          institutional_id: whitelist.institutional_id,
          role: normalizedRole,
          department_id: whitelist.department_id,
          batch: whitelist.batch,
        }
      }
    );

    if (updateAuthErr || !updatedUser?.user) {
      console.error('Error updating existing auth user:', updateAuthErr);
      return { error: 'Failed to update user credentials: ' + (updateAuthErr?.message || 'Unknown error') };
    }

    newUserId = updatedUser.user.id;
  } else {
    // Create new auth user via admin API with email_confirm: true
    const { data: newAuthData, error: createAuthErr } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        full_name: fullName,
        institutional_id: whitelist.institutional_id,
        role: normalizedRole,
        department_id: whitelist.department_id,
        batch: whitelist.batch,
      }
    });

    if (createAuthErr || !newAuthData?.user) {
      console.error('Supabase admin createUser error:', createAuthErr);
      return { error: createAuthErr?.message || 'Unable to create user account. Please check your credentials and try again.' };
    }

    newUserId = newAuthData.user.id;
  }

  // 4. Create Profile: Insert or update record in profiles mapping auth.user.id to institutional_id
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
    return { error: `Failed to create profile: ${profileError.message}` };
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
    return { error: `Failed to update whitelist claim status: ${claimError.message}` };
  }

  // 6. Revalidate routes
  revalidatePath('/login');
  revalidatePath('/signup');
  revalidatePath('/admin/users');
  revalidatePath('/admin/users/create');

  // 7. Redirect to /login with confirmed status
  const portalParam = normalizedRole === 'TEACHER' ? 'teacher' : 'student';
  redirect(`/login?registered=true&confirmed=true&portal=${portalParam}&email=${encodeURIComponent(email)}`);
}

export async function instantVerifyWhitelistedUser(email: string) {
  if (!email || !email.includes('@')) {
    return { error: 'Please enter a valid email address.' };
  }

  try {
    const { data: usersData, error: listErr } = await supabaseAdmin.auth.admin.listUsers();
    if (listErr || !usersData?.users) {
      return { error: 'Unable to access auth user registry.' };
    }

    const targetUser = usersData.users.find(
      (u) => u.email?.toLowerCase().trim() === email.toLowerCase().trim()
    );

    if (!targetUser) {
      return { error: 'No account found with this email address.' };
    }

    const { error: updateErr } = await supabaseAdmin.auth.admin.updateUserById(targetUser.id, {
      email_confirm: true,
    });

    if (updateErr) {
      return { error: updateErr.message };
    }

    revalidatePath('/login');
    revalidatePath('/verify-email');
    return { success: true, message: 'Account verified successfully! You can now log in.' };
  } catch (err: any) {
    return { error: err?.message || 'Verification failed.' };
  }
}

export async function resendConfirmationEmail(email: string) {
  if (!email || !email.includes('@')) {
    return { error: 'Please provide a valid email address.' };
  }

  try {
    const supabase = await createClient();

    let siteUrl = '';
    try {
      const headerList = await headers();
      const host = headerList.get('x-forwarded-host') || headerList.get('host');
      const proto = headerList.get('x-forwarded-proto') || 'http';
      if (host) {
        siteUrl = `${proto}://${host}`;
      }
    } catch {
      // fallback
    }

    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: email.trim(),
      options: {
        emailRedirectTo: siteUrl ? `${siteUrl}/auth/callback` : undefined,
      },
    });

    if (error) {
      return { error: error.message };
    }

    return { success: true, message: `A fresh verification link has been sent to ${email.trim()}.` };
  } catch (err: any) {
    return { error: err?.message || 'Failed to resend confirmation email.' };
  }
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/');
}
