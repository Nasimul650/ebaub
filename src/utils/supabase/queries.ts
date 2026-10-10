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

// ==========================================
// COURSE MATERIALS & MULTI-DEPARTMENT TAGGING
// ==========================================

import type { CourseMaterial, DepartmentOption } from '@/types';
export type { CourseMaterial, DepartmentOption };

/**
 * Fetches all available departments across the university.
 */
export async function getAllDepartments(): Promise<DepartmentOption[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('departments')
      .select('id, name, faculty_id')
      .order('name', { ascending: true });

    if (error) {
      console.error('Error fetching departments:', error.message);
      return [];
    }

    return (data || []) as DepartmentOption[];
  } catch (err) {
    console.error('Unexpected error fetching departments:', err);
    return [];
  }
}

export interface DepartmentWithFaculty {
  id: string;
  name: string;
  code?: string;
  faculty_id: string;
  faculty_name?: string;
}

/**
 * Fetches all departments joined with their parent faculty details
 * to populate administrative dropdowns cleanly.
 */
export async function getDepartmentsWithFaculty(): Promise<DepartmentWithFaculty[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('departments')
      .select('id, name, faculty_id, faculties(id, name)')
      .order('name', { ascending: true });

    if (error) {
      console.warn('Error fetching departments with faculties join, trying basic select:', error.message);
      const fallback = await supabase
        .from('departments')
        .select('id, name, faculty_id')
        .order('name', { ascending: true });
      return (fallback.data || []).map((row: any) => ({
        id: row.id,
        name: row.name,
        faculty_id: row.faculty_id,
      }));
    }

    return (data || []).map((row: any) => ({
      id: row.id,
      name: row.name,
      faculty_id: row.faculty_id,
      faculty_name: Array.isArray(row.faculties) ? row.faculties[0]?.name : (row.faculties?.name || undefined),
    }));
  } catch (err) {
    console.error('Unexpected error fetching departments with faculty:', err);
    return [];
  }
}

export interface UserProfileItem {
  id: string;
  institutional_id: string | null;
  full_name: string | null;
  first_name: string | null;
  last_name: string | null;
  email: string;
  role: string;
  department_id: string | null;
  faculty_id: string | null;
  faculty_name?: string | null;
  batch?: string | null;
  avatar_url?: string | null;
  bio?: string | null;
  phone?: string | null;
  created_at: string;
  department?: { 
    id: string; 
    name: string;
    faculty_id?: string;
    faculty_name?: string;
  } | null;
}

/**
 * Fetches university profiles for the Admin User Management dashboard.
 * Resolves department and parent faculty hierarchy for institutional organization.
 */
export async function getUniversityProfiles(roleFilter?: string): Promise<UserProfileItem[]> {
  try {
    const supabase = await createClient();

    // Fetch faculties lookup for reliable fallback mapping
    const { data: faculties } = await supabase
      .from('faculties')
      .select('id, name');
    
    const facultyMap: Record<string, string> = {};
    if (faculties) {
      faculties.forEach((f: any) => {
        facultyMap[f.id] = f.name;
      });
    }

    let query = supabase
      .from('profiles')
      .select('id, institutional_id, full_name, first_name, last_name, email, role, department_id, faculty_id, batch, avatar_url, created_at, departments(id, name, faculty_id, faculties(id, name))')
      .order('created_at', { ascending: false });

    if (roleFilter && roleFilter !== 'ALL') {
      query = query.eq('role', roleFilter.toUpperCase());
    }

    let { data, error } = await query;
    if (error && (error.message.includes('batch') || error.message.includes('avatar_url'))) {
      // Graceful fallback if migration not yet applied
      let fallbackQuery = supabase
        .from('profiles')
        .select('id, institutional_id, full_name, first_name, last_name, email, role, department_id, faculty_id, created_at, departments(id, name, faculty_id, faculties(id, name))')
        .order('created_at', { ascending: false });
      if (roleFilter && roleFilter !== 'ALL') {
        fallbackQuery = fallbackQuery.eq('role', roleFilter.toUpperCase());
      }
      const fallbackRes = await fallbackQuery;
      data = fallbackRes.data as any;
      error = fallbackRes.error;
    }

    if (error) {
      console.error('Error fetching university profiles:', error.message);
      return [];
    }

    return (data || []).map((row: any) => {
      const dept = row.departments;
      let facultyName: string | null = null;
      if (dept?.faculties) {
        facultyName = Array.isArray(dept.faculties)
          ? dept.faculties[0]?.name
          : (dept.faculties?.name || null);
      }
      if (!facultyName && row.faculty_id && facultyMap[row.faculty_id]) {
        facultyName = facultyMap[row.faculty_id];
      }
      if (!facultyName && dept?.faculty_id && facultyMap[dept.faculty_id]) {
        facultyName = facultyMap[dept.faculty_id];
      }

      return {
        ...row,
        batch: row.batch || null,
        faculty_name: facultyName,
        department: dept ? {
          id: dept.id,
          name: dept.name,
          faculty_id: dept.faculty_id,
          faculty_name: facultyName,
        } : null,
      };
    });
  } catch (err) {
    console.error('Unexpected error fetching university profiles:', err);
    return [];
  }
}

/**
 * Grabs the teacher's registered default department ID from profiles, teachers, or faculty_members.
 */
export async function getTeacherDefaultDepartment(teacherId: string): Promise<string | null> {
  if (!teacherId || teacherId.trim() === '') return null;
  try {
    const supabase = await createClient();

    // 1. Check profiles table department_id
    const { data: profile } = await supabase
      .from('profiles')
      .select('department_id')
      .eq('id', teacherId)
      .single();

    if (profile?.department_id) {
      return profile.department_id;
    }

    // 2. Check teachers extension table
    const { data: teacher } = await supabase
      .from('teachers')
      .select('department_id')
      .eq('id', teacherId)
      .single();

    if (teacher?.department_id) {
      return teacher.department_id;
    }

    // 3. Fallback: check faculty_members table by matching user email
    const { data: userProfile } = await supabase
      .from('profiles')
      .select('email')
      .eq('id', teacherId)
      .single();

    if (userProfile?.email) {
      const { data: facultyMember } = await supabase
        .from('faculty_members')
        .select('department_id')
        .eq('email', userProfile.email)
        .single();

      if (facultyMember?.department_id) {
        return facultyMember.department_id;
      }
    }

    // 4. Fallback to first department
    const { data: firstDept } = await supabase
      .from('departments')
      .select('id')
      .order('name', { ascending: true })
      .limit(1)
      .single();

    return firstDept?.id || null;
  } catch (err) {
    console.error('Error getting teacher default department:', err);
    return null;
  }
}

/**
 * Grabs the student's registered default department ID.
 */
export async function getStudentDefaultDepartment(studentId: string): Promise<string | null> {
  if (!studentId || studentId.trim() === '') return null;
  try {
    const supabase = await createClient();

    // 1. Check profiles table
    const { data: profile } = await supabase
      .from('profiles')
      .select('department_id')
      .eq('id', studentId)
      .single();

    if (profile?.department_id) {
      return profile.department_id;
    }

    // 2. Check students extension table
    const { data: student } = await supabase
      .from('students')
      .select('department_id')
      .eq('id', studentId)
      .single();

    return student?.department_id || null;
  } catch (err) {
    console.error('Error getting student default department:', err);
    return null;
  }
}

/**
 * Helper to enrich course material rows with resolved teacher uploader profiles
 * and department + faculty metadata.
 */
async function enrichMaterialsWithDetails(supabase: any, rawData: any[]): Promise<CourseMaterial[]> {
  if (!rawData || rawData.length === 0) return [];

  // Extract unique teacher IDs
  const teacherIds = Array.from(new Set(rawData.map((r: any) => r.teacher_id).filter(Boolean)));
  const profileMap: Record<string, { full_name: string; email: string }> = {};

  if (teacherIds.length > 0) {
    try {
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, full_name, first_name, last_name, email')
        .in('id', teacherIds);

      if (profiles) {
        profiles.forEach((p: any) => {
          const name = p.full_name || (p.first_name ? `${p.first_name} ${p.last_name || ''}`.trim() : '') || p.email;
          profileMap[p.id] = { full_name: name, email: p.email };
        });
      }
    } catch (e) {
      console.warn('Could not enrich materials with teacher profiles:', e);
    }
  }

  return rawData.map((row: any) => {
    const depts: DepartmentOption[] = (row.course_material_departments || [])
      .map((cmd: any) => {
        const dept = cmd.departments;
        if (!dept) return null;
        const facName = Array.isArray(dept.faculties)
          ? dept.faculties[0]?.name
          : dept.faculties?.name || undefined;
        return {
          id: dept.id,
          name: dept.name,
          faculty_id: dept.faculty_id,
          faculty_name: facName,
        };
      })
      .filter(Boolean);

    const profile = profileMap[row.teacher_id];

    return {
      ...row,
      departments: depts,
      teacher_name: profile?.full_name || undefined,
      teacher_email: profile?.email || undefined,
    };
  });
}

/**
 * Fetches course materials uploaded by a specific teacher, including joined tagged departments and faculties.
 */
export async function getTeacherMaterials(teacherId: string): Promise<CourseMaterial[]> {
  try {
    const supabase = await createClient();
    let query = supabase
      .from('course_materials')
      .select('*, course_material_departments(department_id, departments(id, name, faculty_id, faculties(id, name)))')
      .order('created_at', { ascending: false });

    if (teacherId && teacherId.trim() !== '') {
      query = query.eq('teacher_id', teacherId);
    }

    const { data, error } = await query;

    if (error) {
      console.warn('Error fetching teacher materials with junction, trying base query:', error.message);
      const fallbackQuery = await supabase
        .from('course_materials')
        .select('*')
        .order('created_at', { ascending: false });
      return (fallbackQuery.data || []) as CourseMaterial[];
    }

    return await enrichMaterialsWithDetails(supabase, data || []);
  } catch (err) {
    console.error('Unexpected error fetching course materials:', err);
    return [];
  }
}

/**
 * Fetches all course materials across the entire university,
 * including tagged departments with faculty and teacher uploader profiles.
 */
export async function getAllCourseMaterials(): Promise<CourseMaterial[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('course_materials')
      .select('*, course_material_departments(department_id, departments(id, name, faculty_id, faculties(id, name)))')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching all course materials:', error.message);
      return [];
    }

    return await enrichMaterialsWithDetails(supabase, data || []);
  } catch (err) {
    console.error('Unexpected error fetching all course materials:', err);
    return [];
  }
}

export interface StudentMaterialsFilter {
  selectedDepartmentId?: string;
  searchQuery?: string;
  studentDeptId?: string;
}

/**
 * Fetches course materials for students with department filtering, search,
 * and smart sorting where materials matching the student's own department appear first.
 */
export async function getCourseMaterialsForStudent({
  selectedDepartmentId,
  searchQuery,
  studentDeptId,
}: StudentMaterialsFilter = {}): Promise<CourseMaterial[]> {
  try {
    const supabase = await createClient();

    let query = supabase
      .from('course_materials')
      .select('*, course_material_departments(department_id, departments(id, name, faculty_id, faculties(id, name)))')
      .order('created_at', { ascending: false });

    if (searchQuery && searchQuery.trim() !== '') {
      const term = `%${searchQuery.trim()}%`;
      query = query.or(`title.ilike.${term},course_code.ilike.${term},file_name.ilike.${term}`);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching student course materials:', error.message);
      return [];
    }

    let materials: CourseMaterial[] = await enrichMaterialsWithDetails(supabase, data || []);

    // If a specific department is chosen (and not 'all')
    if (selectedDepartmentId && selectedDepartmentId !== 'all') {
      materials = materials.filter((m) =>
        m.departments && m.departments.some((d) => d.id === selectedDepartmentId)
      );
    } else if (studentDeptId) {
      // If "all" or omitted, order so materials matching student's department appear first
      materials.sort((a, b) => {
        const aMatches = a.departments?.some((d) => d.id === studentDeptId) ? 1 : 0;
        const bMatches = b.departments?.some((d) => d.id === studentDeptId) ? 1 : 0;

        if (bMatches !== aMatches) {
          return bMatches - aMatches; // matching department first
        }
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      });
    }

    return materials;
  } catch (err) {
    console.error('Unexpected error fetching student materials:', err);
    return [];
  }
}

export interface FullUserProfileDetails {
  id: string;
  email: string;
  role: string;
  full_name: string | null;
  first_name?: string | null;
  last_name?: string | null;
  institutional_id: string | null;
  department_id: string | null;
  faculty_id: string | null;
  batch?: string | null;
  username?: string | null;
  avatar_url?: string | null;
  bio?: string | null;
  phone?: string | null;
  created_at: string;
  department_name?: string | null;
  faculty_name?: string | null;
}

/**
 * Fetches complete profile details for settings page.
 */
export async function getUserFullProfile(userId: string): Promise<FullUserProfileDetails | null> {
  try {
    const supabase = await createClient();

    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*, departments(id, name, faculty_id, faculties(id, name))')
      .eq('id', userId)
      .maybeSingle();

    if (error || !profile) {
      // Fallback query without joins if departments table relationship has issues
      const { data: fallbackProfile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (!fallbackProfile) return null;

      let departmentName: string | null = null;
      let facultyName: string | null = null;

      if (fallbackProfile.department_id) {
        const { data: dept } = await supabase
          .from('departments')
          .select('name, faculties(name)')
          .eq('id', fallbackProfile.department_id)
          .maybeSingle();

        if (dept) {
          departmentName = dept.name;
          facultyName = Array.isArray(dept.faculties) ? dept.faculties[0]?.name : (dept.faculties as any)?.name || null;
        }
      }

      return {
        id: fallbackProfile.id,
        email: fallbackProfile.email,
        role: (fallbackProfile.role || 'STUDENT').toUpperCase(),
        full_name: fallbackProfile.full_name || `${fallbackProfile.first_name || ''} ${fallbackProfile.last_name || ''}`.trim() || null,
        first_name: fallbackProfile.first_name,
        last_name: fallbackProfile.last_name,
        institutional_id: fallbackProfile.institutional_id || null,
        department_id: fallbackProfile.department_id || null,
        faculty_id: fallbackProfile.faculty_id || null,
        batch: fallbackProfile.batch || null,
        username: (fallbackProfile as any)?.username || null,
        avatar_url: fallbackProfile.avatar_url || null,
        bio: fallbackProfile.bio || null,
        phone: fallbackProfile.phone || null,
        created_at: fallbackProfile.created_at,
        department_name: departmentName,
        faculty_name: facultyName,
      };
    }

    const dept = (profile as any).departments;
    let facultyName: string | null = null;
    let departmentName: string | null = null;

    if (dept) {
      departmentName = dept.name;
      if (dept.faculties) {
        facultyName = Array.isArray(dept.faculties) ? dept.faculties[0]?.name : dept.faculties.name || null;
      }
    }

    return {
      id: profile.id,
      email: profile.email,
      role: (profile.role || 'STUDENT').toUpperCase(),
      full_name: profile.full_name || `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || null,
      first_name: profile.first_name,
      last_name: profile.last_name,
      institutional_id: profile.institutional_id || null,
      department_id: profile.department_id || null,
      faculty_id: profile.faculty_id || null,
      batch: profile.batch || null,
      username: (profile as any)?.username || null,
      avatar_url: profile.avatar_url || null,
      bio: profile.bio || null,
      phone: profile.phone || null,
      created_at: profile.created_at,
      department_name: departmentName,
      faculty_name: facultyName,
    };
  } catch (err) {
    console.error('Error fetching user full profile:', err);
    return null;
  }
}

