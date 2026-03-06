import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FormikErrors, useFormik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';

import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { userSignUp, IUserSignUp } from '../services/auth';
import { clearError } from '../redux/slices/authSlice';
import { RootState, AppDispatch } from '../redux/store';

interface SignUpForm {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export const SignUp: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { user, loading, error, success } = useSelector((state: RootState) => state.authSlice);
  const [localError, setLocalError] = useState<string | null>(null);

  useEffect(() => {
    if (success && user) {
      setLocalError(null);
      // Redirect to dashboard after successful signup
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    }
  }, [success, user, navigate]);

  const validate = (values: SignUpForm): FormikErrors<SignUpForm> => {
    const errors: FormikErrors<SignUpForm> = {};

    if (!values.firstName.trim()) {
      errors.firstName = 'First name is required';
    }

    if (!values.lastName.trim()) {
      errors.lastName = 'Last name is required';
    }

    if (!values.email) {
      errors.email = 'Email is required';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
      errors.email = 'Invalid email address';
    }

    if (!values.password) {
      errors.password = 'Password is required';
    } else if (values.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    if (!values.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (values.password !== values.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    return errors;
  };

  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    validate,
    onSubmit: async (values) => {
      setLocalError(null);
      dispatch(clearError());

      const signupData: IUserSignUp = {
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        password: values.password,
      };

      try {
        await dispatch(userSignUp(signupData)).unwrap();
      } catch (err: unknown) {
        if (err instanceof Error) {
          setLocalError(err.message);
        } else {
          setLocalError('Signup failed. Please try again.');
        }
      }
    },
  });

  const displayError = localError || error;

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

          {/* Success Message */}
          {success && user && (
            <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
              ✓ Signup successful! Redirecting...
            </div>
          )}

          {/* Error Message */}
          {displayError && (
            <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              ✗ {displayError}
            </div>
          )}

          {/* OAuth Buttons */}
          <div className="space-y-3 mb-6">
            <button
              className="w-full border border-gray-300 rounded-lg py-3 flex items-center justify-center gap-2 hover:bg-gray-50 transition"
              disabled={loading}
            >
              <span>🐙</span>
              Sign up with Google
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 border-t border-gray-300"></div>
            <span className="text-gray-500 text-sm">OR</span>
            <div className="flex-1 border-t border-gray-300"></div>
          </div>

          {/* Form */}
          <form onSubmit={formik.handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Input
                  placeholder="First name"
                  name="firstName"
                  value={formik.values.firstName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  disabled={loading}
                />
                {formik.touched.firstName && formik.errors.firstName && (
                  <div className="text-red-500 text-sm mt-1">{formik.errors.firstName}</div>
                )}
              </div>
              <div>
                <Input
                  placeholder="Last name"
                  name="lastName"
                  value={formik.values.lastName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  disabled={loading}
                />
                {formik.touched.lastName && formik.errors.lastName && (
                  <div className="text-red-500 text-sm mt-1">{formik.errors.lastName}</div>
                )}
              </div>
            </div>

            <div>
              <Input
                type="email"
                placeholder="Enter your email"
                name="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                disabled={loading}
              />
              {formik.touched.email && formik.errors.email && (
                <div className="text-red-500 text-sm mt-1">{formik.errors.email}</div>
              )}
            </div>

            <div>
              <Input
                type="password"
                placeholder="Create password"
                name="password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                disabled={loading}
              />
              {formik.touched.password && formik.errors.password && (
                <div className="text-red-500 text-sm mt-1">{formik.errors.password}</div>
              )}
            </div>

            <div>
              <Input
                type="password"
                placeholder="Confirm password"
                name="confirmPassword"
                value={formik.values.confirmPassword}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                disabled={loading}
              />
              {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                <div className="text-red-500 text-sm mt-1">{formik.errors.confirmPassword}</div>
              )}
            </div>

            {/* Sign Up Button */}
            <Button type="submit" disabled={loading}>
              {loading ? 'Creating account...' : 'Create account'}
            </Button>
          </form>

          {/* Sign In Link */}
          <div className="text-center mt-6">
            <span className="text-gray-700">Already have an account? </span>
            <Link to="/sign-in" className="text-blue-500 font-semibold hover:underline">
              Sign in
            </Link>
          </div>
        </div>

        {/* Right Section - Decorative */}
        <div className="hidden md:block md:w-1/2 bg-gradient-to-br from-pink-200 via-purple-200 to-blue-200 p-12 relative overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="grid grid-cols-3 gap-4">
              {/* {decorationIndices.map((index) => (
                <div
                  key={index}
                  className="w-20 h-20 rounded-full bg-white opacity-30 shadow-lg"
                ></div>
              ))} */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
