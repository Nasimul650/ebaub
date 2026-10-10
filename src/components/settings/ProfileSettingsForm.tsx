'use client';

import React, { useState, useRef } from 'react';
import { 
  User, 
  Mail, 
  Hash, 
  Building2, 
  Phone, 
  FileText, 
  Camera, 
  Trash2, 
  Loader2, 
  CheckCircle2, 
  AlertCircle, 
  ShieldCheck, 
  GraduationCap, 
  Briefcase, 
  Sparkles,
  Info,
  Lock,
  KeyRound,
  Eye,
  EyeOff,
  AtSign
} from 'lucide-react';
import { updateUserProfile, changeUserPassword } from '@/app/actions/profile';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import type { FullUserProfileDetails } from '@/utils/supabase/queries';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface ProfileSettingsFormProps {
  initialProfile: FullUserProfileDetails;
}

export default function ProfileSettingsForm({ initialProfile }: ProfileSettingsFormProps) {
  const router = useRouter();

  // Form Editable Identity & Contact States
  const [fullName, setFullName] = useState(
    initialProfile.full_name || 
    `${initialProfile.first_name || ''} ${initialProfile.last_name || ''}`.trim() || 
    ''
  );
  const [username, setUsername] = useState(
    initialProfile.username || 
    initialProfile.email.split('@')[0] || 
    ''
  );
  const [phone, setPhone] = useState(initialProfile.phone || '');
  const [bio, setBio] = useState(initialProfile.bio || '');
  
  // Avatar Management States
  const [avatarUrl, setAvatarUrl] = useState<string | null>(initialProfile.avatar_url || null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [removeAvatar, setRemoveAvatar] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Status Feedback States for Profile Form
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Password Management States
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);

  // Derive display metadata
  const displayName = fullName || username || initialProfile.email.split('@')[0];
  const initial = displayName.charAt(0).toUpperCase();

  const roleUpper = (initialProfile.role || 'STUDENT').toUpperCase();
  const roleLabel = roleUpper === 'ADMIN' ? 'System Administrator' :
    roleUpper === 'TEACHER' ? 'Faculty Member / Instructor' : 'Enrolled Student';

  // Handle local image selection and preview
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage('Image size exceeds 5MB. Please choose a smaller image.');
      return;
    }

    // Validate type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/jpg'];
    if (!validTypes.includes(file.type.toLowerCase())) {
      setErrorMessage('Please select a valid image file (JPG, PNG, WEBP, or GIF).');
      return;
    }

    setErrorMessage(null);
    setSuccessMessage(null);
    setSelectedFile(file);
    setRemoveAvatar(false);

    // Create browser local preview
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
  };

  const handleTriggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveAvatar = () => {
    setSelectedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    setAvatarUrl(null);
    setRemoveAvatar(true);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Submit Profile Information
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const formData = new FormData();
      formData.append('fullName', fullName.trim());
      formData.append('username', username.trim());
      formData.append('phone', phone.trim());
      formData.append('bio', bio.trim());

      if (removeAvatar) {
        formData.append('remove_avatar', 'true');
      } else if (selectedFile) {
        formData.append('avatar', selectedFile);
      }

      const res = await updateUserProfile(formData);

      if (res.error) {
        setErrorMessage(res.error);
        setIsSubmitting(false);
        return;
      }

      if (res.success) {
        setSuccessMessage(res.message || 'Profile saved successfully!');
        if (res.avatarUrl !== undefined) {
          setAvatarUrl(res.avatarUrl);
        }
        if (previewUrl) {
          URL.revokeObjectURL(previewUrl);
          setPreviewUrl(null);
        }
        setSelectedFile(null);
        setRemoveAvatar(false);

        // Refresh client Supabase session so user_metadata is updated locally
        try {
          const supabase = createClient();
          await supabase.auth.refreshSession();
        } catch (authErr) {
          console.warn('Session refresh error:', authErr);
        }

        // Revalidate layouts and client state across the app
        router.refresh();

        // Auto dismiss success notice after 5 seconds
        setTimeout(() => {
          setSuccessMessage(null);
        }, 5000);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'An error occurred while updating your profile.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Submit Password Change
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(null);

    if (!newPassword) {
      setPasswordError('Please enter a new password.');
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('New password and confirmation password do not match.');
      return;
    }

    setIsChangingPassword(true);
    try {
      const formData = new FormData();
      formData.append('new_password', newPassword);
      formData.append('confirm_password', confirmPassword);

      const res = await changeUserPassword(formData);

      if (res.error) {
        setPasswordError(res.error);
      } else if (res.success) {
        setPasswordSuccess(res.message || 'Password updated successfully!');
        setNewPassword('');
        setConfirmPassword('');

        // Auto dismiss after 6 seconds
        setTimeout(() => {
          setPasswordSuccess(null);
        }, 6000);
      }
    } catch (err: any) {
      setPasswordError(err.message || 'An unexpected error occurred while changing your password.');
    } finally {
      setIsChangingPassword(false);
    }
  };

  // Current display image source
  const currentAvatarSrc = previewUrl || (removeAvatar ? null : avatarUrl);

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      {/* ======================================================== */}
      {/* 1. MAIN PROFILE SETTINGS CARD                           */}
      {/* ======================================================== */}
      <Card className="rounded-3xl border border-slate-200/90 bg-white/95 backdrop-blur-md shadow-sm overflow-hidden">
        <CardHeader className="border-b border-slate-100 p-6 sm:p-8 bg-gradient-to-r from-campus-50/50 via-white to-campus-50/30">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-campus-100 text-campus-900 mb-2">
                <Sparkles className="w-3.5 h-3.5 text-campus-700" />
                <span>Account Information</span>
              </div>
              <CardTitle className="text-xl sm:text-2xl font-extrabold text-slate-900 heading-display">
                Profile & Personal Details
              </CardTitle>
              <CardDescription className="text-xs text-slate-500 mt-1">
                Customize your public avatar, username, full legal name, contact details, and biography.
              </CardDescription>
            </div>

            {/* Role Badge */}
            <div className="shrink-0">
              <span className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-extrabold border ${
                roleUpper === 'ADMIN' ? 'bg-purple-50 text-purple-800 border-purple-200' :
                roleUpper === 'TEACHER' ? 'bg-blue-50 text-blue-800 border-blue-200' :
                'bg-campus-50 text-campus-900 border-campus-200'
              }`}>
                {roleUpper === 'ADMIN' ? <ShieldCheck className="w-3.5 h-3.5 text-purple-700" /> :
                 roleUpper === 'TEACHER' ? <Briefcase className="w-3.5 h-3.5 text-blue-700" /> :
                 <GraduationCap className="w-3.5 h-3.5 text-campus-700" />}
                <span>{roleLabel}</span>
              </span>
            </div>
          </div>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="p-6 sm:p-8 space-y-8">
            {/* Feedback Alerts */}
            {errorMessage && (
              <div className="p-4 bg-red-50/90 border border-red-200 rounded-2xl text-red-700 text-xs font-semibold flex items-center gap-3 shadow-xs animate-in fade-in slide-in-from-top-1">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                <span>{errorMessage}</span>
              </div>
            )}

            {successMessage && (
              <div className="p-4 bg-emerald-50/90 border border-emerald-300 rounded-2xl text-emerald-900 text-xs font-semibold flex items-center gap-3 shadow-xs animate-in fade-in slide-in-from-top-1">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                <span>{successMessage}</span>
              </div>
            )}

            {/* ========================================== */}
            {/* 1. VISUAL AVATAR UPLOADER                   */}
            {/* ========================================== */}
            <div className="space-y-3 pb-8 border-b border-slate-100">
              <Label className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                Profile Picture & Avatar
              </Label>
              
              <div className="flex flex-col sm:flex-row sm:items-center gap-5 pt-1">
                {/* Avatar Display Frame */}
                <div className="relative group shrink-0">
                  <div className="w-24 h-24 rounded-3xl bg-slate-100 border-2 border-slate-200 overflow-hidden shadow-sm flex items-center justify-center font-extrabold text-slate-700 text-2xl transition-all group-hover:border-campus-600">
                    {currentAvatarSrc ? (
                      <img 
                        src={currentAvatarSrc} 
                        alt={displayName} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-campus-900 text-3xl font-black">
                        {initial}
                      </span>
                    )}
                  </div>

                  {/* Quick Camera Overlay */}
                  <button
                    type="button"
                    onClick={handleTriggerFileInput}
                    className="absolute inset-0 bg-slate-900/40 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-[11px] font-bold gap-1 cursor-pointer"
                    title="Change Avatar"
                  >
                    <Camera className="w-5 h-5" />
                    <span>Upload</span>
                  </button>
                </div>

                {/* Upload Actions & Guidelines */}
                <div className="space-y-3 flex-1">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/webp,image/gif,image/jpg"
                    onChange={handleFileChange}
                    className="hidden"
                  />

                  <div className="flex flex-wrap items-center gap-2.5">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleTriggerFileInput}
                      disabled={isSubmitting}
                      className="rounded-xl border-slate-200 hover:bg-slate-50 text-xs font-bold gap-2 text-slate-700"
                    >
                      <Camera className="w-3.5 h-3.5 text-campus-700" />
                      <span>{currentAvatarSrc ? 'Change Picture' : 'Upload Picture'}</span>
                    </Button>

                    {currentAvatarSrc && (
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={handleRemoveAvatar}
                        disabled={isSubmitting}
                        className="rounded-xl text-red-600 hover:text-red-700 hover:bg-red-50 text-xs font-bold gap-1.5"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Remove</span>
                      </Button>
                    )}

                    {selectedFile && (
                      <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                        New file selected ({Math.round(selectedFile.size / 1024)} KB)
                      </span>
                    )}
                  </div>

                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    JPG, PNG, GIF, or WEBP up to 5 MB. A square image (1:1 aspect ratio) works best.
                  </p>
                </div>
              </div>
            </div>

            {/* ========================================== */}
            {/* 2. EDITABLE IDENTITY & CONTACT DETAILS     */}
            {/* ========================================== */}
            <div className="space-y-4 pb-8 border-b border-slate-100">
              <div>
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-campus-700" />
                  <span>Personal Identity & Contact</span>
                </h4>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Update your legal name, username handle, contact phone, and biography.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                {/* Full Legal Name */}
                <div className="space-y-1.5">
                  <Label htmlFor="fullName" className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-campus-700" />
                    <span>Full Legal Name</span>
                  </Label>
                  <Input
                    id="fullName"
                    name="fullName"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. MD Nasim"
                    disabled={isSubmitting}
                    className="bg-white border-slate-200 focus-visible:border-campus-700 text-xs font-medium"
                    required
                  />
                  <p className="text-[11px] text-slate-400">
                    Your official full name displayed across workspaces and communications.
                  </p>
                </div>

                {/* Username / Display Handle */}
                <div className="space-y-1.5">
                  <Label htmlFor="username" className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <AtSign className="w-3.5 h-3.5 text-campus-700" />
                    <span>Username / Handle</span>
                  </Label>
                  <Input
                    id="username"
                    name="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="e.g. nasim1024"
                    disabled={isSubmitting}
                    className="bg-white border-slate-200 focus-visible:border-campus-700 text-xs font-mono"
                  />
                  <p className="text-[11px] text-slate-400">
                    Unique public username or identifier on the digital campus.
                  </p>
                </div>

                {/* Phone Number Input */}
                <div className="space-y-1.5 md:col-span-2">
                  <Label htmlFor="phone" className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-campus-700" />
                    <span>Contact Phone Number</span>
                    <span className="text-slate-400 font-normal">(Optional)</span>
                  </Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. +880 1712-345678"
                    disabled={isSubmitting}
                    className="bg-white border-slate-200 focus-visible:border-campus-700 text-xs"
                  />
                  <p className="text-[11px] text-slate-400">
                    Primary phone used for university SMS circulars and urgent contact.
                  </p>
                </div>
              </div>

              {/* Bio Textarea */}
              <div className="space-y-1.5 pt-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="bio" className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-campus-700" />
                    <span>Personal / Academic Biography</span>
                    <span className="text-slate-400 font-normal">(Optional)</span>
                  </Label>
                  <span className={`text-[10px] font-bold ${bio.length > 900 ? 'text-amber-600' : 'text-slate-400'}`}>
                    {bio.length} / 1000 characters
                  </span>
                </div>
                <Textarea
                  id="bio"
                  name="bio"
                  rows={4}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder={
                    roleUpper === 'TEACHER'
                      ? 'Share your research interests, courses taught, academic publications, or office consultation hours...'
                      : 'Share your academic interests, focus areas, extracurricular achievements, or aspirations...'
                  }
                  maxLength={1000}
                  disabled={isSubmitting}
                  className="bg-white border-slate-200 focus-visible:border-campus-700 text-xs resize-y"
                />
                <p className="text-[11px] text-slate-400">
                  Displayed on your university profile and digital workspace.
                </p>
              </div>
            </div>

            {/* ========================================== */}
            {/* 3. READ-ONLY INSTITUTIONAL CREDENTIALS     */}
            {/* ========================================== */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-slate-400" />
                    <span>Official Institutional Records</span>
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Assigned and verified by the university administration.
                  </p>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-100 px-2.5 py-1 rounded-lg">
                  Read-Only
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
                {/* Institutional ID */}
                <div className="space-y-1.5">
                  <Label className="text-[11px] text-slate-500 font-semibold flex items-center gap-1">
                    <Hash className="w-3 h-3 text-slate-400" />
                    <span>
                      {roleUpper === 'TEACHER' ? 'Teacher ID Number' : 'Student Roll / ID'}
                    </span>
                  </Label>
                  <Input 
                    value={initialProfile.institutional_id || 'Not Assigned'} 
                    disabled 
                    readOnly 
                    className="font-mono font-bold bg-slate-50 border-slate-200 text-campus-900"
                  />
                </div>

                {/* Email Address */}
                <div className="space-y-1.5">
                  <Label className="text-[11px] text-slate-500 font-semibold flex items-center gap-1">
                    <Mail className="w-3 h-3 text-slate-400" />
                    <span>Official Email Address</span>
                  </Label>
                  <Input 
                    value={initialProfile.email} 
                    disabled 
                    readOnly 
                    className="font-medium bg-slate-50 border-slate-200 text-slate-800"
                  />
                </div>

                {/* Department */}
                <div className="space-y-1.5">
                  <Label className="text-[11px] text-slate-500 font-semibold flex items-center gap-1">
                    <Building2 className="w-3 h-3 text-slate-400" />
                    <span>Assigned Department</span>
                  </Label>
                  <Input 
                    value={initialProfile.department_name || 'Unassigned Department'} 
                    disabled 
                    readOnly 
                    className="font-medium bg-slate-50 border-slate-200 text-slate-800"
                  />
                </div>

                {/* Faculty */}
                <div className="space-y-1.5">
                  <Label className="text-[11px] text-slate-500 font-semibold flex items-center gap-1">
                    <Building2 className="w-3 h-3 text-slate-400" />
                    <span>Faculty Affiliation</span>
                  </Label>
                  <Input 
                    value={initialProfile.faculty_name || 'General / Non-Faculty'} 
                    disabled 
                    readOnly 
                    className="font-medium bg-slate-50 border-slate-200 text-slate-800"
                  />
                </div>

                {/* Batch (For Students) */}
                {roleUpper === 'STUDENT' && (
                  <div className="space-y-1.5">
                    <Label className="text-[11px] text-slate-500 font-semibold flex items-center gap-1">
                      <GraduationCap className="w-3 h-3 text-slate-400" />
                      <span>Student Batch / Cohort</span>
                    </Label>
                    <Input 
                      value={initialProfile.batch || 'Unassigned Cohort'} 
                      disabled 
                      readOnly 
                      className="font-bold text-indigo-700 bg-slate-50 border-slate-200"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Profile Submit Action Bar */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-100">
              <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>Changes will be applied immediately across your workspace.</span>
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-campus-900 hover:bg-campus-800 text-white font-bold text-xs shadow-md transition-all gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Saving Changes...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-campus-300" />
                    <span>Save Profile Changes</span>
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </form>
      </Card>

      {/* ======================================================== */}
      {/* 2. SECURITY & PASSWORD SETTINGS CARD                     */}
      {/* ======================================================== */}
      <Card className="rounded-3xl border border-slate-200/90 bg-white/95 backdrop-blur-md shadow-sm overflow-hidden">
        <CardHeader className="border-b border-slate-100 p-6 sm:p-8 bg-gradient-to-r from-slate-50 via-white to-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 shrink-0">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <CardTitle className="text-lg sm:text-xl font-extrabold text-slate-900 heading-display">
                Account Security & Password
              </CardTitle>
              <CardDescription className="text-xs text-slate-500 mt-0.5">
                Update your login password to ensure your university account remains protected.
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <form onSubmit={handlePasswordSubmit}>
          <CardContent className="p-6 sm:p-8 space-y-6">
            {/* Feedback Alerts for Password Form */}
            {passwordError && (
              <div className="p-4 bg-red-50/90 border border-red-200 rounded-2xl text-red-700 text-xs font-semibold flex items-center gap-3 shadow-xs animate-in fade-in slide-in-from-top-1">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                <span>{passwordError}</span>
              </div>
            )}

            {passwordSuccess && (
              <div className="p-4 bg-emerald-50/90 border border-emerald-300 rounded-2xl text-emerald-900 text-xs font-semibold flex items-center gap-3 shadow-xs animate-in fade-in slide-in-from-top-1">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                <span>{passwordSuccess}</span>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              {/* New Password Input */}
              <div className="space-y-1.5">
                <Label htmlFor="newPassword" className="text-xs font-bold text-slate-700 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-campus-700" />
                    <span>New Password</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-[11px] font-semibold text-campus-800 hover:text-campus-900 flex items-center gap-1"
                  >
                    {showPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                    <span>{showPassword ? 'Hide' : 'Show'}</span>
                  </button>
                </Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    name="newPassword"
                    type={showPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter at least 6 characters"
                    disabled={isChangingPassword}
                    className="bg-white border-slate-200 focus-visible:border-campus-700 text-xs pr-10"
                    autoComplete="new-password"
                  />
                </div>
                <p className="text-[11px] text-slate-400">
                  Minimum 6 characters. Use a combination of letters, numbers, and symbols.
                </p>
              </div>

              {/* Confirm New Password Input */}
              <div className="space-y-1.5">
                <Label htmlFor="confirmPassword" className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-campus-700" />
                  <span>Confirm New Password</span>
                </Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-type your new password"
                  disabled={isChangingPassword}
                  className="bg-white border-slate-200 focus-visible:border-campus-700 text-xs"
                  autoComplete="new-password"
                />
                <p className="text-[11px] text-slate-400">
                  Must match the new password entered on the left.
                </p>
              </div>
            </div>

            {/* Password Action Bar */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-100">
              <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Your credentials are encrypted and securely stored.</span>
              </div>

              <Button
                type="submit"
                disabled={isChangingPassword || !newPassword}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-campus-900 hover:bg-campus-800 text-white font-bold text-xs shadow-md transition-all gap-2 disabled:opacity-50"
              >
                {isChangingPassword ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Updating Password...</span>
                  </>
                ) : (
                  <>
                    <KeyRound className="w-4 h-4 text-campus-300" />
                    <span>Update Password</span>
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </form>
      </Card>
    </div>
  );
}
