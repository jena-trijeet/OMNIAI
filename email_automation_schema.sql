-- 1. OAuth Configuration table
CREATE TABLE IF NOT EXISTS email_automation_configs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID,
    gmail_account TEXT NOT NULL,
    access_token TEXT,
    refresh_token TEXT,
    expiry_date BIGINT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Campaigns table
CREATE TABLE IF NOT EXISTS email_campaigns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID,
    name TEXT NOT NULL,
    subject TEXT NOT NULL,
    body TEXT NOT NULL,
    signature TEXT,
    status TEXT DEFAULT 'Draft', -- 'Draft', 'Scheduled', 'Sending', 'Completed', 'Failed'
    scheduled_at TIMESTAMP WITH TIME ZONE,
    total_emails INT DEFAULT 0,
    sent_emails INT DEFAULT 0,
    failed_emails INT DEFAULT 0,
    pending_emails INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Recipients table
CREATE TABLE IF NOT EXISTS email_recipients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campaign_id UUID REFERENCES email_campaigns(id) ON DELETE CASCADE,
    name TEXT,
    email TEXT NOT NULL,
    variables JSONB DEFAULT '{}'::jsonb, -- Custom spreadsheet column variables
    status TEXT DEFAULT 'Pending', -- 'Pending', 'Sent', 'Failed'
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Email Activity Logs
CREATE TABLE IF NOT EXISTS email_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campaign_id UUID REFERENCES email_campaigns(id) ON DELETE CASCADE,
    recipient_email TEXT NOT NULL,
    subject TEXT NOT NULL,
    status TEXT NOT NULL, -- 'Success', 'Failed'
    error_message TEXT,
    opened BOOLEAN DEFAULT FALSE,
    clicked BOOLEAN DEFAULT FALSE,
    sent_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
