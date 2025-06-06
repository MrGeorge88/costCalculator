'use client';

import { useTranslations } from 'next-intl';
import { Package, ChefHat, AlertTriangle, TrendingUp } from 'lucide-react';

export function DashboardStats() {
  const t = useTranslations('dashboard');

  const stats = [
    {
      name: t('totalRecipes'),
      value: '12',
      icon: ChefHat,
      color: 'bg-blue-500',
      change: '+2',
      changeType: 'positive'
    },
    {
      name: t('totalIngredients'),
      value: '48',
      icon: Package,
      color: 'bg-green-500',
      change: '+5',
      changeType: 'positive'
    },
    {
      name: t('lowStockItems'),
      value: '3',
      icon: AlertTriangle,
      color: 'bg-yellow-500',
      change: '-1',
      changeType: 'negative'
    },
    {
      name: 'Ganancia Promedio',
      value: '35%',
      icon: TrendingUp,
      color: 'bg-purple-500',
      change: '+2%',
      changeType: 'positive'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div key={stat.name} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                <div className="flex items-center mt-2">
                  <span className={`text-sm font-medium ${
                    stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stat.change}
                  </span>
                  <span className="text-sm text-gray-500 ml-1">vs mes anterior</span>
                </div>
              </div>
              <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
