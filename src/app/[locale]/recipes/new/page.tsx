'use client';

import { useRouter } from 'next/navigation';
import { RecipeForm } from '@/components/recipes/RecipeForm';

export default function NewRecipePage() {
  const router = useRouter();

  const handleSave = (recipeId: string) => {
    // Redirigir a la lista de recetas después de guardar
    router.push('/recipes');
  };

  const handleCancel = () => {
    // Regresar a la lista de recetas
    router.push('/recipes');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Nueva Receta</h1>
          <p className="text-gray-600 mt-1">
            Crea una nueva receta con cálculo automático de costos
          </p>
        </div>
      </div>

      <RecipeForm
        onSave={handleSave}
        onCancel={handleCancel}
      />
    </div>
  );
}
