import { Metadata } from 'next'
import { ResetPasswordForm } from '@/components/auth/ResetPasswordForm'
import { AuthGuard } from '@/components/auth/AuthGuard'

export const metadata: Metadata = {
  title: 'Restablecer Contraseña | Ice Cost Calculator',
  description: 'Establece una nueva contraseña para tu cuenta',
}

export default function ResetPasswordPage() {
  return (
    <AuthGuard requireAuth={false}>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <ResetPasswordForm />
        </div>
      </div>
    </AuthGuard>
  )
}
