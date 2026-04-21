import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { apiInstance } from '@src/apis/initialize.instance';
import { IProfile, IProfileFormData } from '@my-monorepo/types';

interface IUpsertProfileRequest {
  userId: string;
  profileData: IProfileFormData;
}

export const getProfileByUserId = createAsyncThunk<IProfile, string, { rejectValue: string }>(
  'profile/getProfileByUserId',
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await apiInstance.get(`profiles/${userId}`);
      if (response && response.data) {
        return response.data as IProfile;
      }
      throw new Error('No response data received');
    } catch (error: unknown) {
      if (axios.isAxiosError<{ message?: string }>(error)) {
        if (error.response?.status === 404) {
          return rejectWithValue('PROFILE_NOT_FOUND');
        }

        return rejectWithValue(error.response?.data?.message ?? 'Failed to fetch profile.');
      }

      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }

      return rejectWithValue('Failed to fetch profile.');
    }
  }
);

export const upsertProfile = createAsyncThunk<
  IProfile,
  IUpsertProfileRequest,
  { rejectValue: string }
>('profile/upsertProfile', async ({ userId, profileData }, { rejectWithValue }) => {
  try {
    const response = await apiInstance.put(`profiles/${userId}`, profileData);
    if (response && response.data) {
      return response.data as IProfile;
    }
    throw new Error('No response data received');
  } catch (error: unknown) {
    if (axios.isAxiosError<{ message?: string }>(error)) {
      return rejectWithValue(error.response?.data?.message ?? 'Failed to update profile.');
    }

    if (error instanceof Error) {
      return rejectWithValue(error.message);
    }

    return rejectWithValue('Failed to update profile.');
  }
});
