import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuthState, IUser } from '@my-monorepo/types';
import {
  userSignIn,
  userSignUp,
  getUserById,
  getCurrentUser,
  userGoogleSignIn,
} from '@src/services/auth';

const storedToken = localStorage.getItem('token');

const initialState: AuthState = {
  user: null,
  token: storedToken,
  loading: false,
  initializing: !!storedToken,
  error: null,
  success: false,
};

const authSlice = createSlice({
  name: 'authSlice',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<IUser>) {
      state.user = action.payload;
      state.error = null;
      state.success = true;
    },
    initializeAuth(state) {
      const token = localStorage.getItem('token');
      if (token) {
        state.token = token;
        state.error = null;
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

    builder
      .addCase(userGoogleSignIn.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(userGoogleSignIn.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.accessToken;
        state.success = true;
        state.error = null;
        localStorage.setItem('token', action.payload.accessToken);
      })
      .addCase(userGoogleSignIn.rejected, (state, action) => {
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

    // Handle getCurrentUser
    builder
      .addCase(getCurrentUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        state.initializing = false;
        state.user = action.payload;
        state.token = localStorage.getItem('token');
        state.success = true;
        state.error = null;
      })
      .addCase(getCurrentUser.rejected, (state, action) => {
        state.loading = false;
        state.initializing = false;
        state.user = null;
        state.token = null;
        state.success = false;
        state.error = action.payload as string;
        localStorage.removeItem('token');
      });
  },
});

export const { setUser, initializeAuth, logout, clearError, clearSuccess } = authSlice.actions;
export default authSlice.reducer;
