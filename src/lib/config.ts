/**
 * Application Configuration & Environment Variable Validator
 */

export const PASSWORD_MIN_LENGTH = 8;

export const ROUTE_ROLE_MAP: Record<string, string> = {
  '/admin': 'admin',
  '/teacher': 'teacher',
  '/student': 'student',
};

export const ROLE_EMAIL_PATTERNS = {
  admin: /^(admin|provost|dean|registrar|vc)@/i,
  teacher: /^(teacher|faculty|prof|lecturer)@/i,
  student: /^(student|[0-9]{4,})@/i,
};

export function getTavilyApiKey(required: boolean = false): string {
  const apiKey = process.env.TAVILY_API_KEY;
  if (!apiKey || apiKey.trim() === '') {
    if (required) {
      throw new Error('TAVILY_API_KEY not configured. Please define it in your environment variables.');
    }
    return '';
  }
  return apiKey.trim();
}

export function getGoogleAiApiKey(): string {
  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
  if (!apiKey || apiKey.trim() === '') {
    throw new Error('GOOGLE_GENERATIVE_AI_API_KEY not configured. Required for AI features.');
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

export interface AppConfig {
  supabaseUrl: string;
  supabaseAnonKey: string;
  hasServiceRoleKey: boolean;
  hasGoogleAiKey: boolean;
  hasTavilyKey: boolean;
  passwordMinLength: number;
}

export function getAppConfig(): AppConfig {
  const supabase = getSupabaseConfig();
  return {
    supabaseUrl: supabase.url,
    supabaseAnonKey: supabase.anonKey,
    hasServiceRoleKey: Boolean(supabase.serviceRoleKey),
    hasGoogleAiKey: Boolean(process.env.GOOGLE_GENERATIVE_AI_API_KEY),
    hasTavilyKey: Boolean(process.env.TAVILY_API_KEY),
    passwordMinLength: PASSWORD_MIN_LENGTH,
  };
}
