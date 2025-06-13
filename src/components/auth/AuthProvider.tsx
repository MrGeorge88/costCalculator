'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { 
  AuthContextType, 
  AuthState, 
  LoginCredentials, 
  RegisterCredentials,
  AuthUser,
  AuthSession
} from '@/types/auth'

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: React.ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const router = useRouter()
  const [state, setState] = useState<AuthState>({
    user: null,
    session: null,
    loading: true,
    error: null
  })

  // Initialize auth state
  useEffect(() => {
    let mounted = true

    async function getInitialSession() {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('Error getting session:', error)
          if (mounted) {
            setState(prev => ({ 
              ...prev, 
              loading: false, 
              error: error.message 
            }))
          }
          return
        }

        if (mounted) {
          setState(prev => ({
            ...prev,
            user: session?.user as AuthUser || null,
            session: session as AuthSession || null,
            loading: false,
            error: null
          }))
        }
      } catch (error) {
        console.error('Error in getInitialSession:', error)
        if (mounted) {
          setState(prev => ({ 
            ...prev, 
            loading: false, 
            error: 'Failed to initialize authentication' 
          }))
        }
      }
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email)
        
        if (mounted) {
          setState(prev => ({
            ...prev,
            user: session?.user as AuthUser || null,
            session: session as AuthSession || null,
            loading: false,
            error: null
          }))
        }

        // Handle auth events
        if (event === 'SIGNED_IN') {
          router.push('/')
        } else if (event === 'SIGNED_OUT') {
          router.push('/auth/login')
        }
      }
    )

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [router])

  const signIn = async (credentials: LoginCredentials) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }))

      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password
      })

      if (error) {
        throw error
      }

      // Session will be updated via onAuthStateChange
    } catch (error: any) {
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: error.message || 'Failed to sign in' 
      }))
      throw error
    }
  }

  const signUp = async (credentials: RegisterCredentials) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }))

      const { data, error } = await supabase.auth.signUp({
        email: credentials.email,
        password: credentials.password,
        options: {
          data: {
            first_name: credentials.firstName,
            last_name: credentials.lastName
          }
        }
      })

      if (error) {
        throw error
      }

      // Don't automatically redirect - let user know to check email
      setState(prev => ({ ...prev, loading: false }))
    } catch (error: any) {
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: error.message || 'Failed to sign up' 
      }))
      throw error
    }
  }

  const signOut = async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }))
      
      const { error } = await supabase.auth.signOut()
      
      if (error) {
        throw error
      }

      // Session will be updated via onAuthStateChange
    } catch (error: any) {
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: error.message || 'Failed to sign out' 
      }))
      throw error
    }
  }

  const resetPassword = async (email: string) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }))

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`
      })

      if (error) {
        throw error
      }

      setState(prev => ({ ...prev, loading: false }))
    } catch (error: any) {
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: error.message || 'Failed to send reset email' 
      }))
      throw error
    }
  }

  const updatePassword = async (password: string) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }))

      const { error } = await supabase.auth.updateUser({
        password: password
      })

      if (error) {
        throw error
      }

      setState(prev => ({ ...prev, loading: false }))
    } catch (error: any) {
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: error.message || 'Failed to update password' 
      }))
      throw error
    }
  }

  const refreshSession = async () => {
    try {
      const { data, error } = await supabase.auth.refreshSession()
      
      if (error) {
        throw error
      }

      setState(prev => ({
        ...prev,
        user: data.session?.user as AuthUser || null,
        session: data.session as AuthSession || null,
        error: null
      }))
    } catch (error: any) {
      setState(prev => ({ 
        ...prev, 
        error: error.message || 'Failed to refresh session' 
      }))
      throw error
    }
  }

  const value: AuthContextType = {
    ...state,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updatePassword,
    refreshSession
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
