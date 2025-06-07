'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Calculator, TrendingUp, TrendingDown } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select, SelectOption } from '@/components/ui/Select';
import { useRecipes } from '@/hooks/useRecipes';

interface PriceScenario {
  id: string;
  name: string;
  ingredientChanges: { [key: string]: number };
  totalCostChange: number;
  newMargin: number;
}

export function PriceSimulator() {
  const t = useTranslations('simulator');
  const [selectedRecipe, setSelectedRecipe] = useState('');
  const [priceChange, setPriceChange] = useState('');
  const [currentPrice, setCurrentPrice] = useState('');
  const [scenarios, setScenarios] = useState<PriceScenario[]>([]);

  const { recipes, loading, error } = useRecipes();

  const recipeOptions: SelectOption[] = recipes.map(recipe => ({
    value: recipe.id,
    label: recipe.nombre
  }));

  const selectedRecipeData = recipes.find(recipe => recipe.id === selectedRecipe);

  const calculateScenario = () => {
    if (!selectedRecipe || !priceChange || !currentPrice || !selectedRecipeData) return;

    const changePercent = parseFloat(priceChange) / 100;
    const newCost = selectedRecipeData.costo_total * (1 + changePercent);
    const price = parseFloat(currentPrice);
    const newMargin = price > 0 ? ((price - newCost) / price) * 100 : 0;

    const newScenario: PriceScenario = {
      id: Date.now().toString(),
      name: `Cambio ${priceChange}% en costos de ingredientes`,
      ingredientChanges: { all: parseFloat(priceChange) },
      totalCostChange: changePercent,
      newMargin: newMargin
    };

    setScenarios(prev => [newScenario, ...prev.slice(0, 2)]);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-2 mb-6">
          <Calculator className="w-5 h-5 text-blue-600" />
          <h2 className="text-lg font-semibold text-gray-900">{t('priceSimulator')}</h2>
        </div>
        <div className="text-center py-8">
          <div className="text-gray-500">Cargando recetas...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-2 mb-6">
          <Calculator className="w-5 h-5 text-blue-600" />
          <h2 className="text-lg font-semibold text-gray-900">{t('priceSimulator')}</h2>
        </div>
        <div className="text-center py-8">
          <div className="text-red-500">Error al cargar las recetas</div>
        </div>
      </div>
    );
  }

  const currentMargin = selectedRecipeData && currentPrice ?
    ((parseFloat(currentPrice) - selectedRecipeData.costo_total) / parseFloat(currentPrice)) * 100 : 0;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center space-x-2 mb-6">
        <Calculator className="w-5 h-5 text-blue-600" />
        <h2 className="text-lg font-semibold text-gray-900">{t('priceSimulator')}</h2>
      </div>

      <div className="space-y-4">
        <Select
          label="Seleccionar Receta"
          value={selectedRecipe}
          onChange={(e) => setSelectedRecipe(e.target.value)}
          options={recipeOptions}
          placeholder="Elegir receta para simular"
        />

        <Input
          label="Precio de Venta Actual"
          type="number"
          step="0.01"
          min="0"
          value={currentPrice}
          onChange={(e) => setCurrentPrice(e.target.value)}
          placeholder="Ej: 8.50"
        />

        {selectedRecipeData && currentPrice && (
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-medium text-gray-900 mb-2">Datos Actuales</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Costo Total:</span>
                <span className="ml-2 font-medium">{formatCurrency(selectedRecipeData.costo_total)}</span>
              </div>
              <div>
                <span className="text-gray-500">Precio Venta:</span>
                <span className="ml-2 font-medium">{formatCurrency(parseFloat(currentPrice))}</span>
              </div>
              <div>
                <span className="text-gray-500">Margen:</span>
                <span className="ml-2 font-medium text-green-600">{currentMargin.toFixed(1)}%</span>
              </div>
            </div>
          </div>
        )}

        <div className="flex space-x-2">
          <Input
            label="Cambio en Precios (%)"
            type="number"
            value={priceChange}
            onChange={(e) => setPriceChange(e.target.value)}
            placeholder="Ej: 10 para +10%, -5 para -5%"
          />
          <div className="flex items-end">
            <Button onClick={calculateScenario} disabled={!selectedRecipe || !priceChange || !currentPrice}>
              Simular
            </Button>
          </div>
        </div>

        {scenarios.length > 0 && (
          <div className="space-y-3">
            <h3 className="font-medium text-gray-900">Escenarios Simulados</h3>
            {scenarios.map((scenario) => {
              const recipe = selectedRecipeData!;
              const newCost = recipe.costo_total * (1 + scenario.totalCostChange);
              const costDiff = newCost - recipe.costo_total;
              const marginDiff = scenario.newMargin - currentMargin;

              return (
                <div key={scenario.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900">{scenario.name}</h4>
                    <div className="flex items-center space-x-1">
                      {marginDiff >= 0 ? (
                        <TrendingUp className="w-4 h-4 text-green-500" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-red-500" />
                      )}
                      <span className={`text-sm font-medium ${
                        marginDiff >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {marginDiff >= 0 ? '+' : ''}{marginDiff.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Nuevo Costo:</span>
                      <div className="font-medium">{formatCurrency(newCost)}</div>
                      <div className={`text-xs ${costDiff >= 0 ? 'text-red-600' : 'text-green-600'}`}>
                        {costDiff >= 0 ? '+' : ''}{formatCurrency(costDiff)}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-500">Precio Venta:</span>
                      <div className="font-medium">{formatCurrency(parseFloat(currentPrice))}</div>
                      <div className="text-xs text-gray-500">Sin cambios</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Nuevo Margen:</span>
                      <div className={`font-medium ${
                        scenario.newMargin >= currentMargin ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {scenario.newMargin.toFixed(1)}%
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
