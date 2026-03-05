import { JSX, useState } from 'react';

interface ProfileData {
  name: string;
  email: string;
  linkedInUrl: string;
  githubUrl: string;
}

const ProfilePage = (): JSX.Element => {
  const [profileData, setProfileData] = useState<ProfileData>({
    name: 'John Doe',
    email: 'john.doe@example.com',
    linkedInUrl: 'https://linkedin.com/in/johndoe',
    githubUrl: 'https://github.com/johndoe',
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [editData, setEditData] = useState<ProfileData>(profileData);

  const handleEditChange = (field: keyof ProfileData, value: string) => {
    setEditData({
      ...editData,
      [field]: value,
    });
  };

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setProfileData(editData);
    setIsSaving(false);
    setSaveSuccess(true);
    setIsEditing(false);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleCancel = () => {
    setEditData(profileData);
    setIsEditing(false);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning 🌅';
    if (hour < 18) return 'Good Afternoon ☀️';
    return 'Good Evening 🌙';
  };

  const profileCompleteness = 100; // All fields filled

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-200 via-purple-200 to-pink-200">
      {/* Header Section */}
      <section className="px-6 md:px-16 py-10">
        <div className="max-w-2xl">
          <p className="text-gray-700 mb-2">{getGreeting()}</p>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">Your Profile</h1>
          <p className="text-gray-600">Manage your personal information and social links</p>
        </div>
      </section>

      {/* Main Content */}
      <section className="px-6 md:px-16 pb-20">
        <div className="max-w-2xl">
          {/* Success Message */}
          {saveSuccess && (
            <div className="mb-6 p-4 bg-green-100/80 backdrop-blur-md rounded-2xl border border-green-300 flex items-center gap-3 animate-pulse">
              <span className="text-2xl">✓</span>
              <span className="text-green-800 font-medium">Profile updated successfully!</span>
            </div>
          )}

          {/* Profile Card */}
          <div className="bg-white/40 backdrop-blur-md rounded-3xl shadow-xl p-8 md:p-12">
            {/* Profile Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8 pb-8 border-b border-white/30">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-4xl shadow-lg">
                  👤
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{profileData.name}</h2>
                  <p className="text-gray-600">Account Profile</p>
                </div>
              </div>

              {/* Profile Completion */}
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-green-400 to-blue-500 flex items-center justify-center text-white font-bold shadow-lg">
                  {profileCompleteness}%
                </div>
                <p className="text-sm text-gray-700 mt-2">Complete</p>
              </div>
            </div>

            {/* Form Section */}
            <div className="space-y-6">
              {/* Name Field */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Full Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editData.name}
                    onChange={(e) => handleEditChange('name', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border-2 border-purple-300 bg-white/70 backdrop-blur-sm focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition"
                    placeholder="Enter your full name"
                  />
                ) : (
                  <div className="px-4 py-3 rounded-xl bg-white/50 text-gray-900">
                    {profileData.name}
                  </div>
                )}
              </div>

              {/* Email Field */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">📧 Email</label>
                {isEditing ? (
                  <input
                    type="email"
                    value={editData.email}
                    onChange={(e) => handleEditChange('email', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border-2 border-purple-300 bg-white/70 backdrop-blur-sm focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition"
                    placeholder="Enter your email"
                  />
                ) : (
                  <div className="px-4 py-3 rounded-xl bg-white/50 text-gray-900">
                    {profileData.email}
                  </div>
                )}
              </div>

              {/* LinkedIn Field */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  💼 LinkedIn URL
                </label>
                {isEditing ? (
                  <input
                    type="url"
                    value={editData.linkedInUrl}
                    onChange={(e) => handleEditChange('linkedInUrl', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border-2 border-purple-300 bg-white/70 backdrop-blur-sm focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition"
                    placeholder="https://linkedin.com/in/yourprofile"
                  />
                ) : (
                  <a
                    href={profileData.linkedInUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-3 rounded-xl bg-white/50 text-blue-600 hover:text-blue-800 block truncate hover:underline transition"
                  >
                    {profileData.linkedInUrl}
                  </a>
                )}
              </div>

              {/* GitHub Field */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  🐙 GitHub URL
                </label>
                {isEditing ? (
                  <input
                    type="url"
                    value={editData.githubUrl}
                    onChange={(e) => handleEditChange('githubUrl', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border-2 border-purple-300 bg-white/70 backdrop-blur-sm focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition"
                    placeholder="https://github.com/yourprofile"
                  />
                ) : (
                  <a
                    href={profileData.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-3 rounded-xl bg-white/50 text-gray-900 hover:text-gray-700 block truncate hover:underline transition"
                  >
                    {profileData.githubUrl}
                  </a>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-10 pt-8 border-t border-white/30 flex flex-col md:flex-row gap-4">
              {isEditing ? (
                <>
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex-1 bg-gradient-to-r from-green-400 to-blue-500 text-white font-semibold py-3 px-6 rounded-xl hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSaving ? (
                      <>
                        <span className="animate-spin">⏳</span>
                        Saving...
                      </>
                    ) : (
                      <>
                        <span>✓</span>
                        Save Changes
                      </>
                    )}
                  </button>
                  <button
                    onClick={handleCancel}
                    className="flex-1 bg-white/60 text-gray-900 font-semibold py-3 px-6 rounded-xl hover:bg-white/80 transition"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  onClick={() => {
                    setIsEditing(true);
                    setEditData(profileData);
                  }}
                  className="w-full bg-gradient-to-r from-purple-400 to-pink-400 text-white font-semibold py-3 px-6 rounded-xl hover:shadow-lg transition flex items-center justify-center gap-2"
                >
                  <span>✏️</span>
                  Edit Profile
                </button>
              )}
            </div>
          </div>

          {/* Quick Tips Section */}
          <div className="mt-8 grid md:grid-cols-2 gap-6">
            <div className="bg-yellow-100/40 backdrop-blur-md rounded-2xl p-6 border border-yellow-200/50">
              <p className="text-2xl mb-2">💡</p>
              <h3 className="font-semibold text-gray-900 mb-2">Pro Tip</h3>
              <p className="text-sm text-gray-700">
                Keep your profile updated to help others find and connect with you!
              </p>
            </div>

            <div className="bg-blue-100/40 backdrop-blur-md rounded-2xl p-6 border border-blue-200/50">
              <p className="text-2xl mb-2">🔒</p>
              <h3 className="font-semibold text-gray-900 mb-2">Privacy</h3>
              <p className="text-sm text-gray-700">
                Your profile information is secure and only visible to you.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProfilePage;
