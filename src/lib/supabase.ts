import { createClient } from '@supabase/supabase-js';


// Initialize Supabase client
// Using direct values from project configuration
const supabaseUrl = 'https://pzgytyypezoyqzyvwwdm.supabase.co';
const supabaseKey = 'sb_publishable_wyyCsjpIePAwxkDfG01hIQ_nasjd66X';
const supabase = createClient(supabaseUrl, supabaseKey);


export { supabase };