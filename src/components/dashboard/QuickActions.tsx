'use client';

import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import { Package, ChefHat, Calculator, Plus } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { motion } from 'framer-motion';

export function QuickActions() {
  const t = useTranslations('dashboard');
  const locale = useLocale();

  const actions = [
    {
      name: 'Agregar Ingrediente',
      description: 'Añadir nuevos ingredientes al inventario',
      href: '/inventory/new',
      icon: Package,
      color: 'primary' as const
    },
    {
      name: 'Nueva Receta',
      description: 'Crear una nueva receta de helado',
      href: '/recipes/new',
      icon: ChefHat,
      color: 'secondary' as const
    },
    {
      name: 'Simular Costos',
      description: 'Analizar escenarios de precios',
      href: '/simulator',
      icon: Calculator,
      color: 'warning' as const
    }
  ];

  return (
    <Card hover>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="w-5 h-5 text-primary" />
          {t('quickActions')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {actions.map((action, index) => {
            const Icon = action.icon;
            return (
              <motion.div
                key={action.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1, duration: 0.3 }}
              >
                <Link href={`/${locale}${action.href}`}>
                  <Button
                    variant={action.color}
                    size="lg"
                    className="w-full justify-start h-auto p-4"
                    icon={<Icon className="w-5 h-5" />}
                  >
                    <div className="text-left">
                      <div className="font-semibold">{action.name}</div>
                      <div className="text-sm opacity-90 font-normal">
                        {action.description}
                      </div>
                    </div>
                  </Button>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
