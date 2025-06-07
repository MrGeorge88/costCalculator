'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { Database } from '@/types/database';
import {
  IngredientCalculation,
  RecipeCalculation,
  PresentationCalculation,
  calculateIngredientCost,
  calculateRecipeCost,
  calculateCostPerUnit,
  calculateSuggestedPrice,
  calculateProfitMargin,
  calculatePresentation,
} from '@/lib/calculations';

// Usar los tipos de la base de datos directamente
export type RecipeInsert = Database['public']['Tables']['recetas']['Insert'];
export type RecipeUpdate = Database['public']['Tables']['recetas']['Update'];
export type RecipeIngredientInsert = Database['public']['Tables']['receta_ingredientes']['Insert'];

export interface RecipeIngredient {
  id?: string;
  ingrediente_id: string;
  cantidad: number;
  unidad: string;
  ingrediente?: {
    id: string;
    nombre: string;
    precio_por_unidad: number;
    unidad_medida: string;
  };
}

export interface RecipeData {
  id?: string;
  nombre: string;
  descripcion?: string | null;
  categoria: string;
  tiempo_preparacion?: number | null;
  rendimiento: number;
  unidad_rendimiento: string;
  precio_sugerido?: number | null;
  margen_ganancia?: number | null;
  ingredientes: RecipeIngredient[];
}

export function useRecipeCalculations(initialData?: RecipeData) {
  const [recipeData, setRecipeData] = useState<RecipeData>(
    initialData || {
      nombre: '',
      categoria: 'ice_cream',
      rendimiento: 1,
      unidad_rendimiento: 'litros',
      ingredientes: [],
    }
  );

  const [calculations, setCalculations] = useState<RecipeCalculation>({
    ingredientes: [],
    costo_total: 0,
    rendimiento: 1,
    unidad_rendimiento: 'litros',
    costo_por_unidad_rendimiento: 0,
  });

  const [availableIngredients, setAvailableIngredients] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cargar ingredientes disponibles
  const loadAvailableIngredients = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('ingredientes')
        .select('*')
        .order('nombre');

      if (error) throw error;
      setAvailableIngredients(data || []);
    } catch (err) {
      console.error('Error loading ingredients:', err);
      setError('Error al cargar ingredientes');
    }
  }, []);

  // Cargar ingredientes al montar el componente
  useEffect(() => {
    loadAvailableIngredients();
  }, [loadAvailableIngredients]);

  // Función para calcular todos los costos de la receta
  const calculateRecipeCosts = useCallback(() => {
    const ingredientCalculations: IngredientCalculation[] = recipeData.ingredientes.map(ing => {
      const ingrediente = availableIngredients.find(i => i.id === ing.ingrediente_id);
      
      if (!ingrediente) {
        return {
          ingrediente_id: ing.ingrediente_id,
          nombre: 'Ingrediente no encontrado',
          cantidad: ing.cantidad,
          unidad: ing.unidad,
          precio_por_unidad: 0,
          costo_unitario: 0,
          costo_total: 0,
        };
      }

      const costo_total = calculateIngredientCost(
        ing.cantidad,
        ingrediente.precio_por_unidad,
        ingrediente.unidad_medida,
        ing.unidad
      );

      const costo_unitario = costo_total / ing.cantidad;

      return {
        ingrediente_id: ing.ingrediente_id,
        nombre: ingrediente.nombre,
        cantidad: ing.cantidad,
        unidad: ing.unidad,
        precio_por_unidad: ingrediente.precio_por_unidad,
        costo_unitario,
        costo_total,
      };
    });

    const recipeCalc = calculateRecipeCost(ingredientCalculations);
    const costo_por_unidad_rendimiento = calculateCostPerUnit(
      recipeCalc.costo_total,
      recipeData.rendimiento
    );

    const newCalculations: RecipeCalculation = {
      ...recipeCalc,
      rendimiento: recipeData.rendimiento,
      unidad_rendimiento: recipeData.unidad_rendimiento,
      costo_por_unidad_rendimiento,
    };

    // Calcular precio sugerido si hay margen definido
    if (recipeData.margen_ganancia && recipeData.margen_ganancia > 0) {
      newCalculations.precio_sugerido = calculateSuggestedPrice(
        recipeCalc.costo_total,
        recipeData.margen_ganancia
      );
      newCalculations.margen_ganancia = recipeData.margen_ganancia;
    }

    setCalculations(newCalculations);
  }, [recipeData, availableIngredients]);

  // Recalcular costos cuando cambian los ingredientes o el rendimiento
  useEffect(() => {
    calculateRecipeCosts();
  }, [recipeData.ingredientes, recipeData.rendimiento, calculateRecipeCosts]);

  // Agregar ingrediente a la receta
  const addIngredient = useCallback((ingrediente_id: string, cantidad: number = 1, unidad: string = 'kg') => {
    setRecipeData(prev => ({
      ...prev,
      ingredientes: [
        ...prev.ingredientes,
        { ingrediente_id, cantidad, unidad }
      ]
    }));
  }, []);

  // Actualizar ingrediente en la receta
  const updateIngredient = useCallback((index: number, updates: Partial<RecipeIngredient>) => {
    setRecipeData(prev => ({
      ...prev,
      ingredientes: prev.ingredientes.map((ing, i) => 
        i === index ? { ...ing, ...updates } : ing
      )
    }));
  }, []);

  // Remover ingrediente de la receta
  const removeIngredient = useCallback((index: number) => {
    setRecipeData(prev => ({
      ...prev,
      ingredientes: prev.ingredientes.filter((_, i) => i !== index)
    }));
  }, []);

  // Actualizar datos básicos de la receta
  const updateRecipeData = useCallback((updates: Partial<RecipeData>) => {
    setRecipeData(prev => ({ ...prev, ...updates }));
  }, []);

  // Calcular precio sugerido basado en margen
  const calculateSuggestedPriceFromMargin = useCallback((margen: number) => {
    const precio = calculateSuggestedPrice(calculations.costo_total, margen);
    setRecipeData(prev => ({
      ...prev,
      precio_sugerido: precio,
      margen_ganancia: margen,
    }));
    return precio;
  }, [calculations.costo_total]);

  // Calcular margen basado en precio
  const calculateMarginFromPrice = useCallback((precio: number) => {
    const margen = calculateProfitMargin(calculations.costo_total, precio);
    setRecipeData(prev => ({
      ...prev,
      precio_sugerido: precio,
      margen_ganancia: margen,
    }));
    return margen;
  }, [calculations.costo_total]);

  // Calcular presentación
  const calculatePresentationCost = useCallback((
    tamaño_porcion: number,
    unidad_porcion: string,
    precio_venta: number
  ): PresentationCalculation => {
    return calculatePresentation(
      calculations.costo_total,
      calculations.rendimiento,
      calculations.unidad_rendimiento,
      tamaño_porcion,
      unidad_porcion,
      precio_venta
    );
  }, [calculations]);

  // Guardar receta en la base de datos
  const saveRecipe = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        throw new Error('Usuario no autenticado');
      }

      // Guardar receta principal
      const recipePayload: RecipeInsert = {
        nombre: recipeData.nombre,
        descripcion: recipeData.descripcion,
        categoria: recipeData.categoria,
        tiempo_preparacion: recipeData.tiempo_preparacion,
        rendimiento: recipeData.rendimiento,
        unidad_rendimiento: recipeData.unidad_rendimiento,
        costo_total: calculations.costo_total,
        precio_sugerido: recipeData.precio_sugerido,
        margen_ganancia: recipeData.margen_ganancia,
        user_id: user.id,
      };

      let recipeId: string;

      if (recipeData.id) {
        // Actualizar receta existente
        const { error: updateError } = await supabase
          .from('recetas')
          .update(recipePayload as any)
          .eq('id' as any, recipeData.id);

        if (updateError) throw updateError;
        recipeId = recipeData.id;
      } else {
        // Crear nueva receta
        const { data: newRecipe, error: insertError } = await supabase
          .from('recetas')
          .insert(recipePayload as any)
          .select()
          .single();

        if (insertError) throw insertError;
        recipeId = (newRecipe as any).id;
      }

      // Eliminar ingredientes existentes si es actualización
      if (recipeData.id) {
        await supabase
          .from('receta_ingredientes')
          .delete()
          .eq('receta_id' as any, recipeId);
      }

      // Insertar ingredientes de la receta
      const ingredientPayloads: RecipeIngredientInsert[] = calculations.ingredientes.map(ing => ({
        receta_id: recipeId,
        ingrediente_id: ing.ingrediente_id,
        cantidad: ing.cantidad,
        unidad: ing.unidad,
        costo_unitario: ing.costo_unitario,
        costo_total: ing.costo_total,
      }));

      if (ingredientPayloads.length > 0) {
        const { error: ingredientsError } = await supabase
          .from('receta_ingredientes')
          .insert(ingredientPayloads as any);

        if (ingredientsError) throw ingredientsError;
      }

      // Actualizar el ID de la receta si es nueva
      if (!recipeData.id) {
        setRecipeData(prev => ({ ...prev, id: recipeId }));
      }

      return recipeId;
    } catch (err) {
      console.error('Error saving recipe:', err);
      setError('Error al guardar la receta');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [recipeData, calculations]);

  // Cargar receta existente
  const loadRecipe = useCallback(async (recipeId: string) => {
    setLoading(true);
    setError(null);

    try {
      // Cargar datos de la receta
      const { data: recipe, error: recipeError } = await supabase
        .from('recetas')
        .select('*')
        .eq('id' as any, recipeId)
        .single();

      if (recipeError) throw recipeError;

      // Cargar ingredientes de la receta
      const { data: ingredients, error: ingredientsError } = await supabase
        .from('receta_ingredientes')
        .select(`
          *,
          ingrediente:ingredientes(*)
        `)
        .eq('receta_id' as any, recipeId);

      if (ingredientsError) throw ingredientsError;

      const recipeIngredients: RecipeIngredient[] = (ingredients as any).map((ing: any) => ({
        id: ing.id,
        ingrediente_id: ing.ingrediente_id,
        cantidad: ing.cantidad,
        unidad: ing.unidad,
        ingrediente: ing.ingrediente,
      }));

      setRecipeData({
        id: (recipe as any).id,
        nombre: (recipe as any).nombre,
        descripcion: (recipe as any).descripcion,
        categoria: (recipe as any).categoria,
        tiempo_preparacion: (recipe as any).tiempo_preparacion,
        rendimiento: (recipe as any).rendimiento,
        unidad_rendimiento: (recipe as any).unidad_rendimiento,
        precio_sugerido: (recipe as any).precio_sugerido,
        margen_ganancia: (recipe as any).margen_ganancia,
        ingredientes: recipeIngredients,
      });
    } catch (err) {
      console.error('Error loading recipe:', err);
      setError('Error al cargar la receta');
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    // Estado
    recipeData,
    calculations,
    availableIngredients,
    loading,
    error,

    // Acciones
    addIngredient,
    updateIngredient,
    removeIngredient,
    updateRecipeData,
    calculateSuggestedPriceFromMargin,
    calculateMarginFromPrice,
    calculatePresentationCost,
    saveRecipe,
    loadRecipe,
    loadAvailableIngredients,
  };
}
