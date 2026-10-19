import { supabase } from '../lib/supabase';
import type { DbEnquiry, EnquiryStatus } from '../types/database';

export const enquiriesService = {
  // Public submission with input validation and rate limiting
  async submitEnquiry(
    enquiry: Omit<DbEnquiry, 'id' | 'status' | 'admin_notes' | 'created_at' | 'updated_at'>
  ): Promise<DbEnquiry> {
    // Client-side rate limiting / spam prevention check: prevent rapid submissions (within 30s)
    const lastSubmitTime = localStorage.getItem('rynx_last_enquiry_ts');
    const now = Date.now();
    if (lastSubmitTime && now - Number(lastSubmitTime) < 15000) {
      throw new Error('Please wait a moment before submitting another enquiry.');
    }

    // Validation & sanitization
    const fullName = enquiry.full_name?.trim();
    const email = enquiry.email?.trim().toLowerCase();
    const whatsApp = enquiry.whatsapp_number?.trim();
    const description = enquiry.description?.trim();

    if (!fullName || fullName.length < 2) {
      throw new Error('Please enter a valid full name.');
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new Error('Please enter a valid email address.');
    }
    if (!whatsApp || whatsApp.length < 6) {
      throw new Error('Please enter a valid WhatsApp number.');
    }
    if (!description || description.length < 10) {
      throw new Error('Please provide at least 10 characters describing your project.');
    }

    const { data, error } = await supabase
      .from('enquiries')
      .insert({
        full_name: fullName,
        email: email,
        whatsapp_number: whatsApp,
        brand_name: enquiry.brand_name?.trim() || null,
        editing_type: enquiry.editing_type || 'Custom Video Editing',
        video_count: enquiry.video_count || null,
        deadline: enquiry.deadline?.trim() || null,
        budget: enquiry.budget?.trim() || null,
        description: description,
        reference_link: enquiry.reference_link?.trim() || null,
        status: 'New',
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    // Set submission timestamp for rate limiting
    localStorage.setItem('rynx_last_enquiry_ts', String(now));

    return data;
  },

  async getEnquiriesAdmin(options?: {
    status?: EnquiryStatus | 'All';
    search?: string;
  }): Promise<DbEnquiry[]> {
    let query = supabase
      .from('enquiries')
      .select('*')
      .order('created_at', { ascending: false });

    if (options?.status && options.status !== 'All') {
      query = query.eq('status', options.status);
    }

    if (options?.search && options.search.trim()) {
      const s = options.search.trim();
      query = query.or(
        `full_name.ilike.%${s}%,email.ilike.%${s}%,brand_name.ilike.%${s}%,whatsapp_number.ilike.%${s}%`
      );
    }

    const { data, error } = await query;

    if (error) {
      console.warn('Error fetching enquiries:', error.message);
      return [];
    }

    return data || [];
  },

  async updateEnquiryStatus(
    id: string,
    status: EnquiryStatus,
    adminNotes?: string
  ): Promise<DbEnquiry> {
    const updates: Partial<DbEnquiry> = { status };
    if (adminNotes !== undefined) {
      updates.admin_notes = adminNotes;
    }

    const { data, error } = await supabase
      .from('enquiries')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteEnquiry(id: string): Promise<void> {
    const { error } = await supabase.from('enquiries').delete().eq('id', id);
    if (error) throw error;
  },
};
