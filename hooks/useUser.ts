"use client";
//import { api } from '@/services/api';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

interface UserData {
  name: string;
  email: string;
  password: string;
}

export const useCreateUser = () => {
  const router = useRouter();

  const createUser = async (data: UserData) => {
    try {
      //await api.post('/auth/users', data);
      router.push('/users');
      router.refresh();
    } catch (error) {
      throw error instanceof Error 
        ? error 
        : new Error('Failed to create user');
    }
  };

  return { createUser };
};

export const useUpdateUser = (id: string) => {
  const router = useRouter();

  const updateUser = async (data: Partial<UserData>) => {
    try {
      //await api.patch(`/auth/users/${id}`, data);
      router.push('/users');
      router.refresh();
    } catch (error) {
      throw error instanceof Error 
        ? error 
        : new Error('Failed to update user');
    }
  };

  return { updateUser };
};

export const useUser = (id: string) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  /* useEffect(() => {
    const fetchUser = async () => {
      try {
        setIsLoading(true);
        const response = await api.get(`/auth/users/${id}`);
        setUser(response.data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch user'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [id]); */

  return { user, isLoading, error };
};

export const useRoles = () => {
  // Since we don't have the roles endpoint yet, we'll hardcode the roles
  const roles = [
    { id: 'admin', name: 'Administrator' },
    { id: 'user', name: 'User' },
    { id: 'editor', name: 'Editor' },
  ];

  return { roles };
};