-- Fix critical security vulnerability in negotiations table RLS policies
-- Drop existing overly permissive policies
DROP POLICY IF EXISTS "Users can create negotiations" ON public.negotiations;
DROP POLICY IF EXISTS "Users can update their own negotiations" ON public.negotiations;
DROP POLICY IF EXISTS "Users can view their own negotiations" ON public.negotiations;

-- Create secure RLS policies that properly restrict access
CREATE POLICY "Users can view their own negotiations only"
ON public.negotiations
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own negotiations only"
ON public.negotiations
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own negotiations only"
ON public.negotiations
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Make user_id NOT NULL for better security (existing rows will need user_id set)
-- First, let's ensure any existing rows without user_id are handled
UPDATE public.negotiations 
SET user_id = (SELECT id FROM auth.users LIMIT 1) 
WHERE user_id IS NULL;

-- Now make the column NOT NULL
ALTER TABLE public.negotiations 
ALTER COLUMN user_id SET NOT NULL;