import { FC, memo } from 'react';

interface PasswordVisibilityButtonProps {
  visible: boolean;
  onClick: () => void;
  disabled?: boolean;
}

const EyeIcon: FC = () => (
  <svg
    aria-hidden="true"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-5 w-5"
  >
    <path d="M2.25 12s3.75-7.5 9.75-7.5 9.75 7.5 9.75 7.5-3.75 7.5-9.75 7.5S2.25 12 2.25 12Z" />
    <circle cx="12" cy="12" r="3.25" />
  </svg>
);

const EyeOffIcon: FC = () => (
  <svg
    aria-hidden="true"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-5 w-5"
  >
    <path d="M3 3l18 18" />
    <path d="M10.58 10.58A2 2 0 0 0 10 12a2 2 0 0 0 2 2c.53 0 1.02-.21 1.42-.58" />
    <path d="M9.88 5.09A10.94 10.94 0 0 1 12 4.88c6 0 9.75 7.12 9.75 7.12a14.76 14.76 0 0 1-4.04 4.9" />
    <path d="M6.61 6.61A14.64 14.64 0 0 0 2.25 12s3.75 7.12 9.75 7.12c1.6 0 3.06-.39 4.36-1.03" />
  </svg>
);

export const PasswordVisibilityButton: FC<PasswordVisibilityButtonProps> = memo(
  ({ visible, onClick, disabled = false }) => {
    return (
      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        aria-label={visible ? 'Hide password' : 'Show password'}
        aria-pressed={visible}
        className="inline-flex h-9 w-9 items-center justify-center rounded-md text-gray-500 transition hover:text-gray-900 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {visible ? <EyeOffIcon /> : <EyeIcon />}
      </button>
    );
  }
);
