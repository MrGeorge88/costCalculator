// Auth Components
export { AuthProvider, useAuth } from './AuthProvider'
export { AuthGuard, withAuthGuard, useAuthGuard, ProtectedSection, AuthSwitch } from './AuthGuard'
export { LoginForm } from './LoginForm'
export { RegisterForm } from './RegisterForm'
export { ForgotPasswordForm } from './ForgotPasswordForm'
export { ResetPasswordForm } from './ResetPasswordForm'
export { UserProfile } from './UserProfile'

// Auth Hooks
export { useAuthForm, getPasswordStrength, formatAuthError } from '@/hooks/auth/useAuth'

// Auth Types
export type {
  AuthUser,
  AuthSession,
  AuthState,
  LoginCredentials,
  RegisterCredentials,
  ForgotPasswordData,
  ResetPasswordData,
  AuthContextType,
  AuthFormErrors,
  AuthFormState
} from '@/types/auth'
