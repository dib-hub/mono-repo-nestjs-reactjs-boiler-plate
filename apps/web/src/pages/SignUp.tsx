import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FormikErrors, useFormik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { CreateUser, UserRole } from '@my-monorepo/types';
import { CredentialResponse, GoogleLogin } from '@react-oauth/google';
import { Input } from '@src/components/Input';
import { Button } from '@src/components/Button';
import { userGoogleSignIn, userSignUp } from '@src/services/auth';
import { clearError } from '@src/redux/slices/authSlice';
import { RootState, AppDispatch } from '@src/redux/store';

const googleClientId = import.meta.env['VITE_GOOGLE_CLIENT_ID'] as string;

export const SignUp: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { user, loading, error, success } = useSelector((state: RootState) => state.authSlice);
  const [localError, setLocalError] = useState<string | null>(null);

  useEffect(() => {
    if (success && user) {
      setLocalError(null);
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    }
  }, [success, user, navigate]);

  const validate = useCallback((values: CreateUser): FormikErrors<CreateUser> => {
    const errors: FormikErrors<CreateUser> = {};

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
  }, []);

  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: UserRole.USER,
    },
    validate,
    onSubmit: async (values) => {
      setLocalError(null);
      dispatch(clearError());

      const signupData: CreateUser = {
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        password: values.password,
        confirmPassword: values.confirmPassword,
        role: values.role,
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

  const displayError = useMemo(() => localError || error, [localError, error]);

  const handleGoogleSuccess = useCallback(
    async (credentialResponse: CredentialResponse) => {
      const idToken = credentialResponse.credential;

      if (!idToken) {
        setLocalError('Google did not return a valid token. Please try again.');
        return;
      }

      setLocalError(null);
      dispatch(clearError());

      try {
        await dispatch(userGoogleSignIn({ idToken })).unwrap();
      } catch (err: unknown) {
        if (typeof err === 'string') {
          setLocalError(err);
        } else if (err instanceof Error) {
          setLocalError(err.message);
        } else {
          setLocalError('Google sign-in failed. Please try again.');
        }
      }
    },
    [dispatch]
  );

  const handleGoogleError = useCallback(() => {
    setLocalError('Google sign-in failed. Please try again.');
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-pink-100 via-blue-100 to-purple-100 p-4">
      <div className="flex w-full max-w-5xl bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
          <div className="mb-8">
            <h1 className="text-2xl font-bold mb-2">DibHub</h1>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Create an account</h2>
            <p className="text-gray-600">Join us today and get started.</p>
          </div>

          {success && user && (
            <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
              Signup successful! Redirecting...
            </div>
          )}

          {displayError && (
            <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              {displayError}
            </div>
          )}

          <div className="space-y-3 mb-6">
            {googleClientId ? (
              <GoogleLogin
                onSuccess={(credentialResponse) => {
                  void handleGoogleSuccess(credentialResponse);
                }}
                onError={handleGoogleError}
                text="signup_with"
                shape="rectangular"
                width="100%"
                theme="outline"
                containerProps={{
                  style: loading ? { opacity: 0.6, pointerEvents: 'none' } : undefined,
                }}
              />
            ) : (
              <div className="w-full border border-yellow-300 rounded-lg p-3 text-sm text-yellow-700 bg-yellow-50">
                Google sign-up is unavailable because `VITE_GOOGLE_CLIENT_ID` is missing.
              </div>
            )}
          </div>

          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 border-t border-gray-300"></div>
            <span className="text-gray-500 text-sm">OR</span>
            <div className="flex-1 border-t border-gray-300"></div>
          </div>

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

            <Button type="submit" disabled={loading}>
              {loading ? 'Creating account...' : 'Create account'}
            </Button>
          </form>

          <div className="text-center mt-6">
            <span className="text-gray-700">Already have an account? </span>
            <Link to="/sign-in" className="text-blue-500 font-semibold hover:underline">
              Sign in
            </Link>
          </div>
        </div>

        <div className="hidden md:block md:w-1/2 bg-gradient-to-br from-pink-200 via-purple-200 to-blue-200 p-12 relative overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="grid grid-cols-3 gap-4"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
