import { supabase } from '../lib/supabase';
import type { DbPortfolioProject } from '../types/database';

export const portfolioService = {
  async getPublishedProjects(): Promise<DbPortfolioProject[]> {
    const { data, error } = await supabase
      .from('portfolio_projects')
      .select('*, category:categories(*)')
      .eq('is_published', true)
      .order('display_order', { ascending: true })
      .order('created_at', { ascending: false })
      .order('id', { ascending: true });

    if (error) {
      console.warn('Error fetching published projects:', error.message);
      return [];
    }

    const items = (data || []) as DbPortfolioProject[];
    return items.sort(
      (a, b) =>
        (a.display_order ?? 0) - (b.display_order ?? 0) ||
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime() ||
        a.id.localeCompare(b.id)
    );
  },

  async getAllProjectsAdmin(): Promise<DbPortfolioProject[]> {
    const { data, error } = await supabase
      .from('portfolio_projects')
      .select('*, category:categories(*)')
      .order('display_order', { ascending: true })
      .order('created_at', { ascending: false })
      .order('id', { ascending: true });

    if (error) {
      console.warn('Error fetching admin projects:', error.message);
      return [];
    }

    const items = (data || []) as DbPortfolioProject[];
    return items.sort(
      (a, b) =>
        (a.display_order ?? 0) - (b.display_order ?? 0) ||
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime() ||
        a.id.localeCompare(b.id)
    );
  },

  /**
   * Updates multiple portfolio video display orders atomically and safely.
   * Handles duplicate-position prevention via two-phase updates and RPC.
   */
  async updateProjectOrders(
    projectOrders: { id: string; display_order: number }[]
  ): Promise<void> {
    if (!projectOrders || projectOrders.length === 0) return;

    // Validate that all positions are positive integers
    for (const item of projectOrders) {
      if (!item.id) {
        throw new Error('Project ID is required for ordering update.');
      }
      if (!Number.isInteger(item.display_order) || item.display_order < 1) {
        throw new Error(`Invalid position "${item.display_order}". Position must be a positive integer (1, 2, 3...).`);
      }
    }

    // Check for duplicate positions
    const positions = projectOrders.map((p) => p.display_order);
    const uniquePositions = new Set(positions);
    if (uniquePositions.size !== positions.length) {
      throw new Error('Duplicate positions detected. Every portfolio video must have a unique position number.');
    }

    // 1. Attempt atomic RPC call first
    try {
      const { error: rpcError } = await supabase.rpc('update_portfolio_project_orders', {
        project_orders: projectOrders,
      });

      if (!rpcError) {
        return;
      }

      // If function doesn't exist, log notice and use safe two-phase client update
      console.warn('RPC update_portfolio_project_orders notice:', rpcError.message);
    } catch (rpcErr) {
      console.warn('RPC call exception, using client fallback:', rpcErr);
    }

    // 2. Safe Fallback: Two-phase update to prevent any temporary collision issues
    // Phase 1: Set temporary negative positions
    for (const item of projectOrders) {
      const { error: tempErr } = await supabase
        .from('portfolio_projects')
        .update({ display_order: -(item.display_order + 1000000) })
        .eq('id', item.id);

      if (tempErr) {
        throw new Error(`Failed to assign temporary order: ${tempErr.message}`);
      }
    }

    // Phase 2: Set final positive positions
    for (const item of projectOrders) {
      const { error: finalErr } = await supabase
        .from('portfolio_projects')
        .update({
          display_order: item.display_order,
          updated_at: new Date().toISOString(),
        })
        .eq('id', item.id);

      if (finalErr) {
        throw new Error(`Failed to save final order position: ${finalErr.message}`);
      }
    }
  },

  async createProject(
    project: Omit<DbPortfolioProject, 'id' | 'created_at' | 'updated_at' | 'category'>
  ): Promise<DbPortfolioProject> {
    if (!project.title?.trim()) throw new Error('Project title is required.');
    if (!project.slug?.trim()) throw new Error('Project slug is required.');
    if (!project.thumbnail_url?.trim()) throw new Error('Project video / thumbnail is required.');

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
        video_storage_path: project.video_storage_path || null,
        thumbnail_storage_path: project.thumbnail_storage_path || null,
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
    // 1. Fetch paths for cleanup
    const { data: project } = await supabase
      .from('portfolio_projects')
      .select('video_storage_path, thumbnail_storage_path')
      .eq('id', id)
      .maybeSingle();

    // 2. Delete database record
    const { error } = await supabase.from('portfolio_projects').delete().eq('id', id);
    if (error) throw error;

    // 3. Clean up storage files asynchronously
    if (project?.video_storage_path) {
      try {
        await supabase.storage.from('portfolio-media').remove([project.video_storage_path]);
      } catch (err) {
        console.warn('Video storage delete warning:', err);
      }
    }
    if (project?.thumbnail_storage_path) {
      try {
        await supabase.storage.from('portfolio-media').remove([project.thumbnail_storage_path]);
      } catch (err) {
        console.warn('Thumbnail storage delete warning:', err);
      }
    }
  },
};
