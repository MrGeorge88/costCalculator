'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Mail, AlertCircle, CheckCircle, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useAuth } from './AuthProvider'
import { useAuthForm, formatAuthError } from '@/hooks/auth/useAuth'
import { ForgotPasswordData } from '@/types/auth'

interface ForgotPasswordFormProps {
  onSuccess?: () => void
}

export function ForgotPasswordForm({ onSuccess }: ForgotPasswordFormProps) {
  const { resetPassword } = useAuth()
  const { formState, validateForgotPasswordForm, setLoading, setErrors, setError, setSuccess, clearState } = useAuthForm()
  
  const [data, setData] = useState<ForgotPasswordData>({
    email: ''
  })
  const [emailSent, setEmailSent] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData({ email: e.target.value })
    
    // Clear errors when user starts typing
    if (formState.errors.email) {
      setErrors({ ...formState.errors, email: undefined })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    clearState()

    // Validate form
    const errors = validateForgotPasswordForm(data)
    if (Object.keys(errors).length > 0) {
      setErrors(errors)
      return
    }

    try {
      setLoading(true)
      await resetPassword(data.email)
      
      setEmailSent(true)
      setSuccess(true, 'Email de recuperación enviado exitosamente.')
      
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

  if (emailSent) {
    return (
      <div className="w-full max-w-md mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Email Enviado
            </h1>
            <p className="text-gray-600 mb-6">
              Hemos enviado un enlace de recuperación a <strong>{data.email}</strong>. 
              Por favor revisa tu bandeja de entrada y sigue las instrucciones para restablecer tu contraseña.
            </p>
            <div className="space-y-4">
              <Button
                variant="primary"
                size="lg"
                className="w-full"
                onClick={() => window.location.href = '/auth/login'}
              >
                Volver al Login
              </Button>
              <Button
                variant="outline"
                size="md"
                className="w-full"
                onClick={() => {
                  setEmailSent(false)
                  setData({ email: '' })
                  clearState()
                }}
              >
                Enviar a otro email
              </Button>
            </div>
            
            {/* Help Text */}
            <div className="mt-6 p-4 bg-gray-50 rounded-xl">
              <p className="text-sm text-gray-600">
                <strong>¿No ves el email?</strong><br />
                Revisa tu carpeta de spam o correo no deseado. El email puede tardar unos minutos en llegar.
              </p>
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
            Recuperar Contraseña
          </h1>
          <p className="text-gray-600">
            Ingresa tu email y te enviaremos un enlace para restablecer tu contraseña
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
          {/* Email Field */}
          <Input
            type="email"
            label="Email"
            placeholder="tu@email.com"
            value={data.email}
            onChange={handleInputChange}
            error={formState.errors.email}
            icon={<Mail className="h-5 w-5" />}
            required
            autoComplete="email"
            disabled={formState.isLoading}
            helperText="Ingresa el email asociado a tu cuenta"
          />

          {/* Submit Button */}
          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full"
            loading={formState.isLoading}
            disabled={formState.isLoading}
          >
            {formState.isLoading ? 'Enviando...' : 'Enviar Enlace de Recuperación'}
          </Button>
        </form>

        {/* Back to Login */}
        <div className="mt-8">
          <Link 
            href="/auth/login"
            className="inline-flex items-center justify-center w-full text-gray-600 hover:text-gray-800 font-medium transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver al Login
          </Link>
        </div>

        {/* Help Section */}
        <div className="mt-6 p-4 bg-gray-50 rounded-xl">
          <h3 className="text-sm font-medium text-gray-800 mb-2">¿Necesitas ayuda?</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Asegúrate de usar el email correcto</li>
            <li>• Revisa tu carpeta de spam</li>
            <li>• El enlace expira en 1 hora</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
