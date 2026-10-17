/**
 * Shared Form Data Parser Utility
 * Extracts and sanitizes common form fields across auth, profile, and admin actions.
 */

export function extractPassword(formData: FormData, fieldName = 'password'): string {
  const val = formData.get(fieldName);
  if (typeof val !== 'string') return '';
  return val.trim();
}

export function extractEmail(formData: FormData, fieldName = 'email'): string {
  const val = formData.get(fieldName);
  if (typeof val !== 'string') return '';
  return val.trim().toLowerCase();
}

export function extractString(formData: FormData, fieldName: string, defaultValue = ''): string {
  const val = formData.get(fieldName);
  if (typeof val !== 'string') return defaultValue;
  return val.trim();
}
