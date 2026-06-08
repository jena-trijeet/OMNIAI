-- Media Generation Additions

-- 1. Generations table
CREATE TABLE IF NOT EXISTS media_generations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  type TEXT CHECK (type IN ('image', 'video')),
  prompt TEXT NOT NULL,
  negative_prompt TEXT,
  aspect_ratio TEXT DEFAULT '1:1',
  output_url TEXT,
  status TEXT DEFAULT 'pending', -- 'pending', 'processing', 'completed', 'failed'
  config JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- RLS
ALTER TABLE media_generations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own media generations" ON media_generations
  FOR ALL USING (auth.uid() = user_id);
