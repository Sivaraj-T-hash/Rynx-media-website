import { createClient } from '@supabase/supabase-js';

// Retrieve environment variables with multiple fallback keys (Vite and Next format)
const supabaseUrl =
  (import.meta.env.VITE_SUPABASE_URL as string) ||
  (import.meta.env.NEXT_PUBLIC_SUPABASE_URL as string) ||
  'https://qmlcpudtvlzoqwkvsxjj.supabase.co';

const supabasePublishableKey =
  (import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string) ||
  (import.meta.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY as string) ||
  (import.meta.env.VITE_SUPABASE_ANON_KEY as string) ||
  'sb_publishable_gYy0n9FxhYC8A-kks1WPRA_lwgAw2fZ';

if (!supabaseUrl || !supabasePublishableKey) {
  console.warn(
    'Supabase configuration: Missing Supabase URL or Publishable Key. Check .env.local'
  );
}

export const supabase = createClient(supabaseUrl, supabasePublishableKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

export const isSupabaseConfigured = (): boolean => {
  return Boolean(supabaseUrl && supabasePublishableKey);
};
