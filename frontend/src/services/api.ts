import axios, { type AxiosError } from 'axios';
import type {
  ActivityLog,
  ApiResponse,
  AuthResponse,
  Board,
  Comment,
  Organization,
  OrganizationMember,
  Project,
  Task,
  User,
  BoardStatus
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Attach Authorization header if token exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('devflow_token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Global response error handler
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string }>) => {
    if (error.response?.status === 401) {
      // Clear token if expired or unauthorized
      if (!window.location.pathname.startsWith('/login') && !window.location.pathname.startsWith('/register')) {
        localStorage.removeItem('devflow_token');
        localStorage.removeItem('devflow_user');
      }
    }
    return Promise.reject(error);
  }
);

export const authApi = {
  login: async (credentials: { email: string; password: string }) => {
    const res = await api.post<ApiResponse<AuthResponse>>('/auth/login', credentials);
    return res.data.data;
  },
  register: async (data: { name: string; email: string; password: string }) => {
    const res = await api.post<ApiResponse<AuthResponse>>('/auth/register', data);
    return res.data.data;
  },
  getMe: async () => {
    const res = await api.get<ApiResponse<User>>('/auth/me');
    return res.data.data;
  },
  getUsers: async () => {
    const res = await api.get<ApiResponse<User[]>>('/auth/users');
    return res.data.data;
  }
};

export const organizationApi = {
  list: async () => {
    const res = await api.get<ApiResponse<Organization[]>>('/organizations');
    return res.data.data;
  },
  getById: async (organizationId: number) => {
    const res = await api.get<ApiResponse<Organization>>(`/organizations/${organizationId}`);
    return res.data.data;
  },
  create: async (name: string) => {
    const res = await api.post<ApiResponse<Organization>>('/organizations', { name });
    return res.data.data;
  },
  addMember: async (organizationId: number, memberData: { userId?: number; email?: string }) => {
    const res = await api.post<ApiResponse<OrganizationMember>>(
      `/organizations/${organizationId}/members`,
      memberData
    );
    return res.data.data;
  },
  listMembers: async (organizationId: number) => {
    const res = await api.get<ApiResponse<OrganizationMember[]>>(
      `/organizations/${organizationId}/members`
    );
    return res.data.data;
  }
};

export const projectApi = {
  list: async (organizationId: number) => {
    const res = await api.get<ApiResponse<Project[]>>(
      `/organizations/${organizationId}/projects`
    );
    return res.data.data;
  },
  getById: async (projectId: number) => {
    const res = await api.get<ApiResponse<Project>>(`/projects/${projectId}`);
    return res.data.data;
  },
  create: async (organizationId: number, data: { name: string; description?: string }) => {
    const res = await api.post<ApiResponse<Project>>(
      `/organizations/${organizationId}/projects`,
      data
    );
    return res.data.data;
  }
};

export const boardApi = {
  list: async (projectId: number) => {
    const res = await api.get<ApiResponse<Board[]>>(`/projects/${projectId}/boards`);
    return res.data.data;
  },
  getById: async (boardId: number) => {
    const res = await api.get<ApiResponse<Board>>(`/boards/${boardId}`);
    return res.data.data;
  },
  create: async (projectId: number, name: string) => {
    const res = await api.post<ApiResponse<Board>>(`/projects/${projectId}/boards`, { name });
    return res.data.data;
  }
};

export const taskApi = {
  list: async (boardId: number) => {
    const res = await api.get<ApiResponse<Task[]>>(`/boards/${boardId}/tasks`);
    return res.data.data;
  },
  getById: async (taskId: number) => {
    const res = await api.get<ApiResponse<Task>>(`/tasks/${taskId}`);
    return res.data.data;
  },
  create: async (
    boardId: number,
    data: { title: string; description?: string; status?: BoardStatus; assigneeId?: number | null }
  ) => {
    const res = await api.post<ApiResponse<Task>>(`/boards/${boardId}/tasks`, data);
    return res.data.data;
  },
  update: async (
    boardId: number,
    taskId: number,
    data: { title?: string; description?: string; status?: BoardStatus; assigneeId?: number | null }
  ) => {
    const res = await api.patch<ApiResponse<Task>>(`/boards/${boardId}/tasks/${taskId}`, data);
    return res.data.data;
  },
  delete: async (boardId: number, taskId: number) => {
    const res = await api.delete<ApiResponse<Task>>(`/boards/${boardId}/tasks/${taskId}`);
    return res.data.data;
  }
};

export const commentApi = {
  list: async (taskId: number) => {
    const res = await api.get<ApiResponse<Comment[]>>(`/tasks/${taskId}/comments`);
    return res.data.data;
  },
  create: async (taskId: number, content: string) => {
    const res = await api.post<ApiResponse<Comment>>(`/tasks/${taskId}/comments`, { content });
    return res.data.data;
  }
};

export const activityApi = {
  list: async () => {
    const res = await api.get<ApiResponse<ActivityLog[]>>('/activities');
    return res.data.data;
  }
};

export default api;
