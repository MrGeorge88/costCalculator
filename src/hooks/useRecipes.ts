'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';

export interface Recipe {
  id: string;
  nombre: string;
  descripcion?: string | null;
  categoria: string;
  tiempo_preparacion?: number | null;
  rendimiento: number;
  unidad_rendimiento: string;
  costo_total: number;
  precio_sugerido?: number | null;
  margen_ganancia?: number | null;
  activa: boolean;
  created_at: string;
  updated_at: string;
  user_id: string;
}

export interface RecipeWithIngredients extends Recipe {
  ingredientes?: {
    id: string;
    cantidad: number;
    unidad: string;
    costo_unitario: number;
    costo_total: number;
    ingrediente: {
      id: string;
      nombre: string;
      unidad_medida: string;
      precio_por_unidad: number;
    };
  }[];
}

export function useRecipes() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cargar todas las recetas
  const loadRecipes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('recetas')
        .select('*')
        .order('nombre');

      if (error) throw error;
      setRecipes(data || []);
    } catch (err) {
      console.error('Error loading recipes:', err);
      setError('Error al cargar recetas');
    } finally {
      setLoading(false);
    }
  }, []);

  // Obtener receta con ingredientes
  const getRecipeWithIngredients = useCallback(async (id: string): Promise<RecipeWithIngredients> => {
    try {
      // Cargar datos de la receta
      const { data: recipe, error: recipeError } = await supabase
        .from('recetas')
        .select('*')
        .eq('id' as any, id)
        .single();

      if (recipeError) throw recipeError;

      // Cargar ingredientes de la receta
      const { data: ingredients, error: ingredientsError } = await supabase
        .from('receta_ingredientes')
        .select(`
          *,
          ingrediente:ingredientes(*)
        `)
        .eq('receta_id' as any, id);

      if (ingredientsError) throw ingredientsError;

      return {
        ...recipe,
        ingredientes: ingredients || []
      };
    } catch (err) {
      console.error('Error getting recipe with ingredients:', err);
      setError('Error al obtener receta');
      throw err;
    }
  }, []);

  // Eliminar receta
  const deleteRecipe = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);

      // Primero eliminar los ingredientes de la receta
      const { error: ingredientsError } = await supabase
        .from('receta_ingredientes')
        .delete()
        .eq('receta_id' as any, id);

      if (ingredientsError) throw ingredientsError;

      // Luego eliminar la receta
      const { error: recipeError } = await supabase
        .from('recetas')
        .delete()
        .eq('id' as any, id);

      if (recipeError) throw recipeError;

      // Actualizar la lista local
      setRecipes(prev => prev.filter(recipe => recipe.id !== id));
    } catch (err) {
      console.error('Error deleting recipe:', err);
      setError('Error al eliminar receta');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Activar/desactivar receta
  const toggleRecipeStatus = useCallback(async (id: string, activa: boolean) => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('recetas')
        .update({ activa } as any)
        .eq('id' as any, id)
        .select()
        .single();

      if (error) throw error;

      // Actualizar la lista local
      setRecipes(prev => prev.map(recipe => 
        recipe.id === id ? { ...recipe, activa } : recipe
      ));

      return data;
    } catch (err) {
      console.error('Error toggling recipe status:', err);
      setError('Error al cambiar estado de receta');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Duplicar receta
  const duplicateRecipe = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);

      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('Usuario no autenticado');
      }

      // Obtener la receta original con ingredientes
      const originalRecipe = await getRecipeWithIngredients(id);

      // Crear nueva receta
      const newRecipeData = {
        nombre: `${originalRecipe.nombre} (Copia)`,
        descripcion: originalRecipe.descripcion,
        categoria: originalRecipe.categoria,
        tiempo_preparacion: originalRecipe.tiempo_preparacion,
        rendimiento: originalRecipe.rendimiento,
        unidad_rendimiento: originalRecipe.unidad_rendimiento,
        precio_sugerido: originalRecipe.precio_sugerido,
        margen_ganancia: originalRecipe.margen_ganancia,
        user_id: user.id
      };

      const { data: newRecipe, error: recipeError } = await supabase
        .from('recetas')
        .insert(newRecipeData as any)
        .select()
        .single();

      if (recipeError) throw recipeError;

      // Copiar ingredientes si existen
      if (originalRecipe.ingredientes && originalRecipe.ingredientes.length > 0) {
        const ingredientData = originalRecipe.ingredientes.map(ing => ({
          receta_id: newRecipe.id,
          ingrediente_id: ing.ingrediente.id,
          cantidad: ing.cantidad,
          unidad: ing.unidad,
          costo_unitario: ing.costo_unitario,
          costo_total: ing.costo_total,
        }));

        const { error: ingredientsError } = await supabase
          .from('receta_ingredientes')
          .insert(ingredientData as any);

        if (ingredientsError) throw ingredientsError;
      }

      // Actualizar la lista local
      setRecipes(prev => [...prev, newRecipe]);
      return newRecipe;
    } catch (err) {
      console.error('Error duplicating recipe:', err);
      setError('Error al duplicar receta');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [getRecipeWithIngredients]);

  // Cargar recetas al montar el componente
  useEffect(() => {
    loadRecipes();
  }, [loadRecipes]);

  // Función para obtener recetas por categoría
  const getRecipesByCategory = useCallback((category: string) => {
    return recipes.filter(recipe => recipe.categoria === category);
  }, [recipes]);

  // Función para obtener recetas activas
  const getActiveRecipes = useCallback(() => {
    return recipes.filter(recipe => recipe.activa);
  }, [recipes]);

  // Función para obtener estadísticas
  const getRecipeStats = useCallback(() => {
    const total = recipes.length;
    const active = recipes.filter(r => r.activa).length;
    const avgCost = recipes.length > 0 
      ? recipes.reduce((sum, r) => sum + r.costo_total, 0) / recipes.length 
      : 0;
    const avgPrice = recipes.length > 0 
      ? recipes.reduce((sum, r) => sum + (r.precio_sugerido || 0), 0) / recipes.length 
      : 0;

    return {
      total,
      active,
      inactive: total - active,
      avgCost,
      avgPrice,
      avgMargin: avgPrice > 0 ? ((avgPrice - avgCost) / avgPrice) * 100 : 0
    };
  }, [recipes]);

  return {
    // Estado
    recipes,
    loading,
    error,

    // Acciones CRUD
    loadRecipes,
    getRecipeWithIngredients,
    deleteRecipe,
    toggleRecipeStatus,
    duplicateRecipe,

    // Utilidades
    getRecipesByCategory,
    getActiveRecipes,
    getRecipeStats,
  };
}
