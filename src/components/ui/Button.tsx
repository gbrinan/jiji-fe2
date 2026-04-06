"use client";

import { Loader2 } from "lucide-react";

interface ButtonProps {
  variant?: "primary" | "secondary" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  disabled?: boolean;
  loading?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
  className?: string;
}

const variantStyles = {
  primary: "bg-gradient-to-r from-primary-500 to-primary-600 text-white hover:from-primary-600 hover:to-blue-700",
  secondary: "bg-white border border-primary-500 text-primary-500 hover:bg-primary-50",
  danger: "bg-red-500 text-white hover:bg-red-600",
  ghost: "bg-transparent text-primary-500 hover:bg-primary-50",
};

const sizeStyles = {
  sm: "h-9 px-3 text-sm",
  md: "h-12 px-4 text-base",
  lg: "h-14 px-6 text-lg",
};

export default function Button({
  variant = "primary",
  size = "md",
  fullWidth = false,
  disabled = false,
  loading = false,
  children,
  onClick,
  type = "button",
  className = "",
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        inline-flex items-center justify-center rounded-xl font-semibold
        transition-all duration-150
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${fullWidth ? "w-full" : ""}
        ${disabled || loading ? "opacity-50 pointer-events-none" : ""}
        ${className}
      `}
    >
      {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : children}
    </button>
  );
}
