'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { Plus, Search, Filter, Package } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export function PresentationsHeader() {
  const t = useTranslations('presentations');

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
      <div>
        <div className="flex items-center space-x-3 mb-2">
          <Package className="w-8 h-8 text-purple-600" />
          <h1 className="text-3xl font-bold text-gray-900">{t('title')}</h1>
        </div>
        <p className="text-gray-600">
          Gestiona las presentaciones comerciales de tus recetas
        </p>
      </div>

      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar presentaciones..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filtros
          </Button>
        </div>
      </div>
    </div>
  );
}
