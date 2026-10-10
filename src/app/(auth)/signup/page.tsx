'use client';

import React, { useActionState, useState } from 'react';
import Link from 'next/link';
import { 
  GraduationCap, 
  ShieldCheck, 
  UserCheck, 
  ArrowRight, 
  Lock, 
  Mail, 
  Hash, 
  User, 
  AlertCircle, 
  CheckCircle2, 
  Eye, 
  EyeOff,
  Sparkles
} from 'lucide-react';
import { registerAccount } from '@/app/actions/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function SignUpPage() {
  const [state, formAction, pending] = useActionState(registerAccount, null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border bg-campus-50 text-campus-800 border-campus-200 shadow-2xs">
            <ShieldCheck className="w-4 h-4 text-campus-700" />
            <span>Whitelist-Verified Self Registration</span>
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight heading-display">
          Claim Your Account
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-slate-500 max-w-sm mx-auto">
          Enter your official institutional registration ID to verify your status and create your account.
        </p>
      </div>

      {/* Main Registration Card */}
      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-lg">
        <Card className="border-slate-200/80 bg-white shadow-sm rounded-3xl overflow-hidden">
          <CardContent className="p-6 sm:p-10 space-y-6">
            
            {/* Error Message */}
            {state?.error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-2xl text-xs font-semibold flex items-start gap-2.5 animate-in fade-in">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <span className="font-bold">Registration Failed: </span>
                  {state.error}
                </div>
              </div>
            )}

            <form action={formAction} className="space-y-4">
              
              {/* Field 1: Institutional ID */}
              <div className="space-y-1.5">
                <Label htmlFor="institutional_id" className="text-xs font-bold text-slate-700 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Hash className="w-3.5 h-3.5 text-slate-400" />
                    <span>Institutional ID / Registration No. *</span>
                  </span>
                  <span className="text-[10px] text-campus-700 font-semibold uppercase">Official University ID</span>
                </Label>
                <div className="relative">
                  <Input
                    id="institutional_id"
                    name="institutional_id"
                    type="text"
                    required
                    placeholder="e.g. 1901015 or T-CSE-004"
                    className="w-full text-xs font-mono font-bold rounded-xl border-slate-200 focus-visible:ring-campus-400 h-11 uppercase pl-3.5"
                  />
                </div>
                <p className="text-[11px] text-slate-400">
                  Students: enter your Reg/Roll number. Teachers: enter your Faculty ID number.
                </p>
              </div>

              {/* Field 2: Full Legal Name */}
              <div className="space-y-1.5">
                <Label htmlFor="full_name" className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <span>Full Legal Name *</span>
                </Label>
                <Input
                  id="full_name"
                  name="full_name"
                  type="text"
                  required
                  placeholder="e.g. Md. Sadikur Rahman or Dr. Shamim Ahmed"
                  className="w-full text-xs rounded-xl border-slate-200 focus-visible:ring-campus-400 h-11"
                />
                <p className="text-[11px] text-slate-400">
                  As registered on your official university admission or appointment records.
                </p>
              </div>

              {/* Field 3: Official Email Address */}
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span>Email Address *</span>
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="e.g. student@ebaub.edu.bd or yourname@gmail.com"
                  className="w-full text-xs rounded-xl border-slate-200 focus-visible:ring-campus-400 h-11"
                />
                <p className="text-[11px] text-slate-400">
                  This email will be used to log in and receive university academic communications.
                </p>
              </div>

              {/* Field 4 & 5: Password & Confirm Password (Responsive Stack / Row) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                {/* Password */}
                <div className="space-y-1.5">
                  <Label htmlFor="password" className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-slate-400" />
                    <span>Password *</span>
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                      required
                      placeholder="Min. 6 characters"
                      className="w-full text-xs rounded-xl border-slate-200 focus-visible:ring-campus-400 h-11 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                      aria-label="Toggle password visibility"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="space-y-1.5">
                  <Label htmlFor="confirm_password" className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-slate-400" />
                    <span>Confirm Password *</span>
                  </Label>
                  <div className="relative">
                    <Input
                      id="confirm_password"
                      name="confirm_password"
                      type={showConfirmPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                      required
                      placeholder="Re-type password"
                      className="w-full text-xs rounded-xl border-slate-200 focus-visible:ring-campus-400 h-11 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                      aria-label="Toggle confirm password visibility"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-3">
                <Button
                  type="submit"
                  disabled={pending}
                  className="w-full h-12 bg-campus-900 hover:bg-campus-800 text-white font-extrabold text-xs shadow-md rounded-xl transition-all gap-2"
                >
                  {pending ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Verifying Whitelist & Creating Account...</span>
                    </span>
                  ) : (
                    <>
                      <UserCheck className="w-4 h-4 text-campus-300" />
                      <span>Verify Whitelist & Claim Account</span>
                      <ArrowRight className="w-4 h-4 ml-auto" />
                    </>
                  )}
                </Button>
              </div>

            </form>

            {/* Bottom Links */}
            <div className="pt-4 border-t border-slate-100 text-center space-y-3 text-xs">
              <div>
                <span className="text-slate-500">Already claimed your account? </span>
                <Link
                  href="/login"
                  className="font-bold text-campus-800 hover:text-campus-900 transition-colors underline-offset-4 hover:underline"
                >
                  Sign in here
                </Link>
              </div>

              <div>
                <Link
                  href="/contact"
                  className="text-slate-400 hover:text-campus-800 transition-colors font-medium text-[11px]"
                >
                  Not whitelisted yet? Contact EBAUB Academic Section or IT Support &rarr;
                </Link>
              </div>
            </div>

          </CardContent>
        </Card>

        {/* Return to Homepage Link */}
        <p className="mt-6 text-center text-xs text-slate-500">
          <Link href="/" className="hover:text-campus-800 transition-colors font-medium">
            &larr; Return to University Homepage
          </Link>
        </p>
      </div>
    </div>
  );
}
