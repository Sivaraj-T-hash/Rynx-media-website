import { supabase } from '../lib/supabase';
import type { DbTestimonial } from '../types/database';

export const testimonialsService = {
  async getPublishedTestimonials(): Promise<DbTestimonial[]> {
    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .eq('is_published', true)
      .order('display_order', { ascending: true })
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Error fetching published testimonials:', error.message);
      return [];
    }

    return data || [];
  },

  async getAllTestimonialsAdmin(): Promise<DbTestimonial[]> {
    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .order('display_order', { ascending: true })
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Error fetching admin testimonials:', error.message);
      return [];
    }

    return data || [];
  },

  async createTestimonial(
    testimonial: Omit<DbTestimonial, 'id' | 'created_at' | 'updated_at'>
  ): Promise<DbTestimonial> {
    if (!testimonial.client_name?.trim()) throw new Error('Client name is required.');
    if (!testimonial.testimonial_text?.trim()) throw new Error('Testimonial text is required.');

    const { data, error } = await supabase
      .from('testimonials')
      .insert({
        client_name: testimonial.client_name.trim(),
        company_name: testimonial.company_name?.trim() || null,
        client_designation: testimonial.client_designation?.trim() || null,
        testimonial_text: testimonial.testimonial_text.trim(),
        profile_photo_url: testimonial.profile_photo_url?.trim() || null,
        video_url: testimonial.video_url?.trim() || null,
        rating: Math.min(5, Math.max(1, Number(testimonial.rating) || 5)),
        is_published: Boolean(testimonial.is_published),
        display_order: Number(testimonial.display_order) || 0,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateTestimonial(
    id: string,
    updates: Partial<Omit<DbTestimonial, 'id' | 'created_at' | 'updated_at'>>
  ): Promise<DbTestimonial> {
    const { data, error } = await supabase
      .from('testimonials')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteTestimonial(id: string): Promise<void> {
    const { error } = await supabase.from('testimonials').delete().eq('id', id);
    if (error) throw error;
  },
};
