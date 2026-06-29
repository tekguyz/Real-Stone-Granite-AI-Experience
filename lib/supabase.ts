import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

let supabase: SupabaseClient | null = null;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    'Warning: Supabase environment variables are missing. ' +
    'Please ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set. ' +
    'Falling back to a mock client shell to prevent crashes.'
  );
  
  // Return a shell that doesn't completely crash the compiler,
  // but won't be fully functional without keys.
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
    // ...other minimally required stub methods could be added here
  } as unknown as SupabaseClient;
} else {
  supabase = createClient(supabaseUrl, supabaseAnonKey);
}

export { supabase };
