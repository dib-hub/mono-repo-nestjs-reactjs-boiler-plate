import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { IAuthResponse, IUser, IUserSignIn, IUserSignUp } from '@my-monorepo/types';

import { authInstance } from '../../apis/initialize.instance';

export const userSignUp = createAsyncThunk<IAuthResponse, IUserSignUp, { rejectValue: string }>(
  'auth/userSignUp',
  async (userData: IUserSignUp, { rejectWithValue }) => {
    try {
      const response = await authInstance.post('signup', {
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        password: userData.password,
      });

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
        return rejectWithValue(typeof msg === 'string' ? msg : 'Signup failed. Please try again.');
      }

      if (err instanceof Error) {
        return rejectWithValue(err.message);
      }

      return rejectWithValue('Signup failed. Please try again.');
    }
  }
);

export const getUserById = createAsyncThunk<IUser, string, { rejectValue: string }>(
  'auth/getUserById',
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await authInstance.get(`users/${userId}`);
      if (response && response.data) {
        return response.data as IUser;
      }
      throw new Error('No response data received');
    } catch (error: unknown) {
      if (axios.isAxiosError<{ message?: string }>(error)) {
        return rejectWithValue(error.response?.data?.message ?? 'Failed to fetch user.');
      }

      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }

      return rejectWithValue('Failed to fetch user.');
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

export const userSignIn = createAsyncThunk<IAuthResponse, IUserSignIn, { rejectValue: string }>(
  'auth/userSignIn',
  async (credentials: IUserSignIn, { rejectWithValue }) => {
    try {
      const response = await authInstance.post('signin', credentials);
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
        return rejectWithValue(typeof msg === 'string' ? msg : 'Signin failed. Please try again.');
      }

      if (err instanceof Error) {
        return rejectWithValue(err.message);
      }

      return rejectWithValue('Signin failed. Please try again.');
    }
  }
);
