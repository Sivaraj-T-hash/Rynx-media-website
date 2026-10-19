import { supabase } from '../lib/supabase';
import type { Category } from '../types/database';

export const categoriesService = {
  async getCategories(): Promise<Category[]> {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('display_order', { ascending: true })
      .order('name', { ascending: true });

    if (error) {
      console.warn('Error fetching categories from Supabase:', error.message);
      return [];
    }

    // Filter out any accidentally added 'All' row to protect the virtual filter rule
    return (data || []).filter(
      (c) => c.name.toLowerCase() !== 'all' && c.slug.toLowerCase() !== 'all'
    );
  },

  async createCategory(category: Omit<Category, 'id' | 'created_at' | 'updated_at'>): Promise<Category> {
    const cleanName = category.name.trim();
    const cleanSlug = category.slug.trim().toLowerCase();

    if (cleanName.toLowerCase() === 'all' || cleanSlug === 'all') {
      throw new Error('"All" is a reserved virtual filter and cannot be created as a category.');
    }

    const { data, error } = await supabase
      .from('categories')
      .insert({
        name: cleanName,
        slug: cleanSlug,
        description: category.description?.trim() || null,
        display_order: Number(category.display_order) || 0,
      })
      .select()
      .single();

    if (error) {
      if (error.code === '23505') {
        throw new Error('A category with this name or slug already exists.');
      }
      throw error;
    }

    return data;
  },

  async updateCategory(
    id: string,
    updates: Partial<Omit<Category, 'id' | 'created_at' | 'updated_at'>>
  ): Promise<Category> {
    if (updates.name && updates.name.trim().toLowerCase() === 'all') {
      throw new Error('"All" is a reserved virtual filter and cannot be used as a category name.');
    }

    const { data, error } = await supabase
      .from('categories')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      if (error.code === '23505') {
        throw new Error('A category with this name or slug already exists.');
      }
      throw error;
    }

    return data;
  },

  async deleteCategory(id: string): Promise<void> {
    // Check if any portfolio projects reference this category
    const { count, error: countError } = await supabase
      .from('portfolio_projects')
      .select('id', { count: 'exact', head: true })
      .eq('category_id', id);

    if (countError) throw countError;

    if (count && count > 0) {
      throw new Error(
        `Cannot delete category: It is currently referenced by ${count} project(s). Please reassign or delete those projects first.`
      );
    }

    const { error } = await supabase.from('categories').delete().eq('id', id);
    if (error) throw error;
  },
};
