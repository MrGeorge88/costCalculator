'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Eye, EyeOff, Mail, Lock, User, AlertCircle, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useAuth } from './AuthProvider'
import { useAuthForm, formatAuthError, getPasswordStrength } from '@/hooks/auth/useAuth'
import { RegisterCredentials } from '@/types/auth'

interface RegisterFormProps {
  onSuccess?: () => void
}

export function RegisterForm({ onSuccess }: RegisterFormProps) {
  const { signUp } = useAuth()
  const { formState, validateRegisterForm, setLoading, setErrors, setError, setSuccess, clearState } = useAuthForm()
  
  const [credentials, setCredentials] = useState<RegisterCredentials>({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [registrationSuccess, setRegistrationSuccess] = useState(false)

  const passwordStrength = getPasswordStrength(credentials.password)

  const handleInputChange = (field: keyof RegisterCredentials) => (
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
    const errors = validateRegisterForm(credentials)
    if (Object.keys(errors).length > 0) {
      setErrors(errors)
      return
    }

    try {
      setLoading(true)
      await signUp(credentials)
      
      setRegistrationSuccess(true)
      setSuccess(true, 'Registro exitoso. Por favor revisa tu email para confirmar tu cuenta.')
      
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

  if (registrationSuccess) {
    return (
      <div className="w-full max-w-md mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              ¡Registro Exitoso!
            </h1>
            <p className="text-gray-600 mb-6">
              Hemos enviado un email de confirmación a <strong>{credentials.email}</strong>. 
              Por favor revisa tu bandeja de entrada y haz clic en el enlace para activar tu cuenta.
            </p>
            <div className="space-y-4">
              <Button
                variant="primary"
                size="lg"
                className="w-full"
                onClick={() => window.location.href = '/auth/login'}
              >
                Ir al Login
              </Button>
              <Button
                variant="outline"
                size="md"
                className="w-full"
                onClick={() => {
                  setRegistrationSuccess(false)
                  clearState()
                }}
              >
                Registrar otra cuenta
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Crear Cuenta
          </h1>
          <p className="text-gray-600">
            Únete a la calculadora de costos
          </p>
        </div>

        {/* Error Message */}
        {formState.errors.general && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start space-x-3">
            <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-red-800">Error de registro</p>
              <p className="text-sm text-red-700 mt-1">{formState.errors.general}</p>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name Fields */}
          <div className="grid grid-cols-2 gap-4">
            <Input
              type="text"
              label="Nombre"
              placeholder="Juan"
              value={credentials.firstName}
              onChange={handleInputChange('firstName')}
              error={formState.errors.firstName}
              icon={<User className="h-5 w-5" />}
              autoComplete="given-name"
              disabled={formState.isLoading}
            />
            <Input
              type="text"
              label="Apellido"
              placeholder="Pérez"
              value={credentials.lastName}
              onChange={handleInputChange('lastName')}
              error={formState.errors.lastName}
              icon={<User className="h-5 w-5" />}
              autoComplete="family-name"
              disabled={formState.isLoading}
            />
          </div>

          {/* Email Field */}
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
              autoComplete="new-password"
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
            
            {/* Password Strength Indicator */}
            {credentials.password && (
              <div className="mt-2">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-gray-600">Fortaleza de contraseña:</span>
                  <span className={`font-medium text-${passwordStrength.color}-600`}>
                    {passwordStrength.label}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full bg-${passwordStrength.color}-500 transition-all duration-300`}
                    style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Confirm Password Field */}
          <div className="relative">
            <Input
              type={showConfirmPassword ? 'text' : 'password'}
              label="Confirmar Contraseña"
              placeholder="••••••••"
              value={credentials.confirmPassword}
              onChange={handleInputChange('confirmPassword')}
              error={formState.errors.confirmPassword}
              icon={<Lock className="h-5 w-5" />}
              iconPosition="left"
              required
              autoComplete="new-password"
              disabled={formState.isLoading}
              className="pr-12"
            />
            <button
              type="button"
              className="absolute right-3 top-[38px] text-gray-400 hover:text-gray-600 transition-colors z-10"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              disabled={formState.isLoading}
            >
              {showConfirmPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
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
            {formState.isLoading ? 'Creando cuenta...' : 'Crear Cuenta'}
          </Button>
        </form>

        {/* Login Link */}
        <div className="mt-8 text-center">
          <p className="text-gray-600">
            ¿Ya tienes una cuenta?{' '}
            <Link 
              href="/auth/login"
              className="text-primary hover:text-primary/80 font-medium transition-colors"
            >
              Inicia sesión aquí
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
