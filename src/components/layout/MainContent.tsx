'use client';

import { ReactNode } from 'react';
import { useSidebar } from '@/contexts/SidebarContext';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface MainContentProps {
  children: ReactNode;
}

export function MainContent({ children }: MainContentProps) {
  const { isOpen } = useSidebar();

  return (
    <motion.main
      animate={{
        marginLeft: isOpen ? '240px' : '72px'
      }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="flex-1 pt-16 min-h-screen bg-slate-50"
      style={{ marginLeft: isOpen ? '240px' : '72px' }}
    >
      <div className="container mx-auto px-6 py-8 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {children}
        </motion.div>
      </div>
    </motion.main>
  );
}
