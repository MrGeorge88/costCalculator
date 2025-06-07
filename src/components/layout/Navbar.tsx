'use client';

import { useTranslations } from 'next-intl';
import { LanguageSelector } from './LanguageSelector';
import { UserMenu } from './UserMenu';
import { Bell, Search } from 'lucide-react';

export function Navbar() {
  const t = useTranslations('common');

  return (
    <nav
      className="bg-white shadow-sm border-b border-gray-200 fixed w-full top-0 z-50 header"
      style={{
        backgroundColor: 'white',
        borderBottom: '1px solid #e5e7eb',
        position: 'fixed',
        width: '100%',
        top: '0',
        zIndex: '50',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
      }}
    >
      <div className="px-6 py-4" style={{ padding: '1rem 1.5rem' }}>
        <div className="flex items-center justify-between" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div className="flex items-center space-x-4" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div className="flex items-center space-x-2" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div
                className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center"
                style={{
                  width: '2rem',
                  height: '2rem',
                  backgroundColor: '#2563eb',
                  borderRadius: '0.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <span className="text-white font-bold text-sm" style={{ color: 'white', fontWeight: 'bold', fontSize: '0.875rem' }}>🍦</span>
              </div>
              <h1 className="text-xl font-bold text-gray-900" style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1f2937' }}>
                Ice Cost Calculator
              </h1>
            </div>
          </div>

          <div className="flex items-center space-x-4" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {/* Search */}
            <div className="relative" style={{ position: 'relative' }}>
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4"
                style={{
                  position: 'absolute',
                  left: '0.75rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#9ca3af',
                  width: '1rem',
                  height: '1rem'
                }}
              />
              <input
                type="text"
                placeholder={t('search')}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent form-input"
                style={{
                  paddingLeft: '2.5rem',
                  paddingRight: '1rem',
                  paddingTop: '0.5rem',
                  paddingBottom: '0.5rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem'
                }}
              />
            </div>

            {/* Notifications */}
            <button
              className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors"
              style={{
                position: 'relative',
                padding: '0.5rem',
                color: '#9ca3af',
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer',
                transition: 'color 0.2s'
              }}
            >
              <Bell style={{ width: '1.25rem', height: '1.25rem' }} />
              <span
                className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"
                style={{
                  position: 'absolute',
                  top: '0',
                  right: '0',
                  width: '0.5rem',
                  height: '0.5rem',
                  backgroundColor: '#ef4444',
                  borderRadius: '50%'
                }}
              ></span>
            </button>

            {/* Language Selector */}
            <LanguageSelector />

            {/* User Menu */}
            <UserMenu />
          </div>
        </div>
      </div>
    </nav>
  );
}
