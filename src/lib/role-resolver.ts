/**
 * Role Resolution Utility
 * Single source of truth for email- and profile-based role determination.
 */

export function resolveRoleFromEmail(email: string): 'ADMIN' | 'TEACHER' | 'STUDENT' {
  const normalized = email.toLowerCase().trim();
  if (normalized.includes('admin')) {
    return 'ADMIN';
  }
  if (normalized.includes('teacher') || normalized.includes('faculty')) {
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
