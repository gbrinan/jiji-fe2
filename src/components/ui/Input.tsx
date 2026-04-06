"use client";

import { useId } from "react";

interface InputProps {
  type?: "text" | "email" | "password" | "number" | "date";
  label: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  helperText?: string;
  disabled?: boolean;
  required?: boolean;
  autoComplete?: string;
}

export default function Input({
  type = "text",
  label,
  placeholder,
  value,
  onChange,
  error,
  helperText,
  disabled = false,
  required = false,
  autoComplete,
}: InputProps) {
  const id = useId();
  const errorId = `${id}-error`;
  const helperId = `${id}-helper`;

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        autoComplete={autoComplete}
        aria-invalid={!!error}
        aria-describedby={error ? errorId : helperText ? helperId : undefined}
        className={`
          h-14 px-4 rounded-2xl border text-base outline-none transition-all duration-150
          shadow-[inset_0px_1px_2px_0px_rgba(0,0,0,0.05)]
          ${error
            ? "border-red-500 focus:ring-2 focus:ring-red-500"
            : "border-[#fafafa] focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          }
          ${disabled ? "bg-gray-100 text-gray-400" : "bg-[#f5f5f5]"}
        `}
      />
      {error && <p id={errorId} className="text-sm text-red-500 mt-1">{error}</p>}
      {!error && helperText && <p id={helperId} className="text-sm text-gray-500 mt-1">{helperText}</p>}
    </div>
  );
}
