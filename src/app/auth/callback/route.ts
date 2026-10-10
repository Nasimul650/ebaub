import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const tokenHash = requestUrl.searchParams.get('token_hash');
  const type = requestUrl.searchParams.get('type') as any;
  const next = requestUrl.searchParams.get('next');

  const supabase = await createClient();

  // Handle PKCE code exchange
  if (code) {
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      if (next) {
        return NextResponse.redirect(`${requestUrl.origin}${next}`);
      }

      // Check user role to redirect directly or to login with confirmed state
      const userId = data.user?.id;
      if (userId) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', userId)
          .maybeSingle();

        const role = (profile?.role || '').toLowerCase();
        if (role === 'teacher') {
          return NextResponse.redirect(`${requestUrl.origin}/login?confirmed=true&portal=teacher`);
        } else if (role === 'student') {
          return NextResponse.redirect(`${requestUrl.origin}/login?confirmed=true&portal=student`);
        }
      }

      return NextResponse.redirect(`${requestUrl.origin}/login?confirmed=true`);
    }
  }

  // Handle token hash verification (standard OTP / email verification link)
  if (tokenHash && type) {
    const { data, error } = await supabase.auth.verifyOtp({
      token_hash: tokenHash,
      type: type || 'signup',
    });
    if (!error) {
      if (next) {
        return NextResponse.redirect(`${requestUrl.origin}${next}`);
      }

      const userId = data.user?.id;
      if (userId) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', userId)
          .maybeSingle();

        const role = (profile?.role || '').toLowerCase();
        if (role === 'teacher') {
          return NextResponse.redirect(`${requestUrl.origin}/login?confirmed=true&portal=teacher`);
        } else if (role === 'student') {
          return NextResponse.redirect(`${requestUrl.origin}/login?confirmed=true&portal=student`);
        }
      }

      return NextResponse.redirect(`${requestUrl.origin}/login?confirmed=true`);
    }
  }

  // Fallback for expired or invalid link
  return NextResponse.redirect(
    `${requestUrl.origin}/login?error=${encodeURIComponent(
      'Invalid or expired confirmation link. Please request a new confirmation email.'
    )}`
  );
}
