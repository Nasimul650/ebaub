'use client';

import React, { Suspense, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { 
  GraduationCap, 
  Mail, 
  CheckCircle2, 
  ArrowRight, 
  RefreshCw, 
  Clock, 
  ExternalLink, 
  ShieldCheck, 
  Copy, 
  Check, 
  AlertTriangle,
  HelpCircle,
  Inbox,
  Sparkles,
  BookOpen
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { resendConfirmationEmail, instantVerifyWhitelistedUser } from '@/app/actions/auth';

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const rawEmail = searchParams.get('email') || '';
  const portal = searchParams.get('portal')?.toLowerCase() || 'student';
  const isRegistered = searchParams.get('registered') === 'true';

  const [email, setEmail] = useState(rawEmail);
  const [copied, setCopied] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [isVerifyingInstant, setIsVerifyingInstant] = useState(false);
  const [resendStatus, setResendStatus] = useState<{ success: boolean; message: string } | null>(null);
  const [cooldown, setCooldown] = useState(0);

  // Sync external email if param changes
  useEffect(() => {
    if (rawEmail) setEmail(rawEmail);
  }, [rawEmail]);

  // Cooldown countdown timer
  useEffect(() => {
    if (cooldown <= 0) return;
    const interval = setInterval(() => {
      setCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [cooldown]);

  const handleCopyEmail = async () => {
    if (!email) return;
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  const handleResend = async () => {
    if (!email || cooldown > 0 || isResending) return;

    setIsResending(true);
    setResendStatus(null);

    try {
      const result = await resendConfirmationEmail(email);
      if (result.success) {
        setResendStatus({
          success: true,
          message: result.message || 'A fresh confirmation link has been sent to your email.'
        });
        setCooldown(60); // 60s cooldown to prevent rate limiting
      } else {
        setResendStatus({
          success: false,
          message: result.error || 'Failed to resend confirmation email. Please try again later.'
        });
      }
    } catch (err: any) {
      setResendStatus({
        success: false,
        message: err?.message || 'An unexpected error occurred while sending email.'
      });
    } finally {
      setIsResending(false);
    }
  };

  const handleInstantVerify = async () => {
    if (!email || isVerifyingInstant) return;
    setIsVerifyingInstant(true);
    try {
      const res = await instantVerifyWhitelistedUser(email);
      if (res.success) {
        window.location.href = `/login?confirmed=true&portal=${portal}&email=${encodeURIComponent(email)}`;
      } else {
        setResendStatus({
          success: false,
          message: res.error || 'Instant verification failed.'
        });
      }
    } catch (err: any) {
      setResendStatus({
        success: false,
        message: err?.message || 'Verification error occurred.'
      });
    } finally {
      setIsVerifyingInstant(false);
    }
  };

  // Determine webmail link if known provider
  const getWebmailProvider = () => {
    const lower = email.toLowerCase();
    if (lower.includes('@gmail.com')) {
      return { name: 'Open Gmail', url: 'https://mail.google.com' };
    }
    if (lower.includes('@outlook.com') || lower.includes('@hotmail.com') || lower.includes('@live.com')) {
      return { name: 'Open Outlook', url: 'https://outlook.live.com' };
    }
    if (lower.includes('@yahoo.com')) {
      return { name: 'Open Yahoo Mail', url: 'https://mail.yahoo.com' };
    }
    return null;
  };

  const webmail = getWebmailProvider();
  const loginUrl = `/login?portal=${portal}${email ? `&email=${encodeURIComponent(email)}` : ''}`;

  return (
    <div className="min-h-screen bg-campus-50 flex flex-col justify-center py-10 sm:py-16 px-4 sm:px-6 lg:px-8">
      {/* Top University Branding */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link href="/" className="inline-flex items-center gap-2 mb-4 group">
          <div className="w-10 h-10 rounded-xl bg-campus-900 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
            <GraduationCap className="w-5 h-5 text-campus-400" />
          </div>
          <span className="font-extrabold text-xl text-slate-900 tracking-tight heading-display">
            EBAUB Digital Campus
          </span>
        </Link>

        {/* Security Badge */}
        <div className="flex justify-center mb-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border bg-blue-50 text-blue-800 border-blue-200 shadow-2xs">
            <ShieldCheck className="w-4 h-4 text-blue-600" />
            <span>Official Identity Verification</span>
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight heading-display">
          Check Your Email
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-slate-500 max-w-sm mx-auto">
          We sent a secure activation link to verify your university credentials.
        </p>
      </div>

      {/* Main Verification Card */}
      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-xl">
        <Card className="border-slate-200/80 bg-white shadow-sm rounded-3xl overflow-hidden">
          <CardContent className="p-6 sm:p-10 space-y-6">

            {/* Visual Envelope Header */}
            <div className="flex flex-col items-center text-center p-6 bg-gradient-to-b from-campus-50/70 to-white rounded-2xl border border-campus-100">
              <div className="relative mb-3">
                <div className="w-16 h-16 rounded-2xl bg-campus-900 text-campus-400 flex items-center justify-center shadow-lg">
                  <Mail className="w-8 h-8" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center text-white shadow-xs">
                  <Clock className="w-3.5 h-3.5" />
                </div>
              </div>

              <h2 className="text-lg font-bold text-slate-900">
                Confirmation Link Dispatched
              </h2>
              <p className="text-xs text-slate-500 max-w-md mt-1">
                Your account has been whitelisted and created. To protect university records, you must confirm your email before accessing the portal.
              </p>

              {/* Recipient Email Address Capsule */}
              {email ? (
                <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200 shadow-2xs">
                  <span className="text-xs font-bold font-mono text-campus-900">{email}</span>
                  <button
                    type="button"
                    onClick={handleCopyEmail}
                    className="text-slate-400 hover:text-slate-700 transition-colors p-1"
                    title="Copy email"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              ) : (
                <div className="mt-4 w-full max-w-xs">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your registered email"
                    className="w-full text-xs px-3 py-2 border rounded-xl border-slate-200"
                  />
                </div>
              )}
            </div>

            {/* Step-by-Step Guidance */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <Inbox className="w-3.5 h-3.5 text-campus-700" />
                <span>Next Steps to Activate Your Account</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {/* Step 1 */}
                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-start gap-3">
                  <div className="w-6 h-6 rounded-lg bg-campus-900 text-white font-extrabold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                    1
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">Check Your Inbox</div>
                    <div className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                      Look for a confirmation message from <span className="font-semibold text-slate-700">EBAUB Digital Campus</span> or Supabase Auth.
                    </div>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-start gap-3">
                  <div className="w-6 h-6 rounded-lg bg-campus-900 text-white font-extrabold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                    2
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">Click &ldquo;Confirm Your Email&rdquo;</div>
                    <div className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                      Clicking the secure activation link will automatically verify your address and activate your profile.
                    </div>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-start gap-3">
                  <div className="w-6 h-6 rounded-lg bg-campus-900 text-white font-extrabold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                    3
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">Check Spam or Junk</div>
                    <div className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                      University firewalls and spam filters can occasionally divert new activation messages.
                    </div>
                  </div>
                </div>

                {/* Step 4 */}
                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-start gap-3">
                  <div className="w-6 h-6 rounded-lg bg-campus-900 text-white font-extrabold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                    4
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">Sign In to Your Workspace</div>
                    <div className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                      Once confirmed, sign in with your email and password to access your courses and materials.
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Webmail Launcher (If applicable) */}
            {webmail && (
              <div className="pt-1">
                <a
                  href={webmail.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors"
                >
                  <span>{webmail.name}</span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                </a>
              </div>
            )}

            {/* Resend Status Banner */}
            {resendStatus && (
              <div className={`p-3.5 rounded-2xl text-xs font-semibold flex items-start gap-2.5 animate-in fade-in ${
                resendStatus.success
                  ? 'bg-emerald-50 border border-emerald-200 text-emerald-900'
                  : 'bg-red-50 border border-red-200 text-red-800'
              }`}>
                {resendStatus.success ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                )}
                <div className="flex-1 leading-relaxed">
                  {resendStatus.message}
                </div>
              </div>
            )}

            {/* Resend & Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={handleResend}
                disabled={isResending || cooldown > 0 || !email}
                className="w-full sm:w-1/2 h-11 text-xs font-bold rounded-xl border-slate-200 text-slate-700 hover:bg-slate-50 gap-2"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isResending ? 'animate-spin' : ''}`} />
                <span>
                  {isResending
                    ? 'Resending...'
                    : cooldown > 0
                    ? `Resend in ${cooldown}s`
                    : 'Resend Confirmation Email'}
                </span>
              </Button>

              <Link
                href={loginUrl}
                className="w-full sm:w-1/2"
              >
                <Button
                  type="button"
                  className="w-full h-11 text-xs font-bold rounded-xl bg-campus-900 hover:bg-campus-800 text-white shadow-xs gap-2"
                >
                  <span>Already Confirmed? Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>

            {/* Instant Whitelist Verification Alternative */}
            <div className="p-4 bg-emerald-50/80 border border-emerald-200 rounded-2xl text-emerald-950 text-xs space-y-2.5 shadow-2xs">
              <div className="font-bold flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-emerald-900">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Didn&apos;t get the email? Instant Whitelist Activation</span>
                </span>
                <span className="text-[10px] bg-emerald-200/80 text-emerald-900 px-2 py-0.5 rounded-full font-extrabold uppercase tracking-wider">
                  Instant
                </span>
              </div>
              <p className="text-[11px] text-emerald-800 leading-relaxed">
                Because your institutional registration ID is already verified by university administration, you can activate your account immediately without waiting for email delivery.
              </p>
              <Button
                type="button"
                onClick={handleInstantVerify}
                disabled={isVerifyingInstant || !email}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs h-10 rounded-xl gap-2 shadow-2xs transition-all"
              >
                <CheckCircle2 className={`w-4 h-4 ${isVerifyingInstant ? 'animate-spin' : ''}`} />
                <span>{isVerifyingInstant ? 'Activating Account...' : 'Activate Account Instantly'}</span>
              </Button>
            </div>

            {/* Troubleshooting & Admin Note */}
            <div className="p-4 bg-amber-50/70 border border-amber-200/80 rounded-2xl text-amber-900 text-xs space-y-1.5">
              <div className="font-bold flex items-center gap-1.5 text-amber-950">
                <HelpCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span>Didn&apos;t receive the email?</span>
              </div>
              <p className="text-[11px] text-amber-800 leading-relaxed">
                If the email doesn&apos;t arrive within a few minutes, check your spam folder or click &ldquo;Resend Confirmation Email&rdquo; above. 
                For university network issues or administrative queries, contact the EBAUB Academic Section or IT Helpdesk.
              </p>
            </div>

          </CardContent>
        </Card>

        {/* Back link */}
        <p className="mt-6 text-center text-xs text-slate-500">
          <Link href="/login" className="hover:text-campus-800 transition-colors font-medium">
            &larr; Return to Sign In Page
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-campus-50 flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-campus-700 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  );
}
