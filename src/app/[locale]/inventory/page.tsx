import { InventoryList } from '@/components/inventory/InventoryList';
import { InventoryHeader } from '@/components/inventory/InventoryHeader';

export default function InventoryPage() {
  return (
    <div className="space-y-6">
      <InventoryHeader />
      <InventoryList />
    </div>
  );
}
