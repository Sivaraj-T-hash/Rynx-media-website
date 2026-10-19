-- ==============================================================================
-- RYNX DIGITAL MEDIA - COMPLETE SUPABASE SCHEMA & RLS POLICIES
-- Phase 2: Production Portfolio, CMS & Secure Admin Dashboard
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. ADMIN USERS TABLE (Explicit Server-Verified Authorization)
-- Only users listed in this table with is_active = true possess administrator rights.
-- Never relies on client-editable user_metadata!
CREATE TABLE IF NOT EXISTS public.admin_users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin')),
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Function to check if current authenticated user is an authorized admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 
        FROM public.admin_users 
        WHERE id = auth.uid() 
          AND is_active = true
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    display_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Constraint: "All" is a virtual filter and must never be stored in categories
ALTER TABLE public.categories 
ADD CONSTRAINT check_not_virtual_all CHECK (LOWER(name) != 'all' AND LOWER(slug) != 'all');

-- 4. PORTFOLIO PROJECTS TABLE
CREATE TABLE IF NOT EXISTS public.portfolio_projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT NOT NULL,
    category_id UUID REFERENCES public.categories(id) ON DELETE RESTRICT,
    thumbnail_url TEXT NOT NULL,
    preview_video_url TEXT,
    full_video_url TEXT,
    aspect_ratio TEXT NOT NULL DEFAULT '16:9' CHECK (aspect_ratio IN ('16:9', '9:16', '2.39:1')),
    duration TEXT DEFAULT '00:30',
    client_industry TEXT,
    deliverables TEXT[] DEFAULT '{}',
    tools_used TEXT[] DEFAULT '{}',
    case_study TEXT,
    is_featured BOOLEAN NOT NULL DEFAULT false,
    is_published BOOLEAN NOT NULL DEFAULT false,
    display_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. TESTIMONIALS TABLE
CREATE TABLE IF NOT EXISTS public.testimonials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_name TEXT NOT NULL,
    company_name TEXT,
    client_designation TEXT,
    testimonial_text TEXT NOT NULL,
    profile_photo_url TEXT,
    video_url TEXT,
    rating INT CHECK (rating >= 1 AND rating <= 5) DEFAULT 5,
    is_published BOOLEAN NOT NULL DEFAULT false,
    display_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. BEFORE & AFTER PROJECTS TABLE
CREATE TABLE IF NOT EXISTS public.before_after_projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_name TEXT NOT NULL,
    raw_footage_url TEXT NOT NULL,
    final_video_url TEXT NOT NULL,
    thumbnail_url TEXT,
    is_published BOOLEAN NOT NULL DEFAULT false,
    display_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. ENQUIRIES TABLE
CREATE TABLE IF NOT EXISTS public.enquiries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    whatsapp_number TEXT NOT NULL,
    brand_name TEXT,
    editing_type TEXT NOT NULL,
    video_count TEXT,
    deadline TEXT,
    budget TEXT,
    description TEXT NOT NULL,
    reference_link TEXT,
    status TEXT NOT NULL DEFAULT 'New' CHECK (status IN ('New', 'Contacted', 'In Progress', 'Closed')),
    admin_notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. WEBSITE SETTINGS TABLE
CREATE TABLE IF NOT EXISTS public.website_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key TEXT UNIQUE NOT NULL,
    value TEXT NOT NULL,
    description TEXT,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Insert Default Sensible Website Settings
INSERT INTO public.website_settings (key, value, description)
VALUES 
    ('business_name', 'RYNX Digital Media', 'Company trading name'),
    ('contact_email', 'ramankandhan11@gmail.com', 'Primary contact email'),
    ('whatsapp_number', '916382605739', 'WhatsApp number with country code'),
    ('instagram_url', 'https://www.instagram.com/raman_kandhan?dlrf=bnIzdHJsbWtsZjNr', 'Official Instagram profile'),
    ('instagram_handle', '@raman_kandhan', 'Official Instagram handle'),
    ('hero_headline', 'We Don''t Just Edit Videos. We Create Impact.', 'Hero main headline'),
    ('hero_subtitle', 'Turning raw footage into powerful visual stories that capture attention, build brands, and drive results.', 'Hero supporting text'),
    ('primary_cta_label', 'Explore Our Work', 'Primary CTA button label'),
    ('footer_description', 'A boutique digital video post-production agency turning raw footage into cinematic visual narratives that command audience attention.', 'Footer summary text'),
    ('seo_title', 'RYNX Digital Media | Premium Video Editing Agency', 'Meta title tag'),
    ('seo_description', 'We Don''t Just Edit Videos. We Create Impact. RYNX Digital Media turns raw footage into powerful visual stories.', 'Meta description tag')
ON CONFLICT (key) DO NOTHING;

-- 9. ANALYTICS EVENTS TABLE
CREATE TABLE IF NOT EXISTS public.analytics_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_name TEXT NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- 10. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

-- Enable RLS on all tables
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.before_after_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.website_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

-- ADMIN_USERS Policies
CREATE POLICY "Admins can view admin_users"
    ON public.admin_users FOR SELECT
    TO authenticated
    USING (public.is_admin() OR auth.uid() = id);

CREATE POLICY "Super admins can manage admin_users"
    ON public.admin_users FOR ALL
    TO authenticated
    USING (public.is_admin());

-- CATEGORIES Policies
CREATE POLICY "Public can view categories"
    ON public.categories FOR SELECT
    TO anon, authenticated
    USING (true);

CREATE POLICY "Admins can manage categories"
    ON public.categories FOR ALL
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- PORTFOLIO_PROJECTS Policies
CREATE POLICY "Public can view published portfolio projects"
    ON public.portfolio_projects FOR SELECT
    TO anon, authenticated
    USING (is_published = true OR public.is_admin());

CREATE POLICY "Admins can manage portfolio projects"
    ON public.portfolio_projects FOR ALL
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- TESTIMONIALS Policies
CREATE POLICY "Public can view published testimonials"
    ON public.testimonials FOR SELECT
    TO anon, authenticated
    USING (is_published = true OR public.is_admin());

CREATE POLICY "Admins can manage testimonials"
    ON public.testimonials FOR ALL
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- BEFORE_AFTER_PROJECTS Policies
CREATE POLICY "Public can view published before_after projects"
    ON public.before_after_projects FOR SELECT
    TO anon, authenticated
    USING (is_published = true OR public.is_admin());

CREATE POLICY "Admins can manage before_after projects"
    ON public.before_after_projects FOR ALL
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- ENQUIRIES Policies
-- Public visitors can submit enquiries, but can NEVER read other enquiries or modify status!
CREATE POLICY "Public can submit enquiries"
    ON public.enquiries FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

CREATE POLICY "Admins can read enquiries"
    ON public.enquiries FOR SELECT
    TO authenticated
    USING (public.is_admin());

CREATE POLICY "Admins can update enquiries"
    ON public.enquiries FOR UPDATE
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

CREATE POLICY "Admins can delete enquiries"
    ON public.enquiries FOR DELETE
    TO authenticated
    USING (public.is_admin());

-- WEBSITE_SETTINGS Policies
CREATE POLICY "Public can view website settings"
    ON public.website_settings FOR SELECT
    TO anon, authenticated
    USING (true);

CREATE POLICY "Admins can manage website settings"
    ON public.website_settings FOR ALL
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- ANALYTICS_EVENTS Policies
CREATE POLICY "Public can log analytics events"
    ON public.analytics_events FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

CREATE POLICY "Admins can view analytics events"
    ON public.analytics_events FOR SELECT
    TO authenticated
    USING (public.is_admin());

-- ==============================================================================
-- 11. HELPER TRIGGER FOR UPDATED_AT
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_categories_updated_at
    BEFORE UPDATE ON public.categories
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_portfolio_projects_updated_at
    BEFORE UPDATE ON public.portfolio_projects
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_testimonials_updated_at
    BEFORE UPDATE ON public.testimonials
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_before_after_updated_at
    BEFORE UPDATE ON public.before_after_projects
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_enquiries_updated_at
    BEFORE UPDATE ON public.enquiries
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_website_settings_updated_at
    BEFORE UPDATE ON public.website_settings
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
