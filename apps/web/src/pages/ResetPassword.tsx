import { FC, FormEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { AnimatedErrorAlert } from '@src/components/AnimatedErrorAlert';
import { Button } from '@src/components/Button';
import { Input } from '@src/components/Input';
import { completePasswordReset, validatePasswordResetToken } from '@src/services/auth';

const decorationIndices = Array.from({ length: 9 }, (_, i) => i);

export const ResetPassword: FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = useMemo(() => searchParams.get('token') ?? '', [searchParams]);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [validatingToken, setValidatingToken] = useState(true);
  const [tokenValidated, setTokenValidated] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Clear error states on component unmount
  useEffect(() => {
    return () => {
      setError(null);
      setSuccess(false);
    };
  }, []);

  useEffect(() => {
    const validateToken = async (): Promise<void> => {
      if (!token) {
        setError('Reset link is invalid or missing a token');
        setTokenValidated(false);
        setValidatingToken(false);
        return;
      }

      setValidatingToken(true);
      setError(null);

      try {
        await validatePasswordResetToken({ token });
        setTokenValidated(true);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('Reset link is invalid or expired.');
        }
        setTokenValidated(false);
      } finally {
        setValidatingToken(false);
      }
    };

    void validateToken();
  }, [token]);

  const handleSubmit = useCallback(
    async (e: FormEvent): Promise<void> => {
      e.preventDefault();

      if (!tokenValidated) {
        setError('Reset link is invalid or expired.');
        return;
      }

      if (password.length < 6) {
        setError('Password must be at least 6 characters');
        return;
      }

      if (password !== confirmPassword) {
        setError('Passwords do not match');
        return;
      }

      setLoading(true);
      setError(null);

      try {
        await completePasswordReset({
          token,
          password,
          confirmPassword,
        });

        setSuccess(true);

        setTimeout(() => {
          navigate('/sign-in');
        }, 1200);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('Failed to reset password');
        }
      } finally {
        setLoading(false);
      }
    },
    [confirmPassword, navigate, password, token, tokenValidated]
  );

  const isDisabled = useMemo(
    () =>
      loading ||
      validatingToken ||
      !tokenValidated ||
      !token ||
      !password ||
      password !== confirmPassword,
    [confirmPassword, loading, password, token, tokenValidated, validatingToken]
  );

  const passwordMismatch = useMemo(
    () => password !== confirmPassword && !!confirmPassword,
    [password, confirmPassword]
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-pink-100 via-blue-100 to-purple-100 p-4">
      <div className="flex w-full max-w-5xl bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Left Section */}
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
          <div className="mb-8">
            <h1 className="text-2xl font-bold mb-2">DibHub</h1>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Reset password</h2>
            <p className="text-gray-600">Enter and confirm your new password.</p>
          </div>

          {!success ? (
            <form
              onSubmit={(e) => {
                void handleSubmit(e);
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter new password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password
                </label>
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Confirm password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={loading}
                  required
                />
              </div>

              <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showPassword}
                  onChange={(e) => setShowPassword(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300"
                />
                <span>Show password</span>
              </label>

              {passwordMismatch && <p className="text-red-600 text-sm">Passwords do not match</p>}

              <Button type="submit" disabled={isDisabled}>
                {loading ? 'Updating password...' : 'Reset password'}
              </Button>
              <AnimatedErrorAlert message={error} />
            </form>
          ) : (
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Password reset successful!
              </h3>
              <p className="text-gray-600 mb-6">
                Your password has been updated. Redirecting to sign in...
              </p>
              <Link to="/sign-in">
                <Button>Go to sign in</Button>
              </Link>
            </div>
          )}

          {validatingToken && !success && (
            <p className="mt-4 text-sm text-gray-600">Validating reset link...</p>
          )}
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

export default ResetPassword;
