import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { clsx } from 'clsx';
import { useAuth } from '@/contexts/AuthContext';
import {
  LayoutDashboard,
  Package,
  ArrowDownToLine,
  ArrowUpFromLine,
  ArrowLeftRight,
  ClipboardList,
  History,
  Settings,
  ChevronLeft,
} from 'lucide-react';

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  adminOnly?: boolean;
}

const navItems: NavItem[] = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: <LayoutDashboard className="w-5 h-5" />,
  },
  {
    label: 'Products',
    href: '/products',
    icon: <Package className="w-5 h-5" />,
  },
  {
    label: 'Receipts',
    href: '/receipts',
    icon: <ArrowDownToLine className="w-5 h-5" />,
  },
  {
    label: 'Deliveries',
    href: '/deliveries',
    icon: <ArrowUpFromLine className="w-5 h-5" />,
  },
  {
    label: 'Transfers',
    href: '/transfers',
    icon: <ArrowLeftRight className="w-5 h-5" />,
  },
  {
    label: 'Adjustments',
    href: '/adjustments',
    icon: <ClipboardList className="w-5 h-5" />,
  },
  {
    label: 'Stock Ledger',
    href: '/ledger',
    icon: <History className="w-5 h-5" />,
  },
  {
    label: 'Settings',
    href: '/settings',
    icon: <Settings className="w-5 h-5" />,
    adminOnly: true,
  },
];

export interface SidebarProps {
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, onToggleCollapse }) => {
  const pathname = usePathname();
  const { user } = useAuth();

  // Debug logging
  console.log('Sidebar - User:', user);
  console.log('Sidebar - Role:', user?.role);
  console.log('Is Admin?:', user?.role === 'admin');

  // Filter nav items based on user role
  const visibleNavItems = navItems.filter(item => {
    if (item.adminOnly) {
      return user?.role === 'admin';
    }
    return true;
  });

  console.log('Visible Nav Items:', visibleNavItems.map(i => i.label));

  return (
    <aside
      className={clsx(
        'flex flex-col bg-surface border-r border-border h-screen transition-all duration-150',
        isCollapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Logo / Brand */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-border">
        {!isCollapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded flex items-center justify-center text-white font-bold">
              I
            </div>
            <span className="text-lg font-semibold text-text-primary">IMS</span>
          </div>
        )}
        {isCollapsed && (
          <div className="w-8 h-8 bg-primary rounded flex items-center justify-center text-white font-bold mx-auto">
            I
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-2">
          {visibleNavItems.map((item) => {
            const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`);
            
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={clsx(
                    'flex items-center gap-3 px-3 py-2.5 rounded transition-all duration-150',
                    'hover:bg-background',
                    isActive
                      ? 'bg-primary-light text-primary font-medium'
                      : 'text-text-secondary',
                    isCollapsed && 'justify-center'
                  )}
                  title={isCollapsed ? item.label : undefined}
                >
                  {item.icon}
                  {!isCollapsed && <span className="text-sm">{item.label}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Collapse Toggle */}
      {onToggleCollapse && (
        <div className="p-4 border-t border-border">
          <button
            onClick={onToggleCollapse}
            className={clsx(
              'w-full flex items-center gap-3 px-3 py-2 rounded hover:bg-background text-text-secondary transition-colors',
              isCollapsed && 'justify-center'
            )}
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <ChevronLeft
              className={clsx(
                'w-5 h-5 transition-transform duration-150',
                isCollapsed && 'rotate-180'
              )}
            />
            {!isCollapsed && <span className="text-sm">Collapse</span>}
          </button>
        </div>
      )}
    </aside>
  );
};
