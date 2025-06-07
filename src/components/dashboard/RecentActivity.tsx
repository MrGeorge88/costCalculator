'use client';

import { useTranslations } from 'next-intl';
import { Clock, Package, ChefHat, Edit, Activity } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { motion } from 'framer-motion';

export function RecentActivity() {
  const t = useTranslations('dashboard');

  // Mock data for demonstration
  const activities = [
    {
      id: 1,
      type: 'recipe',
      title: 'Receta "Vainilla Premium" creada',
      time: 'Hace 2 horas',
      icon: ChefHat,
      color: 'primary' as const
    },
    {
      id: 2,
      type: 'ingredient',
      title: 'Stock de "Leche Entera" actualizado',
      time: 'Hace 4 horas',
      icon: Package,
      color: 'secondary' as const
    },
    {
      id: 3,
      type: 'edit',
      title: 'Receta "Chocolate Intenso" modificada',
      time: 'Hace 1 día',
      icon: Edit,
      color: 'warning' as const
    }
  ];

  return (
    <Card hover>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-primary" />
          {t('recentActivity')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {activities.length > 0 ? (
          <div className="space-y-4">
            {activities.map((activity, index) => {
              const Icon = activity.icon;
              return (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.3 }}
                  className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                      <Icon className="w-4 h-4 text-gray-600" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {activity.title}
                    </p>
                    <div className="flex items-center space-x-2 mt-1">
                      <p className="text-xs text-gray-500">{activity.time}</p>
                      <Badge variant={activity.color} size="sm">
                        {activity.type}
                      </Badge>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8">
            <Clock className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-sm">
              La actividad reciente aparecerá aquí cuando comiences a usar la aplicación
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
