'use client'

import React, { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { useAuth } from './AuthProvider'

interface AuthGuardProps {
  children: React.ReactNode
  requireAuth?: boolean
  redirectTo?: string
  fallback?: React.ReactNode
}

export function AuthGuard({ 
  children, 
  requireAuth = true, 
  redirectTo,
  fallback 
}: AuthGuardProps) {
  const { user, loading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    if (!loading) {
      setIsChecking(false)
      
      if (requireAuth && !user) {
        // User needs to be authenticated but isn't
        const loginUrl = redirectTo || `/auth/login?redirect=${encodeURIComponent(pathname)}`
        router.push(loginUrl)
      } else if (!requireAuth && user) {
        // User is authenticated but shouldn't be (e.g., on login page)
        router.push('/')
      }
    }
  }, [user, loading, requireAuth, router, pathname, redirectTo])

  // Show loading state while checking authentication
  if (loading || isChecking) {
    return fallback || <AuthLoadingFallback />
  }

  // If auth is required and user is not authenticated, don't render children
  if (requireAuth && !user) {
    return null
  }

  // If auth is not required and user is authenticated, don't render children
  if (!requireAuth && user) {
    return null
  }

  return <>{children}</>
}

// Default loading fallback component
function AuthLoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
        <p className="text-gray-600">Verificando autenticación...</p>
      </div>
    </div>
  )
}

// Higher-order component for protecting pages
export function withAuthGuard<P extends object>(
  Component: React.ComponentType<P>,
  options: {
    requireAuth?: boolean
    redirectTo?: string
    fallback?: React.ReactNode
  } = {}
) {
  const WrappedComponent = (props: P) => {
    return (
      <AuthGuard {...options}>
        <Component {...props} />
      </AuthGuard>
    )
  }

  WrappedComponent.displayName = `withAuthGuard(${Component.displayName || Component.name})`
  
  return WrappedComponent
}

// Hook for checking authentication status in components
export function useAuthGuard(requireAuth: boolean = true) {
  const { user, loading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  const isAuthenticated = !!user
  const isLoading = loading
  const shouldRedirect = requireAuth ? !isAuthenticated : isAuthenticated

  const redirectToAuth = () => {
    if (requireAuth) {
      router.push(`/auth/login?redirect=${encodeURIComponent(pathname)}`)
    } else {
      router.push('/')
    }
  }

  return {
    isAuthenticated,
    isLoading,
    shouldRedirect,
    redirectToAuth,
    user
  }
}

// Component for protecting specific sections within a page
export function ProtectedSection({ 
  children, 
  fallback,
  requireAuth = true 
}: {
  children: React.ReactNode
  fallback?: React.ReactNode
  requireAuth?: boolean
}) {
  const { user, loading } = useAuth()

  if (loading) {
    return fallback || (
      <div className="flex items-center justify-center p-4">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    )
  }

  if (requireAuth && !user) {
    return fallback || (
      <div className="text-center p-4">
        <p className="text-gray-600">Debes iniciar sesión para ver este contenido.</p>
      </div>
    )
  }

  if (!requireAuth && user) {
    return null
  }

  return <>{children}</>
}

// Component for showing different content based on auth status
export function AuthSwitch({
  authenticated,
  unauthenticated,
  loading
}: {
  authenticated: React.ReactNode
  unauthenticated: React.ReactNode
  loading?: React.ReactNode
}) {
  const { user, loading: authLoading } = useAuth()

  if (authLoading) {
    return loading || <AuthLoadingFallback />
  }

  return user ? <>{authenticated}</> : <>{unauthenticated}</>
}
