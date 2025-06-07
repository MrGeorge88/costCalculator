'use client';

import { useTranslations, useLocale } from 'next-intl';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { 
  LayoutDashboard, 
  Package, 
  ChefHat, 
  Presentation, 
  Calculator, 
  BarChart3, 
  Settings 
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'dashboard', href: '/', icon: LayoutDashboard },
  { name: 'inventory', href: '/inventory', icon: Package },
  { name: 'recipes', href: '/recipes', icon: ChefHat },
  { name: 'presentations', href: '/presentations', icon: Presentation },
  { name: 'simulator', href: '/simulator', icon: Calculator },
  { name: 'reports', href: '/reports', icon: BarChart3 },
  { name: 'settings', href: '/settings', icon: Settings },
];

export function Sidebar() {
  const t = useTranslations('navigation');
  const locale = useLocale();
  const pathname = usePathname();

  return (
    <div
      className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-white shadow-sm border-r border-gray-200 sidebar"
      style={{
        position: 'fixed',
        left: '0',
        top: '4rem',
        height: 'calc(100vh - 4rem)',
        width: '16rem',
        backgroundColor: 'white',
        borderRight: '1px solid #e5e7eb',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
      }}
    >
      <div className="p-6" style={{ padding: '1.5rem' }}>
        <nav className="space-y-2" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {navigation.map((item) => {
            const Icon = item.icon;
            const localizedHref = `/${locale}${item.href}`;
            const isActive = pathname === localizedHref || pathname.startsWith(localizedHref + '/');

            return (
              <Link
                key={item.name}
                href={localizedHref}
                className={cn(
                  'flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors nav-link',
                  isActive
                    ? 'bg-blue-50 text-blue-700 border border-blue-200 active'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                )}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.5rem 0.75rem',
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  textDecoration: 'none',
                  transition: 'all 0.2s',
                  backgroundColor: isActive ? '#eff6ff' : 'transparent',
                  color: isActive ? '#2563eb' : '#6b7280',
                  border: isActive ? '1px solid #bfdbfe' : '1px solid transparent'
                }}
              >
                <Icon style={{ width: '1.25rem', height: '1.25rem' }} />
                <span>{t(item.name)}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
