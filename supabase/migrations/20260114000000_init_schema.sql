-- Create profiles table
CREATE TABLE public.profiles (
    id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    email TEXT,
    role TEXT DEFAULT 'seller' CHECK (role IN ('seller', 'admin')),
    shop_name TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create orders table
CREATE TABLE public.orders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    seller_id UUID REFERENCES public.profiles(id) NOT NULL,
    tracking_number TEXT UNIQUE NOT NULL,
    buyer_email TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'shipped', 'disputed', 'delivered')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create evidences table
CREATE TABLE public.evidences (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
    uploader_id UUID REFERENCES public.profiles(id), -- Null if public buyer upload
    type TEXT CHECK (type IN ('packing', 'unboxing')),
    media_url TEXT NOT NULL,
    metadata JSONB DEFAULT '{}'::JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create blacklist table
CREATE TABLE public.blacklist (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    subject_name TEXT NOT NULL,
    platform TEXT NOT NULL,
    reason TEXT NOT NULL,
    reported_by UUID REFERENCES public.profiles(id) NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'verified', 'rejected')),
    trust_score INTEGER DEFAULT 50,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.evidences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blacklist ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
CREATE POLICY "Users can view their own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = id OR id IS NOT NULL); -- Allow initial insert during signup

CREATE POLICY "Users can update their own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" ON public.profiles
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
    );

-- Orders Policies
CREATE POLICY "Sellers can manage their own orders" ON public.orders
    FOR ALL USING (seller_id = auth.uid());

CREATE POLICY "Buyers can view order by tracking number" ON public.orders
    FOR SELECT USING (true); -- Restricted view via tracking filter in app

-- Evidences Policies
CREATE POLICY "Sellers can manage packing evidence" ON public.evidences
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.orders 
            WHERE id = order_id AND seller_id = auth.uid()
        )
    );

CREATE POLICY "Public access for buyer unboxing upload" ON public.evidences
    FOR INSERT WITH CHECK (type = 'unboxing');

-- Blacklist Policies
CREATE POLICY "Anyone can view verified blacklist" ON public.blacklist
    FOR SELECT USING (status = 'verified');

CREATE POLICY "Sellers can create reports" ON public.blacklist
    FOR INSERT WITH CHECK (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'seller')
    );

CREATE POLICY "Admins have full control over blacklist" ON public.blacklist
    FOR ALL USING (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
    );
