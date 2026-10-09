'use server';

import { createClient } from '@/utils/supabase/server';
import { supabaseAdmin } from '@/utils/supabase/admin';
import { revalidatePath } from 'next/cache';

export interface AdminAccountResult {
  success?: boolean;
  error?: string;
  message?: string;
  account?: {
    id: string;
    email: string;
    institutional_id: string;
    full_name: string;
    role: string;
    password?: string;
    department_id?: string | null;
    batch?: string | null;
  };
}

/**
 * Server Action: createUniversityAccount
 * Provision official Teacher or Student credentials using institutional ID numbers.
 * Accessible only by authenticated users with ADMIN role.
 */
export async function createUniversityAccount(formData: FormData): Promise<AdminAccountResult> {
  try {
    // 1. Authenticate caller and assert Admin role
    const supabase = await createClient();
    const { data: { user: caller }, error: authError } = await supabase.auth.getUser();

    if (authError || !caller) {
      return { error: 'Unauthorized: You must be logged in as an administrator to create accounts.' };
    }

    // Verify Admin role in profiles or user_metadata
    const { data: callerProfile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', caller.id)
      .maybeSingle();

    const callerRole = (callerProfile?.role || caller.user_metadata?.role || '').toUpperCase();
    if (callerRole !== 'ADMIN') {
      return { error: 'Forbidden: Only administrators have permission to provision university credentials.' };
    }

    // 2. Extract inputs
    const rawRole = (formData.get('role') as string || '').trim().toLowerCase();
    const institutionalId = (formData.get('institutional_id') as string || '').trim();
    const fullName = (formData.get('full_name') as string || '').trim();
    const email = (formData.get('email') as string || '').trim().toLowerCase();
    const password = (formData.get('password') as string || '').trim();
    const departmentId = (formData.get('department_id') as string || '').trim() || null;
    const batch = (formData.get('batch') as string || '').trim() || null;

    // 3. Validation
    if (!rawRole || (rawRole !== 'teacher' && rawRole !== 'student')) {
      return { error: 'Invalid role specified. Please select either Teacher or Student.' };
    }

    if (!institutionalId) {
      return { error: 'Institutional ID is required (e.g. Teacher ID or Student Roll/Reg No).' };
    }

    if (!fullName) {
      return { error: 'Full Name is required.' };
    }

    if (!email || !email.includes('@')) {
      return { error: 'A valid email address is required.' };
    }

    if (!password || password.length < 6) {
      return { error: 'Password must be at least 6 characters long.' };
    }

    // Check if institutional_id already exists in profiles
    const { data: existingIdProfile } = await supabaseAdmin
      .from('profiles')
      .select('id, institutional_id')
      .eq('institutional_id', institutionalId)
      .maybeSingle();

    if (existingIdProfile) {
      return { error: `An account with Institutional ID "${institutionalId}" already exists.` };
    }

    // Check if email already exists in profiles
    const { data: existingEmailProfile } = await supabaseAdmin
      .from('profiles')
      .select('id, email')
      .eq('email', email)
      .maybeSingle();

    if (existingEmailProfile) {
      return { error: `An account with email "${email}" already exists.` };
    }

    // Normalize role for database ENUM ('ADMIN', 'TEACHER', 'STUDENT')
    const normalizedRole = rawRole === 'teacher' ? 'TEACHER' : 'STUDENT';

    // 4. Create user in Supabase Auth via Admin API
    const { data: authData, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirm so credentials work immediately
      user_metadata: {
        role: normalizedRole,
        full_name: fullName,
        institutional_id: institutionalId,
        department_id: departmentId || undefined,
        batch: batch || undefined,
      },
    });

    if (createError || !authData.user) {
      console.error('Supabase admin.createUser error:', createError);
      return { error: createError?.message || 'Failed to create authentication user in Supabase.' };
    }

    const newUserId = authData.user.id;

    // 5. Look up parent faculty_id if department_id is assigned
    let facultyId: string | null = null;
    if (departmentId) {
      const { data: dept } = await supabaseAdmin
        .from('departments')
        .select('faculty_id')
        .eq('id', departmentId)
        .maybeSingle();
      facultyId = dept?.faculty_id || null;
    }

    // Split name for compatibility with existing profile headers
    const nameParts = fullName.split(' ');
    const firstName = nameParts[0] || fullName;
    const lastName = nameParts.slice(1).join(' ') || null;

    // 6. Insert / Upsert into profiles table
    // (Upsert handles cases where handle_new_user trigger may have fired automatically)
    const profilePayload: any = {
      id: newUserId,
      institutional_id: institutionalId,
      full_name: fullName,
      first_name: firstName,
      last_name: lastName,
      email,
      role: normalizedRole,
      department_id: departmentId,
      faculty_id: facultyId,
      batch: batch || null,
    };

    let { error: profileError } = await supabaseAdmin
      .from('profiles')
      .upsert(profilePayload, { onConflict: 'id' });

    // Fallback if batch column not yet migrated
    if (profileError && profileError.message.includes('batch')) {
      delete profilePayload.batch;
      profileError = (await supabaseAdmin.from('profiles').upsert(profilePayload, { onConflict: 'id' })).error;
    }

    if (profileError) {
      console.error('Error inserting profile row:', profileError);
      // Clean up orphaned auth user
      await supabaseAdmin.auth.admin.deleteUser(newUserId).catch(() => {});
      return { error: `Failed to create university profile record: ${profileError.message}` };
    }

    // 7. Sync with extension tables (teachers / students) if department is provided
    if (departmentId) {
      try {
        if (normalizedRole === 'TEACHER') {
          await supabaseAdmin
            .from('teachers')
            .upsert({
              id: newUserId,
              department_id: departmentId,
              designation: 'Faculty Member',
            }, { onConflict: 'id' });
        } else if (normalizedRole === 'STUDENT') {
          const studentPayload: any = {
            id: newUserId,
            department_id: departmentId,
            student_id: institutionalId,
            enrollment_year: new Date().getFullYear(),
            status: 'ACTIVE',
            batch: batch || null,
          };

          let studentUpsertRes = await supabaseAdmin
            .from('students')
            .upsert(studentPayload, { onConflict: 'id' });

          if (studentUpsertRes.error && studentUpsertRes.error.message.includes('batch')) {
            delete studentPayload.batch;
            await supabaseAdmin.from('students').upsert(studentPayload, { onConflict: 'id' });
          }
        }
      } catch (syncErr: any) {
        console.warn('Extension table sync notice:', syncErr?.message);
      }
    }

    // 8. Revalidate routes
    revalidatePath('/admin/users');
    revalidatePath('/admin/users/create');
    revalidatePath('/admin');

    return {
      success: true,
      message: `${normalizedRole === 'TEACHER' ? 'Teacher' : 'Student'} account created successfully!`,
      account: {
        id: newUserId,
        email,
        institutional_id: institutionalId,
        full_name: fullName,
        role: normalizedRole,
        password,
        department_id: departmentId,
        batch: batch || undefined,
      },
    };
  } catch (err: any) {
    console.error('Unexpected error creating university account:', err);
    return { error: err.message || 'An unexpected error occurred while creating the account.' };
  }
}
