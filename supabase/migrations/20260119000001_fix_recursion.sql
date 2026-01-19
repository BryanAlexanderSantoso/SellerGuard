-- 1. Create a secure function to check admin status (bypasses RLS recursion)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE id = auth.uid()
    AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Fix the recursive policy on 'profiles'
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
CREATE POLICY "Admins can view all profiles" ON public.profiles
    FOR SELECT USING (public.is_admin());

-- 3. Update other policies to use the helper function for consistency and performance
DROP POLICY IF EXISTS "Admins have full control over blacklist" ON public.blacklist;
CREATE POLICY "Admins have full control over blacklist" ON public.blacklist
    FOR ALL USING (public.is_admin());

DROP POLICY IF EXISTS "Admins can update stats" ON public.stats;
CREATE POLICY "Admins can update stats" ON public.stats
    FOR ALL USING (public.is_admin());
