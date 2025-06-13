import { useTranslations } from 'next-intl';
import { PresentationsList } from '@/components/presentations/PresentationsList';
import { PresentationsHeader } from '@/components/presentations/PresentationsHeader';
import { AuthGuard } from '@/components/auth/AuthGuard';

export default function PresentationsPage() {
  const t = useTranslations('presentations');

  return (
    <AuthGuard requireAuth={true}>
      <div className="space-y-6">
        <PresentationsHeader />
        <PresentationsList />
      </div>
    </AuthGuard>
  );
}
