import React from 'react';
import { clsx } from 'clsx';
import { TrendingUp, TrendingDown } from 'lucide-react';

export interface KPICardProps {
  title: string;
  value: number | string;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  subtitle?: string;
  onClick?: () => void;
  variant?: 'default' | 'warning' | 'danger' | 'success';
  isLoading?: boolean;
}

export const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  icon,
  trend,
  subtitle,
  onClick,
  variant = 'default',
  isLoading,
}) => {
  const variants = {
    default: 'border-border',
    warning: 'border-l-4 border-l-warning',
    danger: 'border-l-4 border-l-danger',
    success: 'border-l-4 border-l-success',
  };

  if (isLoading) {
    return (
      <div className={clsx('card p-6', variants[variant])}>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="skeleton h-4 w-24 mb-2"></div>
            <div className="skeleton h-8 w-32 mb-2"></div>
            <div className="skeleton h-3 w-20"></div>
          </div>
          {icon && <div className="skeleton h-10 w-10 rounded"></div>}
        </div>
      </div>
    );
  }

  return (
    <div
      className={clsx(
        'card p-6 transition-all duration-150',
        variants[variant],
        onClick && 'cursor-pointer hover:shadow-md'
      )}
      onClick={onClick}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-text-secondary mb-1">{title}</p>
          <p className="text-2xl font-semibold text-text-primary mb-2">{value}</p>
          {(trend || subtitle) && (
            <div className="flex items-center gap-2">
              {trend && (
                <span
                  className={clsx(
                    'inline-flex items-center gap-1 text-xs font-medium',
                    trend.isPositive ? 'text-success' : 'text-danger'
                  )}
                >
                  {trend.isPositive ? (
                    <TrendingUp className="w-3 h-3" />
                  ) : (
                    <TrendingDown className="w-3 h-3" />
                  )}
                  {Math.abs(trend.value)}%
                </span>
              )}
              {subtitle && (
                <span className="text-xs text-text-tertiary">{subtitle}</span>
              )}
            </div>
          )}
        </div>
        {icon && (
          <div className="flex-shrink-0 p-2 bg-primary-light rounded text-primary">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
};
