-- Fix critical security vulnerability in chat_messages table
-- Drop existing overly permissive policies
DROP POLICY IF EXISTS "Chat messages are viewable by all" ON public.chat_messages;
DROP POLICY IF EXISTS "Chat messages can be inserted by all" ON public.chat_messages;

-- Create secure policies that restrict access to user's own negotiations
CREATE POLICY "Users can view messages from their own negotiations only" 
ON public.chat_messages 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.negotiations 
    WHERE negotiations.id = chat_messages.negotiation_id 
    AND negotiations.user_id = auth.uid()
  )
);

CREATE POLICY "Users can insert messages to their own negotiations only" 
ON public.chat_messages 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.negotiations 
    WHERE negotiations.id = chat_messages.negotiation_id 
    AND negotiations.user_id = auth.uid()
  )
);