"use client";

interface InputProps {
  type?: "text" | "email" | "password" | "number" | "date";
  label: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
  required?: boolean;
}

export default function Input({
  type = "text",
  label,
  placeholder,
  value,
  onChange,
  error,
  disabled = false,
  required = false,
}: InputProps) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className={`
          h-12 px-4 rounded-xl border text-base outline-none transition-all
          ${error ? "border-red-500 ring-2 ring-red-500/20" : "border-gray-300 focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500"}
          ${disabled ? "bg-gray-100 text-gray-400" : "bg-white"}
        `}
      />
      {error && <span className="text-sm text-red-500">{error}</span>}
    </div>
  );
}
