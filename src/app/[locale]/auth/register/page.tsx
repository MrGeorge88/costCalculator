import { Metadata } from 'next'
import { RegisterForm } from '@/components/auth/RegisterForm'
import { AuthGuard } from '@/components/auth/AuthGuard'

export const metadata: Metadata = {
  title: 'Crear Cuenta | Ice Cost Calculator',
  description: 'Crea tu cuenta en la calculadora de costos de helados',
}

export default function RegisterPage() {
  return (
    <AuthGuard requireAuth={false}>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <RegisterForm />
        </div>
      </div>
    </AuthGuard>
  )
}
