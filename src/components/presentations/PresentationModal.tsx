'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { usePresentations } from '@/hooks/usePresentations';
import type { PresentationWithRecipe } from '@/hooks/usePresentations';
import { useRecipes } from '@/hooks/useRecipes';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { X } from 'lucide-react';

interface PresentationModalProps {
  isOpen: boolean;
  onClose: () => void;
  presentation?: PresentationWithRecipe;
}

const PORTION_UNITS = [
  { value: 'ml', label: 'Mililitros (ml)' },
  { value: 'g', label: 'Gramos (g)' },
  { value: 'porciones', label: 'Porciones' },
  { value: 'unidades', label: 'Unidades' },
];

export function PresentationModal({ isOpen, onClose, presentation }: PresentationModalProps) {
  const t = useTranslations('presentations');
  const { createPresentation, updatePresentation } = usePresentations();
  const { recipes, loadRecipes } = useRecipes();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    receta_id: '',
    nombre: '',
    descripcion: '',
    tamaño_porcion: 150,
    unidad_porcion: 'ml',
    precio_venta: 0,
    costo_por_porcion: 0,
    margen_ganancia: 0,
  });

  // Cargar recetas al abrir el modal
  useEffect(() => {
    if (isOpen) {
      loadRecipes();
    }
  }, [isOpen, loadRecipes]);

  // Llenar formulario si estamos editando
  useEffect(() => {
    if (presentation) {
      setFormData({
        receta_id: presentation.receta_id,
        nombre: presentation.nombre,
        descripcion: presentation.descripcion || '',
        tamaño_porcion: presentation.tamaño_porcion,
        unidad_porcion: presentation.unidad_porcion,
        precio_venta: presentation.precio_venta,
        costo_por_porcion: presentation.costo_por_porcion,
        margen_ganancia: presentation.margen_ganancia,
      });
    } else {
      // Resetear formulario para nueva presentación
      setFormData({
        receta_id: '',
        nombre: '',
        descripcion: '',
        tamaño_porcion: 150,
        unidad_porcion: 'ml',
        precio_venta: 0,
        costo_por_porcion: 0,
        margen_ganancia: 0,
      });
    }
    setError(null);
  }, [presentation, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.receta_id || !formData.nombre || formData.precio_venta <= 0) {
      setError('Por favor completa todos los campos requeridos');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      if (presentation) {
        // Actualizar presentación existente
        await updatePresentation(presentation.id, {
          nombre: formData.nombre,
          descripcion: formData.descripcion || null,
          tamaño_porcion: formData.tamaño_porcion,
          unidad_porcion: formData.unidad_porcion,
          precio_venta: formData.precio_venta,
          costo_por_porcion: formData.costo_por_porcion,
          margen_ganancia: formData.margen_ganancia,
        });
      } else {
        // Crear nueva presentación
        await createPresentation({
          receta_id: formData.receta_id,
          nombre: formData.nombre,
          descripcion: formData.descripcion || null,
          tamaño_porcion: formData.tamaño_porcion,
          unidad_porcion: formData.unidad_porcion,
          precio_venta: formData.precio_venta,
          costo_por_porcion: formData.costo_por_porcion,
          margen_ganancia: formData.margen_ganancia,
          activa: true,
        });
      }

      onClose();
    } catch (err) {
      console.error('Error saving presentation:', err);
      setError('Error al guardar la presentación');
    } finally {
      setLoading(false);
    }
  };

  const recipeOptions = recipes.map(recipe => ({
    value: recipe.id,
    label: recipe.nombre
  }));

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            {presentation ? 'Editar Presentación' : 'Nueva Presentación'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Selección de receta (solo para nuevas presentaciones) */}
          {!presentation && (
            <Select
              label="Receta *"
              value={formData.receta_id}
              onChange={(e) => setFormData(prev => ({ ...prev, receta_id: e.target.value }))}
              options={recipeOptions}
              placeholder="Selecciona una receta"
              required
            />
          )}

          {/* Nombre de la presentación */}
          <Input
            label="Nombre de la Presentación *"
            value={formData.nombre}
            onChange={(e) => setFormData(prev => ({ ...prev, nombre: e.target.value }))}
            placeholder="Ej: Vaso pequeño, Vaso grande, Cono doble..."
            required
          />

          {/* Descripción */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descripción
            </label>
            <textarea
              value={formData.descripcion}
              onChange={(e) => setFormData(prev => ({ ...prev, descripcion: e.target.value }))}
              placeholder="Descripción opcional de la presentación"
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          {/* Tamaño y unidad de porción */}
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Tamaño de Porción *"
              type="number"
              value={formData.tamaño_porcion}
              onChange={(e) => setFormData(prev => ({ ...prev, tamaño_porcion: Number(e.target.value) }))}
              step="0.1"
              min="0"
              required
            />

            <Select
              label="Unidad *"
              value={formData.unidad_porcion}
              onChange={(e) => setFormData(prev => ({ ...prev, unidad_porcion: e.target.value }))}
              options={PORTION_UNITS}
              required
            />
          </div>

          {/* Precio de venta */}
          <Input
            label="Precio de Venta *"
            type="number"
            value={formData.precio_venta}
            onChange={(e) => setFormData(prev => ({ ...prev, precio_venta: Number(e.target.value) }))}
            step="0.01"
            min="0"
            placeholder="0.00"
            required
          />

          {/* Botones */}
          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={loading || !formData.receta_id || !formData.nombre || formData.precio_venta <= 0}
            >
              {loading ? 'Guardando...' : (presentation ? 'Actualizar' : 'Crear')}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
