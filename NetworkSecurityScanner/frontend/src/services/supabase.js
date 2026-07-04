import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || '';
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY || '';

let supabase = null;
if (supabaseUrl && supabaseKey) {
  supabase = createClient(supabaseUrl, supabaseKey);
}

export { supabase };

export const getSupabase = () => {
  if (!supabase) {
    console.warn('Supabase not configured — set REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_ANON_KEY');
    return null;
  }
  return supabase;
};

export const useSupabaseAuth = () => {
  return supabase?.auth;
};

export const useSupabaseDatabase = () => {
  return supabase;
};
