import { useTranslations } from 'next-intl';
import { DashboardStats } from '@/components/dashboard/DashboardStats';
import { RecentActivity } from '@/components/dashboard/RecentActivity';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { TailwindTest } from '@/components/test/TailwindTest';
import { CalculationTest } from '@/components/test/CalculationTest';

export default function HomePage() {
  const t = useTranslations('dashboard');

  return (
    <div className="space-y-6">
      <TailwindTest />

      <div>
        <h1 className="text-3xl font-bold text-gray-900">{t('title')}</h1>
        <p className="text-gray-600 mt-2">{t('welcome')}</p>
      </div>

      <DashboardStats />

      <CalculationTest />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <QuickActions />
        <RecentActivity />
      </div>
    </div>
  );
}
