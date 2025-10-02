// src/lib/supabaseClient.ts
import { createClient } from '@supabase/supabase-js';

// Read from Vite env (loaded from your .env file at build/run time)
const url = import.meta.env.VITE_SUPABASE_URL;
const anon = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Safety checks + a visible console log so we can verify at runtime
if (!url || !anon) {
  console.error('[SUPABASE ENV MISSING]', { url, hasAnon: !!anon });
  throw new Error(
    'Supabase env vars missing. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in a .env file at the project root.'
  );
}

console.log('[SUPABASE] Using URL:', url);

export const supabase = createClient(url, anon, {
  auth: { persistSession: false },
});

export default supabase;
