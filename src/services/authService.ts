import { supabase } from '../lib/supabase';
import type { AdminUser } from '../types/database';

export const authService = {
  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw error;
    }

    // Verify administrator role in admin_users table
    const isAdmin = await this.checkIsAdmin(data.user.id);
    if (!isAdmin) {
      const userUid = data.user.id;
      const userEmail = data.user.email ?? email;
      // Sign out immediately if not authorized
      await supabase.auth.signOut();
      throw new Error(
        `Access Denied: Authentication succeeded for ${userEmail}, but this account is not registered as an administrator in the admin_users table. (User UUID: ${userUid})`
      );
    }

    return data;
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) {
      throw error;
    }
  },

  async getSession() {
    const { data, error } = await supabase.auth.getSession();
    if (error) {
      throw error;
    }
    return data.session;
  },

  async getUser() {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) return null;
    return user;
  },

  async checkIsAdmin(userId: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('admin_users')
        .select('id, role, is_active')
        .eq('id', userId)
        .eq('is_active', true)
        .maybeSingle();

      if (error) {
        console.warn('Admin check warning:', error.message);
        // Fallback: If admin_users table has not yet been populated via SQL,
        // we check user session. If user exists and email matches admin, allow setup mode.
        return false;
      }

      return Boolean(data && data.is_active);
    } catch {
      return false;
    }
  },

  async getAdminProfile(userId: string): Promise<AdminUser | null> {
    const { data, error } = await supabase
      .from('admin_users')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (error) return null;
    return data;
  },
};
