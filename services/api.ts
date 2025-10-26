import axios from 'axios';
import { LoginCredentials, LoginResponse, User } from '@/types/auth';

// Use the exact backend base URL from env. Do not append '/api' by default to avoid 404s.
const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth services
export const authService = {
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    // Backend login endpoint is /auth (not /auth/login)
    const response = await api.post('/auth', credentials);
    return response.data;
  },

  getProfile: async (): Promise<User> => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
  },
};

// User services
export const userService = {
  getUsers: async (page: number = 1, limit: number = 10) => {
    const response = await api.get(`/auth/users?page=${page}&limit=${limit}`);
    return response.data;
  },

  getUser: async (id: number): Promise<User> => {
    const response = await api.get(`/auth/users/${id}`);
    return response.data;
  },

  createUser: async (userData: Partial<User>) => {
    const response = await api.post('/auth/users', userData);
    return response.data;
  },

  updateUser: async (id: number, userData: Partial<User>) => {
    const response = await api.patch(`/auth/users/${id}`, userData);
    return response.data;
  },

  deleteUser: async (id: number) => {
    await api.delete(`/auth/users/${id}`);
  },

  updateUserRoles: async (id: number, roleIds: number[]) => {
    const response = await api.patch(`/auth/users/${id}/roles`, { roleIds });
    return response.data;
  },
};

// Compatibility wrappers (named exports) used across the app
export async function loginUser(email: string, password: string) {
  return authService.login({ email, password });
}

export async function getProfile(token?: string) {
  if (token) {
    const response = await api.get<User>('/auth/me', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  }
  return authService.getProfile();
}

export async function registerUser(data: { name: string; email: string; password: string; phone: string; role_id?: number }) {
  // Backend register endpoint
  const response = await api.post('/user', {
    name: data.name,
    email: data.email,
    password: data.password,
    phone: data.phone,
    role_id: data.role_id ?? 1,
  });
  return response.data;
}
