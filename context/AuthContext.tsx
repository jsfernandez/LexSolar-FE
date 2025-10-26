'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import { getProfile } from '@/services/api';

interface AuthContextType {
  user: any;
  token: string | null;
  login: (token: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  login: async () => {},
  logout: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  
  function decodeJwt<T = any>(jwt: string): T | null {
    try {
      const payload = jwt.split('.')[1]
      return JSON.parse(atob(payload))
    } catch {
      return null
    }
  }

  function getCookie(name: string): string | null {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
    return null;
  }

  useEffect(() => {
    // Check localStorage first, then cookies
    const storedToken = localStorage.getItem('token') || getCookie('access_token');
    if (storedToken) login(storedToken);
  }, []);

  async function login(jwt: string) {
    // Store under both keys to satisfy legacy code and axios interceptor
    localStorage.setItem('token', jwt);
    localStorage.setItem('access_token', jwt);
    
    // Also store in cookies for middleware authentication
    document.cookie = `access_token=${jwt}; path=/; max-age=${60 * 60 * 24 * 7}`; // 7 days
    
    setToken(jwt);
    try {
      const profile = await getProfile(jwt);
      setUser(profile);
    } catch {
      logout();
    }
  }

  function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('access_token');
    
    // Also remove from cookies
    document.cookie = 'access_token=; path=/; max-age=0';
    
    setToken(null);
    setUser(null);
  }

  // Optional: auto-logout on token expiration
  useEffect(() => {
    const checkExp = () => {
      const t = localStorage.getItem('token')
      if (!t) return
      const payload = decodeJwt<{ exp?: number }>(t)
      if (payload?.exp && Date.now() / 1000 > payload.exp) {
        logout()
      }
    }
    checkExp()
    const id = setInterval(checkExp, 60_000)
    return () => clearInterval(id)
  }, [])

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
