'use client';

import { ReactNode } from 'react';
import { useSidebar } from '@/contexts/SidebarContext';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface MainContentProps {
  children: ReactNode;
}

export function MainContent({ children }: MainContentProps) {
  return (
    <motion.main
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex-1 overflow-auto bg-slate-50"
    >
      <div className="container mx-auto px-6 py-8 max-w-7xl">
        {children}
      </div>
    </motion.main>
  );
}
