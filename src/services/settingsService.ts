import { supabase } from '../lib/supabase';
import type { DbWebsiteSetting } from '../types/database';

export interface WebsiteSettingsMap {
  business_name: string;
  contact_email: string;
  whatsapp_number: string;
  instagram_url: string;
  instagram_handle: string;
  hero_headline: string;
  hero_subtitle: string;
  primary_cta_label: string;
  footer_description: string;
  seo_title: string;
  seo_description: string;
}

export const DEFAULT_SETTINGS: WebsiteSettingsMap = {
  business_name: 'RYNX Digital Media',
  contact_email: 'ramankandhan11@gmail.com',
  whatsapp_number: '916382605739',
  instagram_url: 'https://www.instagram.com/raman_kandhan?dlrf=bnIzdHJsbWtsZjNr',
  instagram_handle: '@raman_kandhan',
  hero_headline: "We Don't Just Edit Videos. We Create Impact.",
  hero_subtitle:
    'Turning raw footage into powerful visual stories that capture attention, build brands, and drive results.',
  primary_cta_label: 'Explore Our Work',
  footer_description:
    'A boutique digital video post-production agency turning raw footage into cinematic visual narratives that command audience attention.',
  seo_title: 'RYNX Digital Media | Premium Video Editing Agency',
  seo_description:
    "We Don't Just Edit Videos. We Create Impact. RYNX Digital Media turns raw footage into powerful visual stories.",
};

export const settingsService = {
  async getSettings(): Promise<WebsiteSettingsMap> {
    try {
      const { data, error } = await supabase.from('website_settings').select('*');

      if (error || !data || data.length === 0) {
        return DEFAULT_SETTINGS;
      }

      const map: WebsiteSettingsMap = { ...DEFAULT_SETTINGS };
      data.forEach((row: DbWebsiteSetting) => {
        if (row.key in map) {
          (map as unknown as Record<string, string>)[row.key] = row.value;
        }
      });

      return map;
    } catch {
      return DEFAULT_SETTINGS;
    }
  },

  async getAllSettingsAdmin(): Promise<DbWebsiteSetting[]> {
    const { data, error } = await supabase
      .from('website_settings')
      .select('*')
      .order('key', { ascending: true });

    if (error) {
      console.warn('Error fetching website settings:', error.message);
      return [];
    }

    return data || [];
  },

  async updateSetting(key: string, value: string): Promise<void> {
    const { error } = await supabase
      .from('website_settings')
      .upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: 'key' });

    if (error) throw error;
  },

  async batchUpdateSettings(settings: Record<string, string>): Promise<void> {
    const updates = Object.entries(settings).map(([key, value]) => ({
      key,
      value,
      updated_at: new Date().toISOString(),
    }));

    const { error } = await supabase
      .from('website_settings')
      .upsert(updates, { onConflict: 'key' });

    if (error) throw error;
  },
};
