import { createBrowserClient } from '@supabase/ssr'
import { Database } from '@/types/database'

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  
  console.log('Supabase URL:', supabaseUrl)
  console.log('Supabase Key exists:', !!supabaseKey)
  
  return createBrowserClient<Database>(
    supabaseUrl,
    supabaseKey
  )
}
