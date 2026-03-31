import { createClient } from "@supabase/supabase-js";

// REPLACE THESE WITH YOUR ACTUAL VALUES FROM SUPABASE DASHBOARD
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_PUBLIC_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Export the supabase client instance
export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLIC_KEY);
