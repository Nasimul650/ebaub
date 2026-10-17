/**
 * Role Resolution Utility
 * Single source of truth for email- and profile-based role determination.
 */

import { ROLE_EMAIL_PATTERNS } from '@/lib/config';

export function resolveRoleFromEmail(email: string): 'ADMIN' | 'TEACHER' | 'STUDENT' {
  const normalized = email.toLowerCase().trim();
  if (ROLE_EMAIL_PATTERNS.admin.test(normalized) || normalized.includes('admin')) {
    return 'ADMIN';
  }
  if (ROLE_EMAIL_PATTERNS.teacher.test(normalized) || normalized.includes('teacher') || normalized.includes('faculty')) {
    return 'TEACHER';
  }
  return 'STUDENT';
}

export function resolveRoleFromProfile(profile: any, fallbackUserMetadata?: any): 'ADMIN' | 'TEACHER' | 'STUDENT' {
  const rawRole = (profile?.role || fallbackUserMetadata?.role || '').toString().toUpperCase().trim();
  if (rawRole === 'ADMIN') return 'ADMIN';
  if (rawRole === 'TEACHER') return 'TEACHER';
  return 'STUDENT';
}
