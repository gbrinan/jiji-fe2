interface CardProps {
  variant?: "default" | "elevated" | "outlined";
  padding?: "sm" | "md" | "lg";
  children: React.ReactNode;
  className?: string;
}

const variantStyles = {
  default: "bg-white rounded-2xl",
  elevated: "bg-white rounded-2xl shadow-lg",
  outlined: "bg-white rounded-2xl border border-gray-200",
};

const paddingStyles = {
  sm: "p-3",
  md: "p-4",
  lg: "p-6",
};

export default function Card({
  variant = "default",
  padding = "md",
  children,
  className = "",
}: CardProps) {
  return (
    <div className={`${variantStyles[variant]} ${paddingStyles[padding]} ${className}`}>
      {children}
    </div>
  );
}
