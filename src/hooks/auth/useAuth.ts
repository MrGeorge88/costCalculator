import { useState } from 'react'
import { 
  AuthFormState, 
  AuthFormErrors, 
  LoginCredentials, 
  RegisterCredentials,
  ForgotPasswordData,
  ResetPasswordData
} from '@/types/auth'

// Email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Password validation - at least 8 characters, 1 uppercase, 1 lowercase, 1 number
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/

export function useAuthForm() {
  const [formState, setFormState] = useState<AuthFormState>({
    isLoading: false,
    errors: {},
    success: false,
    message: undefined
  })

  const validateEmail = (email: string): string | undefined => {
    if (!email) {
      return 'El email es requerido'
    }
    if (!EMAIL_REGEX.test(email)) {
      return 'Por favor ingresa un email válido'
    }
    return undefined
  }

  const validatePassword = (password: string): string | undefined => {
    if (!password) {
      return 'La contraseña es requerida'
    }
    if (password.length < 8) {
      return 'La contraseña debe tener al menos 8 caracteres'
    }
    if (!PASSWORD_REGEX.test(password)) {
      return 'La contraseña debe contener al menos: 1 mayúscula, 1 minúscula y 1 número'
    }
    return undefined
  }

  const validateConfirmPassword = (password: string, confirmPassword: string): string | undefined => {
    if (!confirmPassword) {
      return 'Confirma tu contraseña'
    }
    if (password !== confirmPassword) {
      return 'Las contraseñas no coinciden'
    }
    return undefined
  }

  const validateName = (name: string, fieldName: string): string | undefined => {
    if (!name) {
      return `${fieldName} es requerido`
    }
    if (name.length < 2) {
      return `${fieldName} debe tener al menos 2 caracteres`
    }
    if (name.length > 50) {
      return `${fieldName} no puede tener más de 50 caracteres`
    }
    return undefined
  }

  const validateLoginForm = (credentials: LoginCredentials): AuthFormErrors => {
    const errors: AuthFormErrors = {}

    const emailError = validateEmail(credentials.email)
    if (emailError) errors.email = emailError

    const passwordError = validatePassword(credentials.password)
    if (passwordError) errors.password = passwordError

    return errors
  }

  const validateRegisterForm = (credentials: RegisterCredentials): AuthFormErrors => {
    const errors: AuthFormErrors = {}

    const emailError = validateEmail(credentials.email)
    if (emailError) errors.email = emailError

    const passwordError = validatePassword(credentials.password)
    if (passwordError) errors.password = passwordError

    const confirmPasswordError = validateConfirmPassword(credentials.password, credentials.confirmPassword)
    if (confirmPasswordError) errors.confirmPassword = confirmPasswordError

    if (credentials.firstName) {
      const firstNameError = validateName(credentials.firstName, 'Nombre')
      if (firstNameError) errors.firstName = firstNameError
    }

    if (credentials.lastName) {
      const lastNameError = validateName(credentials.lastName, 'Apellido')
      if (lastNameError) errors.lastName = lastNameError
    }

    return errors
  }

  const validateForgotPasswordForm = (data: ForgotPasswordData): AuthFormErrors => {
    const errors: AuthFormErrors = {}

    const emailError = validateEmail(data.email)
    if (emailError) errors.email = emailError

    return errors
  }

  const validateResetPasswordForm = (data: ResetPasswordData): AuthFormErrors => {
    const errors: AuthFormErrors = {}

    const passwordError = validatePassword(data.password)
    if (passwordError) errors.password = passwordError

    const confirmPasswordError = validateConfirmPassword(data.password, data.confirmPassword)
    if (confirmPasswordError) errors.confirmPassword = confirmPasswordError

    return errors
  }

  const setLoading = (loading: boolean) => {
    setFormState(prev => ({ ...prev, isLoading: loading }))
  }

  const setErrors = (errors: AuthFormErrors) => {
    setFormState(prev => ({ ...prev, errors }))
  }

  const setSuccess = (success: boolean, message?: string) => {
    setFormState(prev => ({ ...prev, success, message }))
  }

  const setError = (error: string) => {
    setFormState(prev => ({ 
      ...prev, 
      errors: { general: error },
      success: false 
    }))
  }

  const clearState = () => {
    setFormState({
      isLoading: false,
      errors: {},
      success: false,
      message: undefined
    })
  }

  const hasErrors = Object.keys(formState.errors).length > 0

  return {
    formState,
    validateLoginForm,
    validateRegisterForm,
    validateForgotPasswordForm,
    validateResetPasswordForm,
    setLoading,
    setErrors,
    setSuccess,
    setError,
    clearState,
    hasErrors
  }
}

// Utility functions for password strength
export function getPasswordStrength(password: string): {
  score: number
  label: string
  color: string
} {
  let score = 0
  
  if (password.length >= 8) score++
  if (/[a-z]/.test(password)) score++
  if (/[A-Z]/.test(password)) score++
  if (/\d/.test(password)) score++
  if (/[@$!%*?&]/.test(password)) score++

  const labels = ['Muy débil', 'Débil', 'Regular', 'Fuerte', 'Muy fuerte']
  const colors = ['red', 'orange', 'yellow', 'blue', 'green']

  return {
    score,
    label: labels[score] || 'Muy débil',
    color: colors[score] || 'red'
  }
}

export function formatAuthError(error: string): string {
  // Map common Supabase auth errors to user-friendly messages
  const errorMap: Record<string, string> = {
    'Invalid login credentials': 'Email o contraseña incorrectos',
    'Email not confirmed': 'Por favor confirma tu email antes de iniciar sesión',
    'User already registered': 'Este email ya está registrado',
    'Password should be at least 6 characters': 'La contraseña debe tener al menos 6 caracteres',
    'Unable to validate email address: invalid format': 'Formato de email inválido',
    'Signup is disabled': 'El registro está deshabilitado temporalmente',
    'Email rate limit exceeded': 'Demasiados intentos. Intenta de nuevo más tarde',
    'Invalid email or password': 'Email o contraseña incorrectos'
  }

  return errorMap[error] || error
}
