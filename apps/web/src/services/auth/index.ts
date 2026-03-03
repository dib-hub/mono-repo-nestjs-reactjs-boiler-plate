import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

import { authInstance } from '../../apis/initialize.instance';

export interface IUserSignUp {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
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

export const userSignUp = createAsyncThunk<IUserAuthResponse, IUserSignUp, { rejectValue: string }>(
  'auth/userSignUp',
  async (userData: IUserSignUp, { rejectWithValue }) => {
    try {
      const response = await authInstance.post('signup', {
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        password: userData.password,
        confirmPassword: userData.confirmPassword,
      });

      if (response && response.data) {
        return response.data as IUserAuthResponse;
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
