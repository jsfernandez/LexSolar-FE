import { useState, useEffect } from 'react';
import { api } from '@/services/api';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface UsersResponse {
  data: User[];
  totalPages: number;
}

export const useUsers = (page: number = 1, limit: number = 10) => {
  const [data, setData] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        const response = await api.get<UsersResponse>(`/auth/users?page=${page}&limit=${limit}`);
        setData(response.data.data);
        setTotalPages(response.data.totalPages);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch users'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [page, limit]);

  return { data, isLoading, error, totalPages };
};