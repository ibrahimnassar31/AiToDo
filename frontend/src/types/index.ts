// User types
export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// Task types
export interface Task {
  id: string;
  userId: string;
  title: string;
  description?: string;
  priority: 'Low' | 'Medium' | 'High';
  status: 'Pending' | 'Completed';
  category?: string;
  dueDate?: string;
  aiSuggestions?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface TaskState {
  tasks: Task[];
  currentTask: Task | null;
  isLoading: boolean;
  error: string | null;
  filters: TaskFilters;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface TaskFilters {
  status?: 'Pending' | 'Completed';
  priority?: 'Low' | 'Medium' | 'High';
  category?: string;
  search?: string;
  sortBy?: 'createdAt' | 'updatedAt' | 'dueDate' | 'priority' | 'title';
  sortOrder?: 'asc' | 'desc';
}

export interface CreateTaskData {
  title: string;
  description?: string;
  priority?: 'Low' | 'Medium' | 'High';
  dueDate?: string;
  category?: string;
}

export interface UpdateTaskData extends Partial<CreateTaskData> {
  status?: 'Pending' | 'Completed';
}

// Analytics types
export interface Analytics {
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  tasksByPriority: {
    Low: number;
    Medium: number;
    High: number;
  };
  tasksByCategory: Record<string, number>;
  completionRate: number;
  averageCompletionTime: number;
  productivityTrend: Array<{
    date: string;
    completed: number;
    created: number;
  }>;
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    status: string;
    field?: string;
  };
  timestamp: string;
  path: string;
  method: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Form types
export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
}

// UI types
export interface NotificationState {
  notifications: Notification[];
}

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

// Socket types
export interface SocketState {
  connected: boolean;
  error: string | null;
}

// Root state type
export interface RootState {
  auth: AuthState;
  tasks: TaskState;
  notifications: NotificationState;
  socket: SocketState;
}
