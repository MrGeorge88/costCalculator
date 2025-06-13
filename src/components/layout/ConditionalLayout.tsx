'use client';

import { ReactNode } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { usePathname } from 'next/navigation';
import { MainLayout } from './MainLayout';

interface ConditionalLayoutProps {
  children: ReactNode;
}

export function ConditionalLayout({ children }: ConditionalLayoutProps) {
  const { user, loading } = useAuth();
  const pathname = usePathname();
  
  // Define auth-related paths that should not show the main layout
  const isAuthPath = pathname.includes('/auth/');
  
  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }
  
  // For auth pages (login, register, etc.) or when user is not authenticated,
  // render children without the main layout (no sidebar/header)
  if (isAuthPath || !user) {
    return <>{children}</>;
  }
  
  // For authenticated users on non-auth pages, use the main layout with sidebar
  return (
    <MainLayout>
      {children}
    </MainLayout>
  );
}
