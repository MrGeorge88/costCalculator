'use client';

import { useTranslations } from 'next-intl';
import { Edit, Trash2, AlertTriangle } from 'lucide-react';

// Mock data - en producción esto vendría de Supabase
const mockIngredients = [
  {
    id: '1',
    nombre: 'Leche Entera',
    categoria: 'dairy',
    unidad_medida: 'litros',
    precio_por_unidad: 1.50,
    stock_actual: 25,
    stock_minimo: 10,
    proveedor: 'Lácteos del Valle'
  },
  {
    id: '2',
    nombre: 'Azúcar Refinada',
    categoria: 'sweeteners',
    unidad_medida: 'kg',
    precio_por_unidad: 0.80,
    stock_actual: 5,
    stock_minimo: 15,
    proveedor: 'Azucarera Nacional'
  },
  {
    id: '3',
    nombre: 'Vainilla Natural',
    categoria: 'flavorings',
    unidad_medida: 'ml',
    precio_por_unidad: 0.25,
    stock_actual: 200,
    stock_minimo: 50,
    proveedor: 'Esencias Premium'
  }
];

export function InventoryList() {
  const t = useTranslations('inventory');

  const getStockStatus = (current: number, minimum: number) => {
    if (current === 0) return 'out-of-stock';
    if (current <= minimum) return 'low-stock';
    return 'in-stock';
  };

  const getStockColor = (status: string) => {
    switch (status) {
      case 'out-of-stock':
        return 'bg-red-100 text-red-800';
      case 'low-stock':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-green-100 text-green-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('ingredient')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('category')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Stock
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('unitPrice')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('supplier')}
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
            {mockIngredients.map((ingredient) => {
              const stockStatus = getStockStatus(ingredient.stock_actual, ingredient.stock_minimo);
              
              return (
                <tr key={ingredient.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {ingredient.nombre}
                      </div>
                      <div className="text-sm text-gray-500">
                        {ingredient.unidad_medida}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900">
                      {t(`categories.${ingredient.categoria}`)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-900">
                        {ingredient.stock_actual}
                      </span>
                      {stockStatus === 'low-stock' && (
                        <AlertTriangle className="w-4 h-4 text-yellow-500" />
                      )}
                      {stockStatus === 'out-of-stock' && (
                        <AlertTriangle className="w-4 h-4 text-red-500" />
                      )}
                    </div>
                    <div className="text-xs text-gray-500">
                      Mín: {ingredient.stock_minimo}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${ingredient.precio_por_unidad.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {ingredient.proveedor}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStockColor(stockStatus)}`}>
                      {stockStatus === 'out-of-stock' && t('outOfStock')}
                      {stockStatus === 'low-stock' && t('lowStock')}
                      {stockStatus === 'in-stock' && 'En Stock'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button className="text-blue-600 hover:text-blue-900 p-1">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="text-red-600 hover:text-red-900 p-1">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
