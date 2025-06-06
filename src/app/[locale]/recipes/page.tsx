import { RecipeList } from '@/components/recipes/RecipeList';
import { RecipeHeader } from '@/components/recipes/RecipeHeader';

export default function RecipesPage() {
  return (
    <div className="space-y-6">
      <RecipeHeader />
      <RecipeList />
    </div>
  );
}
