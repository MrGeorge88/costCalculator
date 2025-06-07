'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Edit, Trash2, Clock, DollarSign, Plus, Copy, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { useRecipes } from '@/hooks/useRecipes';
import { Button } from '@/components/ui/Button';

export function RecipeList() {
  const t = useTranslations('recipes');
  const {
    recipes,
    loading,
    error,
    deleteRecipe,
    toggleRecipeStatus,
    duplicateRecipe,
    loadRecipes
  } = useRecipes();

  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [duplicatingId, setDuplicatingId] = useState<string | null>(null);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const formatTime = (minutes: number | undefined) => {
    if (!minutes) return '-';
    if (minutes < 60) {
      return `${minutes} min`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}min` : `${hours}h`;
  };

  const handleDelete = async (id: string, nombre: string) => {
    if (confirm(`¿Estás seguro de que quieres eliminar la receta "${nombre}"?`)) {
      try {
        setDeletingId(id);
        await deleteRecipe(id);
      } catch (error) {
        console.error('Error deleting recipe:', error);
      } finally {
        setDeletingId(null);
      }
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      setTogglingId(id);
      await toggleRecipeStatus(id, !currentStatus);
    } catch (error) {
      console.error('Error toggling recipe status:', error);
    } finally {
      setTogglingId(null);
    }
  };

  const handleDuplicate = async (id: string) => {
    try {
      setDuplicatingId(id);
      await duplicateRecipe(id);
    } catch (error) {
      console.error('Error duplicating recipe:', error);
    } finally {
      setDuplicatingId(null);
    }
  };

  if (loading && recipes.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-500">Cargando recetas...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={loadRecipes}>
            Reintentar
          </Button>
        </div>
      </div>
    );
  }

  if (recipes.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div className="text-center">
          <p className="text-gray-500 mb-4">No hay recetas registradas</p>
          <Link href="/recipes/new">
            <Button className="flex items-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>Crear Primera Receta</span>
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
            {recipes.map((recipe) => {
              const isDeleting = deletingId === recipe.id;
              const isToggling = togglingId === recipe.id;
              const isDuplicating = duplicatingId === recipe.id;

              return (
                <tr key={recipe.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {recipe.nombre}
                      </div>
                      <div className="text-sm text-gray-500">
                        {recipe.descripcion || '-'}
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
                    {recipe.precio_sugerido ? formatCurrency(recipe.precio_sugerido) : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                      {recipe.margen_ganancia ? `${recipe.margen_ganancia.toFixed(1)}%` : '-'}
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
                    <div className="flex items-center justify-end space-x-1">
                      <Link
                        href={`/recipes/${recipe.id}`}
                        className="text-blue-600 hover:text-blue-900 p-1"
                        title="Editar receta"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>

                      <button
                        onClick={() => handleToggleStatus(recipe.id, recipe.activa)}
                        disabled={isToggling}
                        className="text-gray-600 hover:text-gray-900 p-1 disabled:opacity-50"
                        title={recipe.activa ? 'Desactivar receta' : 'Activar receta'}
                      >
                        {isToggling ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
                        ) : recipe.activa ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>

                      <button
                        onClick={() => handleDuplicate(recipe.id)}
                        disabled={isDuplicating}
                        className="text-green-600 hover:text-green-900 p-1 disabled:opacity-50"
                        title="Duplicar receta"
                      >
                        {isDuplicating ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600"></div>
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>

                      <button
                        onClick={() => handleDelete(recipe.id, recipe.nombre)}
                        disabled={isDeleting}
                        className="text-red-600 hover:text-red-900 p-1 disabled:opacity-50"
                        title="Eliminar receta"
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
