import { configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';
import authSlice from './slices/authSlice';
import taskSlice from './slices/taskSlice';
import notificationSlice from './slices/notificationSlice';
import socketSlice from './slices/socketSlice';
import type { RootState } from '@/types';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    tasks: taskSlice,
    notifications: notificationSlice,
    socket: socketSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production',
});

export type AppDispatch = typeof store.dispatch;

// Typed hooks
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default store;
