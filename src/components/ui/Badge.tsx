import React from 'react';
import { clsx } from 'clsx';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'neutral';
  size?: 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  className,
}) => {
  const variants = {
    default: 'bg-primary-light text-primary',
    success: 'bg-green-100 text-success',
    warning: 'bg-orange-100 text-warning',
    danger: 'bg-red-100 text-danger',
    info: 'bg-blue-100 text-info',
    neutral: 'bg-background text-text-secondary',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2 py-1 text-xs',
  };

  return (
    <span
      className={clsx(
        'badge',
        variants[variant],
        sizes[size],
        className
      )}
    >
      {children}
    </span>
  );
};

export const getStatusBadge = (status: string): { variant: BadgeProps['variant']; label: string } => {
  const statusMap: Record<string, { variant: BadgeProps['variant']; label: string }> = {
    draft: { variant: 'neutral', label: 'Draft' },
    waiting: { variant: 'warning', label: 'Waiting' },
    ready: { variant: 'info', label: 'Ready' },
    picked: { variant: 'info', label: 'Picked' },
    packed: { variant: 'info', label: 'Packed' },
    shipped: { variant: 'success', label: 'Shipped' },
    done: { variant: 'success', label: 'Done' },
    in_transit: { variant: 'warning', label: 'In Transit' },
    scheduled: { variant: 'info', label: 'Scheduled' },
    cancelled: { variant: 'danger', label: 'Cancelled' },
  };

  return statusMap[status] || { variant: 'neutral', label: status };
};
