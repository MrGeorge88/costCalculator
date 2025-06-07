'use client';

import { useState } from 'react';
import { Plus, Minus, Save, Calculator } from 'lucide-react';
import { useRecipeCalculations } from '@/hooks/useRecipeCalculations';
import { CostCalculator } from './CostCalculator';
import { PresentationCalculator } from './PresentationCalculator';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';

interface RecipeFormProps {
  recipeId?: string;
  onSave?: (recipeId: string) => void;
  onCancel?: () => void;
}

const RECIPE_CATEGORIES = [
  { value: 'ice_cream', label: 'Helado Tradicional' },
  { value: 'sorbet', label: 'Sorbete' },
  { value: 'gelato', label: 'Gelato' },
  { value: 'frozen_yogurt', label: 'Yogurt Helado' },
  { value: 'popsicle', label: 'Paleta' },
  { value: 'sundae', label: 'Sundae' },
  { value: 'milkshake', label: 'Malteada' },
  { value: 'other', label: 'Otro' },
];

const UNITS = [
  { value: 'litros', label: 'Litros' },
  { value: 'kg', label: 'Kilogramos' },
  { value: 'porciones', label: 'Porciones' },
  { value: 'unidades', label: 'Unidades' },
];

export function RecipeForm({ recipeId, onSave, onCancel }: RecipeFormProps) {
  const {
    recipeData,
    calculations,
    availableIngredients,
    loading,
    error,
    addIngredient,
    updateIngredient,
    removeIngredient,
    updateRecipeData,
    calculateSuggestedPriceFromMargin,
    calculateMarginFromPrice,
    saveRecipe,
    loadRecipe,
  } = useRecipeCalculations();

  const [showCalculator, setShowCalculator] = useState(true);
  const [selectedIngredient, setSelectedIngredient] = useState('');
  const [presentations, setPresentations] = useState<any[]>([]);

  // Cargar receta si se proporciona ID
  useState(() => {
    if (recipeId) {
      loadRecipe(recipeId);
    }
  });

  const handleAddIngredient = () => {
    if (selectedIngredient) {
      addIngredient(selectedIngredient, 1, 'kg');
      setSelectedIngredient('');
    }
  };

  const handleSave = async () => {
    try {
      const savedRecipeId = await saveRecipe();
      onSave?.(savedRecipeId);
    } catch (error) {
      console.error('Error saving recipe:', error);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Información Básica de la Receta */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          {recipeId ? 'Editar Receta' : 'Nueva Receta'}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <Input
              label="Nombre de la Receta"
              value={recipeData.nombre}
              onChange={(e) => updateRecipeData({ nombre: e.target.value })}
              placeholder="Ej: Helado de Vainilla Clásico"
              required
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descripción
              </label>
              <textarea
                value={recipeData.descripcion || ''}
                onChange={(e) => updateRecipeData({ descripcion: e.target.value })}
                placeholder="Descripción de la receta..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <Select
              label="Categoría"
              value={recipeData.categoria}
              onChange={(value) => updateRecipeData({ categoria: value })}
              options={RECIPE_CATEGORIES}
            />
          </div>

          <div className="space-y-4">
            <Input
              label="Tiempo de Preparación (minutos)"
              type="number"
              value={recipeData.tiempo_preparacion || ''}
              onChange={(e) => updateRecipeData({ tiempo_preparacion: Number(e.target.value) })}
              placeholder="45"
            />

            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Rendimiento"
                type="number"
                value={recipeData.rendimiento}
                onChange={(e) => updateRecipeData({ rendimiento: Number(e.target.value) })}
                placeholder="2"
                step="0.1"
                min="0.1"
                required
              />

              <Select
                label="Unidad"
                value={recipeData.unidad_rendimiento}
                onChange={(value) => updateRecipeData({ unidad_rendimiento: value })}
                options={UNITS}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Ingredientes */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Ingredientes</h3>
          <Button
            onClick={() => setShowCalculator(!showCalculator)}
            variant="outline"
            size="sm"
            className="flex items-center space-x-2"
          >
            <Calculator className="w-4 h-4" />
            <span>{showCalculator ? 'Ocultar' : 'Mostrar'} Calculadora</span>
          </Button>
        </div>

        {/* Agregar Ingrediente */}
        <div className="flex space-x-3 mb-6">
          <div className="flex-1">
            <Select
              value={selectedIngredient}
              onChange={setSelectedIngredient}
              options={availableIngredients.map(ing => ({
                value: ing.id,
                label: `${ing.nombre} (${ing.precio_por_unidad}/${ing.unidad_medida})`
              }))}
              placeholder="Seleccionar ingrediente..."
            />
          </div>
          <Button
            onClick={handleAddIngredient}
            disabled={!selectedIngredient}
            className="flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Agregar</span>
          </Button>
        </div>

        {/* Lista de Ingredientes */}
        <div className="space-y-3">
          {recipeData.ingredientes.map((ingredient, index) => {
            const ingredientData = availableIngredients.find(i => i.id === ingredient.ingrediente_id);
            
            return (
              <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <span className="font-medium text-gray-900">
                    {ingredientData?.nombre || 'Ingrediente no encontrado'}
                  </span>
                  {ingredientData && (
                    <span className="text-sm text-gray-500 ml-2">
                      ({ingredientData.precio_por_unidad}/{ingredientData.unidad_medida})
                    </span>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  <Input
                    type="number"
                    value={ingredient.cantidad}
                    onChange={(e) => updateIngredient(index, { cantidad: Number(e.target.value) })}
                    className="w-20"
                    step="0.1"
                    min="0"
                  />

                  <Select
                    value={ingredient.unidad}
                    onChange={(value) => updateIngredient(index, { unidad: value })}
                    options={UNITS}
                    className="w-24"
                  />

                  <Button
                    onClick={() => removeIngredient(index)}
                    variant="outline"
                    size="sm"
                    className="text-red-600 hover:text-red-700"
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            );
          })}

          {recipeData.ingredientes.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <p>No hay ingredientes agregados.</p>
              <p className="text-sm">Selecciona un ingrediente arriba para comenzar.</p>
            </div>
          )}
        </div>
      </div>

      {/* Calculadora de Costos */}
      {showCalculator && (
        <CostCalculator
          calculations={calculations}
          onMarginChange={calculateSuggestedPriceFromMargin}
          onPriceChange={calculateMarginFromPrice}
        />
      )}

      {/* Calculadora de Presentaciones */}
      <PresentationCalculator
        recipeCalculations={calculations}
        presentations={presentations}
        onPresentationsChange={setPresentations}
      />

      {/* Acciones */}
      <div className="flex justify-end space-x-3">
        {onCancel && (
          <Button
            onClick={onCancel}
            variant="outline"
          >
            Cancelar
          </Button>
        )}

        <Button
          onClick={handleSave}
          disabled={loading || !recipeData.nombre || recipeData.ingredientes.length === 0}
          className="flex items-center space-x-2"
        >
          <Save className="w-4 h-4" />
          <span>{loading ? 'Guardando...' : 'Guardar Receta'}</span>
        </Button>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error}</p>
        </div>
      )}
    </div>
  );
}
