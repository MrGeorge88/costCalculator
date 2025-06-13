'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { usePresentations } from '@/hooks/usePresentations';
import type { PresentationWithRecipe } from '@/hooks/usePresentations';
import { formatCurrency, formatPercentage } from '@/lib/calculations';
import { Button } from '@/components/ui/Button';
import { PresentationModal } from './PresentationModal';
import { 
  Package, 
  DollarSign, 
  TrendingUp, 
  Edit2, 
  Trash2, 
  ChefHat,
  Scale,
  Tag
} from 'lucide-react';

interface PresentationCardProps {
  presentation: PresentationWithRecipe;
}

export function PresentationCard({ presentation }: PresentationCardProps) {
  const t = useTranslations('presentations');
  const { deletePresentation } = usePresentations();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Calcular métricas de la presentación
  const calculateMetrics = () => {
    const { receta } = presentation;
    
    // Factor de conversión básico (simplificado)
    const conversionFactor = receta.unidad_rendimiento === presentation.unidad_porcion ? 1 : 1;
    
    const costoUnidad = receta.costo_total / (receta.rendimiento * conversionFactor);
    const costoPorcion = costoUnidad * presentation.tamaño_porcion;
    
    const margenGanancia = presentation.precio_venta > 0 
      ? ((presentation.precio_venta - costoPorcion) / presentation.precio_venta) * 100
      : 0;
    
    const gananciaAbsoluta = Math.max(0, presentation.precio_venta - costoPorcion);

    return {
      costoPorcion,
      margenGanancia,
      gananciaAbsoluta
    };
  };

  const metrics = calculateMetrics();

  const handleDelete = async () => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta presentación?')) {
      return;
    }

    try {
      setIsDeleting(true);
      await deletePresentation(presentation.id);
    } catch (error) {
      console.error('Error deleting presentation:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      ice_cream: 'bg-blue-100 text-blue-800',
      sorbet: 'bg-green-100 text-green-800',
      gelato: 'bg-purple-100 text-purple-800',
      frozen_yogurt: 'bg-pink-100 text-pink-800',
      popsicle: 'bg-orange-100 text-orange-800',
      sundae: 'bg-yellow-100 text-yellow-800',
      milkshake: 'bg-indigo-100 text-indigo-800',
      other: 'bg-gray-100 text-gray-800'
    };
    return colors[category] || colors.other;
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
        {/* Header */}
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                {presentation.nombre}
              </h3>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <ChefHat className="w-4 h-4" />
                <span>{presentation.receta.nombre}</span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditModalOpen(true)}
              >
                <Edit2 className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDelete}
                disabled={isDeleting}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          {/* Categoría */}
          <div className="mt-2">
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(presentation.receta.categoria)}`}>
              <Tag className="w-3 h-3 mr-1" />
              {presentation.receta.categoria.replace('_', ' ').toUpperCase()}
            </span>
          </div>
        </div>

        {/* Información de la porción */}
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Scale className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">Tamaño de porción</span>
            </div>
            <span className="font-medium text-gray-900">
              {presentation.tamaño_porcion} {presentation.unidad_porcion}
            </span>
          </div>
          
          {presentation.descripcion && (
            <p className="text-sm text-gray-600 mt-2">{presentation.descripcion}</p>
          )}
        </div>

        {/* Métricas financieras */}
        <div className="p-4">
          <div className="grid grid-cols-2 gap-4">
            {/* Costo por porción */}
            <div className="text-center p-3 bg-red-50 rounded-lg">
              <div className="flex items-center justify-center space-x-1 text-red-600 mb-1">
                <DollarSign className="w-4 h-4" />
                <span className="text-xs font-medium">Costo</span>
              </div>
              <p className="text-lg font-bold text-red-900">
                {formatCurrency(metrics.costoPorcion)}
              </p>
            </div>

            {/* Precio de venta */}
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="flex items-center justify-center space-x-1 text-green-600 mb-1">
                <DollarSign className="w-4 h-4" />
                <span className="text-xs font-medium">Precio</span>
              </div>
              <p className="text-lg font-bold text-green-900">
                {formatCurrency(presentation.precio_venta)}
              </p>
            </div>

            {/* Margen de ganancia */}
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center justify-center space-x-1 text-blue-600 mb-1">
                <TrendingUp className="w-4 h-4" />
                <span className="text-xs font-medium">Margen</span>
              </div>
              <p className="text-lg font-bold text-blue-900">
                {formatPercentage(metrics.margenGanancia)}
              </p>
            </div>

            {/* Ganancia absoluta */}
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <div className="flex items-center justify-center space-x-1 text-purple-600 mb-1">
                <DollarSign className="w-4 h-4" />
                <span className="text-xs font-medium">Ganancia</span>
              </div>
              <p className="text-lg font-bold text-purple-900">
                {formatCurrency(metrics.gananciaAbsoluta)}
              </p>
            </div>
          </div>
        </div>

        {/* Footer con información adicional */}
        <div className="px-4 py-3 bg-gray-50 rounded-b-lg">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>Creado: {new Date(presentation.created_at).toLocaleDateString()}</span>
            <span className={`px-2 py-1 rounded-full ${presentation.activa ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
              {presentation.activa ? 'Activa' : 'Inactiva'}
            </span>
          </div>
        </div>
      </div>

      {/* Modal de edición */}
      <PresentationModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        presentation={presentation}
      />
    </>
  );
}
