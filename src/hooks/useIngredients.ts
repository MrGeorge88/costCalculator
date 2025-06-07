'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { Database } from '@/types/database';

// Usar los tipos de la base de datos directamente
export type Ingredient = Database['public']['Tables']['ingredientes']['Row'];
export type IngredientInsert = Database['public']['Tables']['ingredientes']['Insert'];
export type IngredientUpdate = Database['public']['Tables']['ingredientes']['Update'];

export interface IngredientFormData {
  nombre: string;
  descripcion: string;
  unidad_medida: string;
  precio_por_unidad: string;
  stock_actual: string;
  stock_minimo: string;
  proveedor: string;
  categoria: string;
  fecha_vencimiento: string;
}

export function useIngredients() {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cargar todos los ingredientes
  const loadIngredients = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('ingredientes')
        .select('*')
        .order('nombre');

      if (error) throw error;
      setIngredients((data || []) as unknown as Ingredient[]);
    } catch (err) {
      console.error('Error loading ingredients:', err);
      setError('Error al cargar ingredientes');
    } finally {
      setLoading(false);
    }
  }, []);

  // Crear nuevo ingrediente
  const createIngredient = useCallback(async (formData: IngredientFormData) => {
    try {
      setLoading(true);
      setError(null);

      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('Usuario no autenticado');
      }

      const ingredientData = {
        nombre: formData.nombre.trim(),
        descripcion: formData.descripcion.trim() || null,
        unidad_medida: formData.unidad_medida,
        precio_por_unidad: parseFloat(formData.precio_por_unidad),
        stock_actual: parseFloat(formData.stock_actual),
        stock_minimo: parseFloat(formData.stock_minimo),
        proveedor: formData.proveedor.trim() || null,
        categoria: formData.categoria,
        fecha_vencimiento: formData.fecha_vencimiento || null,
        user_id: user.id
      };

      const { data, error } = await supabase
        .from('ingredientes')
        .insert([ingredientData as any])
        .select()
        .single();

      if (error) throw error;

      // Actualizar la lista local
      setIngredients(prev => [...prev, data as unknown as Ingredient]);
      return data;
    } catch (err) {
      console.error('Error creating ingredient:', err);
      setError('Error al crear ingrediente');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Actualizar ingrediente existente
  const updateIngredient = useCallback(async (id: string, formData: IngredientFormData) => {
    try {
      setLoading(true);
      setError(null);

      const ingredientData = {
        nombre: formData.nombre.trim(),
        descripcion: formData.descripcion.trim() || null,
        unidad_medida: formData.unidad_medida,
        precio_por_unidad: parseFloat(formData.precio_por_unidad),
        stock_actual: parseFloat(formData.stock_actual),
        stock_minimo: parseFloat(formData.stock_minimo),
        proveedor: formData.proveedor.trim() || null,
        categoria: formData.categoria,
        fecha_vencimiento: formData.fecha_vencimiento || null,
      };

      const { data, error } = await supabase
        .from('ingredientes')
        .update(ingredientData as any)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      // Actualizar la lista local
      setIngredients(prev => prev.map(ing => ing.id === id ? data as unknown as Ingredient : ing));
      return data;
    } catch (err) {
      console.error('Error updating ingredient:', err);
      setError('Error al actualizar ingrediente');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Eliminar ingrediente
  const deleteIngredient = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);

      const { error } = await supabase
        .from('ingredientes')
        .delete()
        .eq('id', id);

      if (error) throw error;

      // Actualizar la lista local
      setIngredients(prev => prev.filter(ing => ing.id !== id));
    } catch (err) {
      console.error('Error deleting ingredient:', err);
      setError('Error al eliminar ingrediente');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Obtener ingrediente por ID
  const getIngredient = useCallback(async (id: string): Promise<Ingredient> => {
    try {
      const { data, error } = await supabase
        .from('ingredientes')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      if (!data) throw new Error('Ingrediente no encontrado');

      return data as unknown as Ingredient;
    } catch (err) {
      console.error('Error getting ingredient:', err);
      setError('Error al obtener ingrediente');
      throw err;
    }
  }, []);

  // Cargar ingredientes al montar el componente
  useEffect(() => {
    loadIngredients();
  }, [loadIngredients]);

  // Función para verificar stock bajo
  const getLowStockIngredients = useCallback(() => {
    return ingredients.filter(ing => ing.stock_actual <= ing.stock_minimo);
  }, [ingredients]);

  // Función para obtener ingredientes por categoría
  const getIngredientsByCategory = useCallback((category: string) => {
    return ingredients.filter(ing => ing.categoria === category);
  }, [ingredients]);

  return {
    // Estado
    ingredients,
    loading,
    error,

    // Acciones CRUD
    loadIngredients,
    createIngredient,
    updateIngredient,
    deleteIngredient,
    getIngredient,

    // Utilidades
    getLowStockIngredients,
    getIngredientsByCategory,
  };
}
