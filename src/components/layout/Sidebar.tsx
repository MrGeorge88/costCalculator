'use client';

import { useTranslations, useLocale } from 'next-intl';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  Package,
  ChefHat,
  Box,
  Calculator,
  BarChart3,
  Settings
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSidebar } from '@/contexts/SidebarContext';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';

const navigation = [
  { name: 'inventory', href: '/inventory', icon: Package },
  { name: 'recipes', href: '/recipes', icon: ChefHat },
  { name: 'presentations', href: '/presentations', icon: Box },
  { name: 'simulator', href: '/simulator', icon: Calculator },
  { name: 'reports', href: '/reports', icon: BarChart3 },
  { name: 'settings', href: '/settings', icon: Settings },
];

export function Sidebar() {
  const t = useTranslations('navigation');
  const locale = useLocale();
  const pathname = usePathname();
  const { isOpen, close } = useSidebar();

  // Close sidebar on mobile when clicking outside
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 'b') {
        e.preventDefault();
        close();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [close]);

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 lg:hidden"
            onClick={close}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{
          width: isOpen ? 240 : 72
        }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className={cn(
          "fixed left-0 top-16 h-[calc(100vh-4rem)] bg-white shadow-lg border-r border-gray-200 z-40 overflow-hidden"
        )}
        style={{ width: isOpen ? '240px' : '72px' }}
      >
        <div className="p-4">
          <nav className="space-y-2">
            {navigation.map((item, index) => {
              const Icon = item.icon;
              const localizedHref = `/${locale}${item.href}`;
              const isActive = pathname === localizedHref || pathname.startsWith(localizedHref + '/');

              return (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    href={localizedHref}
                    className={cn(
                      'flex items-center px-3 py-3 rounded-xl text-sm font-medium transition-all duration-200 group relative',
                      isActive
                        ? 'bg-primary/10 text-primary border border-primary/20'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    )}
                    title={!isOpen ? t(item.name) : undefined}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    <AnimatePresence>
                      {isOpen && (
                        <motion.span
                          initial={{ opacity: 0, width: 0 }}
                          animate={{ opacity: 1, width: 'auto' }}
                          exit={{ opacity: 0, width: 0 }}
                          transition={{ duration: 0.2 }}
                          className="ml-3 whitespace-nowrap overflow-hidden"
                        >
                          {t(item.name)}
                        </motion.span>
                      )}
                    </AnimatePresence>

                    {/* Active indicator */}
                    {isActive && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-r-full"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                  </Link>
                </motion.div>
              );
            })}
          </nav>
        </div>
      </motion.aside>
    </>
  );
}
