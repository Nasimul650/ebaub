/**
 * Role Normalization Utility
 * Standardizes raw role values into lowercase canonical dashboard targets.
 */

export function normalizeRole(rawRole?: string | null): 'admin' | 'teacher' | 'student' {
  const normalized = (rawRole || '').toString().toLowerCase().trim();
  if (normalized === 'admin') return 'admin';
  if (normalized === 'teacher' || normalized === 'faculty') return 'teacher';
  return 'student';
}
