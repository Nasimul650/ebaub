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
