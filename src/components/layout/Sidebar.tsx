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
  Settings,
  Search,
  Home
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSidebar } from '@/contexts/SidebarContext';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';
import { LanguageSelector } from './LanguageSelector';

const navigation = [
  { name: 'dashboard', href: '/', icon: Home },
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

  // Debug: Log sidebar state
  console.log('Sidebar render - isOpen:', isOpen);

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
      {/* Mobile Overlay - Solo en pantallas muy pequeñas */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
            onClick={close}
          />
        )}
      </AnimatePresence>

      {/* Sidebar - POSICIONAMIENTO FIJO COMO PREFIERES */}
      <motion.aside
        initial={false}
        animate={{
          width: isOpen ? 240 : 72
        }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className={cn(
          // Base: flex column con posicionamiento fijo
          "flex flex-col",
          // Posicionamiento fijo en desktop y mobile
          "fixed inset-y-0 left-0 z-50",
          // Estilos visuales
          "bg-white shadow-lg border-r border-gray-200 overflow-hidden",
          // Debug: hacer más visible
          "border-4 border-red-500"
        )}
        style={{
          width: isOpen ? '240px' : '72px',
          display: 'flex' // Forzar que siempre sea visible
        }}
      >
        {/* Search Section - Only when expanded */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="p-4 border-b border-gray-100"
            >
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Buscar..."
                  className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg text-sm leading-5 bg-gray-50/50 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white transition-all duration-200"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation Section */}
        <div className="flex-1 p-4">
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

        {/* Language Selector Section - Bottom */}
        <div className="p-4 border-t border-gray-100">
          <AnimatePresence>
            {isOpen ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="space-y-3"
              >
                <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Idioma
                </div>
                <LanguageSelector />
              </motion.div>
            ) : (
              <div className="flex justify-center">
                <LanguageSelector />
              </div>
            )}
          </AnimatePresence>
        </div>
      </motion.aside>
    </>
  );
}
