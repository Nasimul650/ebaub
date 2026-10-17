'use server';

import { createClient } from '@/utils/supabase/server';
import { supabaseAdmin } from '@/utils/supabase/admin';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { extractEmail, extractPassword, extractString } from '@/lib/form-parser';
import { resolveRoleFromEmail } from '@/lib/role-resolver';

import { registerAccount as _registerAccount, signupAction as _signupAction } from './signup';
import { resendConfirmationEmail as _resendConfirmationEmail, requestPasswordReset as _requestPasswordReset, passwordResetAction as _passwordResetAction } from './password-reset';
import { instantVerifyWhitelistedUser as _instantVerifyWhitelistedUser, whitelistAction as _whitelistAction } from './whitelist-verify';

export async function registerAccount(prevStateOrFormData: any, formDataArg?: FormData) {
  return _registerAccount(prevStateOrFormData, formDataArg);
}

export async function signupAction(prevStateOrFormData: any, formDataArg?: FormData) {
  return _signupAction(prevStateOrFormData, formDataArg);
}

export async function resendConfirmationEmail(email: string) {
  return _resendConfirmationEmail(email);
}

export async function requestPasswordReset(email: string) {
  return _requestPasswordReset(email);
}

export async function passwordResetAction(email: string) {
  return _passwordResetAction(email);
}

export async function instantVerifyWhitelistedUser(email: string) {
  return _instantVerifyWhitelistedUser(email);
}

export async function whitelistAction(email: string) {
  return _whitelistAction(email);
}

export async function login(prevState: any, formData: FormData) {
  const email = extractEmail(formData);
  const password = extractPassword(formData);
  const portal = extractString(formData, 'portal').toLowerCase();
  const redirectTo = extractString(formData, 'redirectTo');

  if (!email || !password) {
    return { error: 'Email and password are required' };
  }

  const supabase = await createClient();

  let { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    // Development-only fallback: Auto-confirm unverified emails if testing in local development.
    if (process.env.NODE_ENV === 'development' && error.message.toLowerCase().includes('not confirmed')) {
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

  let role = profile?.role || data.user.user_metadata?.role;

  // Fallback: Infer role from official email pattern if not in profile yet
  if (!role) {
    role = resolveRoleFromEmail(email);

    // Auto-create basic profile row if missing
    await supabase.from('profiles').upsert({
      id: data.user.id,
      role: role,
      email: data.user.email,
    });
  }

  // Portal Mismatch Guard: Validate requested portal matches user's actual role
  if (portal) {
    const isMismatch =
      (portal === 'admin' && role !== 'ADMIN') ||
      (portal === 'teacher' && role !== 'TEACHER' && role !== 'ADMIN') ||
      (portal === 'student' && role !== 'STUDENT');

    if (isMismatch) {
      await supabase.auth.signOut();
      const actualRoleLabel =
        role === 'ADMIN' ? 'Administrator' : role === 'TEACHER' ? 'Teacher / Faculty' : 'Student';
      const attemptedPortalLabel =
        portal === 'admin' ? 'Admin Portal' : portal === 'teacher' ? 'Faculty Portal' : 'Student Portal';

      return {
        error: `Portal Mismatch: Your account is registered as ${actualRoleLabel}. You cannot sign in through the ${attemptedPortalLabel}. Please use the correct portal.`,
      };
    }
  }

  // Revalidate layout
  revalidatePath('/', 'layout');

  // Handle redirects
  if (redirectTo && !redirectTo.startsWith('/login')) {
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

  // Fallback based on role
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

export const loginAction = login;

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/');
}
