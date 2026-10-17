'use server';

import { createClient } from '@/utils/supabase/server';
import { headers } from 'next/headers';

/**
 * Server Action: resendConfirmationEmail / passwordResetAction
 */
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

export async function requestPasswordReset(email: string) {
  if (!email || !email.includes('@')) {
    return { error: 'Please provide a valid email address.' };
  }

  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim());
    if (error) {
      return { error: error.message };
    }
    return { success: true, message: `Password reset instructions sent to ${email.trim()}.` };
  } catch (err: any) {
    return { error: err?.message || 'Failed to request password reset.' };
  }
}

export const passwordResetAction = requestPasswordReset;
