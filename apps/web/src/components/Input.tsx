import { FC, memo } from 'react';

interface InputProps {
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  className?: string;
  name?: string;
  required?: boolean;
  disabled?: boolean;
}

export const Input: FC<InputProps> = memo(
  ({
    type = 'text',
    placeholder = '',
    value,
    onChange,
    onBlur,
    className = '',
    name = '',
    required = false,
    disabled = false,
  }) => {
    return (
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        name={name}
        required={required}
        disabled={disabled}
        className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black transition disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      />
    );
  }
);
