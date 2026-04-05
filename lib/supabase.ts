import { createBrowserClient } from '@supabase/ssr'
import { SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  if (typeof window !== 'undefined') {
    console.error(
      'MISSING SUPABASE ENVIRONMENT VARIABLES! \n' +
      'Check NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your .env.local file.'
    )
  }
}

let client: SupabaseClient<any, "public", any> | undefined;

export const createClient = (): SupabaseClient<any, "public", any> => {
  if (typeof window === 'undefined') {
    return createBrowserClient<any, "public">(supabaseUrl || '', supabaseAnonKey || '')
  }

  if (client) return client;

  client = createBrowserClient<any, "public">(supabaseUrl || '', supabaseAnonKey || '');
  return client;
}
