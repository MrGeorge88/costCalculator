import { User, Session } from '@supabase/supabase-js'

export interface AuthUser extends User {
  // Extend with custom user properties if needed
}

export interface AuthSession extends Session {
  // Extend with custom session properties if needed
}

export interface AuthState {
  user: AuthUser | null
  session: AuthSession | null
  loading: boolean
  error: string | null
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterCredentials {
  email: string
  password: string
  confirmPassword: string
  firstName?: string
  lastName?: string
}

export interface ForgotPasswordData {
  email: string
}

export interface ResetPasswordData {
  password: string
  confirmPassword: string
}

export interface AuthContextType extends AuthState {
  signIn: (credentials: LoginCredentials) => Promise<void>
  signUp: (credentials: RegisterCredentials) => Promise<void>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<void>
  updatePassword: (password: string) => Promise<void>
  refreshSession: () => Promise<void>
}

export interface AuthFormErrors {
  email?: string
  password?: string
  confirmPassword?: string
  firstName?: string
  lastName?: string
  general?: string
}

export interface AuthFormState {
  isLoading: boolean
  errors: AuthFormErrors
  success: boolean
  message?: string
}
