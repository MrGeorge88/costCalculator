'use client'

import React, { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Eye, EyeOff, Lock, AlertCircle, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useAuth } from './AuthProvider'
import { useAuthForm, formatAuthError, getPasswordStrength } from '@/hooks/auth/useAuth'
import { ResetPasswordData } from '@/types/auth'

interface ResetPasswordFormProps {
  onSuccess?: () => void
}

export function ResetPasswordForm({ onSuccess }: ResetPasswordFormProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { updatePassword } = useAuth()
  const { formState, validateResetPasswordForm, setLoading, setErrors, setError, setSuccess, clearState } = useAuthForm()
  
  const [data, setData] = useState<ResetPasswordData>({
    password: '',
    confirmPassword: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [resetSuccess, setResetSuccess] = useState(false)
  const [isValidToken, setIsValidToken] = useState(true)

  const passwordStrength = getPasswordStrength(data.password)

  // Check if we have valid reset token
  useEffect(() => {
    const accessToken = searchParams.get('access_token')
    const refreshToken = searchParams.get('refresh_token')
    const type = searchParams.get('type')

    if (type !== 'recovery' || !accessToken || !refreshToken) {
      setIsValidToken(false)
    }
  }, [searchParams])

  const handleInputChange = (field: keyof ResetPasswordData) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setData(prev => ({
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
    const errors = validateResetPasswordForm(data)
    if (Object.keys(errors).length > 0) {
      setErrors(errors)
      return
    }

    try {
      setLoading(true)
      await updatePassword(data.password)
      
      setResetSuccess(true)
      setSuccess(true, 'Contraseña actualizada exitosamente.')
      
      // Success callback
      if (onSuccess) {
        onSuccess()
      }

      // Redirect to login after 3 seconds
      setTimeout(() => {
        router.push('/auth/login')
      }, 3000)
    } catch (error: any) {
      const friendlyError = formatAuthError(error.message)
      setError(friendlyError)
    } finally {
      setLoading(false)
    }
  }

  // Invalid token state
  if (!isValidToken) {
    return (
      <div className="w-full max-w-md mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-6">
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Enlace Inválido
            </h1>
            <p className="text-gray-600 mb-6">
              El enlace de recuperación es inválido o ha expirado. Por favor solicita un nuevo enlace de recuperación.
            </p>
            <Button
              variant="primary"
              size="lg"
              className="w-full"
              onClick={() => router.push('/auth/forgot-password')}
            >
              Solicitar Nuevo Enlace
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Success state
  if (resetSuccess) {
    return (
      <div className="w-full max-w-md mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              ¡Contraseña Actualizada!
            </h1>
            <p className="text-gray-600 mb-6">
              Tu contraseña ha sido actualizada exitosamente. Serás redirigido al login en unos segundos.
            </p>
            <Button
              variant="primary"
              size="lg"
              className="w-full"
              onClick={() => router.push('/auth/login')}
            >
              Ir al Login
            </Button>
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
            Nueva Contraseña
          </h1>
          <p className="text-gray-600">
            Ingresa tu nueva contraseña
          </p>
        </div>

        {/* Error Message */}
        {formState.errors.general && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start space-x-3">
            <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-red-800">Error</p>
              <p className="text-sm text-red-700 mt-1">{formState.errors.general}</p>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Password Field */}
          <div className="relative">
            <Input
              type={showPassword ? 'text' : 'password'}
              label="Nueva Contraseña"
              placeholder="••••••••"
              value={data.password}
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
            {data.password && (
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
              label="Confirmar Nueva Contraseña"
              placeholder="••••••••"
              value={data.confirmPassword}
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
            {formState.isLoading ? 'Actualizando...' : 'Actualizar Contraseña'}
          </Button>
        </form>

        {/* Security Tips */}
        <div className="mt-6 p-4 bg-gray-50 rounded-xl">
          <h3 className="text-sm font-medium text-gray-800 mb-2">Consejos de seguridad:</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Usa al menos 8 caracteres</li>
            <li>• Incluye mayúsculas, minúsculas y números</li>
            <li>• Evita información personal</li>
            <li>• No reutilices contraseñas de otras cuentas</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
