-- Part 5: Security & Permissions Schema

-- 1. Enhanced Meetings Security
ALTER TABLE meetings ADD COLUMN IF NOT EXISTS is_private BOOLEAN DEFAULT false;
ALTER TABLE meetings ADD COLUMN IF NOT EXISTS room_password_hash TEXT;
ALTER TABLE meetings ADD COLUMN IF NOT EXISTS access_token UUID DEFAULT gen_random_uuid();
ALTER TABLE meetings ADD COLUMN IF NOT EXISTS expires_at TIMESTAMP WITH TIME ZONE;

-- 2. Meeting Participants table (Permissions)
CREATE TABLE IF NOT EXISTS meeting_participants (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  meeting_id UUID REFERENCES meetings(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'guest', -- 'owner', 'co-host', 'guest'
  permissions JSONB DEFAULT '{"can_speak": true, "can_share": true}'::jsonb,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- RLS
ALTER TABLE meeting_participants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view participants of meetings they belong to" 
  ON meeting_participants FOR SELECT USING (
    EXISTS (SELECT 1 FROM meeting_participants mp WHERE mp.meeting_id = meeting_participants.meeting_id AND mp.user_id = auth.uid())
  );

CREATE POLICY "Owners can manage participants"
  ON meeting_participants FOR ALL USING (
    EXISTS (SELECT 1 FROM meeting_participants mp WHERE mp.meeting_id = meeting_participants.meeting_id AND mp.user_id = auth.uid() AND mp.role = 'owner')
  );
