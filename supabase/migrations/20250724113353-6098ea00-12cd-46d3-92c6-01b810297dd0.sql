-- Create products table
CREATE TABLE public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  base_price DECIMAL(10,2) NOT NULL,
  min_price DECIMAL(10,2) NOT NULL,
  image_url TEXT,
  category TEXT,
  stock INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create negotiations table
CREATE TABLE public.negotiations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  product_id UUID NOT NULL REFERENCES public.products(id),
  current_offer DECIMAL(10,2),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'accepted', 'rejected', 'expired')),
  final_price DECIMAL(10,2),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create chat messages table
CREATE TABLE public.chat_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  negotiation_id UUID NOT NULL REFERENCES public.negotiations(id) ON DELETE CASCADE,
  sender TEXT NOT NULL CHECK (sender IN ('user', 'bot')),
  message TEXT NOT NULL,
  offer_amount DECIMAL(10,2),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.negotiations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- Products are viewable by everyone
CREATE POLICY "Products are viewable by everyone" 
ON public.products 
FOR SELECT 
USING (true);

-- Users can view their own negotiations
CREATE POLICY "Users can view their own negotiations" 
ON public.negotiations 
FOR SELECT 
USING (true);

-- Users can create negotiations
CREATE POLICY "Users can create negotiations" 
ON public.negotiations 
FOR INSERT 
WITH CHECK (true);

-- Users can update their own negotiations
CREATE POLICY "Users can update their own negotiations" 
ON public.negotiations 
FOR UPDATE 
USING (true);

-- Chat messages are viewable by all
CREATE POLICY "Chat messages are viewable by all" 
ON public.chat_messages 
FOR SELECT 
USING (true);

-- Chat messages can be inserted by all
CREATE POLICY "Chat messages can be inserted by all" 
ON public.chat_messages 
FOR INSERT 
WITH CHECK (true);

-- Insert dummy products
INSERT INTO public.products (name, description, base_price, min_price, image_url, category, stock) VALUES
('iPhone 15 Pro', 'Latest iPhone with advanced camera system', 999.00, 850.00, 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500', 'Electronics', 25),
('MacBook Air M2', '13-inch laptop with M2 chip', 1199.00, 1000.00, 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=500', 'Electronics', 15),
('Nike Air Max 270', 'Comfortable running shoes', 150.00, 120.00, 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500', 'Fashion', 50),
('Samsung 4K TV 55"', 'Ultra HD Smart TV', 799.00, 650.00, 'https://images.unsplash.com/photo-1567690187548-f07b1d7bf5a9?w=500', 'Electronics', 10),
('Sony WH-1000XM5', 'Noise cancelling headphones', 399.00, 320.00, 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=500', 'Electronics', 30);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for negotiations
CREATE TRIGGER update_negotiations_updated_at
  BEFORE UPDATE ON public.negotiations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();