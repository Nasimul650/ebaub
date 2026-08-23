import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q');

  if (!q || q.trim() === '') {
    return NextResponse.json([]);
  }

  const supabase = await createClient();
  const searchTerm = `%${q}%`;

  try {
    const term = `%${q}%`;
    // Run all searches concurrently using broader OR conditions
    const [newsRes, noticesRes, facultyRes, programsRes] = await Promise.all([
      supabase.from('news').select('id, title').or(`title.ilike.${term},summary.ilike.${term}`).limit(4),
      supabase.from('notices').select('id, title').or(`title.ilike.${term},category.ilike.${term}`).limit(4),
      supabase.from('faculty_members').select('id, name').or(`name.ilike.${term},title.ilike.${term},bio.ilike.${term}`).limit(4),
      supabase.from('programs').select('id, name').or(`name.ilike.${term},degree_level.ilike.${term}`).limit(4),
    ]);

    const results: Array<{ id: string; title: string; type: string; url: string }> = [];

    if (newsRes.data) {
      newsRes.data.forEach(item => {
        results.push({ id: `news-${item.id}`, title: item.title, type: 'News', url: `/news/${item.id}` });
      });
    }

    if (noticesRes.data) {
      noticesRes.data.forEach(item => {
        results.push({ id: `notices-${item.id}`, title: item.title, type: 'Notice', url: `/notices/${item.id}` });
      });
    }

    if (facultyRes.data) {
      facultyRes.data.forEach(item => {
        results.push({ id: `faculty-${item.id}`, title: item.name, type: 'Faculty', url: `/faculty/${item.id}` });
      });
    }

    if (programsRes.data) {
      programsRes.data.forEach(item => {
        results.push({ id: `program-${item.id}`, title: item.name, type: 'Program', url: `/academics/${item.id}` });
      });
    }

    return NextResponse.json(results);
  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json({ error: 'Search failed' }, { status: 500 });
  }
}
