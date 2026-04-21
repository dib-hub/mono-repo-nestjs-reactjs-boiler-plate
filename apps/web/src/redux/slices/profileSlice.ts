import { createSlice } from '@reduxjs/toolkit';
import { IProfileState } from '@my-monorepo/types';
import { getProfileByUserId, upsertProfile } from '@src/services/profile';
import { logout } from '@src/redux/slices/authSlice';

const initialState: IProfileState = {
  profile: null,
  profileUserId: null,
  loading: false,
  error: null,
  success: false,
};

const profileSlice = createSlice({
  name: 'profileSlice',
  initialState,
  reducers: {
    clearProfileError(state) {
      state.error = null;
    },
    clearProfileSuccess(state) {
      state.success = false;
    },
    resetProfileState(state) {
      state.profile = null;
      state.profileUserId = null;
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getProfileByUserId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProfileByUserId.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
        state.profileUserId = action.payload.userId;
        state.error = null;
      })
      .addCase(getProfileByUserId.rejected, (state, action) => {
        state.loading = false;
        state.profile = null;
        state.profileUserId = action.meta.arg;

        if (action.payload === 'PROFILE_NOT_FOUND') {
          state.error = null;
          return;
        }

        state.error = action.payload ?? 'Failed to fetch profile.';
      });

    builder
      .addCase(upsertProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(upsertProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
        state.profileUserId = action.payload.userId;
        state.error = null;
        state.success = true;
      })
      .addCase(upsertProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Failed to update profile.';
        state.success = false;
      })
      .addCase(logout, (state) => {
        state.profile = null;
        state.profileUserId = null;
        state.loading = false;
        state.error = null;
        state.success = false;
      });
  },
});

export const { clearProfileError, clearProfileSuccess, resetProfileState } = profileSlice.actions;
export default profileSlice.reducer;
