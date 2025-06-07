import { useTranslations } from 'next-intl';
import { DashboardStats } from '@/components/dashboard/DashboardStats';
import { RecentActivity } from '@/components/dashboard/RecentActivity';
import { QuickActions } from '@/components/dashboard/QuickActions';

export default function HomePage() {
  const t = useTranslations('dashboard');

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="text-center lg:text-left">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          {t('title')}
        </h1>
        <p className="text-xl text-gray-600">
          {t('welcome')}
        </p>
      </div>

      {/* KPI Cards */}
      <DashboardStats />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <QuickActions />
        <RecentActivity />
      </div>
    </div>
  );
}
