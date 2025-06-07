import { useTranslations } from 'next-intl';
import { DashboardStats } from '@/components/dashboard/DashboardStats';
import { RecentActivity } from '@/components/dashboard/RecentActivity';
import { QuickActions } from '@/components/dashboard/QuickActions';

export default function HomePage() {
  const t = useTranslations('dashboard');

  return (
    <div className="space-y-6" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 className="text-3xl font-bold text-gray-900" style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '0.5rem' }}>
          {t('title')}
        </h1>
        <p className="text-gray-600 mt-2" style={{ color: '#6b7280', marginTop: '0.5rem' }}>
          {t('welcome')}
        </p>
      </div>

      <DashboardStats />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
        <QuickActions />
        <RecentActivity />
      </div>
    </div>
  );
}
