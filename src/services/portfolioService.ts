import { supabase } from '../lib/supabase';
import type { DbPortfolioProject } from '../types/database';

export const portfolioService = {
  async getPublishedProjects(): Promise<DbPortfolioProject[]> {
    const { data, error } = await supabase
      .from('portfolio_projects')
      .select('*, category:categories(*)')
      .eq('is_published', true)
      .order('display_order', { ascending: true })
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Error fetching published projects:', error.message);
      return [];
    }

    return data || [];
  },

  async getAllProjectsAdmin(): Promise<DbPortfolioProject[]> {
    const { data, error } = await supabase
      .from('portfolio_projects')
      .select('*, category:categories(*)')
      .order('display_order', { ascending: true })
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Error fetching admin projects:', error.message);
      return [];
    }

    return data || [];
  },

  async createProject(
    project: Omit<DbPortfolioProject, 'id' | 'created_at' | 'updated_at' | 'category'>
  ): Promise<DbPortfolioProject> {
    if (!project.title?.trim()) throw new Error('Project title is required.');
    if (!project.slug?.trim()) throw new Error('Project slug is required.');
    if (!project.thumbnail_url?.trim()) throw new Error('Thumbnail image URL is required.');

    const { data, error } = await supabase
      .from('portfolio_projects')
      .insert({
        title: project.title.trim(),
        slug: project.slug.trim().toLowerCase(),
        description: project.description.trim(),
        category_id: project.category_id || null,
        thumbnail_url: project.thumbnail_url.trim(),
        preview_video_url: project.preview_video_url?.trim() || null,
        full_video_url: project.full_video_url?.trim() || null,
        aspect_ratio: project.aspect_ratio || '16:9',
        duration: project.duration?.trim() || '00:30',
        client_industry: project.client_industry?.trim() || null,
        deliverables: project.deliverables || [],
        tools_used: project.tools_used || [],
        case_study: project.case_study?.trim() || null,
        is_featured: Boolean(project.is_featured),
        is_published: Boolean(project.is_published),
        display_order: Number(project.display_order) || 0,
      })
      .select('*, category:categories(*)')
      .single();

    if (error) {
      if (error.code === '23505') {
        throw new Error('A project with this slug already exists.');
      }
      throw error;
    }

    return data;
  },

  async updateProject(
    id: string,
    updates: Partial<Omit<DbPortfolioProject, 'id' | 'created_at' | 'updated_at' | 'category'>>
  ): Promise<DbPortfolioProject> {
    const { data, error } = await supabase
      .from('portfolio_projects')
      .update(updates)
      .eq('id', id)
      .select('*, category:categories(*)')
      .single();

    if (error) {
      if (error.code === '23505') {
        throw new Error('A project with this slug already exists.');
      }
      throw error;
    }

    return data;
  },

  async deleteProject(id: string): Promise<void> {
    const { error } = await supabase.from('portfolio_projects').delete().eq('id', id);
    if (error) throw error;
  },
};
