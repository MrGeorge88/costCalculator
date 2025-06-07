'use client';

import { useTranslations } from 'next-intl';
import { Clock, Package, ChefHat, Edit } from 'lucide-react';

export function RecentActivity() {
  const t = useTranslations('dashboard');

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('recentActivity')}</h3>
      <div className="text-center py-8">
        <Clock className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500 text-sm">
          La actividad reciente aparecerá aquí cuando comiences a usar la aplicación
        </p>
      </div>
    </div>
  );
}
