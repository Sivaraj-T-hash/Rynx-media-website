export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  display_order: number;
  created_at: string;
  updated_at?: string;
}

export interface DbPortfolioProject {
  id: string;
  title: string;
  slug: string;
  description: string;
  category_id?: string | null;
  category?: Category | null;
  thumbnail_url: string;
  preview_video_url?: string | null;
  full_video_url?: string | null;
  aspect_ratio: '16:9' | '9:16' | '2.39:1';
  duration?: string | null;
  client_industry?: string | null;
  deliverables?: string[] | null;
  tools_used?: string[] | null;
  case_study?: string | null;
  is_featured: boolean;
  is_published: boolean;
  display_order: number;
  created_at: string;
  updated_at?: string;
}

export interface DbTestimonial {
  id: string;
  client_name: string;
  company_name?: string | null;
  client_designation?: string | null;
  testimonial_text: string;
  profile_photo_url?: string | null;
  video_url?: string | null;
  rating: number;
  is_published: boolean;
  display_order: number;
  created_at: string;
  updated_at?: string;
}

export interface DbBeforeAfterProject {
  id: string;
  project_name: string;
  raw_footage_url: string;
  final_video_url: string;
  thumbnail_url?: string | null;
  is_published: boolean;
  display_order: number;
  created_at: string;
  updated_at?: string;
}

export type EnquiryStatus = 'New' | 'Contacted' | 'In Progress' | 'Closed';

export interface DbEnquiry {
  id: string;
  full_name: string;
  email: string;
  whatsapp_number: string;
  brand_name?: string | null;
  editing_type: string;
  video_count?: string | null;
  deadline?: string | null;
  budget?: string | null;
  description: string;
  reference_link?: string | null;
  status: EnquiryStatus;
  admin_notes?: string | null;
  created_at: string;
  updated_at?: string;
}

export interface DbWebsiteSetting {
  id: string;
  key: string;
  value: string;
  description?: string | null;
  updated_at?: string;
}

export interface AdminUser {
  id: string;
  email: string;
  role: 'admin' | 'super_admin';
  is_active: boolean;
  created_at: string;
}
