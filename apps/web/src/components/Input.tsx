import { FC, ReactNode, memo } from 'react';

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
  endAdornment?: ReactNode;
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
    endAdornment,
  }) => {
    const input = (
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        name={name}
        required={required}
        disabled={disabled}
        className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black transition disabled:opacity-50 disabled:cursor-not-allowed ${
          endAdornment ? 'pr-14' : ''
        } ${className}`}
      />
    );

    if (!endAdornment) {
      return input;
    }

    return (
      <div className="relative">
        {input}
        <div className="absolute inset-y-0 right-0 flex items-center pr-3">{endAdornment}</div>
      </div>
    );
  }
);
