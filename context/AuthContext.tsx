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

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) login(storedToken);
  }, []);

  async function login(jwt: string) {
    localStorage.setItem('token', jwt);
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
