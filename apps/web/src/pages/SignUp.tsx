import React, { useState } from 'react';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Link } from 'react-router-dom';

export const SignUp: React.FC = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(formData);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-pink-100 via-blue-100 to-purple-100 p-4">
      <div className="flex w-full max-w-5xl bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Left Section */}
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
          <div className="mb-8">
            <h1 className="text-2xl font-bold mb-2">DibHub</h1>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Create an account</h2>
            <p className="text-gray-600">Join us today and get started.</p>
          </div>

          {/* OAuth Buttons */}
          <div className="space-y-3 mb-6">
            <button className="w-full border border-gray-300 rounded-lg py-3 flex items-center justify-center gap-2 hover:bg-gray-50 transition">
              <span>🔵</span>
              Sign up with Google
            </button>
            <button className="w-full border border-gray-300 rounded-lg py-3 flex items-center justify-center gap-2 hover:bg-gray-50 transition">
              <span>🐙</span>
              Sign up with GitHub
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 border-t border-gray-300"></div>
            <span className="text-gray-500 text-sm">OR</span>
            <div className="flex-1 border-t border-gray-300"></div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input
                placeholder="First name"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
              />
              <Input
                placeholder="Last name"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
              />
            </div>
            <Input
              type="email"
              placeholder="Enter your email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
            <Input
              type="password"
              placeholder="Create password"
              name="password"
              value={formData.password}
              onChange={handleChange}
            />
            <Input
              type="password"
              placeholder="Confirm password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
            />

            {/* Sign Up Button */}
            <Button type="submit">Create account</Button>
          </form>

          {/* Sign In Link */}
          <div className="text-center mt-6">
            <span className="text-gray-700">Already have an account? </span>
            <Link to="/sign-in" className="text-black font-semibold hover:underline">
              Sign in
            </Link>
          </div>
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

export default SignUp;
