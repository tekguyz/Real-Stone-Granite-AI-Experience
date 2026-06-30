import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

let supabase: SupabaseClient | null = null;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    'Warning: Supabase environment variables are missing. ' +
    'Please ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set. ' +
    'Falling back to a mock client shell to prevent crashes.'
  );
  
  // Your clean fallback shell remains completely untouched
  supabase = {
    from: () => ({
      select: () => ({
        eq: () => ({}),
        order: () => ({}),
      }),
      insert: () => ({}),
      update: () => ({}),
      delete: () => ({}),
    }),
    channel: () => ({
      on: () => ({
        subscribe: () => ({}),
      }),
    }),
  } as unknown as SupabaseClient;
} else {
  // Check if the current execution context is on the server or the browser
  const isServer = typeof window === 'undefined';
  
  // Use the admin Service Key exclusively on the server side to bypass Row-Level Security blocks.
  // Otherwise, fallback safely to the standard Public Anon Key for the frontend.
  const activeKey = isServer && supabaseServiceKey ? supabaseServiceKey : supabaseAnonKey;

  supabase = createClient(supabaseUrl, activeKey);
}

export { supabase };