'use client'

import React, { useState } from 'react'
import { User, Mail, Calendar, Shield, Edit2, Save, X, AlertCircle, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useAuth } from './AuthProvider'
import { useAuthForm, formatAuthError } from '@/hooks/auth/useAuth'

interface UserProfileProps {
  onUpdate?: () => void
}

interface ProfileData {
  firstName: string
  lastName: string
  email: string
}

export function UserProfile({ onUpdate }: UserProfileProps) {
  const { user, signOut } = useAuth()
  const { formState, setLoading, setError, setSuccess, clearState } = useAuthForm()
  
  const [isEditing, setIsEditing] = useState(false)
  const [profileData, setProfileData] = useState<ProfileData>({
    firstName: user?.user_metadata?.first_name || '',
    lastName: user?.user_metadata?.last_name || '',
    email: user?.email || ''
  })

  const handleInputChange = (field: keyof ProfileData) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setProfileData(prev => ({
      ...prev,
      [field]: e.target.value
    }))
  }

  const handleSave = async () => {
    clearState()
    
    try {
      setLoading(true)
      
      // Here you would typically update the user profile via Supabase
      // For now, we'll just simulate the update
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setSuccess(true, 'Perfil actualizado exitosamente')
      setIsEditing(false)
      
      if (onUpdate) {
        onUpdate()
      }
    } catch (error: any) {
      const friendlyError = formatAuthError(error.message)
      setError(friendlyError)
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setProfileData({
      firstName: user?.user_metadata?.first_name || '',
      lastName: user?.user_metadata?.last_name || '',
      email: user?.email || ''
    })
    setIsEditing(false)
    clearState()
  }

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
  }

  if (!user) {
    return (
      <div className="text-center p-8">
        <p className="text-gray-600">No hay información de usuario disponible.</p>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-primary/80 px-8 py-6">
          <div className="flex items-center space-x-4">
            <div className="h-16 w-16 bg-white/20 rounded-full flex items-center justify-center">
              <span className="text-2xl font-bold text-white">
                {getInitials(profileData.firstName, profileData.lastName)}
              </span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">
                {profileData.firstName} {profileData.lastName}
              </h1>
              <p className="text-white/80">{profileData.email}</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          {/* Success/Error Messages */}
          {formState.success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-start space-x-3">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-green-800">Éxito</p>
                <p className="text-sm text-green-700 mt-1">{formState.message}</p>
              </div>
            </div>
          )}

          {formState.errors.general && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start space-x-3">
              <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-red-800">Error</p>
                <p className="text-sm text-red-700 mt-1">{formState.errors.general}</p>
              </div>
            </div>
          )}

          {/* Profile Information */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Información Personal</h2>
              {!isEditing && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                  icon={<Edit2 className="h-4 w-4" />}
                >
                  Editar
                </Button>
              )}
            </div>

            {isEditing ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Nombre"
                    value={profileData.firstName}
                    onChange={handleInputChange('firstName')}
                    disabled={formState.isLoading}
                    icon={<User className="h-5 w-5" />}
                  />
                  <Input
                    label="Apellido"
                    value={profileData.lastName}
                    onChange={handleInputChange('lastName')}
                    disabled={formState.isLoading}
                    icon={<User className="h-5 w-5" />}
                  />
                </div>
                
                <Input
                  label="Email"
                  type="email"
                  value={profileData.email}
                  onChange={handleInputChange('email')}
                  disabled={true} // Email usually can't be changed
                  icon={<Mail className="h-5 w-5" />}
                  helperText="El email no se puede modificar"
                />

                <div className="flex space-x-3">
                  <Button
                    variant="primary"
                    onClick={handleSave}
                    loading={formState.isLoading}
                    disabled={formState.isLoading}
                    icon={<Save className="h-4 w-4" />}
                  >
                    Guardar Cambios
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleCancel}
                    disabled={formState.isLoading}
                    icon={<X className="h-4 w-4" />}
                  >
                    Cancelar
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center space-x-3">
                    <User className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">Nombre completo</p>
                      <p className="text-gray-900">{profileData.firstName} {profileData.lastName}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Mail className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">Email</p>
                      <p className="text-gray-900">{profileData.email}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">Miembro desde</p>
                      <p className="text-gray-900">{formatDate(user.created_at)}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Shield className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">Estado de la cuenta</p>
                      <p className="text-green-600 font-medium">Verificada</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Account Actions */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Acciones de Cuenta</h3>
            <div className="space-y-3">
              <Button
                variant="outline"
                onClick={() => window.location.href = '/auth/change-password'}
                className="w-full justify-start"
              >
                Cambiar Contraseña
              </Button>
              <Button
                variant="destructive"
                onClick={handleSignOut}
                className="w-full justify-start"
              >
                Cerrar Sesión
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
