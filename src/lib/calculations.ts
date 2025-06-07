/**
 * Funciones de cálculo para costos de recetas y márgenes de ganancia
 */

export interface IngredientCalculation {
  ingrediente_id: string;
  nombre: string;
  cantidad: number;
  unidad: string;
  precio_por_unidad: number;
  costo_unitario: number;
  costo_total: number;
}

export interface RecipeCalculation {
  ingredientes: IngredientCalculation[];
  costo_total: number;
  rendimiento: number;
  unidad_rendimiento: string;
  costo_por_unidad_rendimiento: number;
  precio_sugerido?: number;
  margen_ganancia?: number;
}

export interface PresentationCalculation {
  tamaño_porcion: number;
  unidad_porcion: string;
  costo_por_porcion: number;
  precio_venta: number;
  margen_ganancia: number;
  ganancia_absoluta: number;
}

/**
 * Calcula el costo total de un ingrediente en una receta
 */
export function calculateIngredientCost(
  cantidad: number,
  precio_por_unidad: number,
  unidad_ingrediente: string,
  unidad_receta: string
): number {
  // Factor de conversión básico (se puede expandir para más unidades)
  const conversionFactor = getConversionFactor(unidad_ingrediente, unidad_receta);
  const costo_unitario = precio_por_unidad * conversionFactor;
  return cantidad * costo_unitario;
}

/**
 * Calcula el costo total de una receta
 */
export function calculateRecipeCost(ingredientes: IngredientCalculation[]): RecipeCalculation {
  const costo_total = ingredientes.reduce((total, ingrediente) => {
    return total + ingrediente.costo_total;
  }, 0);

  return {
    ingredientes,
    costo_total,
    rendimiento: 0, // Se debe establecer desde el formulario
    unidad_rendimiento: '', // Se debe establecer desde el formulario
    costo_por_unidad_rendimiento: 0, // Se calculará cuando se establezca el rendimiento
  };
}

/**
 * Calcula el costo por unidad de rendimiento
 */
export function calculateCostPerUnit(
  costo_total: number,
  rendimiento: number
): number {
  if (rendimiento <= 0) return 0;
  return costo_total / rendimiento;
}

/**
 * Calcula el precio sugerido basado en el margen de ganancia deseado
 */
export function calculateSuggestedPrice(
  costo_total: number,
  margen_ganancia: number
): number {
  if (margen_ganancia <= 0) return costo_total;
  return costo_total / (1 - margen_ganancia / 100);
}

/**
 * Calcula el margen de ganancia basado en costo y precio de venta
 */
export function calculateProfitMargin(
  costo: number,
  precio_venta: number
): number {
  if (precio_venta <= 0) return 0;
  return ((precio_venta - costo) / precio_venta) * 100;
}

/**
 * Calcula la ganancia absoluta
 */
export function calculateAbsoluteProfit(
  costo: number,
  precio_venta: number
): number {
  return Math.max(0, precio_venta - costo);
}

/**
 * Calcula el costo por porción para presentaciones
 */
export function calculatePortionCost(
  costo_total_receta: number,
  rendimiento_receta: number,
  tamaño_porcion: number,
  unidad_porcion: string,
  unidad_rendimiento: string
): number {
  if (rendimiento_receta <= 0) return 0;
  
  const conversionFactor = getConversionFactor(unidad_rendimiento, unidad_porcion);
  const costo_por_unidad = costo_total_receta / (rendimiento_receta * conversionFactor);
  
  return costo_por_unidad * tamaño_porcion;
}

/**
 * Calcula todos los valores para una presentación
 */
export function calculatePresentation(
  costo_total_receta: number,
  rendimiento_receta: number,
  unidad_rendimiento: string,
  tamaño_porcion: number,
  unidad_porcion: string,
  precio_venta: number
): PresentationCalculation {
  const costo_por_porcion = calculatePortionCost(
    costo_total_receta,
    rendimiento_receta,
    tamaño_porcion,
    unidad_porcion,
    unidad_rendimiento
  );

  const margen_ganancia = calculateProfitMargin(costo_por_porcion, precio_venta);
  const ganancia_absoluta = calculateAbsoluteProfit(costo_por_porcion, precio_venta);

  return {
    tamaño_porcion,
    unidad_porcion,
    costo_por_porcion,
    precio_venta,
    margen_ganancia,
    ganancia_absoluta,
  };
}

/**
 * Obtiene el factor de conversión entre unidades
 * TODO: Expandir para más unidades de medida
 */
function getConversionFactor(unidad_origen: string, unidad_destino: string): number {
  // Conversiones básicas
  const conversions: Record<string, Record<string, number>> = {
    // Peso
    'kg': { 'g': 1000, 'kg': 1 },
    'g': { 'kg': 0.001, 'g': 1 },
    
    // Volumen
    'litros': { 'ml': 1000, 'litros': 1 },
    'ml': { 'litros': 0.001, 'ml': 1 },
    
    // Unidades
    'unidades': { 'unidades': 1 },
  };

  if (unidad_origen === unidad_destino) return 1;
  
  if (conversions[unidad_origen] && conversions[unidad_origen][unidad_destino]) {
    return conversions[unidad_origen][unidad_destino];
  }
  
  // Si no hay conversión disponible, asumir 1:1
  console.warn(`Conversión no disponible de ${unidad_origen} a ${unidad_destino}`);
  return 1;
}

/**
 * Formatea un valor monetario
 */
export function formatCurrency(amount: number, currency: string = '$'): string {
  return `${currency}${amount.toFixed(2)}`;
}

/**
 * Formatea un porcentaje
 */
export function formatPercentage(value: number, decimals: number = 1): string {
  return `${value.toFixed(decimals)}%`;
}

/**
 * Valida que un margen de ganancia esté en rango válido
 */
export function validateProfitMargin(margin: number): boolean {
  return margin >= 0 && margin <= 100;
}

/**
 * Calcula el punto de equilibrio (break-even point)
 */
export function calculateBreakEvenPoint(
  costos_fijos: number,
  costo_variable_por_unidad: number,
  precio_venta_por_unidad: number
): number {
  const margen_contribucion = precio_venta_por_unidad - costo_variable_por_unidad;
  if (margen_contribucion <= 0) return Infinity;
  
  return costos_fijos / margen_contribucion;
}

/**
 * Calcula múltiples escenarios de precios
 */
export function calculatePriceScenarios(
  costo_base: number,
  margenes: number[]
): Array<{ margen: number; precio: number; ganancia: number }> {
  return margenes.map(margen => {
    const precio = calculateSuggestedPrice(costo_base, margen);
    const ganancia = calculateAbsoluteProfit(costo_base, precio);
    
    return {
      margen,
      precio,
      ganancia,
    };
  });
}

/**
 * Optimiza el precio basado en elasticidad de demanda (simplificado)
 */
export function optimizePrice(
  costo_base: number,
  demanda_maxima: number,
  elasticidad: number = -1.5
): { precio_optimo: number; ganancia_maxima: number; unidades_vendidas: number } {
  // Algoritmo simplificado de optimización de precios
  let mejor_ganancia = 0;
  let precio_optimo = costo_base;
  let unidades_optimas = 0;

  // Probar diferentes precios
  for (let precio = costo_base * 1.1; precio <= costo_base * 3; precio += costo_base * 0.1) {
    const factor_precio = precio / costo_base;
    const unidades_vendidas = demanda_maxima * Math.pow(factor_precio, elasticidad);
    const ganancia_total = (precio - costo_base) * unidades_vendidas;

    if (ganancia_total > mejor_ganancia) {
      mejor_ganancia = ganancia_total;
      precio_optimo = precio;
      unidades_optimas = unidades_vendidas;
    }
  }

  return {
    precio_optimo,
    ganancia_maxima: mejor_ganancia,
    unidades_vendidas: unidades_optimas,
  };
}
