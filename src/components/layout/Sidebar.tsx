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
    <div className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-white shadow-sm border-r border-gray-200">
      <div className="p-6">
        <nav className="space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            const localizedHref = `/${locale}${item.href}`;
            const isActive = pathname === localizedHref || pathname.startsWith(localizedHref + '/');

            return (
              <Link
                key={item.name}
                href={localizedHref}
                className={cn(
                  'flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                )}
              >
                <Icon className="w-5 h-5" />
                <span>{t(item.name)}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
