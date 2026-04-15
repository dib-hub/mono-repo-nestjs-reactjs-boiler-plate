import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import {
  IAuthResponse,
  IPasswordResetResponse,
  IRequestPasswordReset,
  IValidatePasswordResetToken,
  IUser,
  ISignIn,
  ICompletePasswordReset,
  CreateUser,
} from '@my-monorepo/types';
import { authInstance } from '@src/apis/initialize.instance';

export const userSignUp = createAsyncThunk<IAuthResponse, CreateUser, { rejectValue: string }>(
  'auth/userSignUp',
  async (userData: CreateUser, { rejectWithValue }) => {
    try {
      const response = await authInstance.post('signup', userData);

      if (response && response.data) {
        return response.data as IAuthResponse;
      }
      throw new Error('No response data received');
    } catch (error) {
      if (axios.isAxiosError<{ message?: string }>(error)) {
        return rejectWithValue(error.response?.data?.message ?? 'An unknown error occurred');
      }

      return rejectWithValue('An unknown error occurred');
    }
  }
);

export const getCurrentUser = createAsyncThunk<IUser, void, { rejectValue: string }>(
  'auth/getCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authInstance.get('me');
      if (response && response.data) {
        return response.data as IUser;
      }
      throw new Error('No response data received');
    } catch (error: unknown) {
      if (axios.isAxiosError<{ message?: string }>(error)) {
        return rejectWithValue(error.response?.data?.message ?? 'Failed to fetch current user.');
      }

      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }

      return rejectWithValue('Failed to fetch current user.');
    }
  }
);

export const userSignIn = createAsyncThunk<IAuthResponse, ISignIn, { rejectValue: string }>(
  'auth/userSignIn',
  async (credentials: ISignIn, { rejectWithValue }) => {
    try {
      const response = await authInstance.post('signin', credentials);
      if (response && response.data) {
        return response.data as IAuthResponse;
      }
      throw new Error('No response data received');
    } catch (error) {
      if (axios.isAxiosError<{ message?: string }>(error)) {
        return rejectWithValue(error.response?.data?.message ?? 'Email or password is incorrect.');
      }
      return rejectWithValue('Email or password is incorrect.');
    }
  }
);

export const userGoogleSignIn = createAsyncThunk<
  IAuthResponse,
  { idToken: string },
  { rejectValue: string }
>('auth/userGoogleSignIn', async ({ idToken }, { rejectWithValue }) => {
  try {
    const response = await authInstance.post('google', { idToken });
    if (response && response.data) {
      return response.data as IAuthResponse;
    }
    throw new Error('No response data received');
  } catch (err: unknown) {
    if (axios.isAxiosError<{ message?: string | string[] }>(err)) {
      const data = err.response?.data;
      const msg = data?.message;
      if (Array.isArray(msg)) {
        return rejectWithValue(msg.join(', '));
      }
      return rejectWithValue(
        typeof msg === 'string' ? msg : 'Google sign-in failed. Please try again.'
      );
    }

    if (err instanceof Error) {
      return rejectWithValue(err.message);
    }

    return rejectWithValue('Google sign-in failed. Please try again.');
  }
});

export const requestPasswordReset = async (
  payload: IRequestPasswordReset
): Promise<IPasswordResetResponse> => {
  try {
    const response = await authInstance.post('password-reset/request', payload);
    return response.data as IPasswordResetResponse;
  } catch (error) {
    if (axios.isAxiosError<{ message?: string }>(error)) {
      throw new Error(error.response?.data?.message ?? 'Failed to request password reset.');
    }
    throw new Error('Failed to request password reset.');
  }
};

export const completePasswordReset = async (
  payload: ICompletePasswordReset
): Promise<IPasswordResetResponse> => {
  try {
    const response = await authInstance.post('password-reset/complete', payload);
    return response.data as IPasswordResetResponse;
  } catch (error) {
    if (axios.isAxiosError<{ message?: string }>(error)) {
      throw new Error(error.response?.data?.message ?? 'Failed to reset password.');
    }
    throw new Error('Failed to reset password.');
  }
};

export const validatePasswordResetToken = async (
  payload: IValidatePasswordResetToken
): Promise<IPasswordResetResponse> => {
  try {
    const response = await authInstance.post('password-reset/verify', payload);
    return response.data as IPasswordResetResponse;
  } catch (error) {
    if (axios.isAxiosError<{ message?: string }>(error)) {
      throw new Error(error.response?.data?.message ?? 'Reset link is invalid or expired.');
    }
    throw new Error('Reset link is invalid or expired.');
  }
};
