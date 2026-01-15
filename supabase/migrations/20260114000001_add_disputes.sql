-- Fix profiles role check to include 'buyer'
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
ALTER TABLE public.profiles ADD CONSTRAINT profiles_role_check CHECK (role IN ('seller', 'admin', 'buyer'));

-- Create disputes table
CREATE TABLE IF NOT EXISTS public.disputes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    buyer_id UUID REFERENCES auth.users(id),
    buyer_email TEXT NOT NULL,
    order_id TEXT,
    resi TEXT NOT NULL,
    reason TEXT NOT NULL,
    description TEXT NOT NULL,
    priority TEXT DEFAULT 'Medium' CHECK (priority IN ('Low', 'Medium', 'High')),
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_review', 'resolved', 'rejected')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.disputes ENABLE ROW LEVEL SECURITY;

-- Policies
DROP POLICY IF EXISTS "Anyone can insert disputes" ON public.disputes;
CREATE POLICY "Anyone can insert disputes" ON public.disputes 
    FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Buyers can view their own disputes" ON public.disputes;
CREATE POLICY "Buyers can view their own disputes" ON public.disputes 
    FOR SELECT USING (auth.uid() = buyer_id);

DROP POLICY IF EXISTS "Admins and Sellers can view all disputes" ON public.disputes;
CREATE POLICY "Admins and Sellers can view all disputes" ON public.disputes 
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'seller'))
    );

DROP POLICY IF EXISTS "Admins and Sellers can update disputes" ON public.disputes;
CREATE POLICY "Admins and Sellers can update disputes" ON public.disputes 
    FOR UPDATE USING (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'seller'))
    );
