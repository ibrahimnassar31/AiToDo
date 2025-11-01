import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SocketState } from '@/types';

const initialState: SocketState = {
  connected: false,
  error: null,
};

const socketSlice = createSlice({
  name: 'socket',
  initialState,
  reducers: {
    setConnected: (state, action: PayloadAction<boolean>) => {
      state.connected = action.payload;
      if (action.payload) {
        state.error = null;
      }
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.connected = false;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const { setConnected, setError, clearError } = socketSlice.actions;
export default socketSlice.reducer;
