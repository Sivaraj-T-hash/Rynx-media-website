-- ==============================================================================
-- RYNX DIGITAL MEDIA - PORTFOLIO VIDEO ORDERING MIGRATION
-- Custom ordering support with safe atomic batch updates and indexing
-- ==============================================================================

-- 1. Ensure display_order column exists on portfolio_projects
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_schema = 'public' 
          AND table_name = 'portfolio_projects' 
          AND column_name = 'display_order'
    ) THEN
        ALTER TABLE public.portfolio_projects ADD COLUMN display_order INT NOT NULL DEFAULT 1;
    END IF;
END $$;

-- 2. Add performance index on (display_order ASC, created_at DESC)
CREATE INDEX IF NOT EXISTS idx_portfolio_projects_display_order 
ON public.portfolio_projects(display_order ASC, created_at DESC);

-- 3. Atomic RPC function to update portfolio project orders securely
-- Uses two-phase assignment to prevent any temporary collision or unique constraint issues
CREATE OR REPLACE FUNCTION public.update_portfolio_project_orders(project_orders JSONB)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    item JSONB;
BEGIN
    -- Verify caller has admin privileges
    IF NOT public.is_admin() THEN
        RAISE EXCEPTION 'Access denied. Administrator privileges required.';
    END IF;

    -- Phase 1: Set temporary negative positions to eliminate any collision during reorder
    FOR item IN SELECT * FROM jsonb_array_elements(project_orders)
    LOOP
        UPDATE public.portfolio_projects
        SET display_order = -((item->>'display_order')::INT + 1000000)
        WHERE id = (item->>'id')::UUID;
    END LOOP;

    -- Phase 2: Set final positive positions and update timestamp
    FOR item IN SELECT * FROM jsonb_array_elements(project_orders)
    LOOP
        UPDATE public.portfolio_projects
        SET display_order = (item->>'display_order')::INT,
            updated_at = NOW()
        WHERE id = (item->>'id')::UUID;
    END LOOP;
END;
$$;

-- Grant execution to authenticated users (is_admin checks inside function)
GRANT EXECUTE ON FUNCTION public.update_portfolio_project_orders(JSONB) TO authenticated;
