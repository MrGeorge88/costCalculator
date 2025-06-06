'use client';

import { useTranslations } from 'next-intl';
import { Edit, Trash2, Clock, DollarSign } from 'lucide-react';
import Link from 'next/link';

// Mock data - en producción esto vendría de Supabase
const mockRecipes = [
  {
    id: '1',
    nombre: 'Helado de Vainilla Clásico',
    descripcion: 'Helado cremoso de vainilla tradicional',
    categoria: 'ice_cream',
    tiempo_preparacion: 45,
    rendimiento: 1.0,
    unidad_rendimiento: 'litros',
    costo_total: 4.50,
    precio_sugerido: 8.00,
    margen_ganancia: 77.8,
    activa: true
  },
  {
    id: '2',
    nombre: 'Helado de Chocolate',
    descripcion: 'Helado intenso de chocolate negro',
    categoria: 'ice_cream',
    tiempo_preparacion: 50,
    rendimiento: 1.0,
    unidad_rendimiento: 'litros',
    costo_total: 5.20,
    precio_sugerido: 9.50,
    margen_ganancia: 82.7,
    activa: true
  },
  {
    id: '3',
    nombre: 'Sorbete de Fresa',
    descripcion: 'Sorbete refrescante de fresas naturales',
    categoria: 'sorbet',
    tiempo_preparacion: 30,
    rendimiento: 1.0,
    unidad_rendimiento: 'litros',
    costo_total: 3.80,
    precio_sugerido: 7.00,
    margen_ganancia: 84.3,
    activa: false
  }
];

export function RecipeList() {
  const t = useTranslations('recipes');

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const formatTime = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes} min`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}min` : `${hours}h`;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('recipe')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('category')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('preparationTime')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('yield')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('totalCost')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('suggestedPrice')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Margen
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {mockRecipes.map((recipe) => (
              <tr key={recipe.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {recipe.nombre}
                    </div>
                    <div className="text-sm text-gray-500">
                      {recipe.descripcion}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-gray-900">
                    {t(`categories.${recipe.categoria}`)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-1 text-sm text-gray-900">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span>{formatTime(recipe.tiempo_preparacion)}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {recipe.rendimiento} {recipe.unidad_rendimiento}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-1 text-sm font-medium text-gray-900">
                    <DollarSign className="w-4 h-4 text-gray-400" />
                    <span>{formatCurrency(recipe.costo_total)}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatCurrency(recipe.precio_sugerido)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                    {recipe.margen_ganancia.toFixed(1)}%
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    recipe.activa 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {recipe.activa ? 'Activa' : 'Inactiva'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end space-x-2">
                    <Link
                      href={`/recipes/${recipe.id}`}
                      className="text-blue-600 hover:text-blue-900 p-1"
                    >
                      <Edit className="w-4 h-4" />
                    </Link>
                    <button className="text-red-600 hover:text-red-900 p-1">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
