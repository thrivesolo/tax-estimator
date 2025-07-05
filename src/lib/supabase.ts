import { createClient } from '@supabase/supabase-js';

// These will be set up when we add user authentication
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Note: This is prepared for future use when we add user authentication
// For MVP, we won't be using Supabase yet