/**
 * Settings Validation Helper
 */

export function validateSettingsPayload(pageId: string, payload: any): { isValid: boolean; error?: string } {
  if (!pageId || typeof pageId !== 'string' || pageId.trim() === '') {
    return { isValid: false, error: 'Settings page identifier is required.' };
  }
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
    return { isValid: false, error: 'Invalid settings data payload provided.' };
  }
  return { isValid: true };
}
