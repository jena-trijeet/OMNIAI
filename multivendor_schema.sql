-- ==========================================
-- OMNIAI MULTI-VENDOR DATABASE SCHEMA
-- Target Backend: Supabase PostgreSQL
-- ==========================================

-- 1. Profiles (Extends default profiles with roles)
CREATE TYPE user_role AS ENUM ('admin', 'hotel_manager', 'restaurant_owner', 'product_seller', 'customer');

ALTER TABLE IF EXISTS public.profiles ADD COLUMN IF NOT EXISTS role user_role DEFAULT 'customer';
ALTER TABLE IF EXISTS public.profiles ADD COLUMN IF NOT EXISTS vendor_approved BOOLEAN DEFAULT FALSE;

-- 2. Product Categories
CREATE TYPE product_category AS ENUM ('shoes', 'watches', 'fashion', 'electronics', 'gadgets', 'wearables', 'audio', 'health_fitness');

-- 3. Products Table
CREATE TABLE IF NOT EXISTS public.products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  seller_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
  stock INTEGER NOT NULL DEFAULT 0,
  category product_category NOT NULL DEFAULT 'gadgets',
  images TEXT[] DEFAULT '{}',
  specs TEXT[] DEFAULT '{}',
  accent_color TEXT DEFAULT 'from-[#00D1FF] to-[#3b82f6]',
  gradient TEXT DEFAULT 'linear-gradient(135deg, rgba(0, 209, 255, 0.15) 0%, rgba(59, 130, 246, 0.05) 100%)',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 4. Hotels Table
CREATE TABLE IF NOT EXISTS public.hotels (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  manager_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  description TEXT,
  rating NUMERIC(3, 2) DEFAULT 5.0,
  price_range TEXT DEFAULT '$$$$',
  suites TEXT[] DEFAULT '{"Deluxe Room", "Premier Suite", "Royal Suite"}',
  rate_per_night NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  images TEXT[] DEFAULT '{}',
  amenities TEXT[] DEFAULT '{}',
  accent_color TEXT DEFAULT 'from-[#00D1FF] to-[#3b82f6]',
  gradient TEXT DEFAULT 'linear-gradient(135deg, rgba(0, 209, 255, 0.15) 0%, rgba(59, 130, 246, 0.05) 100%)',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 5. Restaurants Table
CREATE TABLE IF NOT EXISTS public.restaurants (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  cuisine TEXT NOT NULL,
  location TEXT NOT NULL,
  description TEXT,
  price_range TEXT DEFAULT '$$$$',
  rating NUMERIC(3, 2) DEFAULT 5.0,
  available_times TEXT[] DEFAULT '{"18:00", "19:30", "21:00"}',
  opening_hours TEXT DEFAULT '12:00 PM - 11:00 PM',
  images TEXT[] DEFAULT '{}',
  table_availability INTEGER DEFAULT 12,
  accent_color TEXT DEFAULT 'from-[#a855f7] to-[#ec4899]',
  gradient TEXT DEFAULT 'linear-gradient(135deg, rgba(168, 85, 247, 0.15) 0%, rgba(236, 72, 153, 0.05) 100%)',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 6. Bookings (Hotels or Restaurants)
CREATE TYPE booking_type AS ENUM ('hotel', 'restaurant');
CREATE TYPE reservation_status AS ENUM ('pending', 'confirmed', 'cancelled');

CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  entity_id UUID NOT NULL, -- references hotel or restaurant ID
  type booking_type NOT NULL,
  entity_name TEXT NOT NULL,
  check_in TEXT NOT NULL, -- Date or Reservation date
  check_out TEXT, -- Check-out date (for hotels)
  time TEXT, -- Reservation time (for restaurants)
  suite TEXT, -- suite type (for hotels)
  guests INTEGER NOT NULL DEFAULT 2,
  notes TEXT,
  status reservation_status DEFAULT 'pending',
  payment_method TEXT DEFAULT 'cod',
  total_price NUMERIC(12, 2) DEFAULT 0.00,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 7. Orders Table
CREATE TYPE order_status AS ENUM ('processing', 'synthesizing', 'dispatched', 'delivered');

CREATE TABLE IF NOT EXISTS public.orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  items JSONB NOT NULL DEFAULT '[]'::jsonb, -- Array of products and quantities
  total_price NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
  status order_status DEFAULT 'processing',
  receipt_hash TEXT,
  payment_method TEXT DEFAULT 'cod',
  upi_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 8. Reviews Table
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  entity_id UUID NOT NULL,
  entity_type TEXT NOT NULL, -- 'product', 'hotel', 'restaurant'
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 9. Row Level Security Rules
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hotels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.restaurants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- 10. Access Policies
-- Products
CREATE POLICY "Allow read access to anyone on products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Sellers can manage their own products" ON public.products 
  FOR ALL USING (auth.uid() = seller_id);

-- Hotels
CREATE POLICY "Allow read access to anyone on hotels" ON public.hotels FOR SELECT USING (true);
CREATE POLICY "Managers can manage their own hotels" ON public.hotels 
  FOR ALL USING (auth.uid() = manager_id);

-- Restaurants
CREATE POLICY "Allow read access to anyone on restaurants" ON public.restaurants FOR SELECT USING (true);
CREATE POLICY "Owners can manage their own restaurants" ON public.restaurants 
  FOR ALL USING (auth.uid() = owner_id);

-- Bookings
CREATE POLICY "Users can manage their own bookings" ON public.bookings 
  FOR ALL USING (auth.uid() = user_id);

-- Orders
CREATE POLICY "Users can view their own orders" ON public.orders 
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own orders" ON public.orders 
  FOR INSERT WITH CHECK (auth.uid() = user_id);
