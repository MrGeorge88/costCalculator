'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { Database } from '@/types/database';

// Usar los tipos de la base de datos directamente
export type Presentation = Database['public']['Tables']['presentaciones']['Row'];
export type PresentationInsert = Database['public']['Tables']['presentaciones']['Insert'];
export type PresentationUpdate = Database['public']['Tables']['presentaciones']['Update'];

// Tipo extendido con información de la receta
export interface PresentationWithRecipe extends Presentation {
  receta: {
    id: string;
    nombre: string;
    categoria: string;
    costo_total: number;
    rendimiento: number;
    unidad_rendimiento: string;
  };
}

export function usePresentations() {
  const [presentations, setPresentations] = useState<PresentationWithRecipe[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cargar todas las presentaciones con información de recetas
  const loadPresentations = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('presentaciones')
        .select(`
          *,
          receta:recetas(
            id,
            nombre,
            categoria,
            costo_total,
            rendimiento,
            unidad_rendimiento
          )
        `)
        .eq('activa', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPresentations((data || []) as PresentationWithRecipe[]);
    } catch (err) {
      console.error('Error loading presentations:', err);
      setError('Error al cargar presentaciones');
    } finally {
      setLoading(false);
    }
  }, []);

  // Obtener presentaciones por receta
  const getPresentationsByRecipe = useCallback(async (recipeId: string): Promise<Presentation[]> => {
    try {
      const { data, error } = await supabase
        .from('presentaciones')
        .select('*')
        .eq('receta_id', recipeId)
        .eq('activa', true)
        .order('nombre');

      if (error) throw error;
      return (data || []) as Presentation[];
    } catch (err) {
      console.error('Error getting presentations by recipe:', err);
      setError('Error al obtener presentaciones de la receta');
      throw err;
    }
  }, []);

  // Crear nueva presentación
  const createPresentation = useCallback(async (presentationData: Omit<PresentationInsert, 'user_id'>): Promise<string> => {
    try {
      setLoading(true);
      setError(null);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuario no autenticado');

      const { data, error } = await supabase
        .from('presentaciones')
        .insert({
          ...presentationData,
        })
        .select('id')
        .single();

      if (error) throw error;
      if (!data) throw new Error('No se pudo crear la presentación');

      await loadPresentations(); // Recargar lista
      return data.id;
    } catch (err) {
      console.error('Error creating presentation:', err);
      setError('Error al crear presentación');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [loadPresentations]);

  // Actualizar presentación
  const updatePresentation = useCallback(async (id: string, updates: PresentationUpdate): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      const { error } = await supabase
        .from('presentaciones')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id);

      if (error) throw error;
      await loadPresentations(); // Recargar lista
    } catch (err) {
      console.error('Error updating presentation:', err);
      setError('Error al actualizar presentación');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [loadPresentations]);

  // Eliminar presentación (soft delete)
  const deletePresentation = useCallback(async (id: string): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      const { error } = await supabase
        .from('presentaciones')
        .update({ activa: false })
        .eq('id', id);

      if (error) throw error;
      await loadPresentations(); // Recargar lista
    } catch (err) {
      console.error('Error deleting presentation:', err);
      setError('Error al eliminar presentación');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [loadPresentations]);

  // Cargar presentaciones al montar el componente
  useEffect(() => {
    loadPresentations();
  }, [loadPresentations]);

  return {
    presentations,
    loading,
    error,
    loadPresentations,
    getPresentationsByRecipe,
    createPresentation,
    updatePresentation,
    deletePresentation,
  };
}
