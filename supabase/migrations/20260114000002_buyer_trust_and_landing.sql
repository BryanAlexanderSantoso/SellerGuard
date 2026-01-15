-- Add trust_score to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS trust_score INTEGER DEFAULT 100;

-- Update blacklist table to optionally link to a profile and add landing page flag
ALTER TABLE public.blacklist ADD COLUMN IF NOT EXISTS subject_id UUID REFERENCES public.profiles(id);
ALTER TABLE public.blacklist ADD COLUMN IF NOT EXISTS show_on_landing_page BOOLEAN DEFAULT false;

-- Policy: Admin can update landing page flag
DROP POLICY IF EXISTS "Admins can update landing page flag" ON public.blacklist;
CREATE POLICY "Admins can update landing page flag" ON public.blacklist
    FOR UPDATE USING (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
    );

-- Trigger to update profile trust score when a blacklist report is verified
CREATE OR REPLACE FUNCTION update_buyer_trust_score()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'verified' AND OLD.status != 'verified' AND NEW.subject_id IS NOT NULL THEN
        UPDATE public.profiles
        SET trust_score = GREATEST(0, trust_score - 20)
        WHERE id = NEW.subject_id;
    ELSIF NEW.status = 'rejected' AND OLD.status = 'verified' AND NEW.subject_id IS NOT NULL THEN
        UPDATE public.profiles
        SET trust_score = LEAST(100, trust_score + 20)
        WHERE id = NEW.subject_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS tr_update_buyer_trust_score ON public.blacklist;
CREATE TRIGGER tr_update_buyer_trust_score
    AFTER UPDATE ON public.blacklist
    FOR EACH ROW
    EXECUTE FUNCTION update_buyer_trust_score();
