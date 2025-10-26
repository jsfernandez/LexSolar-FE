'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthContextType, LoginCredentials, User } from '@/types/auth';
import { authService } from '@/services/api';
import { getLocalStorageJSON } from '@/lib/utils';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    try {
      const token = localStorage.getItem('access_token');
      const parsedUser = getLocalStorageJSON<User>('user');

      if (token && token !== 'undefined' && parsedUser) {
        setUser(parsedUser);
        setIsAuthenticated(true);
      } else {
        // Clean up bad persisted values if present
        if (token === 'undefined') localStorage.removeItem('access_token');
        const rawUser = localStorage.getItem('user');
        if (rawUser === 'undefined') localStorage.removeItem('user');
      }
    } catch {
      // Ignore parsing/storage errors and keep unauthenticated state
    }
  }, []);

  const login = async (credentials: LoginCredentials) => {
    try {
      const response = await authService.login(credentials);
      localStorage.setItem('access_token', response.access_token);
      localStorage.setItem('user', JSON.stringify(response.user));
      setUser(response.user);
      setIsAuthenticated(true);
      router.push('/dashboard');
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setIsAuthenticated(false);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
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