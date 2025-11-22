'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { clsx } from 'clsx';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface ToastContextType {
  showToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast = { ...toast, id };
    setToasts((prev) => [...prev, newToast]);

    if (toast.duration !== 0) {
      setTimeout(() => {
        removeToast(id);
      }, toast.duration || 5000);
    }
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const contextValue = { showToast, removeToast };

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      <StoreToastContext />
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-md">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

// Standalone showToast function for convenience
let globalShowToast: ((toast: Omit<Toast, 'id'>) => void) | null = null;

export const showToast = (toast: Omit<Toast, 'id'>) => {
  if (globalShowToast) {
    globalShowToast(toast);
  } else {
    console.warn('Toast context not initialized. Wrap your app with ToastProvider.');
  }
};

// Store context reference
const StoreToastContext: React.FC = () => {
  const context = useContext(ToastContext);
  if (context) {
    globalShowToast = context.showToast;
  }
  return null;
};

const ToastItem: React.FC<{ toast: Toast; onClose: () => void }> = ({ toast, onClose }) => {
  const icons = {
    success: <CheckCircle className="w-5 h-5 text-success" />,
    error: <AlertCircle className="w-5 h-5 text-danger" />,
    info: <Info className="w-5 h-5 text-info" />,
    warning: <AlertTriangle className="w-5 h-5 text-warning" />,
  };

  const styles = {
    success: 'bg-surface border-l-4 border-success',
    error: 'bg-surface border-l-4 border-danger',
    info: 'bg-surface border-l-4 border-info',
    warning: 'bg-surface border-l-4 border-warning',
  };

  return (
    <div
      className={clsx(
        'flex items-start gap-3 p-4 rounded shadow-lg border border-border animate-slide-in',
        styles[toast.type]
      )}
      role="alert"
    >
      <div className="flex-shrink-0 mt-0.5">{icons[toast.type]}</div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-text-primary">{toast.message}</p>
        {toast.action && (
          <button
            onClick={toast.action.onClick}
            className="mt-2 text-sm font-medium text-primary hover:text-primary-hover"
          >
            {toast.action.label}
          </button>
        )}
      </div>
      <button
        onClick={onClose}
        className="flex-shrink-0 text-text-tertiary hover:text-text-primary transition-colors"
        aria-label="Close notification"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
