'use client';

import { ReactNode } from 'react';
import { useSidebar } from '@/contexts/SidebarContext';
import { cn } from '@/lib/utils';

interface MainContentProps {
  children: ReactNode;
}

export function MainContent({ children }: MainContentProps) {
  const { isOpen } = useSidebar();

  return (
    <main
      className={cn(
        "flex-1 p-6 main-content transition-all duration-300",
        isOpen ? "ml-64" : "ml-0"
      )}
      style={{
        marginLeft: isOpen ? '16rem' : '0',
        marginTop: '4rem',
        padding: '1.5rem',
        minHeight: 'calc(100vh - 4rem)',
        backgroundColor: '#f8fafc',
        transition: 'margin-left 0.3s ease-in-out'
      }}
    >
      {children}
    </main>
  );
}
