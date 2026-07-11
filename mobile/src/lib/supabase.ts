import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Platform } from 'react-native';

const url = process.env.EXPO_PUBLIC_SUPABASE_URL;
const anonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

// AsyncStorage's web shim touches window.localStorage with no SSR guard,
// which crashes Expo Router's node render — on web let supabase-js use its
// own storage (it checks for window itself).
const storage = Platform.OS === 'web' ? undefined : AsyncStorage;

// Null until the Supabase project exists and .env is populated — the app
// falls back to mock data + mock auth so screens are buildable in the meantime.
export const supabase: SupabaseClient | null =
  url && anonKey
    ? createClient(url, anonKey, {
        auth: {
          storage,
          autoRefreshToken: true,
          persistSession: true,
          detectSessionInUrl: false,
        },
      })
    : null;
