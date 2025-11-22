'use client';

import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';

export interface MainLayoutProps {
  children: React.ReactNode;
  user?: {
    name: string;
    email: string;
    role: string;
  };
  onLogout?: () => void;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children, user, onLogout }) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar user={user} onLogout={onLogout} />
        <main className="flex-1 overflow-y-auto bg-background">
          <div className="max-w-[1600px] mx-auto px-6 py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
