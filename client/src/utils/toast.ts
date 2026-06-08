import { useUIStore } from '@/state/ui.store';

export const useToast = () => {
  const { addNotification, removeNotification } = useUIStore();

  const toast = {
    success: (title: string, message?: string, duration?: number) => {
      addNotification({ type: 'success', title, message, duration });
    },
    error: (title: string, message?: string, duration?: number) => {
      addNotification({ type: 'error', title, message, duration });
    },
    warning: (title: string, message?: string, duration?: number) => {
      addNotification({ type: 'warning', title, message, duration });
    },
    info: (title: string, message?: string, duration?: number) => {
      addNotification({ type: 'info', title, message, duration });
    },
    dismiss: (id: string) => {
      removeNotification(id);
    },
  };

  return toast;
};

export const showSuccessToast = (title: string, message?: string) => {
  const { addNotification } = useUIStore.getState();
  addNotification({ type: 'success', title, message });
};

export const showErrorToast = (title: string, message?: string) => {
  const { addNotification } = useUIStore.getState();
  addNotification({ type: 'error', title, message });
};

export const showWarningToast = (title: string, message?: string) => {
  const { addNotification } = useUIStore.getState();
  addNotification({ type: 'warning', title, message });
};

export const showInfoToast = (title: string, message?: string) => {
  const { addNotification } = useUIStore.getState();
  addNotification({ type: 'info', title, message });
};
