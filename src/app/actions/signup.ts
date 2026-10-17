'use server';

import { supabaseAdmin } from '@/utils/supabase/admin';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { extractEmail, extractPassword, extractString, validatePasswordStrength } from '@/lib/form-parser';
import { PASSWORD_MIN_LENGTH } from '@/lib/config';
import { getWhitelistByInstitutionalId, claimWhitelistRecord } from '@/lib/queries/whitelist';

/**
 * Server Action: registerAccount / signupAction
 * Whitelist-verified public self-service account registration.
 * Allows Teachers and Students to claim pre-authorized institutional IDs.
 */
export async function registerAccount(prevStateOrFormData: any, formDataArg?: FormData) {
  const formData = formDataArg instanceof FormData ? formDataArg : (prevStateOrFormData instanceof FormData ? prevStateOrFormData : null);

  if (!formData) {
    return { error: 'Invalid form submission.' };
  }

  const institutionalId = extractString(formData, 'institutional_id');
  const fullName = extractString(formData, 'full_name');
  const email = extractEmail(formData, 'email');
  const password = extractPassword(formData, 'password');
  const confirmPassword = extractPassword(formData, 'confirm_password');

  // 1. Input Validation
  if (!institutionalId) {
    return { error: 'Institutional ID is required (e.g. Student Reg No or Teacher ID).' };
  }

  if (!fullName) {
    return { error: 'Full legal name is required.' };
  }

  if (!email || !email.includes('@')) {
    return { error: 'A valid email address is required.' };
  }

  if (!password || password.length < PASSWORD_MIN_LENGTH) {
    return { error: `Password must be at least ${PASSWORD_MIN_LENGTH} characters long.` };
  }

  if (confirmPassword && password !== confirmPassword) {
    return { error: 'Passwords do not match.' };
  }

  // Check password strength
  const strengthCheck = validatePasswordStrength(password);
  if (!strengthCheck.isValid) {
    return { error: strengthCheck.error || 'Password does not meet complexity requirements.' };
  }

  // 2. Verify Whitelist: Query credential_whitelist for the provided institutional_id
  const whitelist = await getWhitelistByInstitutionalId(institutionalId);

  if (!whitelist) {
    return { error: 'Invalid ID. Please contact university administration.' };
  }

  if (whitelist.is_claimed) {
    return { error: 'This ID has already been claimed.' };
  }

  // 3. Create or Link Auth User
  const normalizedRole = whitelist.role.toLowerCase() === 'teacher' ? 'TEACHER' : 'STUDENT';
  let newUserId: string;

  // Check if an auth user with this email already exists
  const { data: usersData } = await supabaseAdmin.auth.admin.listUsers();
  const existingAuthUser = usersData?.users?.find(
    (u) => u.email?.toLowerCase().trim() === email.toLowerCase().trim()
  );

  if (existingAuthUser) {
    // Check if this existing auth account has already claimed a DIFFERENT institutional ID
    const { data: alreadyClaimed } = await supabaseAdmin
      .from('credential_whitelist')
      .select('id, institutional_id')
      .eq('claimed_by', existingAuthUser.id)
      .maybeSingle();

    if (alreadyClaimed && alreadyClaimed.institutional_id.toLowerCase().trim() !== institutionalId.toLowerCase().trim()) {
      return {
        error: `This email address is already bound to Institutional ID (${alreadyClaimed.institutional_id}). Please use your official university email.`
      };
    }

    // Update the existing auth user's password, confirmation, and metadata
    const { data: updatedUser, error: updateAuthErr } = await supabaseAdmin.auth.admin.updateUserById(
      existingAuthUser.id,
      {
        password,
        email_confirm: true,
        user_metadata: {
          full_name: fullName,
          institutional_id: whitelist.institutional_id,
          role: normalizedRole,
          department_id: whitelist.department_id,
          batch: whitelist.batch,
        }
      }
    );

    if (updateAuthErr || !updatedUser?.user) {
      console.error('Error updating existing auth user:', updateAuthErr);
      return { error: updateAuthErr?.message || 'Failed to update account credentials.' };
    }

    newUserId = updatedUser.user.id;
  } else {
    // Create brand-new user with email confirmed
    const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        full_name: fullName,
        institutional_id: whitelist.institutional_id,
        role: normalizedRole,
        department_id: whitelist.department_id,
        batch: whitelist.batch,
      }
    });

    if (authError || !authUser?.user) {
      console.error('Error creating auth user during signup:', authError);
      return { error: authError?.message || 'Failed to create user account.' };
    }

    newUserId = authUser.user.id;
  }

  // 4. Upsert Profile into public.profiles
  const nameParts = fullName.split(' ');
  const firstName = nameParts[0] || fullName;
  const lastName = nameParts.slice(1).join(' ') || null;

  const profilePayload = {
    id: newUserId,
    email,
    role: normalizedRole,
    full_name: fullName,
    first_name: firstName,
    last_name: lastName,
    department_id: whitelist.department_id,
    institutional_id: whitelist.institutional_id,
    batch: whitelist.batch || null,
    updated_at: new Date().toISOString(),
  };

  const { error: profileError } = await supabaseAdmin
    .from('profiles')
    .upsert(profilePayload, { onConflict: 'id' });

  if (profileError) {
    console.error('Error upserting profile in signup:', profileError);
  }

  // 5. Mark whitelist entry as claimed
  await claimWhitelistRecord(whitelist.id, newUserId);

  // 6. Revalidate routes
  revalidatePath('/login');
  revalidatePath('/signup');
  revalidatePath('/admin/users');
  revalidatePath('/admin/users/create');

  // 7. Redirect to /login with confirmed status
  const portalParam = normalizedRole === 'TEACHER' ? 'teacher' : 'student';
  redirect(`/login?registered=true&confirmed=true&portal=${portalParam}&email=${encodeURIComponent(email)}`);
}

export const signupAction = registerAccount;
