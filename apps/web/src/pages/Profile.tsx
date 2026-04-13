import { JSX, useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IProfileFormData } from '@my-monorepo/types';
import { clearProfileError, clearProfileSuccess } from '@src/redux/slices/profileSlice';
import type { AppDispatch, RootState } from '@src/redux/store';
import { getProfileByUserId, upsertProfile } from '@src/services/profile';

const buildProfileFormDataFromUser = (user: RootState['authSlice']['user']): IProfileFormData => ({
  name: user ? `${user.firstName} ${user.lastName}`.trim() : '',
  email: user?.email ?? '',
  linkedInUrl: '',
  githubUrl: '',
});

const ProfilePage = (): JSX.Element => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.authSlice);
  const { profile, profileUserId, loading, error, success } = useSelector(
    (state: RootState) => state.profileSlice
  );

  const [profileData, setProfileData] = useState<IProfileFormData>(() =>
    buildProfileFormDataFromUser(user)
  );
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<IProfileFormData>(profileData);

  useEffect(() => {
    if (user?.id && profileUserId !== user.id) {
      void dispatch(getProfileByUserId(user.id));
    }
  }, [dispatch, user?.id, profileUserId]);

  useEffect(() => {
    if (profile) {
      const profileFromApi: IProfileFormData = {
        name: profile.name,
        email: profile.email,
        linkedInUrl: profile.linkedInUrl ?? '',
        githubUrl: profile.githubUrl ?? '',
      };

      setProfileData(profileFromApi);
      setEditData(profileFromApi);
      return;
    }

    if (user) {
      const fallbackData = buildProfileFormDataFromUser(user);
      setProfileData(fallbackData);

      if (!isEditing) {
        setEditData(fallbackData);
      }
    }
  }, [isEditing, profile, user]);

  useEffect(() => {
    if (!success) {
      return;
    }

    const timer = window.setTimeout(() => {
      dispatch(clearProfileSuccess());
    }, 3000);

    return () => {
      window.clearTimeout(timer);
    };
  }, [dispatch, success]);

  const handleEditChange = useCallback((field: keyof IProfileFormData, value: string): void => {
    setEditData((previous) => ({
      ...previous,
      [field]: value,
    }));
  }, []);

  const handleSave = useCallback(async (): Promise<void> => {
    if (!user?.id) {
      return;
    }

    dispatch(clearProfileError());

    const payload: IProfileFormData = {
      name: editData.name.trim(),
      email: editData.email.trim(),
      ...(editData.linkedInUrl ? { linkedInUrl: editData.linkedInUrl.trim() } : {}),
      ...(editData.githubUrl ? { githubUrl: editData.githubUrl.trim() } : {}),
    };

    const resultAction = await dispatch(
      upsertProfile({
        userId: user.id,
        profileData: payload,
      })
    );

    if (upsertProfile.fulfilled.match(resultAction)) {
      const updatedData: IProfileFormData = {
        name: resultAction.payload.name,
        email: resultAction.payload.email,
        linkedInUrl: resultAction.payload.linkedInUrl ?? '',
        githubUrl: resultAction.payload.githubUrl ?? '',
      };

      setProfileData(updatedData);
      setEditData(updatedData);
      setIsEditing(false);
    }
  }, [user?.id, editData, dispatch]);

  const handleCancel = useCallback((): void => {
    setEditData(profileData);
    setIsEditing(false);
    dispatch(clearProfileError());
  }, [profileData, dispatch]);

  const getGreeting = useCallback((): string => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  }, []);

  const profileCompleteness = useMemo(() => {
    const fields = [
      profileData.name,
      profileData.email,
      profileData.linkedInUrl,
      profileData.githubUrl,
    ];
    const completedFields = fields.filter((value) => value && value.trim().length > 0).length;
    return Math.round((completedFields / fields.length) * 100);
  }, [profileData]);

  const renderUrlField = useCallback((emptyText: string, url?: string): JSX.Element => {
    if (!url) {
      return <div className="px-4 py-3 rounded-xl bg-white/50 text-gray-500">{emptyText}</div>;
    }

    const href = /^https?:\/\//i.test(url) ? url : `https://${url}`;

    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="px-4 py-3 rounded-xl bg-white/50 text-blue-700 hover:text-blue-900 block truncate hover:underline transition"
      >
        {url}
      </a>
    );
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-200 via-purple-200 to-pink-200">
      <section className="px-6 md:px-16 py-10">
        <div className="max-w-2xl">
          <p className="text-gray-700 mb-2">{getGreeting()}</p>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">Your Profile</h1>
          <p className="text-gray-600">Manage your personal information and social links</p>
        </div>
      </section>

      <section className="px-6 md:px-16 pb-20">
        <div className="max-w-2xl">
          {success && (
            <div className="mb-6 p-4 bg-green-100/80 backdrop-blur-md rounded-2xl border border-green-300">
              <span className="text-green-800 font-medium">Profile updated successfully.</span>
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-red-100/80 backdrop-blur-md rounded-2xl border border-red-300">
              <span className="text-red-800 font-medium">{error}</span>
            </div>
          )}

          <div className="bg-white/40 backdrop-blur-md rounded-3xl shadow-xl p-8 md:p-12">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8 pb-8 border-b border-white/30">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-xl text-white font-bold shadow-lg">
                  PR
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{profileData.name || '-'}</h2>
                  <p className="text-gray-600">Account Profile</p>
                </div>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-green-400 to-blue-500 flex items-center justify-center text-white font-bold shadow-lg">
                  {profileCompleteness}%
                </div>
                <p className="text-sm text-gray-700 mt-2">Complete</p>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Full Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editData.name}
                    onChange={(event) => handleEditChange('name', event.target.value)}
                    className="w-full px-4 py-3 rounded-xl border-2 border-purple-300 bg-white/70 backdrop-blur-sm focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition"
                    placeholder="Enter your full name"
                  />
                ) : (
                  <div className="px-4 py-3 rounded-xl bg-white/50 text-gray-900">
                    {profileData.name || '-'}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Email</label>
                {isEditing ? (
                  <input
                    type="email"
                    value={editData.email}
                    onChange={(event) => handleEditChange('email', event.target.value)}
                    className="w-full px-4 py-3 rounded-xl border-2 border-purple-300 bg-white/70 backdrop-blur-sm focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition"
                    placeholder="Enter your email"
                  />
                ) : (
                  <div className="px-4 py-3 rounded-xl bg-white/50 text-gray-900">
                    {profileData.email || '-'}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  LinkedIn URL
                </label>
                {isEditing ? (
                  <input
                    type="url"
                    value={editData.linkedInUrl}
                    onChange={(event) => handleEditChange('linkedInUrl', event.target.value)}
                    className="w-full px-4 py-3 rounded-xl border-2 border-purple-300 bg-white/70 backdrop-blur-sm focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition"
                    placeholder="https://linkedin.com/in/yourprofile"
                  />
                ) : (
                  renderUrlField('No LinkedIn URL set', profileData?.linkedInUrl)
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">GitHub URL</label>
                {isEditing ? (
                  <input
                    type="url"
                    value={editData.githubUrl}
                    onChange={(event) => handleEditChange('githubUrl', event.target.value)}
                    className="w-full px-4 py-3 rounded-xl border-2 border-purple-300 bg-white/70 backdrop-blur-sm focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition"
                    placeholder="https://github.com/yourprofile"
                  />
                ) : (
                  renderUrlField('No GitHub URL set', profileData?.githubUrl)
                )}
              </div>
            </div>

            <div className="mt-10 pt-8 border-t border-white/30 flex flex-col md:flex-row gap-4">
              {isEditing ? (
                <>
                  <button
                    onClick={() => {
                      void handleSave();
                    }}
                    disabled={loading || !user}
                    className="flex-1 bg-gradient-to-r from-green-400 to-blue-500 text-white font-semibold py-3 px-6 rounded-xl hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button
                    onClick={handleCancel}
                    disabled={loading}
                    className="flex-1 bg-white/60 text-gray-900 font-semibold py-3 px-6 rounded-xl hover:bg-white/80 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  onClick={() => {
                    setIsEditing(true);
                    setEditData(profileData);
                    dispatch(clearProfileError());
                  }}
                  className="w-full bg-gradient-to-r from-purple-400 to-pink-400 text-white font-semibold py-3 px-6 rounded-xl hover:shadow-lg transition"
                >
                  Edit Profile
                </button>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProfilePage;
