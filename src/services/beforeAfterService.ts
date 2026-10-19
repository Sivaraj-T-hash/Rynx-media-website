import { supabase } from '../lib/supabase';
import type { DbBeforeAfterProject } from '../types/database';

export const beforeAfterService = {
  async getPublishedBeforeAfter(): Promise<DbBeforeAfterProject[]> {
    const { data, error } = await supabase
      .from('before_after_projects')
      .select('*')
      .eq('is_published', true)
      .order('is_featured', { ascending: false })
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
      .order('is_featured', { ascending: false })
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
    if (!project.raw_footage_url?.trim()) throw new Error('Before / RAW image is required.');
    if (!project.final_video_url?.trim()) throw new Error('After / Final image is required.');

    // If setting as featured, un-feature any other items first
    if (project.is_featured) {
      await supabase
        .from('before_after_projects')
        .update({ is_featured: false })
        .eq('is_featured', true);
    }

    const { data, error } = await supabase
      .from('before_after_projects')
      .insert({
        project_name: project.project_name.trim(),
        description: project.description?.trim() || null,
        raw_footage_url: project.raw_footage_url.trim(),
        final_video_url: project.final_video_url.trim(),
        thumbnail_url: project.thumbnail_url?.trim() || null,
        before_image_path: project.before_image_path || null,
        after_image_path: project.after_image_path || null,
        is_featured: Boolean(project.is_featured),
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
    // If setting this one to featured, unset other featured records
    if (updates.is_featured) {
      await supabase
        .from('before_after_projects')
        .update({ is_featured: false })
        .neq('id', id)
        .eq('is_featured', true);
    }

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
    // 1. Fetch paths for cleanup
    const { data: item } = await supabase
      .from('before_after_projects')
      .select('before_image_path, after_image_path')
      .eq('id', id)
      .maybeSingle();

    // 2. Delete database record
    const { error } = await supabase
      .from('before_after_projects')
      .delete()
      .eq('id', id);

    if (error) throw error;

    // 3. Clean up storage files asynchronously
    if (item?.before_image_path) {
      try {
        await supabase.storage.from('before-after-media').remove([item.before_image_path]);
      } catch (err) {
        console.warn('Before image storage delete warning:', err);
      }
    }
    if (item?.after_image_path) {
      try {
        await supabase.storage.from('before-after-media').remove([item.after_image_path]);
      } catch (err) {
        console.warn('After image storage delete warning:', err);
      }
    }
  },
};
