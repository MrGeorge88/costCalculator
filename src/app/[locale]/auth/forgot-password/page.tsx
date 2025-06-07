import { Metadata } from 'next'
import { ForgotPasswordForm } from '@/components/auth/ForgotPasswordForm'
import { AuthGuard } from '@/components/auth/AuthGuard'

export const metadata: Metadata = {
  title: 'Recuperar Contraseña | Ice Cost Calculator',
  description: 'Recupera el acceso a tu cuenta de la calculadora de costos de helados',
}

export default function ForgotPasswordPage() {
  return (
    <AuthGuard requireAuth={false}>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <ForgotPasswordForm />
        </div>
      </div>
    </AuthGuard>
  )
}
