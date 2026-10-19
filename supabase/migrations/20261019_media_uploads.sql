-- ==============================================================================
-- RYNX DIGITAL MEDIA - MEDIA UPLOADS & DYNAMIC BEFORE/AFTER GALLERY MIGRATION
-- ==============================================================================

-- 1. ADD COLUMNS TO PORTFOLIO_PROJECTS FOR STORAGE MANAGEMENT
ALTER TABLE public.portfolio_projects 
    ADD COLUMN IF NOT EXISTS video_storage_path TEXT,
    ADD COLUMN IF NOT EXISTS thumbnail_storage_path TEXT;

-- 2. ADD COLUMNS TO BEFORE_AFTER_PROJECTS FOR DYNAMIC IMAGES & FEATURED STATUS
ALTER TABLE public.before_after_projects 
    ADD COLUMN IF NOT EXISTS description TEXT,
    ADD COLUMN IF NOT EXISTS is_featured BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN IF NOT EXISTS before_image_path TEXT,
    ADD COLUMN IF NOT EXISTS after_image_path TEXT;

-- 3. ENFORCE SINGLE FEATURED BEFORE/AFTER COMPARISON AT DATABASE LEVEL
CREATE OR REPLACE FUNCTION public.handle_single_featured_before_after()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.is_featured = true THEN
        UPDATE public.before_after_projects
        SET is_featured = false
        WHERE id != NEW.id AND is_featured = true;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_single_featured_before_after ON public.before_after_projects;
CREATE TRIGGER trigger_single_featured_before_after
    BEFORE INSERT OR UPDATE OF is_featured ON public.before_after_projects
    FOR EACH ROW
    WHEN (NEW.is_featured = true)
    EXECUTE FUNCTION public.handle_single_featured_before_after();

-- 4. CREATE STORAGE BUCKETS
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
    (
        'portfolio-media', 
        'portfolio-media', 
        true, 
        524288000, -- 500MB limit (respects Supabase storage plan)
        ARRAY['video/mp4', 'video/webm', 'video/quicktime', 'image/jpeg', 'image/png', 'image/webp']
    ),
    (
        'before-after-media', 
        'before-after-media', 
        true, 
        52428800, -- 50MB limit for high-resolution images
        ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/avif']
    )
ON CONFLICT (id) DO UPDATE SET 
    public = true,
    file_size_limit = EXCLUDED.file_size_limit,
    allowed_mime_types = EXCLUDED.allowed_mime_types;

-- 5. STORAGE ROW LEVEL SECURITY POLICIES FOR PORTFOLIO MEDIA
DROP POLICY IF EXISTS "Public can view portfolio media" ON storage.objects;
CREATE POLICY "Public can view portfolio media"
    ON storage.objects FOR SELECT
    TO anon, authenticated
    USING (bucket_id = 'portfolio-media');

DROP POLICY IF EXISTS "Admins can upload portfolio media" ON storage.objects;
CREATE POLICY "Admins can upload portfolio media"
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK (bucket_id = 'portfolio-media' AND public.is_admin());

DROP POLICY IF EXISTS "Admins can update portfolio media" ON storage.objects;
CREATE POLICY "Admins can update portfolio media"
    ON storage.objects FOR UPDATE
    TO authenticated
    USING (bucket_id = 'portfolio-media' AND public.is_admin())
    WITH CHECK (bucket_id = 'portfolio-media' AND public.is_admin());

DROP POLICY IF EXISTS "Admins can delete portfolio media" ON storage.objects;
CREATE POLICY "Admins can delete portfolio media"
    ON storage.objects FOR DELETE
    TO authenticated
    USING (bucket_id = 'portfolio-media' AND public.is_admin());

-- 6. STORAGE ROW LEVEL SECURITY POLICIES FOR BEFORE/AFTER MEDIA
DROP POLICY IF EXISTS "Public can view before-after media" ON storage.objects;
CREATE POLICY "Public can view before-after media"
    ON storage.objects FOR SELECT
    TO anon, authenticated
    USING (bucket_id = 'before-after-media');

DROP POLICY IF EXISTS "Admins can upload before-after media" ON storage.objects;
CREATE POLICY "Admins can upload before-after media"
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK (bucket_id = 'before-after-media' AND public.is_admin());

DROP POLICY IF EXISTS "Admins can update before-after media" ON storage.objects;
CREATE POLICY "Admins can update before-after media"
    ON storage.objects FOR UPDATE
    TO authenticated
    USING (bucket_id = 'before-after-media' AND public.is_admin())
    WITH CHECK (bucket_id = 'before-after-media' AND public.is_admin());

DROP POLICY IF EXISTS "Admins can delete before-after media" ON storage.objects;
CREATE POLICY "Admins can delete before-after media"
    ON storage.objects FOR DELETE
    TO authenticated
    USING (bucket_id = 'before-after-media' AND public.is_admin());
