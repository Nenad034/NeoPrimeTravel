import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('❌ Supabase configuration missing in .env');
}

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '');

/**
 * Helper to log search events or store results in the background
 */
export const logSearchRequest = async (criteria: any) => {
  try {
    const { error } = await supabase
      .from('search_logs')
      .insert([
        { 
          criteria, 
          created_at: new Date().toISOString() 
        }
      ]);
    
    if (error) throw error;
  } catch (err) {
    console.error('Supabase Logging Error:', err);
  }
};
