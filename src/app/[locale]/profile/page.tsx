import { Metadata } from 'next'
import { UserProfile } from '@/components/auth/UserProfile'
import { AuthGuard } from '@/components/auth/AuthGuard'

export const metadata: Metadata = {
  title: 'Mi Perfil | Ice Cost Calculator',
  description: 'Gestiona tu perfil y configuraciones de cuenta',
}

export default function ProfilePage() {
  return (
    <AuthGuard requireAuth={true}>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Mi Perfil</h1>
            <p className="text-gray-600 mt-2">Gestiona tu información personal y configuraciones de cuenta</p>
          </div>
          <UserProfile />
        </div>
      </div>
    </AuthGuard>
  )
}
