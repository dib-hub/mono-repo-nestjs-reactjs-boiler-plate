import { configureStore } from '@reduxjs/toolkit';

import authSlice from './slices/authSlice';
import profileSlice from './slices/profileSlice';

export const store = configureStore({
  reducer: {
    authSlice: authSlice,
    profileSlice: profileSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
