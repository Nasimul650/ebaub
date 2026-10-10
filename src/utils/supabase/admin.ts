import { createClient, SupabaseClient } from '@supabase/supabase-js';

let cachedAdminClient: SupabaseClient | null = null;

/**
 * Returns a dedicated server-only Supabase admin client powered by the service role key.
 * This client bypasses Row Level Security and has full administrative privileges.
 * NEVER expose this or import it into client-side components.
 */
export function createAdminClient(): SupabaseClient {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl) {
    throw new Error('NEXT_PUBLIC_SUPABASE_URL is not defined in environment variables.');
  }

  if (!serviceRoleKey || serviceRoleKey.trim() === '') {
    throw new Error(
      'SUPABASE_SERVICE_ROLE_KEY is missing in .env.local. ' +
      'Please obtain your service_role key from Supabase Dashboard > Project Settings > API and paste it into .env.local.'
    );
  }

  if (!cachedAdminClient) {
    cachedAdminClient = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
  }

  return cachedAdminClient;
}

/**
 * Lazy proxy export for convenient direct calls:
 * supabaseAdmin.auth.admin.createUser(...), supabaseAdmin.from('profiles')...
 */
export const supabaseAdmin = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    const client = createAdminClient();
    return (client as any)[prop];
  },
});
