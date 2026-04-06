interface CardProps {
  variant?: "default" | "elevated" | "outlined";
  padding?: "sm" | "md" | "lg";
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export default function Card({
  variant = "default",
  padding = "md",
  children,
  className = "",
  onClick,
}: CardProps) {
  const variants = {
    default: "bg-white rounded-2xl",
    elevated: "bg-white rounded-2xl shadow-lg",
    outlined: "bg-white rounded-2xl border border-gray-200",
  };

  const paddings = {
    sm: "p-3",
    md: "p-4",
    lg: "p-6",
  };

  return (
    <div
      className={`${variants[variant]} ${paddings[padding]} ${className}`}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {children}
    </div>
  );
}
