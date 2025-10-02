// src/lib/supabaseClient.ts
// Compatibility wrapper so older imports keep working.
// It re-exports the actual client from src/lib/supabase.ts

import supa from "./supabase";

export { supa as supabase }; // named export for: import { supabase } from ".../supabaseClient"
export default supa;         // default export for: import supabase from ".../supabaseClient"
