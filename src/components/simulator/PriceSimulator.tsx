'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Calculator, TrendingUp, TrendingDown } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select, SelectOption } from '@/components/ui/Select';

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
  const [scenarios, setScenarios] = useState<PriceScenario[]>([]);

  // Mock data
  const recipeOptions: SelectOption[] = [
    { value: '1', label: 'Helado de Vainilla Clásico' },
    { value: '2', label: 'Helado de Chocolate' },
    { value: '3', label: 'Sorbete de Fresa' }
  ];

  const mockRecipeData = {
    '1': {
      name: 'Helado de Vainilla Clásico',
      currentCost: 4.50,
      currentPrice: 8.00,
      currentMargin: 77.8,
      ingredients: [
        { name: 'Leche Entera', cost: 0.75, percentage: 16.7 },
        { name: 'Crema de Leche', cost: 0.64, percentage: 14.2 },
        { name: 'Azúcar Refinada', cost: 0.12, percentage: 2.7 },
        { name: 'Vainilla Natural', cost: 2.50, percentage: 55.6 },
        { name: 'Huevos', cost: 0.60, percentage: 13.3 }
      ]
    }
  };

  const calculateScenario = () => {
    if (!selectedRecipe || !priceChange) return;

    const recipe = mockRecipeData[selectedRecipe as keyof typeof mockRecipeData];
    if (!recipe) return;

    const changePercent = parseFloat(priceChange) / 100;
    const newCost = recipe.currentCost * (1 + changePercent);
    const newMargin = ((recipe.currentPrice - newCost) / recipe.currentPrice) * 100;

    const newScenario: PriceScenario = {
      id: Date.now().toString(),
      name: `Cambio ${priceChange}% en ingredientes`,
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

  const selectedRecipeData = selectedRecipe ? mockRecipeData[selectedRecipe as keyof typeof mockRecipeData] : null;

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

        {selectedRecipeData && (
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-medium text-gray-900 mb-2">Datos Actuales</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Costo Total:</span>
                <span className="ml-2 font-medium">{formatCurrency(selectedRecipeData.currentCost)}</span>
              </div>
              <div>
                <span className="text-gray-500">Precio Venta:</span>
                <span className="ml-2 font-medium">{formatCurrency(selectedRecipeData.currentPrice)}</span>
              </div>
              <div>
                <span className="text-gray-500">Margen:</span>
                <span className="ml-2 font-medium text-green-600">{selectedRecipeData.currentMargin.toFixed(1)}%</span>
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
            <Button onClick={calculateScenario} disabled={!selectedRecipe || !priceChange}>
              Simular
            </Button>
          </div>
        </div>

        {scenarios.length > 0 && (
          <div className="space-y-3">
            <h3 className="font-medium text-gray-900">Escenarios Simulados</h3>
            {scenarios.map((scenario) => {
              const recipe = selectedRecipeData!;
              const newCost = recipe.currentCost * (1 + scenario.totalCostChange);
              const costDiff = newCost - recipe.currentCost;
              const marginDiff = scenario.newMargin - recipe.currentMargin;

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
                      <div className="font-medium">{formatCurrency(recipe.currentPrice)}</div>
                      <div className="text-xs text-gray-500">Sin cambios</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Nuevo Margen:</span>
                      <div className={`font-medium ${
                        scenario.newMargin >= recipe.currentMargin ? 'text-green-600' : 'text-red-600'
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
