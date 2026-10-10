import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data, error } = await supabase
    .from('ai_chat_sessions')
    .select('id, title, created_at, updated_at, messages')
    .eq('user_id', user.id)
    .order('updated_at', { ascending: false })
    .limit(50);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const sessions = data.map(session => ({
    id: session.id,
    title: session.title,
    created_at: session.created_at,
    updated_at: session.updated_at,
    message_count: Array.isArray(session.messages) ? session.messages.length : 0
  }));

  return NextResponse.json(sessions);
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, title, messages } = body;

    if (id) {
      const updateData: any = {
        messages,
        updated_at: new Date().toISOString()
      };
      if (title) updateData.title = title;

      const { data, error } = await supabase
        .from('ai_chat_sessions')
        .update(updateData)
        .eq('id', id)
        .eq('user_id', user.id)
        .select('id, title, updated_at')
        .single();

      if (error) throw error;
      return NextResponse.json(data);
    } else {
      let newTitle = 'New Chat';
      if (title) {
        newTitle = title;
      } else if (Array.isArray(messages) && messages.length > 0) {
        const firstUserMsg = messages.find((m: any) => m.role === 'user');
        if (firstUserMsg && firstUserMsg.content) {
          const content = firstUserMsg.content;
          newTitle = content.length > 60 ? content.substring(0, 60) + '...' : content;
        }
      }

      const { data, error } = await supabase
        .from('ai_chat_sessions')
        .insert({
          user_id: user.id,
          title: newTitle,
          messages: messages || []
        })
        .select('id, title, updated_at')
        .single();

      if (error) throw error;
      return NextResponse.json(data);
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
