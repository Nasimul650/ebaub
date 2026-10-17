/**
 * Shared Form Data Parser & Validator Utility
 * Centralized parsing and RFC/strength validation for form inputs.
 */

import { z } from 'zod';
import { PASSWORD_MIN_LENGTH } from '@/lib/config';

export const emailSchema = z.string().trim().email({ message: 'Invalid email address format' });

export const passwordSchema = z
  .string()
  .min(PASSWORD_MIN_LENGTH, { message: `Password must be at least ${PASSWORD_MIN_LENGTH} characters long` })
  .regex(/[A-Z]/, { message: 'Password must contain at least one uppercase letter' })
  .regex(/[0-9]/, { message: 'Password must contain at least one number' })
  .regex(/[^a-zA-Z0-9]/, { message: 'Password must contain at least one special character' });

export function validateEmail(email: string): { isValid: boolean; error?: string } {
  const result = emailSchema.safeParse(email);
  if (!result.success) {
    return { isValid: false, error: result.error.errors[0]?.message || 'Invalid email format' };
  }
  return { isValid: true };
}

export function validatePasswordStrength(password: string): { isValid: boolean; error?: string } {
  if (password.length < PASSWORD_MIN_LENGTH) {
    return { isValid: false, error: `Password must be at least ${PASSWORD_MIN_LENGTH} characters long.` };
  }
  const result = passwordSchema.safeParse(password);
  if (!result.success) {
    return { isValid: false, error: result.error.errors[0]?.message || 'Weak password' };
  }
  return { isValid: true };
}

export function extractPassword(
  formData: FormData,
  fieldName = 'password',
  enforceMinLength = false
): string {
  const val = formData.get(fieldName);
  if (typeof val !== 'string') return '';
  const trimmed = val.trim();
  if (enforceMinLength && trimmed && trimmed.length < PASSWORD_MIN_LENGTH) {
    throw new Error(`Password must be at least ${PASSWORD_MIN_LENGTH} characters long`);
  }
  return trimmed;
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
