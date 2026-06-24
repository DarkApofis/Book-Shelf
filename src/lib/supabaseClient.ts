/**
 * Browser Supabase client. Created only when the public env vars are present,
 * so the app stays fully usable in guest mode before any keys are configured.
 * Sessions persist to localStorage by default (survives refreshes).
 */
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase: SupabaseClient | null =
  url && anonKey ? createClient(url, anonKey) : null;

export const isSupabaseConfigured = supabase !== null;
