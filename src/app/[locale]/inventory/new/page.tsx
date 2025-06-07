import { useTranslations } from 'next-intl';
import { IngredientForm } from '@/components/inventory/IngredientForm';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function NewIngredientPage() {
  const t = useTranslations('inventory');

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/inventory"
            className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Volver al inventario</span>
          </Link>

          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">{t('addIngredient')}</h1>
            <p className="text-lg text-gray-600">
              Completa la información del nuevo ingrediente para agregarlo a tu inventario
            </p>
          </div>
        </div>

        {/* Formulario */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
          <IngredientForm />
        </div>
      </div>
    </div>
  );
}
