import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

/**
 * Expo client: sessions persist in AsyncStorage and refresh automatically.
 * Set EXPO_PUBLIC_* in `.env` (see `.env.example`). Use the project URL and
 * the public anon / “publishable” key from Supabase → Settings → API (never the service_role key).
 */
export const supabase = createClient(supabaseUrl ?? '', supabaseKey ?? '', {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

export function assertSupabaseConfigured(): void {
  if (!supabaseUrl?.trim() || !supabaseKey?.trim()) {
    throw new Error(
      'Missing EXPO_PUBLIC_SUPABASE_URL or EXPO_PUBLIC_SUPABASE_ANON_KEY. Copy .env.example to .env in apps/mobile.',
    );
  }
}
