'use client';

import { ReactNode, forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertCircle, CheckCircle, AlertTriangle, Info } from 'lucide-react';

interface AlertProps {
  children: ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
  title?: string;
  dismissible?: boolean;
  onDismiss?: () => void;
  className?: string;
  icon?: boolean;
}

const Alert = forwardRef<HTMLDivElement, AlertProps>(
  ({ 
    children, 
    variant = 'default', 
    title, 
    dismissible = false, 
    onDismiss,
    className,
    icon = true,
    ...props 
  }, ref) => {
    const variants = {
      default: {
        container: 'bg-gray-50 border-gray-200 text-gray-800',
        icon: 'text-gray-600',
        iconComponent: Info
      },
      success: {
        container: 'bg-green-50 border-green-200 text-green-800',
        icon: 'text-green-600',
        iconComponent: CheckCircle
      },
      warning: {
        container: 'bg-yellow-50 border-yellow-200 text-yellow-800',
        icon: 'text-yellow-600',
        iconComponent: AlertTriangle
      },
      danger: {
        container: 'bg-red-50 border-red-200 text-red-800',
        icon: 'text-red-600',
        iconComponent: AlertCircle
      },
      info: {
        container: 'bg-blue-50 border-blue-200 text-blue-800',
        icon: 'text-blue-600',
        iconComponent: Info
      }
    };

    const config = variants[variant];
    const IconComponent = config.iconComponent;

    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3 }}
        className={cn(
          'relative rounded-xl border p-4',
          config.container,
          className
        )}
        {...props}
      >
        <div className="flex">
          {icon && (
            <div className="flex-shrink-0">
              <IconComponent className={cn('h-5 w-5', config.icon)} />
            </div>
          )}
          
          <div className={cn('flex-1', icon && 'ml-3')}>
            {title && (
              <h3 className="text-sm font-semibold mb-1">
                {title}
              </h3>
            )}
            <div className="text-sm">
              {children}
            </div>
          </div>
          
          {dismissible && (
            <div className="flex-shrink-0 ml-4">
              <button
                type="button"
                className={cn(
                  'inline-flex rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2',
                  config.icon,
                  'hover:bg-black/5 focus:ring-offset-transparent focus:ring-current'
                )}
                onClick={onDismiss}
              >
                <span className="sr-only">Dismiss</span>
                <X className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </motion.div>
    );
  }
);

Alert.displayName = 'Alert';

interface AlertTitleProps {
  children: ReactNode;
  className?: string;
}

export function AlertTitle({ children, className }: AlertTitleProps) {
  return (
    <h5 className={cn('mb-1 font-medium leading-none tracking-tight', className)}>
      {children}
    </h5>
  );
}

interface AlertDescriptionProps {
  children: ReactNode;
  className?: string;
}

export function AlertDescription({ children, className }: AlertDescriptionProps) {
  return (
    <div className={cn('text-sm [&_p]:leading-relaxed', className)}>
      {children}
    </div>
  );
}

// Toast notification component
interface ToastProps extends Omit<AlertProps, 'dismissible'> {
  duration?: number;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
}

export function Toast({ 
  duration = 5000, 
  position = 'top-right',
  onDismiss,
  ...props 
}: ToastProps) {
  const positionClasses = {
    'top-right': 'fixed top-4 right-4 z-50',
    'top-left': 'fixed top-4 left-4 z-50',
    'bottom-right': 'fixed bottom-4 right-4 z-50',
    'bottom-left': 'fixed bottom-4 left-4 z-50'
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, x: position.includes('right') ? 100 : -100 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: position.includes('right') ? 100 : -100 }}
        className={positionClasses[position]}
      >
        <Alert
          {...props}
          dismissible
          onDismiss={onDismiss}
          className="min-w-[300px] shadow-lg"
        />
      </motion.div>
    </AnimatePresence>
  );
}

export { Alert };
