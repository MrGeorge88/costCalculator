'use client';

import { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { SkeletonCard } from '@/components/ui/Loading';

interface KpiCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color?: 'primary' | 'secondary' | 'warning' | 'danger' | 'success';
  change?: {
    value: string;
    type: 'positive' | 'negative' | 'neutral';
  };
  loading?: boolean;
  tooltip?: string;
  className?: string;
}

const colorVariants = {
  primary: {
    bg: 'bg-primary/10',
    icon: 'bg-primary text-white',
    text: 'text-primary'
  },
  secondary: {
    bg: 'bg-secondary/10',
    icon: 'bg-secondary text-white',
    text: 'text-secondary'
  },
  warning: {
    bg: 'bg-warning/10',
    icon: 'bg-warning text-white',
    text: 'text-warning'
  },
  danger: {
    bg: 'bg-danger/10',
    icon: 'bg-danger text-white',
    text: 'text-danger'
  },
  success: {
    bg: 'bg-green-50',
    icon: 'bg-green-500 text-white',
    text: 'text-green-600'
  }
};

export function KpiCard({
  title,
  value,
  icon: Icon,
  color = 'primary',
  change,
  loading = false,
  tooltip,
  className
}: KpiCardProps) {
  const colors = colorVariants[color];

  if (loading) {
    return <SkeletonCard />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        'bg-white rounded-2xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-all duration-200 cursor-pointer',
        className
      )}
      title={tooltip}
      whileHover={{ y: -2 }}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>

          <div className="flex items-baseline space-x-2">
            <p className="text-3xl font-bold text-gray-900">{value}</p>
            {change && (
              <span
                className={cn(
                  'text-sm font-medium',
                  change.type === 'positive' && 'text-green-600',
                  change.type === 'negative' && 'text-red-600',
                  change.type === 'neutral' && 'text-gray-500'
                )}
              >
                {change.value}
              </span>
            )}
          </div>

          {change && (
            <p className="text-xs text-gray-500 mt-1">vs mes anterior</p>
          )}
        </div>

        <motion.div
          className={cn('w-12 h-12 rounded-xl flex items-center justify-center', colors.icon)}
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.2 }}
        >
          <Icon className="w-6 h-6" />
        </motion.div>
      </div>
    </motion.div>
  );
}
