import { createServerClient } from '@supabase/ssr'
import { createClient } from './server'

export interface NewsItem {
  id: string
  title: string
  summary?: string
  image_url?: string
  created_at: string
  category?: string
}

export interface NoticeItem {
  id: string
  title: string
  date?: string
  priority?: string
  description?: string
  attachment_url?: string
  category?: string
}

/**
 * Fetches the most recent published news articles from the server.
 * Ensures the app doesn't crash on database errors by safely returning an empty array.
 */
export async function getLatestNews(limit: number = 3): Promise<NewsItem[]> {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('news')
      .select('id, title, summary, image_url, created_at, category')
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) {
      console.error('Error fetching latest news:', error.message)
      return []
    }

    return data as NewsItem[]
  } catch (err) {
    console.error('Unexpected error fetching latest news:', err)
    return []
  }
}

/**
 * Fetches active/recent notices from the server.
 * Returns an empty array gracefully on failure.
 */
export async function getActiveNotices(limit: number = 5): Promise<NoticeItem[]> {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('notices')
      .select('id, title, date, priority, description, attachment_url, category')
      .order('date', { ascending: false })
      .limit(limit)

    if (error) {
      console.error('Error fetching active notices:', error.message)
      return []
    }

    return data as NoticeItem[]
  } catch (err) {
    console.error('Unexpected error fetching active notices:', err)
    return []
  }
}

/**
 * Fetches a single news article by ID.
 */
export async function getNewsById(id: string): Promise<NewsItem & { content?: string } | null> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('news')
      .select('id, title, summary, image_url, created_at, category, content')
      .eq('id', id)
      .single()
      
    if (error) throw error
    return data
  } catch (err) {
    console.error(`Error fetching news ${id}:`, err)
    return null
  }
}

/**
 * Fetches a single notice by ID.
 */
export async function getNoticeById(id: string): Promise<NoticeItem & { content?: string } | null> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('notices')
      .select('id, title, date, priority, description, attachment_url, category, content')
      .eq('id', id)
      .single()
      
    if (error) throw error
    return data
  } catch (err) {
    console.error(`Error fetching notice ${id}:`, err)
    return null
  }
}

/**
 * Fetches all news articles.
 */
export async function getAllNews(): Promise<NewsItem[]> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('news')
      .select('id, title, summary, image_url, created_at, category')
      .order('created_at', { ascending: false })
      
    if (error) throw error
    return data || []
  } catch (err) {
    console.error('Error fetching all news:', err)
    return []
  }
}

/**
 * Fetches all notices.
 */
export async function getAllNotices(): Promise<NoticeItem[]> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('notices')
      .select('id, title, date, priority, description, attachment_url, category')
      .order('date', { ascending: false })
      
    if (error) throw error
    return data || []
  } catch (err) {
    console.error('Error fetching all notices:', err)
    return []
  }
}

// ==========================================
// EVENTS
// ==========================================

export interface EventItem {
  id: string
  title: string
  slug: string
  description: string
  event_date: string
  time?: string
  location?: string
  image_url?: string
  status?: string
  organizer_id?: string
  created_at: string
}

export async function getAllEvents(limit = 20): Promise<EventItem[]> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('event_date', { ascending: false })
      .limit(limit)

    if (error) throw error
    return data || []
  } catch (err) {
    console.error('Error fetching all events:', err)
    return []
  }
}

export async function getEventById(id: string): Promise<EventItem | null> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return data
  } catch (err) {
    console.error(`Error fetching event ${id}:`, err)
    return null
  }
}

// ==========================================
// FACULTY MEMBERS & ACADEMIC HIERARCHY
// ==========================================

export interface AcademicFaculty {
  id: string;
  name: string;
  description?: string;
}

export interface AcademicDepartment {
  id: string;
  faculty_id: string;
  name: string;
  description?: string;
  faculties?: AcademicFaculty;
}

export interface AdmissionsInfo {
  id: string;
  faculty_id: string;
  requirements: string | null;
  process_steps: string | null;
  important_dates: string | null;
  created_at: string;
  updated_at: string;
}

export interface FacultyHierarchy extends AcademicFaculty {
  departments: AcademicDepartment[];
  admissions_info?: AdmissionsInfo;
}

export interface FacultyItem {
  id: string;
  name: string;
  title: string;
  department_id?: string;
  bio?: string;
  image_url?: string;
  created_at: string;
  updated_at: string;
  departments?: AcademicDepartment;
}

export async function getFacultiesWithDepartments() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('faculties')
    .select('*, departments(*)')
    .order('name', { ascending: true });

  if (error) {
    console.error('Error fetching faculties with departments:', error);
    return [];
  }

  return data as FacultyHierarchy[];
}

export async function getAdmissionsData() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('faculties')
    .select('*, departments(*), admissions_info(*)')
    .order('name', { ascending: true });

  if (error) {
    console.error('Error fetching admissions data:', error);
    return [];
  }

  // Supabase returns a 1-to-1 relationship as an array sometimes or object.
  // Assuming admissions_info is a 1-to-1 relationship, we map it safely.
  return (data as any[]).map(faculty => ({
    ...faculty,
    admissions_info: Array.isArray(faculty.admissions_info) ? faculty.admissions_info[0] : faculty.admissions_info
  })) as FacultyHierarchy[];
}

export async function getAllFaculty(limit = 100): Promise<FacultyItem[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('faculty_members')
      .select('*, departments(*, faculties(*))')
      .order('name', { ascending: true })
      .limit(limit);

    if (error) throw error;
    return data as unknown as FacultyItem[];
  } catch (err) {
    console.error('Error fetching all faculty:', err);
    return [];
  }
}

export async function getFacultyById(id: string): Promise<FacultyItem | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('faculty_members')
      .select('*, departments(*, faculties(*))')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data as unknown as FacultyItem;
  } catch (err) {
    console.error(`Error fetching faculty ${id}:`, err);
    return null;
  }
}

// ==========================================
// ACADEMIC PROGRAMS
// ==========================================

export interface ProgramItem {
  id: string;
  department_id: string;
  name: string;
  degree_level: string;
  duration_years: number;
  description?: string;
  created_at: string;
  departments?: AcademicDepartment;
}

export async function getAllPrograms(limit = 100): Promise<ProgramItem[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('programs')
      .select('*, departments(*, faculties(*))')
      .order('name', { ascending: true })
      .limit(limit);

    if (error) throw error;
    return data as unknown as ProgramItem[];
  } catch (err) {
    console.error('Error fetching all programs:', err);
    return [];
  }
}

export async function getProgramById(id: string): Promise<ProgramItem | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('programs')
      .select('*, departments(*, faculties(*))')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data as unknown as ProgramItem;
  } catch (err) {
    console.error(`Error fetching program ${id}:`, err);
    return null;
  }
}

// ==========================================
// ACADEMIC CALENDAR
// ==========================================

export interface CalendarEventItem {
  id: string;
  title: string;
  start_date: string;
  end_date?: string;
  category?: string;
  description?: string;
  created_at: string;
}

export async function getAcademicCalendar(): Promise<CalendarEventItem[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('academic_calendar')
      .select('*')
      .order('start_date', { ascending: true });

    if (error) throw error;
    return data as CalendarEventItem[];
  } catch (err) {
    console.error('Error fetching calendar:', err);
    return [];
  }
}

export async function getCalendarEventById(id: string): Promise<CalendarEventItem | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('academic_calendar')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data as CalendarEventItem;
  } catch (err) {
    console.error(`Error fetching calendar event ${id}:`, err);
    return null;
  }
}

// ==========================================
// CONTACT MESSAGES
// ==========================================

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: string;
  created_at: string;
}

export async function getAllMessages(): Promise<ContactMessage[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as ContactMessage[];
  } catch (err) {
    console.error('Error fetching contact messages:', err);
    return [];
  }
}

// ==========================================
// PAGE BUILDER QUERIES
// ==========================================

import type { Page } from '@/types';

/**
 * Fetches a page by its unique slug for the block-based page builder.
 * Returns null if the page doesn't exist or on error.
 */
export async function getPageBySlug(slug: string): Promise<Page | null> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('pages')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error) {
      console.error('Error fetching page:', error.message);
      return null;
    }

    return data as Page;
  } catch (err) {
    console.error('Unexpected error fetching page:', err);
    return null;
  }
}

// ==========================================
// SITE SETTINGS (PAGE-BASED STATIC CONTENT MANAGER)
// ==========================================

export * from '@/types/settings';
import type { GlobalSiteSettings } from '@/types/settings';
import { DEFAULT_SITE_SETTINGS, PAGE_SETTINGS_DEFAULTS } from '@/types/settings';

/**
 * Fetches page-specific site settings (e.g. 'home', 'academics', 'admissions', 'faculty', 'student_life', 'contact', 'global_footer').
 * Merges with PAGE_SETTINGS_DEFAULTS so missing fields or missing DB rows always fallback cleanly.
 */
export async function getPageSiteSettings<T = any>(pageId: string): Promise<T> {
  const defaultData = (PAGE_SETTINGS_DEFAULTS as any)[pageId] || {};
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('site_settings')
      .select('data')
      .eq('id', pageId)
      .single();

    if (error || !data || !data.data) {
      return { ...defaultData } as T;
    }

    return {
      ...defaultData,
      ...(typeof data.data === 'object' && data.data !== null ? data.data : {})
    } as T;
  } catch (err) {
    console.error(`Error fetching site settings for page '${pageId}':`, err);
    return { ...defaultData } as T;
  }
}

/**
 * Fetches all page-based site settings dictionary for the Admin Settings dashboard.
 */
export async function getAllPageSiteSettings(): Promise<Record<string, any>> {
  const result: Record<string, any> = {
    global_footer: { ...PAGE_SETTINGS_DEFAULTS.global_footer },
    home: { ...PAGE_SETTINGS_DEFAULTS.home },
    academics: { ...PAGE_SETTINGS_DEFAULTS.academics },
    admissions: { ...PAGE_SETTINGS_DEFAULTS.admissions },
    faculty: { ...PAGE_SETTINGS_DEFAULTS.faculty },
    student_life: { ...PAGE_SETTINGS_DEFAULTS.student_life },
    contact: { ...PAGE_SETTINGS_DEFAULTS.contact },
  };

  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('site_settings')
      .select('id, data');

    if (error || !data) {
      return result;
    }

    data.forEach((row: { id: string; data: any }) => {
      if (row.id in result) {
        result[row.id] = {
          ...result[row.id],
          ...(typeof row.data === 'object' && row.data !== null ? row.data : {})
        };
      } else {
        result[row.id] = row.data;
      }
    });

    return result;
  } catch (err) {
    console.error('Error fetching all page site settings:', err);
    return result;
  }
}

/**
 * Legacy getSiteSettings query for backward compatibility with existing components.
 */
export async function getSiteSettings<T = GlobalSiteSettings>(section?: string): Promise<T> {
  if (section && section in PAGE_SETTINGS_DEFAULTS) {
    return getPageSiteSettings(section) as Promise<T>;
  }

  // If section is hero/general/contact/socials, map to respective page setting
  if (section === 'hero') {
    const home = await getPageSiteSettings('home');
    return {
      headline: home.hero_headline,
      subtitle: home.hero_subtitle,
      video_url: home.hero_video_url,
      fallback_image_url: home.hero_fallback_image_url,
      badge_text: home.badge_text
    } as unknown as T;
  }

  if (section === 'general') {
    const footer = await getPageSiteSettings('global_footer');
    return {
      site_name: footer.site_name,
      short_name: footer.short_name,
      tagline: footer.tagline,
      meta_description: 'Official portal of EXIM Bank Agricultural University Bangladesh (EBAUB).',
      accreditation: footer.accreditation
    } as unknown as T;
  }

  if (section === 'contact') {
    return getPageSiteSettings('contact') as Promise<T>;
  }

  if (section === 'socials') {
    const footer = await getPageSiteSettings('global_footer');
    return {
      facebook_url: footer.facebook_url,
      linkedin_url: footer.linkedin_url,
      youtube_url: footer.youtube_url,
      student_portal_url: footer.student_portal_url,
      teacher_portal_url: footer.teacher_portal_url
    } as unknown as T;
  }

  // Default: Return merged GlobalSiteSettings
  const [globalFooter, home, contact] = await Promise.all([
    getPageSiteSettings('global_footer'),
    getPageSiteSettings('home'),
    getPageSiteSettings('contact')
  ]);

  return {
    hero: {
      headline: home.hero_headline,
      subtitle: home.hero_subtitle,
      video_url: home.hero_video_url,
      fallback_image_url: home.hero_fallback_image_url,
      badge_text: home.badge_text
    },
    general: {
      site_name: globalFooter.site_name,
      short_name: globalFooter.short_name,
      tagline: globalFooter.tagline,
      meta_description: 'Official portal of EXIM Bank Agricultural University Bangladesh (EBAUB).',
      accreditation: globalFooter.accreditation
    },
    contact: {
      campus_address: contact.campus_address,
      inquiries_email: contact.inquiries_email,
      admissions_email: globalFooter.admissions_email,
      hotline_phone: contact.hotline_phone,
      admissions_phone: contact.admissions_phone,
      office_hours: contact.office_hours
    },
    socials: {
      facebook_url: globalFooter.facebook_url,
      linkedin_url: globalFooter.linkedin_url,
      youtube_url: globalFooter.youtube_url,
      student_portal_url: globalFooter.student_portal_url,
      teacher_portal_url: globalFooter.teacher_portal_url
    }
  } as unknown as T;
}


