/**
 * Centralized Error Message Formatting Utility
 */

export function formatPasswordError(error: any): string {
  if (!error) return 'Failed to update password. Please check your credentials and try again.';
  const msg = typeof error === 'string' ? error : error?.message || 'An unexpected error occurred.';
  return `Failed to update password: ${msg}`;
}

export function formatAuthError(error: any): string {
  if (!error) return 'Authentication failed. Please verify your credentials.';
  const msg = typeof error === 'string' ? error : error?.message || '';
  if (msg.toLowerCase().includes('invalid login credentials')) {
    return 'Invalid email address or password. Please try again.';
  }
  return msg || 'Authentication failed.';
}
