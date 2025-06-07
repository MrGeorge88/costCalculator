'use client';

import { useTranslations } from 'next-intl';
import { Package, ChefHat, AlertTriangle, TrendingUp } from 'lucide-react';
import { KpiCard } from '@/components/kpi/KpiCard';
import { useDashboardStats } from '@/hooks/useDashboardStats';
import { motion } from 'framer-motion';

export function DashboardStats() {
  const t = useTranslations('dashboard');
  const { totalRecipes, totalIngredients, lowStockItems, averageMargin, loading } = useDashboardStats();

  const kpiData = [
    {
      title: t('totalRecipes'),
      value: totalRecipes.toString(),
      icon: ChefHat,
      color: 'primary' as const,
      tooltip: 'Total de recetas creadas en el sistema'
    },
    {
      title: t('totalIngredients'),
      value: totalIngredients.toString(),
      icon: Package,
      color: 'success' as const,
      tooltip: 'Total de ingredientes en inventario'
    },
    {
      title: t('lowStockItems'),
      value: lowStockItems.toString(),
      icon: AlertTriangle,
      color: lowStockItems > 0 ? 'danger' as const : 'warning' as const,
      tooltip: 'Ingredientes con stock bajo'
    },
    {
      title: 'Margen Promedio',
      value: `${averageMargin.toFixed(1)}%`,
      icon: TrendingUp,
      color: 'secondary' as const,
      tooltip: 'Margen de ganancia promedio de todas las recetas'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
    >
      {kpiData.map((kpi, index) => (
        <motion.div
          key={kpi.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1, duration: 0.3 }}
        >
          <KpiCard
            title={kpi.title}
            value={kpi.value}
            icon={kpi.icon}
            color={kpi.color}
            loading={loading}
            tooltip={kpi.tooltip}
          />
        </motion.div>
      ))}
    </motion.div>
  );
}
