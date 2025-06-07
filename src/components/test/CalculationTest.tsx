'use client';

import { useState } from 'react';
import { Calculator, CheckCircle, XCircle } from 'lucide-react';
import {
  calculateIngredientCost,
  calculateRecipeCost,
  calculateCostPerUnit,
  calculateSuggestedPrice,
  calculateProfitMargin,
  calculatePresentation,
  formatCurrency,
  formatPercentage,
  IngredientCalculation,
} from '@/lib/calculations';

export function CalculationTest() {
  const [testResults, setTestResults] = useState<Array<{
    name: string;
    expected: any;
    actual: any;
    passed: boolean;
  }>>([]);

  const runTests = () => {
    const results = [];

    // Test 1: Cálculo de costo de ingrediente
    const ingredientCost = calculateIngredientCost(2, 1.50, 'kg', 'kg');
    results.push({
      name: 'Cálculo de costo de ingrediente (2kg × $1.50)',
      expected: 3.00,
      actual: ingredientCost,
      passed: Math.abs(ingredientCost - 3.00) < 0.01,
    });

    // Test 2: Cálculo de costo total de receta
    const mockIngredients: IngredientCalculation[] = [
      {
        ingrediente_id: '1',
        nombre: 'Leche',
        cantidad: 1,
        unidad: 'litros',
        precio_por_unidad: 1.50,
        costo_unitario: 1.50,
        costo_total: 1.50,
      },
      {
        ingrediente_id: '2',
        nombre: 'Azúcar',
        cantidad: 0.3,
        unidad: 'kg',
        precio_por_unidad: 0.80,
        costo_unitario: 0.80,
        costo_total: 0.24,
      },
    ];

    const recipeCalc = calculateRecipeCost(mockIngredients);
    results.push({
      name: 'Cálculo de costo total de receta',
      expected: 1.74,
      actual: recipeCalc.costo_total,
      passed: Math.abs(recipeCalc.costo_total - 1.74) < 0.01,
    });

    // Test 3: Cálculo de costo por unidad
    const costPerUnit = calculateCostPerUnit(1.74, 2);
    results.push({
      name: 'Cálculo de costo por unidad (1.74 / 2 litros)',
      expected: 0.87,
      actual: costPerUnit,
      passed: Math.abs(costPerUnit - 0.87) < 0.01,
    });

    // Test 4: Cálculo de precio sugerido con 60% margen
    const suggestedPrice = calculateSuggestedPrice(1.74, 60);
    results.push({
      name: 'Precio sugerido con 60% margen',
      expected: 4.35,
      actual: suggestedPrice,
      passed: Math.abs(suggestedPrice - 4.35) < 0.01,
    });

    // Test 5: Cálculo de margen de ganancia
    const profitMargin = calculateProfitMargin(1.74, 4.35);
    results.push({
      name: 'Margen de ganancia (costo: 1.74, precio: 4.35)',
      expected: 60,
      actual: profitMargin,
      passed: Math.abs(profitMargin - 60) < 0.1,
    });

    // Test 6: Cálculo de presentación
    const presentation = calculatePresentation(1.74, 2, 'litros', 150, 'ml', 2.50);
    results.push({
      name: 'Costo por porción (150ml de 2 litros)',
      expected: 0.13,
      actual: presentation.costo_por_porcion,
      passed: Math.abs(presentation.costo_por_porcion - 0.13) < 0.01,
    });

    results.push({
      name: 'Margen de presentación (costo: 0.13, precio: 2.50)',
      expected: 94.8,
      actual: presentation.margen_ganancia,
      passed: Math.abs(presentation.margen_ganancia - 94.8) < 0.1,
    });

    setTestResults(results);
  };

  const passedTests = testResults.filter(t => t.passed).length;
  const totalTests = testResults.length;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center space-x-2 mb-6">
        <Calculator className="w-5 h-5 text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-900">Test de Cálculos</h3>
      </div>

      <div className="mb-6">
        <button
          onClick={runTests}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Ejecutar Tests
        </button>
      </div>

      {testResults.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <span className="font-medium text-gray-900">Resultados</span>
            <span className={`font-bold ${passedTests === totalTests ? 'text-green-600' : 'text-red-600'}`}>
              {passedTests}/{totalTests} tests pasaron
            </span>
          </div>

          <div className="space-y-2">
            {testResults.map((result, index) => (
              <div
                key={index}
                className={`flex items-center justify-between p-3 rounded-lg border ${
                  result.passed 
                    ? 'bg-green-50 border-green-200' 
                    : 'bg-red-50 border-red-200'
                }`}
              >
                <div className="flex items-center space-x-3">
                  {result.passed ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-600" />
                  )}
                  <span className="font-medium text-gray-900">{result.name}</span>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-600">
                    Esperado: {typeof result.expected === 'number' ? result.expected.toFixed(2) : result.expected}
                  </div>
                  <div className="text-sm text-gray-600">
                    Actual: {typeof result.actual === 'number' ? result.actual.toFixed(2) : result.actual}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Ejemplo de cálculo completo */}
          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-3">Ejemplo de Cálculo Completo</h4>
            <div className="space-y-2 text-sm text-blue-800">
              <p><strong>Receta:</strong> Helado de Vainilla (2 litros)</p>
              <p><strong>Ingredientes:</strong></p>
              <ul className="ml-4 space-y-1">
                <li>• 1 litro de leche × $1.50 = $1.50</li>
                <li>• 0.3 kg de azúcar × $0.80 = $0.24</li>
              </ul>
              <p><strong>Costo total:</strong> $1.74</p>
              <p><strong>Costo por litro:</strong> $0.87</p>
              <p><strong>Precio con 60% margen:</strong> $4.35</p>
              <p><strong>Presentación 150ml:</strong> Costo $0.13, Precio $2.50, Margen 94.8%</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
