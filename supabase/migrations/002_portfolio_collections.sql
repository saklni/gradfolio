-- =============================================================================
-- Gradfolio — Migration 002: Portfolio Collections (Bagikan Portofolio)
-- =============================================================================
-- Adds the ability for a mahasiswa to bundle several of their PUBLISHED
-- Portfolio Items into a single shareable link (e.g. to send to an HRD when
-- applying for an internship or job), instead of sharing one link per item.
--
-- Design notes:
--   - A "collection" is just a named bundle owned by one user, containing a
--     chosen subset of their own portfolio_items via a join table
--     (collection_items) so the same item can appear in several different
--     bundles (e.g. one bundle per job application).
--   - Only items with status = 'published' can be added to a collection —
--     this keeps the trust/visibility model identical to the existing single
--     Portfolio Share page (/portfolio/[id]), which already relies on
--     status = 'published' to allow anonymous read access. No changes to the
--     RLS policies on portfolio_items/portfolio_resources are needed.
--   - The share link itself is simply `/share/<collection id>`. Security
--     relies on the collection id being an unguessable random UUID — the
--     same "anyone with the link" trust model already used by
--     /portfolio/[id].
-- =============================================================================

-- ============================================================================
-- 1. PORTFOLIO_COLLECTIONS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.portfolio_collections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL DEFAULT 'Portfolio Saya',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_portfolio_collections_user_id
  ON public.portfolio_collections(user_id);

ALTER TABLE public.portfolio_collections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Collections are viewable by anyone with the link"
  ON public.portfolio_collections FOR SELECT
  USING (true);

CREATE POLICY "Users can create their own collections"
  ON public.portfolio_collections FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own collections"
  ON public.portfolio_collections FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own collections"
  ON public.portfolio_collections FOR DELETE
  USING (auth.uid() = user_id);

CREATE TRIGGER update_portfolio_collections_updated_at
  BEFORE UPDATE ON public.portfolio_collections
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================================
-- 2. COLLECTION_ITEMS TABLE (join table: which items are in which bundle)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.collection_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  collection_id UUID NOT NULL REFERENCES public.portfolio_collections(id) ON DELETE CASCADE,
  portfolio_item_id UUID NOT NULL REFERENCES public.portfolio_items(id) ON DELETE CASCADE,
  position INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (collection_id, portfolio_item_id)
);

CREATE INDEX IF NOT EXISTS idx_collection_items_collection_id
  ON public.collection_items(collection_id);
CREATE INDEX IF NOT EXISTS idx_collection_items_portfolio_item_id
  ON public.collection_items(portfolio_item_id);

ALTER TABLE public.collection_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Collection items are viewable by anyone with the link"
  ON public.collection_items FOR SELECT
  USING (true);

-- An item may only be added to a collection if BOTH the collection and the
-- portfolio item belong to the requesting user, and the item is published.
CREATE POLICY "Users can add their own published items to their own collections"
  ON public.collection_items FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.portfolio_collections pc
      WHERE pc.id = collection_id AND pc.user_id = auth.uid()
    )
    AND EXISTS (
      SELECT 1 FROM public.portfolio_items pi
      WHERE pi.id = portfolio_item_id
        AND pi.user_id = auth.uid()
        AND pi.status = 'published'
    )
  );

CREATE POLICY "Users can remove items from their own collections"
  ON public.collection_items FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.portfolio_collections pc
      WHERE pc.id = collection_id AND pc.user_id = auth.uid()
    )
  );
