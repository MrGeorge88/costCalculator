'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Edit, Trash2, AlertTriangle, Plus } from 'lucide-react';
import Link from 'next/link';
import { useIngredients } from '@/hooks/useIngredients';
import { Button } from '@/components/ui/Button';

export function InventoryList() {
  const t = useTranslations('inventory');
  const {
    ingredients,
    loading,
    error,
    deleteIngredient,
    loadIngredients
  } = useIngredients();

  const [deletingId, setDeletingId] = useState<string | null>(null);

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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const handleDelete = async (id: string, nombre: string) => {
    if (confirm(`¿Estás seguro de que quieres eliminar "${nombre}"?`)) {
      try {
        setDeletingId(id);
        await deleteIngredient(id);
      } catch (error) {
        console.error('Error deleting ingredient:', error);
      } finally {
        setDeletingId(null);
      }
    }
  };

  if (loading && ingredients.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-500">Cargando ingredientes...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={loadIngredients}>
            Reintentar
          </Button>
        </div>
      </div>
    );
  }

  if (ingredients.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div className="text-center">
          <p className="text-gray-500 mb-4">No hay ingredientes registrados</p>
          <Link href="/inventory/new">
            <Button className="flex items-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>Agregar Primer Ingrediente</span>
            </Button>
          </Link>
        </div>
      </div>
    );
  }

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
            {ingredients.map((ingredient) => {
              const stockStatus = getStockStatus(ingredient.stock_actual, ingredient.stock_minimo);
              const isDeleting = deletingId === ingredient.id;

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
                    {formatCurrency(ingredient.precio_por_unidad)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {ingredient.proveedor || '-'}
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
                      <Link
                        href={`/inventory/${ingredient.id}/edit`}
                        className="text-blue-600 hover:text-blue-900 p-1"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(ingredient.id, ingredient.nombre)}
                        disabled={isDeleting}
                        className="text-red-600 hover:text-red-900 p-1 disabled:opacity-50"
                      >
                        {isDeleting ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
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
