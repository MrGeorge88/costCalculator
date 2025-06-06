import { useTranslations } from 'next-intl';
import { IngredientForm } from '@/components/inventory/IngredientForm';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function NewIngredientPage() {
  const t = useTranslations('inventory');

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Link
          href="/inventory"
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver al inventario</span>
        </Link>
      </div>

      <div>
        <h1 className="text-3xl font-bold text-gray-900">{t('addIngredient')}</h1>
        <p className="text-gray-600 mt-2">Agrega un nuevo ingrediente a tu inventario</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <IngredientForm />
      </div>
    </div>
  );
}
