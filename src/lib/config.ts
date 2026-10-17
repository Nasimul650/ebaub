/**
 * Application Configuration & Environment Variable Validator
 */

export function getTavilyApiKey(): string {
  const apiKey = process.env.TAVILY_API_KEY;
  if (!apiKey || apiKey.trim() === '') {
    return '';
  }
  return apiKey.trim();
}

export function getGoogleAiApiKey(): string {
  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
  if (!apiKey || apiKey.trim() === '') {
    throw new Error('Missing GOOGLE_GENERATIVE_AI_API_KEY environment variable. Required for AI features.');
  }
  return apiKey.trim();
}

export function getSupabaseConfig(): { url: string; anonKey: string; serviceRoleKey?: string } {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !anonKey) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables.');
  }

  return {
    url,
    anonKey,
    serviceRoleKey,
  };
}
