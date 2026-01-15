-- Add missing columns to orders table
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS price NUMERIC(12, 2) DEFAULT 0;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS buyer_name TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS product_name TEXT;

-- Add missing columns to blacklist table
ALTER TABLE public.blacklist ADD COLUMN IF NOT EXISTS description TEXT;

-- Update blacklist status constraint to include 'dismissed' instead of 'rejected'
ALTER TABLE public.blacklist DROP CONSTRAINT IF EXISTS blacklist_status_check;
ALTER TABLE public.blacklist ADD CONSTRAINT blacklist_status_check CHECK (status IN ('pending', 'verified', 'dismissed'));

-- Add stats table for global statistics
CREATE TABLE IF NOT EXISTS public.stats (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    key TEXT UNIQUE NOT NULL,
    value NUMERIC DEFAULT 0,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for stats
ALTER TABLE public.stats ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read stats
DROP POLICY IF EXISTS "Anyone can read stats" ON public.stats;
CREATE POLICY "Anyone can read stats" ON public.stats
    FOR SELECT USING (true);

-- Policy: Admins can update stats
DROP POLICY IF EXISTS "Admins can update stats" ON public.stats;
CREATE POLICY "Admins can update stats" ON public.stats
    FOR ALL USING (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
    );

-- Insert initial stats
INSERT INTO public.stats (key, value) VALUES 
    ('total_umkm_users', 10247),
    ('total_resolved_disputes', 1429),
    ('total_fraud_blocked', 24310)
ON CONFLICT (key) DO NOTHING;

-- Create function to auto-increment fraud blocked when blacklist is verified
CREATE OR REPLACE FUNCTION increment_fraud_blocked()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'verified' AND OLD.status != 'verified' THEN
        UPDATE public.stats
        SET value = value + 1, updated_at = NOW()
        WHERE key = 'total_fraud_blocked';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS tr_increment_fraud_blocked ON public.blacklist;
CREATE TRIGGER tr_increment_fraud_blocked
    AFTER UPDATE ON public.blacklist
    FOR EACH ROW
    EXECUTE FUNCTION increment_fraud_blocked();

-- Create function to auto-increment resolved disputes
CREATE OR REPLACE FUNCTION increment_resolved_disputes()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'resolved' AND OLD.status != 'resolved' THEN
        UPDATE public.stats
        SET value = value + 1, updated_at = NOW()
        WHERE key = 'total_resolved_disputes';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS tr_increment_resolved_disputes ON public.disputes;
CREATE TRIGGER tr_increment_resolved_disputes
    AFTER UPDATE ON public.disputes
    FOR EACH ROW
    EXECUTE FUNCTION increment_resolved_disputes();
