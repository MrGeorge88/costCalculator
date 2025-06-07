'use client';

import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import { Package, ChefHat, Calculator } from 'lucide-react';

export function QuickActions() {
  const t = useTranslations('dashboard');
  const locale = useLocale();

  const actions = [
    {
      name: 'Agregar Ingrediente',
      href: '/inventory/new',
      icon: Package,
      color: 'bg-blue-500 hover:bg-blue-600'
    },
    {
      name: 'Nueva Receta',
      href: '/recipes/new',
      icon: ChefHat,
      color: 'bg-green-500 hover:bg-green-600'
    },
    {
      name: 'Simular Costos',
      href: '/simulator',
      icon: Calculator,
      color: 'bg-purple-500 hover:bg-purple-600'
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('quickActions')}</h3>
      <div className="space-y-3">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <Link
              key={action.name}
              href={`/${locale}${action.href}`}
              className={`flex items-center space-x-3 p-3 rounded-lg text-white transition-colors ${action.color}`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{action.name}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
