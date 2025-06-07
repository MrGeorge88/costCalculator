'use client';

import { useTranslations } from 'next-intl';
import { LanguageSelector } from './LanguageSelector';
import { UserMenu } from './UserMenu';
import { Bell, Search, Menu, X } from 'lucide-react';
import { useSidebar } from '@/contexts/SidebarContext';
import { motion } from 'framer-motion';

export function Header() {
  const t = useTranslations('common');
  const { isOpen, toggle } = useSidebar();

  return (
    <motion.header
      initial={{ y: -64 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-200 fixed w-full top-0 z-50"
    >
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left side - Logo and Toggle */}
          <div className="flex items-center space-x-4">
            <button
              onClick={toggle}
              className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all duration-200"
              aria-label="Toggle sidebar"
            >
              <motion.div
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                {isOpen ? <X size={20} /> : <Menu size={20} />}
              </motion.div>
            </button>
            
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-blue-700 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-sm">🍦</span>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-gray-900">Ice Cost Calculator</h1>
                <p className="text-xs text-gray-500">Professional Edition</p>
              </div>
            </div>
          </div>

          {/* Center - Search Bar */}
          <div className="flex-1 max-w-2xl mx-8 hidden md:block">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder={t('search') || 'Buscar recetas, ingredientes...'}
                className="block w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl leading-5 bg-gray-50/50 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white transition-all duration-200"
              />
            </div>
          </div>

          {/* Right side - Actions */}
          <div className="flex items-center space-x-3">
            {/* Notifications */}
            <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all duration-200">
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 block h-3 w-3 rounded-full bg-red-400 ring-2 ring-white"></span>
            </button>
            
            {/* Language Selector */}
            <LanguageSelector />
            
            {/* User Menu */}
            <UserMenu />
          </div>
        </div>
      </div>
    </motion.header>
  );
}

// Keep backward compatibility
export const Navbar = Header;
