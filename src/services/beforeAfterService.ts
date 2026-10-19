import { supabase } from '../lib/supabase';
import type { DbBeforeAfterProject } from '../types/database';

export const beforeAfterService = {
  async getPublishedBeforeAfter(): Promise<DbBeforeAfterProject[]> {
    const { data, error } = await supabase
      .from('before_after_projects')
      .select('*')
      .eq('is_published', true)
      .order('display_order', { ascending: true })
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Error fetching published before-after projects:', error.message);
      return [];
    }

    return data || [];
  },

  async getAllBeforeAfterAdmin(): Promise<DbBeforeAfterProject[]> {
    const { data, error } = await supabase
      .from('before_after_projects')
      .select('*')
      .order('display_order', { ascending: true })
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Error fetching admin before-after projects:', error.message);
      return [];
    }

    return data || [];
  },

  async createBeforeAfter(
    project: Omit<DbBeforeAfterProject, 'id' | 'created_at' | 'updated_at'>
  ): Promise<DbBeforeAfterProject> {
    if (!project.project_name?.trim()) throw new Error('Project name is required.');
    if (!project.raw_footage_url?.trim()) throw new Error('Raw footage URL is required.');
    if (!project.final_video_url?.trim()) throw new Error('Final edited video URL is required.');

    const { data, error } = await supabase
      .from('before_after_projects')
      .insert({
        project_name: project.project_name.trim(),
        raw_footage_url: project.raw_footage_url.trim(),
        final_video_url: project.final_video_url.trim(),
        thumbnail_url: project.thumbnail_url?.trim() || null,
        is_published: Boolean(project.is_published),
        display_order: Number(project.display_order) || 0,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateBeforeAfter(
    id: string,
    updates: Partial<Omit<DbBeforeAfterProject, 'id' | 'created_at' | 'updated_at'>>
  ): Promise<DbBeforeAfterProject> {
    const { data, error } = await supabase
      .from('before_after_projects')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteBeforeAfter(id: string): Promise<void> {
    const { error } = await supabase
      .from('before_after_projects')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },
};
