'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Check for stored session on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('ims_user');
    console.log('AuthContext - Stored user from localStorage:', storedUser);
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        console.log('AuthContext - Parsed user:', parsedUser);
        console.log('AuthContext - User role:', parsedUser.role);
        setUser(parsedUser);
      } catch (error) {
        console.error('AuthContext - Error parsing stored user:', error);
        localStorage.removeItem('ims_user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Mock authentication - replace with real API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Demo credentials
    if (email === 'admin@example.com' && password === 'admin123') {
      const userData: User = {
        id: '1',
        name: 'Admin User',
        email: 'admin@example.com',
        role: 'admin',
      };
      console.log('AuthContext - Logging in as admin:', userData);
      setUser(userData);
      localStorage.setItem('ims_user', JSON.stringify(userData));
      console.log('AuthContext - Saved to localStorage:', JSON.stringify(userData));
      return true;
    } else if (email === 'user@example.com' && password === 'user123') {
      const userData: User = {
        id: '2',
        name: 'Regular User',
        email: 'user@example.com',
        role: 'user',
      };
      console.log('AuthContext - Logging in as user:', userData);
      setUser(userData);
      localStorage.setItem('ims_user', JSON.stringify(userData));
      console.log('AuthContext - Saved to localStorage:', JSON.stringify(userData));
      return true;
    }
    
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('ims_user');
    router.push('/login');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
