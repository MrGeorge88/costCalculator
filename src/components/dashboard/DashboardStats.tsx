'use client';

import { useTranslations } from 'next-intl';
import { Package, ChefHat, AlertTriangle, TrendingUp } from 'lucide-react';
import { useRecipes } from '@/hooks/useRecipes';
import { useIngredients } from '@/hooks/useIngredients';

export function DashboardStats() {
  const t = useTranslations('dashboard');
  const { recipes, loading: recipesLoading } = useRecipes();
  const { ingredients, loading: ingredientsLoading } = useIngredients();

  const totalRecipes = recipes.length;
  const totalIngredients = ingredients.length;
  const lowStockItems = ingredients.filter(ingredient =>
    ingredient.stock_actual !== null &&
    ingredient.stock_minimo !== null &&
    ingredient.stock_actual <= ingredient.stock_minimo
  ).length;

  const averageMargin = recipes.length > 0
    ? recipes.reduce((acc, recipe) => acc + (recipe.margen_ganancia || 0), 0) / recipes.length
    : 0;

  const stats = [
    {
      name: t('totalRecipes'),
      value: recipesLoading ? '...' : totalRecipes.toString(),
      icon: ChefHat,
      color: 'bg-blue-500',
      change: '',
      changeType: 'neutral'
    },
    {
      name: t('totalIngredients'),
      value: ingredientsLoading ? '...' : totalIngredients.toString(),
      icon: Package,
      color: 'bg-green-500',
      change: '',
      changeType: 'neutral'
    },
    {
      name: t('lowStockItems'),
      value: ingredientsLoading ? '...' : lowStockItems.toString(),
      icon: AlertTriangle,
      color: lowStockItems > 0 ? 'bg-red-500' : 'bg-yellow-500',
      change: '',
      changeType: lowStockItems > 0 ? 'negative' : 'neutral'
    },
    {
      name: 'Margen Promedio',
      value: recipesLoading ? '...' : `${averageMargin.toFixed(1)}%`,
      icon: TrendingUp,
      color: 'bg-purple-500',
      change: '',
      changeType: 'neutral'
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
                {stat.change && (
                  <div className="flex items-center mt-2">
                    <span className={`text-sm font-medium ${
                      stat.changeType === 'positive' ? 'text-green-600' :
                      stat.changeType === 'negative' ? 'text-red-600' : 'text-gray-500'
                    }`}>
                      {stat.change}
                    </span>
                    <span className="text-sm text-gray-500 ml-1">vs mes anterior</span>
                  </div>
                )}
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
