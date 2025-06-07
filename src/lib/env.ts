/**
 * Environment Variables Configuration
 * Validates and exports environment variables with proper error handling
 */

// Client-side environment variables (accessible in browser)
export const clientEnv = {
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
  supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  nodeEnv: process.env.NODE_ENV,
} as const

// Server-side environment variables (only accessible on server)
export const serverEnv = {
  supabaseServiceKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
  vercelToken: process.env.VERCEL_TOKEN,
  vercelOrgId: process.env.VERCEL_ORG_ID,
  vercelProjectId: process.env.VERCEL_PROJECT_ID,
  nextAuthSecret: process.env.NEXTAUTH_SECRET,
  nextAuthUrl: process.env.NEXTAUTH_URL,
} as const

/**
 * Validates required client environment variables
 */
export function validateClientEnv() {
  const errors: string[] = []

  if (!clientEnv.supabaseUrl) {
    errors.push('NEXT_PUBLIC_SUPABASE_URL is required')
  }

  if (!clientEnv.supabaseAnonKey) {
    errors.push('NEXT_PUBLIC_SUPABASE_ANON_KEY is required')
  }

  if (errors.length > 0) {
    throw new Error(`Missing required environment variables:\n${errors.join('\n')}`)
  }

  return clientEnv
}

/**
 * Validates required server environment variables
 */
export function validateServerEnv() {
  const errors: string[] = []

  if (!serverEnv.supabaseServiceKey) {
    errors.push('SUPABASE_SERVICE_ROLE_KEY is required for server operations')
  }

  if (errors.length > 0) {
    console.warn(`Missing optional server environment variables:\n${errors.join('\n')}`)
  }

  return serverEnv
}

/**
 * Check if we're in development mode
 */
export const isDevelopment = clientEnv.nodeEnv === 'development'

/**
 * Check if we're in production mode
 */
export const isProduction = clientEnv.nodeEnv === 'production'

/**
 * Check if we're running on the server
 */
export const isServer = typeof window === 'undefined'

/**
 * Check if we're running on the client
 */
export const isClient = typeof window !== 'undefined'
