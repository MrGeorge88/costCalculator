import { useTranslations } from 'next-intl';
import { InventoryList } from '@/components/inventory/InventoryList';
import { InventoryHeader } from '@/components/inventory/InventoryHeader';

export default function InventoryPage() {
  const t = useTranslations('inventory');

  return (
    <div className="space-y-6">
      <InventoryHeader />
      <InventoryList />
    </div>
  );
}
