import React from 'react';
import { Search, Bell, User, LogOut } from 'lucide-react';
import { Button } from '../ui/Button';

export interface TopbarProps {
  user?: {
    name: string;
    email: string;
    role: string;
  };
  onLogout?: () => void;
}

export const Topbar: React.FC<TopbarProps> = ({ user, onLogout }) => {
  return (
    <header className="h-16 bg-surface border-b border-border flex items-center justify-between px-6">
      {/* Search */}
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" />
          <input
            type="search"
            placeholder="Search products, SKU, documents..."
            className="w-full pl-10 pr-4 py-2 border border-border rounded bg-background text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
          />
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4 ml-6">
        {/* Notifications */}
        <button
          className="relative p-2 rounded hover:bg-background text-text-secondary hover:text-text-primary transition-colors"
          aria-label="Notifications"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-danger rounded-full"></span>
        </button>

        {/* User Menu */}
        {user && (
          <div className="flex items-center gap-3 pl-4 border-l border-border">
            <div className="text-right">
              <p className="text-sm font-medium text-text-primary">{user.name}</p>
              <p className="text-xs text-text-tertiary capitalize">{user.role.replace('_', ' ')}</p>
            </div>
            <div className="w-9 h-9 rounded-full bg-primary-light text-primary flex items-center justify-center font-semibold">
              {user.name.charAt(0).toUpperCase()}
            </div>
            {onLogout && (
              <button
                onClick={onLogout}
                className="p-2 rounded hover:bg-background text-text-secondary hover:text-danger transition-colors"
                aria-label="Logout"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        )}
      </div>
    </header>
  );
};
