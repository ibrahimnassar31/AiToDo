import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { TaskState, Task, CreateTaskData, UpdateTaskData, TaskFilters } from '@/types';
import { taskAPI } from '@/services/api';

// Initial state
const initialState: TaskState = {
  tasks: [],
  currentTask: null,
  isLoading: false,
  error: null,
  filters: {
    sortBy: 'createdAt',
    sortOrder: 'desc',
  },
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  },
};

// Async thunks
export const fetchTasks = createAsyncThunk(
  'tasks/fetchTasks',
  async (params: { page?: number; limit?: number; filters?: TaskFilters }, { rejectWithValue }) => {
    try {
      const response = await taskAPI.getTasks(params);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error?.message || 'Failed to fetch tasks'
      );
    }
  }
);

export const createTask = createAsyncThunk(
  'tasks/createTask',
  async (taskData: CreateTaskData, { rejectWithValue }) => {
    try {
      const response = await taskAPI.createTask(taskData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error?.message || 'Failed to create task'
      );
    }
  }
);

export const updateTask = createAsyncThunk(
  'tasks/updateTask',
  async ({ id, data }: { id: string; data: UpdateTaskData }, { rejectWithValue }) => {
    try {
      const response = await taskAPI.updateTask(id, data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error?.message || 'Failed to update task'
      );
    }
  }
);

export const deleteTask = createAsyncThunk(
  'tasks/deleteTask',
  async (id: string, { rejectWithValue }) => {
    try {
      await taskAPI.deleteTask(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error?.message || 'Failed to delete task'
      );
    }
  }
);

export const getTaskById = createAsyncThunk(
  'tasks/getTaskById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await taskAPI.getTaskById(id);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error?.message || 'Failed to fetch task'
      );
    }
  }
);

export const toggleTaskStatus = createAsyncThunk(
  'tasks/toggleTaskStatus',
  async (id: string, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { tasks: TaskState };
      const task = state.tasks.tasks.find(t => t.id === id);
      if (!task) throw new Error('Task not found');
      
      const newStatus = task.status === 'Pending' ? 'Completed' : 'Pending';
      const response = await taskAPI.updateTask(id, { status: newStatus });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error?.message || 'Failed to toggle task status'
      );
    }
  }
);

// Task slice
const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<Partial<TaskFilters>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {
        sortBy: 'createdAt',
        sortOrder: 'desc',
      };
    },
    setCurrentTask: (state, action: PayloadAction<Task | null>) => {
      state.currentTask = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    setPagination: (state, action: PayloadAction<{ page?: number; limit?: number }>) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    // Optimistic updates
    addTaskOptimistic: (state, action: PayloadAction<Task>) => {
      state.tasks.unshift(action.payload);
    },
    updateTaskOptimistic: (state, action: PayloadAction<Task>) => {
      const index = state.tasks.findIndex(task => task.id === action.payload.id);
      if (index !== -1) {
        state.tasks[index] = action.payload;
      }
      if (state.currentTask?.id === action.payload.id) {
        state.currentTask = action.payload;
      }
    },
    removeTaskOptimistic: (state, action: PayloadAction<string>) => {
      state.tasks = state.tasks.filter(task => task.id !== action.payload);
      if (state.currentTask?.id === action.payload) {
        state.currentTask = null;
      }
    },
  },
  extraReducers: (builder) => {
    // Fetch tasks
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.isLoading = false;
        state.tasks = action.payload.tasks || action.payload;
        if (action.payload.pagination) {
          state.pagination = action.payload.pagination;
        }
        state.error = null;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Create task
    builder
      .addCase(createTask.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.isLoading = false;
        state.tasks.unshift(action.payload);
        state.error = null;
      })
      .addCase(createTask.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Update task
    builder
      .addCase(updateTask.pending, (state) => {
        state.error = null;
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        const index = state.tasks.findIndex(task => task.id === action.payload.id);
        if (index !== -1) {
          state.tasks[index] = action.payload;
        }
        if (state.currentTask?.id === action.payload.id) {
          state.currentTask = action.payload;
        }
        state.error = null;
      })
      .addCase(updateTask.rejected, (state, action) => {
        state.error = action.payload as string;
      });

    // Delete task
    builder
      .addCase(deleteTask.pending, (state) => {
        state.error = null;
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.tasks = state.tasks.filter(task => task.id !== action.payload);
        if (state.currentTask?.id === action.payload) {
          state.currentTask = null;
        }
        state.error = null;
      })
      .addCase(deleteTask.rejected, (state, action) => {
        state.error = action.payload as string;
      });

    // Get task by ID
    builder
      .addCase(getTaskById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getTaskById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentTask = action.payload;
        state.error = null;
      })
      .addCase(getTaskById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Toggle task status
    builder
      .addCase(toggleTaskStatus.fulfilled, (state, action) => {
        const index = state.tasks.findIndex(task => task.id === action.payload.id);
        if (index !== -1) {
          state.tasks[index] = action.payload;
        }
        if (state.currentTask?.id === action.payload.id) {
          state.currentTask = action.payload;
        }
      })
      .addCase(toggleTaskStatus.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const {
  setFilters,
  clearFilters,
  setCurrentTask,
  clearError,
  setPagination,
  addTaskOptimistic,
  updateTaskOptimistic,
  removeTaskOptimistic,
} = taskSlice.actions;

export default taskSlice.reducer;
