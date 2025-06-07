'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Factory, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select, SelectOption } from '@/components/ui/Select';
import { useRecipes } from '@/hooks/useRecipes';

interface ProductionScenario {
  id: string;
  volume: number;
  totalCost: number;
  totalRevenue: number;
  profit: number;
  profitMargin: number;
}

export function ProductionSimulator() {
  const t = useTranslations('simulator');
  const [selectedRecipe, setSelectedRecipe] = useState('');
  const [productionVolume, setProductionVolume] = useState('');
  const [estimatedPrice, setEstimatedPrice] = useState('');
  const [scenarios, setScenarios] = useState<ProductionScenario[]>([]);

  const { recipes, loading, error } = useRecipes();

  const recipeOptions: SelectOption[] = recipes.map(recipe => ({
    value: recipe.id,
    label: recipe.nombre
  }));

  const selectedRecipeData = recipes.find(recipe => recipe.id === selectedRecipe);

  const calculateProduction = () => {
    if (!selectedRecipe || !productionVolume || !estimatedPrice || !selectedRecipeData) return;

    const volume = parseFloat(productionVolume);
    const pricePerLiter = parseFloat(estimatedPrice);
    const costPerLiter = selectedRecipeData.costo_total / (selectedRecipeData.rendimiento || 1);

    const totalCost = costPerLiter * volume;
    const totalRevenue = pricePerLiter * volume;
    const profit = totalRevenue - totalCost;
    const profitMargin = totalRevenue > 0 ? (profit / totalRevenue) * 100 : 0;

    const newScenario: ProductionScenario = {
      id: Date.now().toString(),
      volume,
      totalCost,
      totalRevenue,
      profit,
      profitMargin
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
          <Factory className="w-5 h-5 text-green-600" />
          <h2 className="text-lg font-semibold text-gray-900">{t('productionSimulator')}</h2>
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
          <Factory className="w-5 h-5 text-green-600" />
          <h2 className="text-lg font-semibold text-gray-900">{t('productionSimulator')}</h2>
        </div>
        <div className="text-center py-8">
          <div className="text-red-500">Error al cargar las recetas</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center space-x-2 mb-6">
        <Factory className="w-5 h-5 text-green-600" />
        <h2 className="text-lg font-semibold text-gray-900">{t('productionSimulator')}</h2>
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
            <h3 className="font-medium text-gray-900 mb-2">Datos de la Receta</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Costo Total:</span>
                <span className="ml-2 font-medium">{formatCurrency(selectedRecipeData.costo_total)}</span>
              </div>
              <div>
                <span className="text-gray-500">Rendimiento:</span>
                <span className="ml-2 font-medium">{selectedRecipeData.rendimiento || 1} {selectedRecipeData.unidad_rendimiento || 'litros'}</span>
              </div>
              <div>
                <span className="text-gray-500">Costo por Litro:</span>
                <span className="ml-2 font-medium">{formatCurrency(selectedRecipeData.costo_total / (selectedRecipeData.rendimiento || 1))}</span>
              </div>
            </div>
          </div>
        )}

        <Input
          label="Precio de Venta Estimado (por litro)"
          type="number"
          step="0.01"
          min="0"
          value={estimatedPrice}
          onChange={(e) => setEstimatedPrice(e.target.value)}
          placeholder="Ej: 8.50"
        />

        <div className="flex space-x-2">
          <Input
            label={`${t('productionVolume')} (litros)`}
            type="number"
            step="0.1"
            min="0"
            value={productionVolume}
            onChange={(e) => setProductionVolume(e.target.value)}
            placeholder="Ej: 10"
          />
          <div className="flex items-end">
            <Button onClick={calculateProduction} disabled={!selectedRecipe || !productionVolume || !estimatedPrice}>
              Calcular
            </Button>
          </div>
        </div>

        {scenarios.length > 0 && (
          <div className="space-y-3">
            <h3 className="font-medium text-gray-900">Escenarios de Producción</h3>
            {scenarios.map((scenario) => (
              <div key={scenario.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-gray-900">
                    Producción: {scenario.volume} litros
                  </h4>
                  <div className="flex items-center space-x-1">
                    <BarChart3 className="w-4 h-4 text-blue-500" />
                    <span className={`text-sm font-medium ${
                      scenario.profit >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {scenario.profitMargin.toFixed(1)}% margen
                    </span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div className="bg-red-50 rounded p-3">
                    <span className="text-red-600 text-xs font-medium">COSTOS</span>
                    <div className="font-bold text-red-700">{formatCurrency(scenario.totalCost)}</div>
                  </div>
                  <div className="bg-blue-50 rounded p-3">
                    <span className="text-blue-600 text-xs font-medium">INGRESOS</span>
                    <div className="font-bold text-blue-700">{formatCurrency(scenario.totalRevenue)}</div>
                  </div>
                  <div className={`rounded p-3 ${
                    scenario.profit >= 0 ? 'bg-green-50' : 'bg-red-50'
                  }`}>
                    <span className={`text-xs font-medium ${
                      scenario.profit >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {scenario.profit >= 0 ? 'GANANCIA' : 'PÉRDIDA'}
                    </span>
                    <div className={`font-bold ${
                      scenario.profit >= 0 ? 'text-green-700' : 'text-red-700'
                    }`}>
                      {formatCurrency(Math.abs(scenario.profit))}
                    </div>
                  </div>
                  <div className="bg-purple-50 rounded p-3">
                    <span className="text-purple-600 text-xs font-medium">PUNTO EQUILIBRIO</span>
                    <div className="font-bold text-purple-700">
                      {(scenario.totalCost / parseFloat(estimatedPrice)).toFixed(1)}L
                    </div>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-gray-200">
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Costo por litro: {formatCurrency(scenario.totalCost / scenario.volume)}</span>
                    <span>Ganancia por litro: {formatCurrency(scenario.profit / scenario.volume)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
