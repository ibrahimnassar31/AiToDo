import axios, { AxiosInstance, AxiosResponse } from 'axios';
import {
  User,
  Task,
  Analytics,
  LoginFormData,
  RegisterFormData,
  CreateTaskData,
  UpdateTaskData,
  TaskFilters,
  ApiResponse,
  PaginatedResponse,
} from '@/types';

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error) => {
    // Handle token expiration
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    
    // Handle network errors
    if (!error.response) {
      error.response = {
        data: {
          error: {
            message: 'Network error. Please check your connection.',
            status: 'error',
          },
        },
      };
    }
    
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials: LoginFormData): Promise<AxiosResponse<ApiResponse<{ user: User; token: string }>>> =>
    api.post('/users/login', credentials),
    
  register: (userData: RegisterFormData): Promise<AxiosResponse<ApiResponse<{ user: User; token: string }>>> =>
    api.post('/users/register', userData),
    
  getCurrentUser: (): Promise<AxiosResponse<ApiResponse<User>>> =>
    api.get('/users/profile'),
    
  updateProfile: (userData: Partial<User>): Promise<AxiosResponse<ApiResponse<User>>> =>
    api.put('/users/profile', userData),
    
  logout: (): Promise<AxiosResponse<ApiResponse<null>>> =>
    api.post('/users/logout'),
};

// Task API
export const taskAPI = {
  getTasks: (params: {
    page?: number;
    limit?: number;
    filters?: TaskFilters;
  }): Promise<AxiosResponse<PaginatedResponse<Task>>> => {
    const queryParams = new URLSearchParams();
    
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());
    
    if (params.filters) {
      Object.entries(params.filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    return api.get(`/tasks?${queryParams.toString()}`);
  },
  
  getTaskById: (id: string): Promise<AxiosResponse<ApiResponse<Task>>> =>
    api.get(`/tasks/${id}`),
    
  createTask: (taskData: CreateTaskData): Promise<AxiosResponse<ApiResponse<Task>>> =>
    api.post('/tasks', taskData),
    
  updateTask: (id: string, taskData: UpdateTaskData): Promise<AxiosResponse<ApiResponse<Task>>> =>
    api.put(`/tasks/${id}`, taskData),
    
  deleteTask: (id: string): Promise<AxiosResponse<ApiResponse<null>>> =>
    api.delete(`/tasks/${id}`),
    
  getTasksByCategory: (category: string): Promise<AxiosResponse<ApiResponse<Task[]>>> =>
    api.get(`/tasks/category/${category}`),
    
  searchTasks: (query: string): Promise<AxiosResponse<ApiResponse<Task[]>>> =>
    api.get(`/tasks/search?q=${encodeURIComponent(query)}`),
};

// Analytics API
export const analyticsAPI = {
  getAnalytics: (params?: {
    startDate?: string;
    endDate?: string;
  }): Promise<AxiosResponse<ApiResponse<Analytics>>> => {
    const queryParams = new URLSearchParams();
    
    if (params?.startDate) queryParams.append('startDate', params.startDate);
    if (params?.endDate) queryParams.append('endDate', params.endDate);
    
    return api.get(`/analytics?${queryParams.toString()}`);
  },
  
  getProductivityTrend: (days: number = 30): Promise<AxiosResponse<ApiResponse<Analytics['productivityTrend']>>> =>
    api.get(`/analytics/productivity-trend?days=${days}`),
    
  getTaskDistribution: (): Promise<AxiosResponse<ApiResponse<{
    byPriority: Analytics['tasksByPriority'];
    byCategory: Analytics['tasksByCategory'];
  }>>> =>
    api.get('/analytics/task-distribution'),
};

// AI API (for future AI features)
export const aiAPI = {
  getSuggestions: (taskData: Partial<CreateTaskData>): Promise<AxiosResponse<ApiResponse<{
    suggestedPriority: Task['priority'];
    suggestedCategory: string;
    suggestedDueDate: string;
    tips: string[];
  }>>> =>
    api.post('/ai/suggestions', taskData),
    
  analyzeProductivity: (): Promise<AxiosResponse<ApiResponse<{
    insights: string[];
    recommendations: string[];
    score: number;
  }>>> =>
    api.get('/ai/productivity-analysis'),
    
  generateTaskFromText: (text: string): Promise<AxiosResponse<ApiResponse<CreateTaskData>>> =>
    api.post('/ai/generate-task', { text }),
};

// Health check API
export const healthAPI = {
  check: (): Promise<AxiosResponse<ApiResponse<{
    status: string;
    timestamp: string;
    uptime: number;
  }>>> =>
    api.get('/health'),
};

export default api;
