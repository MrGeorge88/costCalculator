'use client';

import { useState } from 'react';
import { Plus, Edit2, Trash2, Package, DollarSign, TrendingUp } from 'lucide-react';
import { RecipeCalculation, PresentationCalculation, formatCurrency, formatPercentage } from '@/lib/calculations';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';

interface Presentation {
  id?: string;
  nombre: string;
  descripcion?: string;
  tamaño_porcion: number;
  unidad_porcion: string;
  precio_venta: number;
  calculation?: PresentationCalculation;
}

interface PresentationCalculatorProps {
  recipeCalculations: RecipeCalculation;
  presentations?: Presentation[];
  onPresentationsChange?: (presentations: Presentation[]) => void;
  className?: string;
}

const PORTION_UNITS = [
  { value: 'ml', label: 'Mililitros' },
  { value: 'g', label: 'Gramos' },
  { value: 'porciones', label: 'Porciones' },
  { value: 'unidades', label: 'Unidades' },
];

export function PresentationCalculator({
  recipeCalculations,
  presentations = [],
  onPresentationsChange,
  className = ''
}: PresentationCalculatorProps) {
  const [isAddingPresentation, setIsAddingPresentation] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [newPresentation, setNewPresentation] = useState<Presentation>({
    nombre: '',
    tamaño_porcion: 150,
    unidad_porcion: 'ml',
    precio_venta: 0,
  });

  // Calcular presentación
  const calculatePresentation = (presentation: Presentation): PresentationCalculation => {
    if (recipeCalculations.costo_total <= 0 || recipeCalculations.rendimiento <= 0) {
      return {
        tamaño_porcion: presentation.tamaño_porcion,
        unidad_porcion: presentation.unidad_porcion,
        costo_por_porcion: 0,
        precio_venta: presentation.precio_venta,
        margen_ganancia: 0,
        ganancia_absoluta: 0,
      };
    }

    // Factor de conversión básico
    const getConversionFactor = (from: string, to: string): number => {
      if (from === to) return 1;
      
      const conversions: Record<string, Record<string, number>> = {
        'litros': { 'ml': 1000 },
        'ml': { 'litros': 0.001 },
        'kg': { 'g': 1000 },
        'g': { 'kg': 0.001 },
      };
      
      return conversions[from]?.[to] || 1;
    };

    const conversionFactor = getConversionFactor(
      recipeCalculations.unidad_rendimiento,
      presentation.unidad_porcion
    );

    const costo_por_unidad = recipeCalculations.costo_total / 
      (recipeCalculations.rendimiento * conversionFactor);
    
    const costo_por_porcion = costo_por_unidad * presentation.tamaño_porcion;
    
    const margen_ganancia = presentation.precio_venta > 0 
      ? ((presentation.precio_venta - costo_por_porcion) / presentation.precio_venta) * 100
      : 0;
    
    const ganancia_absoluta = Math.max(0, presentation.precio_venta - costo_por_porcion);

    return {
      tamaño_porcion: presentation.tamaño_porcion,
      unidad_porcion: presentation.unidad_porcion,
      costo_por_porcion,
      precio_venta: presentation.precio_venta,
      margen_ganancia,
      ganancia_absoluta,
    };
  };

  // Calcular todas las presentaciones
  const calculatedPresentations = presentations.map(p => ({
    ...p,
    calculation: calculatePresentation(p),
  }));

  const handleAddPresentation = () => {
    if (newPresentation.nombre && newPresentation.precio_venta > 0) {
      const updatedPresentations = [...presentations, { ...newPresentation }];
      onPresentationsChange?.(updatedPresentations);
      setNewPresentation({
        nombre: '',
        tamaño_porcion: 150,
        unidad_porcion: 'ml',
        precio_venta: 0,
      });
      setIsAddingPresentation(false);
    }
  };

  const handleEditPresentation = (index: number, updates: Partial<Presentation>) => {
    const updatedPresentations = presentations.map((p, i) => 
      i === index ? { ...p, ...updates } : p
    );
    onPresentationsChange?.(updatedPresentations);
  };

  const handleDeletePresentation = (index: number) => {
    const updatedPresentations = presentations.filter((_, i) => i !== index);
    onPresentationsChange?.(updatedPresentations);
  };

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 ${className}`}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <Package className="w-5 h-5 text-purple-600" />
            <h3 className="text-lg font-semibold text-gray-900">Presentaciones</h3>
          </div>
          <Button
            onClick={() => setIsAddingPresentation(true)}
            size="sm"
            className="flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Agregar Presentación</span>
          </Button>
        </div>

        {/* Formulario para nueva presentación */}
        {isAddingPresentation && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="text-sm font-semibold text-gray-900 mb-3">Nueva Presentación</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Nombre"
                value={newPresentation.nombre}
                onChange={(e) => setNewPresentation(prev => ({ ...prev, nombre: e.target.value }))}
                placeholder="Ej: Vaso Pequeño"
              />

              <Input
                label="Descripción"
                value={newPresentation.descripcion || ''}
                onChange={(e) => setNewPresentation(prev => ({ ...prev, descripcion: e.target.value }))}
                placeholder="Descripción opcional"
              />

              <div className="grid grid-cols-2 gap-2">
                <Input
                  label="Tamaño"
                  type="number"
                  value={newPresentation.tamaño_porcion}
                  onChange={(e) => setNewPresentation(prev => ({ ...prev, tamaño_porcion: Number(e.target.value) }))}
                  step="0.1"
                  min="0"
                />

                <Select
                  label="Unidad"
                  value={newPresentation.unidad_porcion}
                  onChange={(e) => setNewPresentation(prev => ({ ...prev, unidad_porcion: e.target.value }))}
                  options={PORTION_UNITS}
                />
              </div>

              <Input
                label="Precio de Venta"
                type="number"
                value={newPresentation.precio_venta}
                onChange={(e) => setNewPresentation(prev => ({ ...prev, precio_venta: Number(e.target.value) }))}
                step="0.01"
                min="0"
                placeholder="0.00"
              />
            </div>

            <div className="flex justify-end space-x-2 mt-4">
              <Button
                onClick={() => setIsAddingPresentation(false)}
                variant="outline"
                size="sm"
              >
                Cancelar
              </Button>
              <Button
                onClick={handleAddPresentation}
                size="sm"
                disabled={!newPresentation.nombre || newPresentation.precio_venta <= 0}
              >
                Agregar
              </Button>
            </div>
          </div>
        )}

        {/* Lista de presentaciones */}
        <div className="space-y-4">
          {calculatedPresentations.map((presentation, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h4 className="font-medium text-gray-900">{presentation.nombre}</h4>
                  {presentation.descripcion && (
                    <p className="text-sm text-gray-600">{presentation.descripcion}</p>
                  )}
                  <p className="text-sm text-gray-500">
                    {presentation.tamaño_porcion} {presentation.unidad_porcion}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    onClick={() => setEditingIndex(editingIndex === index ? null : index)}
                    variant="outline"
                    size="sm"
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button
                    onClick={() => handleDeletePresentation(index)}
                    variant="outline"
                    size="sm"
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Métricas de la presentación */}
              {presentation.calculation && (
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center justify-center space-x-1 text-blue-600 mb-1">
                      <DollarSign className="w-4 h-4" />
                      <span className="text-xs font-medium">Costo</span>
                    </div>
                    <p className="text-lg font-bold text-blue-900">
                      {formatCurrency(presentation.calculation.costo_por_porcion)}
                    </p>
                  </div>

                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center justify-center space-x-1 text-green-600 mb-1">
                      <DollarSign className="w-4 h-4" />
                      <span className="text-xs font-medium">Precio</span>
                    </div>
                    <p className="text-lg font-bold text-green-900">
                      {formatCurrency(presentation.calculation.precio_venta)}
                    </p>
                  </div>

                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <div className="flex items-center justify-center space-x-1 text-purple-600 mb-1">
                      <TrendingUp className="w-4 h-4" />
                      <span className="text-xs font-medium">Margen</span>
                    </div>
                    <p className="text-lg font-bold text-purple-900">
                      {formatPercentage(presentation.calculation.margen_ganancia)}
                    </p>
                  </div>
                </div>
              )}

              {/* Formulario de edición */}
              {editingIndex === index && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="grid grid-cols-2 gap-3">
                    <Input
                      label="Precio de Venta"
                      type="number"
                      value={presentation.precio_venta}
                      onChange={(e) => handleEditPresentation(index, { precio_venta: Number(e.target.value) })}
                      step="0.01"
                      min="0"
                    />
                    <Input
                      label="Tamaño Porción"
                      type="number"
                      value={presentation.tamaño_porcion}
                      onChange={(e) => handleEditPresentation(index, { tamaño_porcion: Number(e.target.value) })}
                      step="0.1"
                      min="0"
                    />
                  </div>
                </div>
              )}
            </div>
          ))}

          {presentations.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p>No hay presentaciones definidas.</p>
              <p className="text-sm">Agrega una presentación para calcular precios por porción.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
