import { useTranslations } from 'next-intl';
import { PriceSimulator } from '@/components/simulator/PriceSimulator';
import { ProductionSimulator } from '@/components/simulator/ProductionSimulator';

export default function SimulatorPage() {
  const t = useTranslations('simulator');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">{t('title')}</h1>
        <p className="text-gray-600 mt-2">Simula diferentes escenarios de precios y producción</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PriceSimulator />
        <ProductionSimulator />
      </div>
    </div>
  );
}
