-- Add full_name column to profiles table to fix registration error
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS full_name TEXT;
