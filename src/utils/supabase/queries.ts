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

export interface FacultyHierarchy extends AcademicFaculty {
  departments: AcademicDepartment[];
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

export async function getFacultiesWithDepartments(): Promise<FacultyHierarchy[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('faculties')
      .select('*, departments(*)');

    if (error) throw error;
    return data as unknown as FacultyHierarchy[];
  } catch (err) {
    console.error('Error fetching faculties with departments:', err);
    return [];
  }
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
