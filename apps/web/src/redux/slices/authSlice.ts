import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { userSignIn, userSignUp, getUserById } from '../../services/auth';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  success: boolean;
}

const initialState: AuthState = {
  user: null,
  token: null,
  loading: false,
  error: null,
  success: false,
};

const authSlice = createSlice({
  name: 'authSlice',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<User>) {
      state.user = action.payload;
      state.error = null;
      state.success = true;
    },
    initializeAuth(state) {
      const token = localStorage.getItem('token');
      if (token) {
        state.token = token;
        // Note: In a real app, you might want to decode the token to get user info
        // For now, we'll assume the user is authenticated if token exists
      }
    },
    logout(state) {
      state.user = null;
      state.token = null;
      state.success = false;
      state.error = null;
      localStorage.removeItem('token');
    },
    clearError(state) {
      state.error = null;
    },
    clearSuccess(state) {
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    // Handle userSignIn
    builder
      .addCase(userSignIn.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(userSignIn.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.accessToken;
        state.success = true;
        state.error = null;
        localStorage.setItem('token', action.payload.accessToken);
      })
      .addCase(userSignIn.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.success = false;
      });

    // Handle userSignUp
    builder
      .addCase(userSignUp.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(userSignUp.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.accessToken;
        state.success = true;
        state.error = null;
        localStorage.setItem('token', action.payload.accessToken);
      })
      .addCase(userSignUp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.success = false;
      });

    // Handle getUserById
    builder
      .addCase(getUserById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserById.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(getUserById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setUser, initializeAuth, logout, clearError, clearSuccess } = authSlice.actions;
export default authSlice.reducer;
