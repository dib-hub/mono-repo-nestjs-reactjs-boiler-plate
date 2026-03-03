import React, { useEffect, useState } from 'react';
import { FormikErrors, useFormik } from 'formik';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { clearError } from '../redux/slices/authSlice';
import { AppDispatch, RootState } from '../redux/store';
import { IUserSignIn, userSignIn } from '../services/auth';

interface SignInForm {
  email: string;
  password: string;
}

export const SignIn: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { user, loading, error, success } = useSelector((state: RootState) => state.authSlice);
  const [rememberMe, setRememberMe] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  useEffect(() => {
    if (success && user) {
      setLocalError(null);
      setTimeout(() => {
        navigate('/');
      }, 1000);
    }
  }, [success, user, navigate]);

  const validate = (values: SignInForm): FormikErrors<SignInForm> => {
    const errors: FormikErrors<SignInForm> = {};

    if (!values.email) {
      errors.email = 'Email is required';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
      errors.email = 'Invalid email address';
    }

    if (!values.password) {
      errors.password = 'Password is required';
    }

    return errors;
  };

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validate,
    onSubmit: async (values) => {
      setLocalError(null);
      dispatch(clearError());

      const signInData: IUserSignIn = {
        email: values.email,
        password: values.password,
      };

      try {
        await dispatch(userSignIn(signInData)).unwrap();
      } catch (err: unknown) {
        if (typeof err === 'string') {
          setLocalError(err);
        } else if (err instanceof Error) {
          setLocalError(err.message);
        } else {
          setLocalError('Signin failed. Please try again.');
        }
      }
    },
  });

  const displayError = localError || error;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-pink-100 via-blue-100 to-purple-100 p-4">
      <div className="flex w-full max-w-5xl bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
          <div className="mb-8">
            <h1 className="text-2xl font-bold mb-2">DibHub</h1>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Welcome back</h2>
            <p className="text-gray-600">Enter your account details.</p>
          </div>

          {success && user && (
            <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
              Login successful! Redirecting...
            </div>
          )}

          {displayError && (
            <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              {displayError}
            </div>
          )}

          <div className="space-y-3 mb-6">
            <button
              className="w-full border border-gray-300 rounded-lg py-3 flex items-center justify-center gap-2 hover:bg-gray-50 transition"
              disabled={loading}
            >
              Log in with Google
            </button>
            <button
              className="w-full border border-gray-300 rounded-lg py-3 flex items-center justify-center gap-2 hover:bg-gray-50 transition"
              disabled={loading}
            >
              Log in with GitHub
            </button>
          </div>

          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 border-t border-gray-300"></div>
            <span className="text-gray-500 text-sm">OR</span>
            <div className="flex-1 border-t border-gray-300"></div>
          </div>

          <form onSubmit={formik.handleSubmit} className="space-y-4">
            <div>
              <Input
                type="email"
                name="email"
                placeholder="Email"
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
                name="password"
                placeholder="Password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                disabled={loading}
              />
              {formik.touched.password && formik.errors.password && (
                <div className="text-red-500 text-sm mt-1">{formik.errors.password}</div>
              )}
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300"
                />
                <span className="text-gray-700">Keep me signed in</span>
              </label>
              <Link to="/forgot-password" className="text-gray-700 hover:text-black transition">
                Forgot password
              </Link>
            </div>

            <Button type="submit" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign in'}
            </Button>
          </form>

          <div className="text-center mt-6">
            <button className="text-sm text-gray-700 hover:text-black transition">
              Trouble signing in?
            </button>
          </div>

          <div className="text-center mt-4">
            <span className="text-gray-700">Don't have an account? </span>
            <Link to="/sign-up" className="text-black font-semibold hover:underline">
              Create an account
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

export default SignIn;
