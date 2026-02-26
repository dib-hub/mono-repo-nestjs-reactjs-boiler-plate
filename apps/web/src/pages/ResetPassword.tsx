import React, { useState } from 'react';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Link } from 'react-router-dom';

export const ResetPassword: React.FC = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === confirmPassword) {
      setSuccess(true);
      console.log({ password });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-pink-100 via-blue-100 to-purple-100 p-4">
      <div className="flex w-full max-w-5xl bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Left Section */}
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
          <div className="mb-8">
            <h1 className="text-2xl font-bold mb-2">DibHub</h1>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Reset password</h2>
            <p className="text-gray-600">Enter your new password below.</p>
          </div>

          {!success ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                <Input
                  type="password"
                  placeholder="Enter new password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password
                </label>
                <Input
                  type="password"
                  placeholder="Confirm password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>

              {password !== confirmPassword && confirmPassword && (
                <p className="text-red-600 text-sm">Passwords do not match</p>
              )}

              <Button type="submit" disabled={password !== confirmPassword || !password}>
                Reset password
              </Button>
            </form>
          ) : (
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Password reset successful!
              </h3>
              <p className="text-gray-600 mb-6">Your password has been updated.</p>
              <Link to="/sign-in">
                <Button>Go to sign in</Button>
              </Link>
            </div>
          )}
        </div>

        {/* Right Section - Decorative */}
        <div className="hidden md:block md:w-1/2 bg-gradient-to-br from-pink-200 via-purple-200 to-blue-200 p-12 relative overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="grid grid-cols-3 gap-4">
              {[...Array(9)].map((_, i) => (
                <div key={i} className="w-20 h-20 rounded-full bg-white opacity-30 shadow-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
