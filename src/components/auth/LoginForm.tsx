'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Eye, EyeOff, Mail, Lock, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useAuth } from './AuthProvider'
import { useAuthForm, formatAuthError } from '@/hooks/auth/useAuth'
import { LoginCredentials } from '@/types/auth'

interface LoginFormProps {
  onSuccess?: () => void
  redirectTo?: string
}

export function LoginForm({ onSuccess, redirectTo }: LoginFormProps) {
  const { signIn } = useAuth()
  const { formState, validateLoginForm, setLoading, setErrors, setError, clearState } = useAuthForm()
  
  const [credentials, setCredentials] = useState<LoginCredentials>({
    email: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)

  const handleInputChange = (field: keyof LoginCredentials) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setCredentials(prev => ({
      ...prev,
      [field]: e.target.value
    }))
    
    // Clear errors when user starts typing
    if (formState.errors[field]) {
      setErrors({ ...formState.errors, [field]: undefined })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    clearState()

    // Validate form
    const errors = validateLoginForm(credentials)
    if (Object.keys(errors).length > 0) {
      setErrors(errors)
      return
    }

    try {
      setLoading(true)
      await signIn(credentials)
      
      // Success callback
      if (onSuccess) {
        onSuccess()
      }
    } catch (error: any) {
      const friendlyError = formatAuthError(error.message)
      setError(friendlyError)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Iniciar Sesión
          </h1>
          <p className="text-gray-600">
            Accede a tu calculadora de costos
          </p>
        </div>

        {/* Error Message */}
        {formState.errors.general && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start space-x-3">
            <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-red-800">Error de autenticación</p>
              <p className="text-sm text-red-700 mt-1">{formState.errors.general}</p>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Field */}
          <div>
            <Input
              type="email"
              label="Email"
              placeholder="tu@email.com"
              value={credentials.email}
              onChange={handleInputChange('email')}
              error={formState.errors.email}
              icon={<Mail className="h-5 w-5" />}
              required
              autoComplete="email"
              disabled={formState.isLoading}
            />
          </div>

          {/* Password Field */}
          <div className="relative">
            <Input
              type={showPassword ? 'text' : 'password'}
              label="Contraseña"
              placeholder="••••••••"
              value={credentials.password}
              onChange={handleInputChange('password')}
              error={formState.errors.password}
              icon={<Lock className="h-5 w-5" />}
              iconPosition="left"
              required
              autoComplete="current-password"
              disabled={formState.isLoading}
              className="pr-12"
            />
            <button
              type="button"
              className="absolute right-3 top-[38px] text-gray-400 hover:text-gray-600 transition-colors z-10"
              onClick={() => setShowPassword(!showPassword)}
              disabled={formState.isLoading}
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>

          {/* Forgot Password Link */}
          <div className="text-right">
            <Link 
              href="/auth/forgot-password"
              className="text-sm text-primary hover:text-primary/80 font-medium transition-colors"
            >
              ¿Olvidaste tu contraseña?
            </Link>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full"
            loading={formState.isLoading}
            disabled={formState.isLoading}
          >
            {formState.isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </Button>
        </form>

        {/* Register Link */}
        <div className="mt-8 text-center">
          <p className="text-gray-600">
            ¿No tienes una cuenta?{' '}
            <Link 
              href="/auth/register"
              className="text-primary hover:text-primary/80 font-medium transition-colors"
            >
              Regístrate aquí
            </Link>
          </p>
        </div>

        {/* Demo Credentials (Development only) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
            <p className="text-xs font-medium text-gray-700 mb-2">Demo (Solo desarrollo):</p>
            <p className="text-xs text-gray-600">
              Email: demo@example.com<br />
              Contraseña: Demo123456
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="w-full mt-2"
              onClick={() => {
                setCredentials({
                  email: 'demo@example.com',
                  password: 'Demo123456'
                })
              }}
              disabled={formState.isLoading}
            >
              Usar credenciales demo
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
