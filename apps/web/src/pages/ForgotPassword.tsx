import { useState, JSX, FC, FormEvent, useCallback, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AnimatedErrorAlert } from '@src/components/AnimatedErrorAlert';
import { Button } from '@src/components/Button';
import { Input } from '@src/components/Input';
import { requestPasswordReset } from '@src/services/auth';

const decorationIndices = Array.from({ length: 9 }, (_, i) => i);

export const ForgotPassword: FC = (): JSX.Element => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  // Clear error states on component unmount
  useEffect(() => {
    return () => {
      setError(null);
      setSuccessMessage('');
    };
  }, []);

  const handleFormSubmit = useCallback(
    async (e: FormEvent): Promise<void> => {
      e.preventDefault();

      const normalizedEmail = email.trim().toLowerCase();

      if (!normalizedEmail) {
        setError('Email is required');
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await requestPasswordReset({ email: normalizedEmail });
        setSuccessMessage(response.message);
        setSubmitted(true);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('Failed to request password reset');
        }
      } finally {
        setLoading(false);
      }
    },
    [email]
  );

  const handleReset = useCallback((): void => {
    setSubmitted(false);
    setError(null);
    setSuccessMessage('');
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-pink-100 via-blue-100 to-purple-100 p-4">
      <div className="flex w-full max-w-5xl bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Left Section */}
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
          <div className="mb-8">
            <h1 className="text-2xl font-bold mb-2">DibHub</h1>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Forgot password?</h2>
            <p className="text-gray-600">No worries, we'll help you reset it.</p>
          </div>

          {!submitted ? (
            <form
              onSubmit={(e) => {
                void handleFormSubmit(e);
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  required
                />
              </div>

              <Button type="submit" disabled={loading}>
                {loading ? 'Sending reset link...' : 'Send reset link'}
              </Button>
              <AnimatedErrorAlert message={error} />
            </form>
          ) : (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Check your email</h3>
              <p className="text-gray-600 mb-4">{successMessage}</p>
              <p className="text-gray-600 mb-6">
                If an account exists for <span className="font-medium">{email}</span>, you will
                receive a reset link. Open that link to create a new password.
              </p>
              <button
                type="button"
                className="mt-4 text-sm text-gray-700 hover:text-black transition"
                onClick={handleReset}
              >
                Use another email
              </button>
            </div>
          )}

          {/* Sign In Link */}
          <div className="text-center mt-6">
            <Link to="/sign-in" className="text-gray-700 hover:text-black transition">
              Back to sign in
            </Link>
          </div>
        </div>

        {/* Right Section - Decorative */}
        <div className="hidden md:block md:w-1/2 bg-gradient-to-br from-pink-200 via-purple-200 to-blue-200 p-12 relative overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="grid grid-cols-3 gap-4">
              {decorationIndices.map((index) => (
                <div
                  key={index}
                  className="w-20 h-20 rounded-full bg-white opacity-30 shadow-lg"
                ></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
