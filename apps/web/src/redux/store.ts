import { configureStore } from '@reduxjs/toolkit';
import authSlice from '@src/redux/slices/authSlice';
import profileSlice from '@src/redux/slices/profileSlice';

export const store = configureStore({
  reducer: {
    authSlice: authSlice,
    profileSlice: profileSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
