import { Metadata } from 'next'
import { LoginForm } from '@/components/auth/LoginForm'
import { AuthGuard } from '@/components/auth/AuthGuard'

export const metadata: Metadata = {
  title: 'Iniciar Sesión | Ice Cost Calculator',
  description: 'Accede a tu cuenta de la calculadora de costos de helados',
}

export default function LoginPage() {
  return (
    <AuthGuard requireAuth={false}>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <LoginForm />
        </div>
      </div>
    </AuthGuard>
  )
}
