import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Null when env vars are missing so the app still runs locally;
// submission will fail gracefully and offer the JSON download fallback.
export const supabase = url && anonKey ? createClient(url, anonKey) : null;

export async function insertResponse(row) {
  if (!supabase) {
    throw new Error(
      'Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.'
    );
  }
  const { error } = await supabase.from('responses').insert(row);
  if (error) {
    throw new Error(error.message || 'Failed to save your response.');
  }
}
