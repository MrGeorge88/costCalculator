'use client';

import { useState } from 'react';
import { Calculator, DollarSign, TrendingUp, Package, AlertCircle } from 'lucide-react';
import { RecipeCalculation, PresentationCalculation, formatCurrency, formatPercentage } from '@/lib/calculations';

interface CostCalculatorProps {
  calculations: RecipeCalculation;
  onMarginChange?: (margin: number) => void;
  onPriceChange?: (price: number) => void;
  className?: string;
}

export function CostCalculator({ 
  calculations, 
  onMarginChange, 
  onPriceChange,
  className = '' 
}: CostCalculatorProps) {
  const [targetMargin, setTargetMargin] = useState<number>(calculations.margen_ganancia || 60);
  const [targetPrice, setTargetPrice] = useState<number>(calculations.precio_sugerido || 0);

  const handleMarginChange = (margin: number) => {
    setTargetMargin(margin);
    onMarginChange?.(margin);
  };

  const handlePriceChange = (price: number) => {
    setTargetPrice(price);
    onPriceChange?.(price);
  };

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 ${className}`}>
      <div className="p-6">
        <div className="flex items-center space-x-2 mb-6">
          <Calculator className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">Calculadora de Costos</h3>
        </div>

        {/* Resumen de Costos */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <Package className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-900">Costo Total</span>
            </div>
            <p className="text-2xl font-bold text-blue-900 mt-1">
              {formatCurrency(calculations.costo_total)}
            </p>
            <p className="text-xs text-blue-700 mt-1">
              Para {calculations.rendimiento} {calculations.unidad_rendimiento}
            </p>
          </div>

          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-green-900">Costo por Unidad</span>
            </div>
            <p className="text-2xl font-bold text-green-900 mt-1">
              {formatCurrency(calculations.costo_por_unidad_rendimiento)}
            </p>
            <p className="text-xs text-green-700 mt-1">
              Por {calculations.unidad_rendimiento}
            </p>
          </div>

          <div className="bg-purple-50 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-medium text-purple-900">Precio Sugerido</span>
            </div>
            <p className="text-2xl font-bold text-purple-900 mt-1">
              {formatCurrency(calculations.precio_sugerido || 0)}
            </p>
            <p className="text-xs text-purple-700 mt-1">
              {formatPercentage(calculations.margen_ganancia || 0)} margen
            </p>
          </div>
        </div>

        {/* Desglose de Ingredientes */}
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-gray-900 mb-3">Desglose por Ingredientes</h4>
          <div className="space-y-2">
            {calculations.ingredientes.map((ingrediente, index) => (
              <div key={index} className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <span className="text-sm font-medium text-gray-900">{ingrediente.nombre}</span>
                  <span className="text-xs text-gray-500 ml-2">
                    {ingrediente.cantidad} {ingrediente.unidad}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-semibold text-gray-900">
                    {formatCurrency(ingrediente.costo_total)}
                  </span>
                  <div className="text-xs text-gray-500">
                    {formatCurrency(ingrediente.costo_unitario)}/{ingrediente.unidad}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Calculadora de Márgenes */}
        <div className="border-t border-gray-200 pt-6">
          <h4 className="text-sm font-semibold text-gray-900 mb-4">Calculadora de Precios</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Calcular por Margen */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">
                Margen de Ganancia Deseado (%)
              </label>
              <div className="flex space-x-2">
                <input
                  type="number"
                  value={targetMargin}
                  onChange={(e) => handleMarginChange(Number(e.target.value))}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="0"
                  max="100"
                  step="0.1"
                />
                <span className="flex items-center px-3 py-2 bg-gray-100 border border-gray-300 rounded-md text-sm text-gray-600">
                  %
                </span>
              </div>
              {calculations.precio_sugerido && (
                <p className="text-sm text-gray-600">
                  Precio sugerido: <span className="font-semibold">{formatCurrency(calculations.precio_sugerido)}</span>
                </p>
              )}
            </div>

            {/* Calcular por Precio */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">
                Precio de Venta Deseado
              </label>
              <div className="flex space-x-2">
                <span className="flex items-center px-3 py-2 bg-gray-100 border border-gray-300 rounded-md text-sm text-gray-600">
                  $
                </span>
                <input
                  type="number"
                  value={targetPrice}
                  onChange={(e) => handlePriceChange(Number(e.target.value))}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="0"
                  step="0.01"
                />
              </div>
              {targetPrice > 0 && (
                <p className="text-sm text-gray-600">
                  Margen resultante: <span className="font-semibold">
                    {formatPercentage(((targetPrice - calculations.costo_total) / targetPrice) * 100)}
                  </span>
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Alertas y Recomendaciones */}
        {calculations.costo_total > 0 && (
          <div className="mt-6 space-y-2">
            {calculations.margen_ganancia && calculations.margen_ganancia < 30 && (
              <div className="flex items-center space-x-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <AlertCircle className="w-4 h-4 text-yellow-600" />
                <span className="text-sm text-yellow-800">
                  Margen de ganancia bajo. Considera aumentar el precio o reducir costos.
                </span>
              </div>
            )}
            
            {calculations.margen_ganancia && calculations.margen_ganancia > 80 && (
              <div className="flex items-center space-x-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <AlertCircle className="w-4 h-4 text-blue-600" />
                <span className="text-sm text-blue-800">
                  Margen muy alto. Podrías ser más competitivo reduciendo el precio.
                </span>
              </div>
            )}
          </div>
        )}

        {/* Escenarios Rápidos */}
        <div className="mt-6 border-t border-gray-200 pt-4">
          <h5 className="text-sm font-medium text-gray-900 mb-3">Escenarios Rápidos</h5>
          <div className="grid grid-cols-3 gap-2">
            {[40, 60, 80].map((margin) => {
              const price = calculations.costo_total / (1 - margin / 100);
              return (
                <button
                  key={margin}
                  onClick={() => handleMarginChange(margin)}
                  className="p-2 text-center border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="text-xs text-gray-600">{margin}% margen</div>
                  <div className="text-sm font-semibold text-gray-900">
                    {formatCurrency(price)}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
