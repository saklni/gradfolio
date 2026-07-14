-- =============================================================================
-- Gradfolio — Database Migration
-- =============================================================================
-- Run this SQL in your Supabase SQL Editor to set up the database.
-- This creates all tables, RLS policies, and triggers for the Gradfolio app.
-- =============================================================================

-- ============================================================================
-- 1. PROFILES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  avatar_url TEXT,
  avatar_public_id TEXT,
  institution TEXT,
  program_studi TEXT,
  angkatan INTEGER,
  bio TEXT,
  username TEXT UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Profiles are viewable by everyone"
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- ============================================================================
-- 2. INSTITUTIONS TABLE (optional, for autocomplete)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.institutions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Enable RLS
ALTER TABLE public.institutions ENABLE ROW LEVEL SECURITY;

-- Institutions policies (readable by everyone, insertable by authenticated)
CREATE POLICY "Institutions are viewable by everyone"
  ON public.institutions FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can insert institutions"
  ON public.institutions FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- ============================================================================
-- 3. PORTFOLIO_ITEMS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.portfolio_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  cover_image_url TEXT,
  cover_image_public_id TEXT,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  jenis_portfolio TEXT NOT NULL,
  semester INTEGER,
  tahun_pengerjaan INTEGER NOT NULL,
  deskripsi_singkat TEXT NOT NULL,
  deskripsi_lengkap TEXT NOT NULL,
  peran TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  tech_stack TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Enable RLS
ALTER TABLE public.portfolio_items ENABLE ROW LEVEL SECURITY;

-- Portfolio items policies
CREATE POLICY "Published portfolio items are viewable by everyone"
  ON public.portfolio_items FOR SELECT
  USING (status = 'published' OR auth.uid() = user_id);

CREATE POLICY "Users can insert their own portfolio items"
  ON public.portfolio_items FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own portfolio items"
  ON public.portfolio_items FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own portfolio items"
  ON public.portfolio_items FOR DELETE
  USING (auth.uid() = user_id);

-- Index for faster showcase queries
CREATE INDEX IF NOT EXISTS idx_portfolio_items_status
  ON public.portfolio_items(status)
  WHERE status = 'published';

CREATE INDEX IF NOT EXISTS idx_portfolio_items_user_id
  ON public.portfolio_items(user_id);

CREATE INDEX IF NOT EXISTS idx_portfolio_items_category
  ON public.portfolio_items(category);

-- ============================================================================
-- 4. PORTFOLIO_RESOURCES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.portfolio_resources (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  portfolio_item_id UUID NOT NULL REFERENCES public.portfolio_items(id) ON DELETE CASCADE,
  resource_type TEXT NOT NULL,
  label TEXT NOT NULL,
  url TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Enable RLS
ALTER TABLE public.portfolio_resources ENABLE ROW LEVEL SECURITY;

-- Resources policies: follow the parent portfolio item's visibility
CREATE POLICY "Resources are viewable when parent item is viewable"
  ON public.portfolio_resources FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.portfolio_items
      WHERE portfolio_items.id = portfolio_resources.portfolio_item_id
        AND (portfolio_items.status = 'published' OR portfolio_items.user_id = auth.uid())
    )
  );

CREATE POLICY "Users can insert resources for their own portfolio items"
  ON public.portfolio_resources FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.portfolio_items
      WHERE portfolio_items.id = portfolio_resources.portfolio_item_id
        AND portfolio_items.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update resources for their own portfolio items"
  ON public.portfolio_resources FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.portfolio_items
      WHERE portfolio_items.id = portfolio_resources.portfolio_item_id
        AND portfolio_items.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete resources for their own portfolio items"
  ON public.portfolio_resources FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.portfolio_items
      WHERE portfolio_items.id = portfolio_resources.portfolio_item_id
        AND portfolio_items.user_id = auth.uid()
    )
  );

CREATE INDEX IF NOT EXISTS idx_portfolio_resources_item_id
  ON public.portfolio_resources(portfolio_item_id);

-- ============================================================================
-- 5. TRIGGER: Auto-create profile on user signup
-- ============================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', 'User')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if it exists, then create
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================================
-- 6. TRIGGER: Auto-update updated_at timestamp
-- ============================================================================
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_portfolio_items_updated_at ON public.portfolio_items;
CREATE TRIGGER update_portfolio_items_updated_at
  BEFORE UPDATE ON public.portfolio_items
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================================
-- 7. SEED: Initial institutions (optional)
-- ============================================================================
INSERT INTO public.institutions (name) VALUES
  ('Universitas Indonesia'),
  ('Institut Teknologi Bandung'),
  ('Universitas Gadjah Mada'),
  ('Institut Teknologi Sepuluh Nopember'),
  ('Universitas Brawijaya'),
  ('Universitas Diponegoro'),
  ('Universitas Airlangga'),
  ('Universitas Padjadjaran'),
  ('Universitas Hasanuddin'),
  ('Institut Pertanian Bogor'),
  ('Universitas Sebelas Maret'),
  ('Universitas Sumatera Utara'),
  ('Universitas Andalas'),
  ('Universitas Udayana'),
  ('Universitas Negeri Semarang'),
  ('Universitas Negeri Yogyakarta'),
  ('Universitas Pendidikan Indonesia'),
  ('Universitas Muhammadiyah Malang'),
  ('Universitas Bina Nusantara'),
  ('Telkom University')
ON CONFLICT (name) DO NOTHING;
