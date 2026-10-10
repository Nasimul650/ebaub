CREATE TABLE ai_chat_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL DEFAULT 'New Chat',
    messages JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE ai_chat_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own chat sessions" ON ai_chat_sessions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own chat sessions" ON ai_chat_sessions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own chat sessions" ON ai_chat_sessions
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own chat sessions" ON ai_chat_sessions
    FOR DELETE USING (auth.uid() = user_id);

CREATE INDEX ai_chat_sessions_user_id_idx ON ai_chat_sessions(user_id);
