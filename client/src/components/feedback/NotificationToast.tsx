import React from 'react';
import { useUIStore } from '@/state/ui.store';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';

const icons = {
  success: <CheckCircle className="h-5 w-5 text-green-500 shrink-0" />,
  error:   <XCircle    className="h-5 w-5 text-red-500   shrink-0" />,
  warning: <AlertTriangle className="h-5 w-5 text-yellow-500 shrink-0" />,
  info:    <Info       className="h-5 w-5 text-blue-500  shrink-0" />,
};

const borders = {
  success: 'border-l-4 border-green-500',
  error:   'border-l-4 border-red-500',
  warning: 'border-l-4 border-yellow-500',
  info:    'border-l-4 border-blue-500',
};

export const NotificationToast: React.FC = () => {
  const { notifications, removeNotification } = useUIStore();

  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-3 w-80 pointer-events-none">
      {notifications.map((n) => (
        <div
          key={n.id}
          className={`
            pointer-events-auto
            flex items-start gap-3 p-4 rounded-lg shadow-lg
            bg-white dark:bg-zinc-900
            border border-gray-200 dark:border-zinc-700
            ${borders[n.type]}
            animate-in slide-in-from-right-5 fade-in duration-300
          `}
        >
          {icons[n.type]}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
              {n.title}
            </p>
            {n.message && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5 break-words">
                {n.message}
              </p>
            )}
          </div>
          <button
            onClick={() => removeNotification(n.id)}
            className="shrink-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
};