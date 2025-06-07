import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/database'
import { validateClientEnv, validateServerEnv } from './env'

// Validate and get environment variables
const { supabaseUrl, supabaseAnonKey } = validateClientEnv()

export const supabase = createClient<Database>(supabaseUrl!, supabaseAnonKey!, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// Server-side client for admin operations
export const createServerClient = () => {
  const { supabaseServiceKey } = validateServerEnv()

  if (!supabaseServiceKey) {
    throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY environment variable')
  }

  return createClient<Database>(supabaseUrl!, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })
}
