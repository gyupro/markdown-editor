import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Create supabase client only if env vars are available
export const supabase: SupabaseClient | null =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

export const isSupabaseConfigured = (): boolean => {
  return supabase !== null;
};

export type Document = {
  id: string;
  title: string;
  content: string;
  share_token: string;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}; 