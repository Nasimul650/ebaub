/**
 * Centralized User-Facing Messages & Notifications
 */

export const ACCOUNT_CREATION_MESSAGES = {
  success: 'Account created successfully.',
  passwordSent: 'Temporary credentials have been configured and dispatched to user email.',
  passwordConfigured: '•••••••• (configured)',
  missingRole: 'Role is required to create an account.',
  missingEmail: 'Email is required to create an account.',
  forbidden: 'Only administrators have permission to provision accounts.',
};

export const AUTH_MESSAGES = {
  loginSuccess: 'Signed in successfully.',
  logoutSuccess: 'Signed out successfully.',
  unauthorized: 'Authentication required. Please sign in.',
  forbidden: 'Access denied: You do not have permission for this resource.',
  passwordChanged: 'Password changed successfully! Please use your new password next time you sign in.',
  currentPasswordIncorrect: 'Current password incorrect.',
};
