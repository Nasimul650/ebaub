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
  Lock
} from 'lucide-react';
import { updateUserProfile } from '@/app/actions/profile';
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
  // Form Editable States
  const [phone, setPhone] = useState(initialProfile.phone || '');
  const [bio, setBio] = useState(initialProfile.bio || '');
  
  // Avatar Management States
  const [avatarUrl, setAvatarUrl] = useState<string | null>(initialProfile.avatar_url || null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [removeAvatar, setRemoveAvatar] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Status Feedback States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Derive display metadata
  const displayName = initialProfile.full_name || 
    `${initialProfile.first_name || ''} ${initialProfile.last_name || ''}`.trim() || 
    initialProfile.email.split('@')[0];
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const formData = new FormData();
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

  // Current display image source
  const currentAvatarSrc = previewUrl || (removeAvatar ? null : avatarUrl);

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Alert Banners */}
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

      {/* Main Settings Card */}
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
                Customize your public avatar, contact details, and academic biography.
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
                      <div className="w-full h-full bg-gradient-to-br from-campus-800 to-campus-950 text-white flex items-center justify-center font-extrabold text-3xl">
                        {initial}
                      </div>
                    )}
                  </div>

                  {/* Quick Camera Trigger Overlay on Avatar */}
                  <button
                    type="button"
                    onClick={handleTriggerFileInput}
                    className="absolute inset-0 bg-slate-950/40 text-white rounded-3xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                    title="Upload New Photo"
                  >
                    <Camera className="w-6 h-6" />
                  </button>
                </div>

                {/* Avatar Action Controls & Guidelines */}
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      onChange={handleFileChange} 
                      accept="image/png, image/jpeg, image/jpg, image/webp, image/gif"
                      className="hidden" 
                    />

                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleTriggerFileInput}
                      className="border-slate-200 text-slate-700 hover:text-campus-900 hover:border-campus-400 gap-1.5"
                    >
                      <Camera className="w-3.5 h-3.5 text-campus-700" />
                      <span>{currentAvatarSrc ? 'Change Photo' : 'Upload Photo'}</span>
                    </Button>

                    {currentAvatarSrc && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={handleRemoveAvatar}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 gap-1.5"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Remove</span>
                      </Button>
                    )}

                    {previewUrl && (
                      <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200 animate-in fade-in">
                        Unsaved preview
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
            {/* 2. READ-ONLY INSTITUTIONAL CREDENTIALS     */}
            {/* ========================================== */}
            <div className="space-y-4 pb-8 border-b border-slate-100">
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
                {/* Full Legal Name */}
                <div className="space-y-1.5">
                  <Label className="text-[11px] text-slate-500 font-semibold flex items-center gap-1">
                    <User className="w-3 h-3 text-slate-400" />
                    <span>Full Legal Name</span>
                  </Label>
                  <Input 
                    value={displayName} 
                    disabled 
                    readOnly 
                    className="font-medium bg-slate-50 border-slate-200 text-slate-800"
                  />
                </div>

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

            {/* ========================================== */}
            {/* 3. EDITABLE PERSONAL & ACADEMIC DETAILS    */}
            {/* ========================================== */}
            <div className="space-y-5">
              <div>
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-campus-700" />
                  <span>Personal Contact & Biography</span>
                </h4>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  You can update your contact phone and personal or academic summary anytime.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Phone Number Input */}
                <div className="space-y-1.5">
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
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="bio" className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-campus-700" />
                    <span>Personal / Academic Bio</span>
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

            {/* Submit Action Bar */}
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
    </div>
  );
}
