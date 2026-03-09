import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

import { authInstance } from '../../apis/initialize.instance';

export interface IUserSignUp {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface IUserSignIn {
  email: string;
  password: string;
}

export interface IUserAuthResponse {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'ADMIN' | 'USER' | 'GUEST';
  createdAt: string;
  updatedAt: string;
}

export interface IAuthResponse {
  user: IUserAuthResponse;
  accessToken: string;
}

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
      if (axios.isAxiosError<{ message?: string }>(err)) {
        return rejectWithValue(err.response?.data?.message ?? 'Signup failed. Please try again.');
      }

      if (err instanceof Error) {
        return rejectWithValue(err.message);
      }

      return rejectWithValue('Signup failed. Please try again.');
    }
  }
);

export const getUserById = createAsyncThunk<IUserAuthResponse, string, { rejectValue: string }>(
  'auth/getUserById',
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await authInstance.get(`users/${userId}`);
      if (response && response.data) {
        return response.data as IUserAuthResponse;
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

export const getCurrentUser = createAsyncThunk<IUserAuthResponse, void, { rejectValue: string }>(
  'auth/getCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authInstance.get('me');
      if (response && response.data) {
        return response.data as IUserAuthResponse;
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
      if (axios.isAxiosError<{ message?: string }>(err)) {
        return rejectWithValue(err.response?.data?.message ?? 'Signin failed. Please try again.');
      }

      if (err instanceof Error) {
        return rejectWithValue(err.message);
      }

      return rejectWithValue('Signin failed. Please try again.');
    }
  }
);
