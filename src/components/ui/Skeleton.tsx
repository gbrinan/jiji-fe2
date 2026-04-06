interface SkeletonProps {
  variant?: "text" | "card" | "circle" | "bar";
  className?: string;
}

const baseStyles: Record<string, string> = {
  text: "h-4 rounded w-full",
  card: "h-32 rounded-2xl w-full",
  circle: "w-10 h-10 rounded-full",
  bar: "h-3 rounded-full w-full",
};

export default function Skeleton({ variant = "text", className = "" }: SkeletonProps) {
  return <div className={`bg-gray-200 animate-pulse ${baseStyles[variant]} ${className}`} aria-hidden="true" />;
}
