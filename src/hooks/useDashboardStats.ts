'use client';

import { useMemo } from 'react';
import { useRecipes } from './useRecipes';
import { useIngredients } from './useIngredients';

export interface DashboardStats {
  totalRecipes: number;
  totalIngredients: number;
  lowStockItems: number;
  averageMargin: number;
  loading: boolean;
}

export function useDashboardStats(): DashboardStats {
  const { recipes, loading: recipesLoading } = useRecipes();
  const { ingredients, loading: ingredientsLoading } = useIngredients();

  const stats = useMemo(() => {
    const totalRecipes = recipes.length;
    const totalIngredients = ingredients.length;
    
    const lowStockItems = ingredients.filter(ingredient =>
      ingredient.stock_actual !== null &&
      ingredient.stock_minimo !== null &&
      ingredient.stock_actual <= ingredient.stock_minimo
    ).length;

    const averageMargin = recipes.length > 0
      ? recipes.reduce((acc, recipe) => acc + (recipe.margen_ganancia || 0), 0) / recipes.length
      : 0;

    return {
      totalRecipes,
      totalIngredients,
      lowStockItems,
      averageMargin,
      loading: recipesLoading || ingredientsLoading
    };
  }, [recipes, ingredients, recipesLoading, ingredientsLoading]);

  return stats;
}
