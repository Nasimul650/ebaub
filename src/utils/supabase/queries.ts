import { createClient } from './server'

export interface NewsItem {
  id: string
  title: string
  slug: string
  content: string
  author_id: string | null
  published_at: string | null
  created_at: string
  updated_at: string
}

export interface NoticeItem {
  id: string
  title: string
  slug: string
  content: string
  file_url: string | null
  category: string | null
  author_id: string | null
  published_at: string | null
  created_at: string
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
      .select('*')
      .not('published_at', 'is', null) // Only fetch published news
      .order('published_at', { ascending: false })
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
      .select('*')
      .order('published_at', { ascending: false })
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
