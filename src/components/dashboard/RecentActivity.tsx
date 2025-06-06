'use client';

import { useTranslations } from 'next-intl';
import { Clock, Package, ChefHat, Edit } from 'lucide-react';

export function RecentActivity() {
  const t = useTranslations('dashboard');

  const activities = [
    {
      id: 1,
      type: 'ingredient',
      action: 'Agregado',
      item: 'Leche Entera',
      time: 'Hace 2 horas',
      icon: Package
    },
    {
      id: 2,
      type: 'recipe',
      action: 'Creada',
      item: 'Helado de Vainilla Premium',
      time: 'Hace 4 horas',
      icon: ChefHat
    },
    {
      id: 3,
      type: 'ingredient',
      action: 'Actualizado',
      item: 'Azúcar Refinada',
      time: 'Hace 6 horas',
      icon: Edit
    },
    {
      id: 4,
      type: 'recipe',
      action: 'Modificada',
      item: 'Sorbete de Limón',
      time: 'Hace 1 día',
      icon: Edit
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('recentActivity')}</h3>
      <div className="space-y-4">
        {activities.map((activity) => {
          const Icon = activity.icon;
          return (
            <div key={activity.id} className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                <Icon className="w-4 h-4 text-gray-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-900">
                  <span className="font-medium">{activity.action}</span> {activity.item}
                </p>
                <div className="flex items-center space-x-1 text-xs text-gray-500">
                  <Clock className="w-3 h-3" />
                  <span>{activity.time}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
