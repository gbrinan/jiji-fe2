interface SkeletonProps {
  variant?: "text" | "card" | "circle" | "bar";
  width?: string;
  height?: string;
  className?: string;
}

export default function Skeleton({ variant = "text", width, height, className = "" }: SkeletonProps) {
  const variants = {
    text: "h-4 rounded w-full",
    card: "h-32 rounded-2xl w-full",
    circle: "rounded-full",
    bar: "h-3 rounded-full w-full",
  };

  return (
    <div
      className={`bg-gray-200 animate-pulse ${variants[variant]} ${className}`}
      style={{ width, height }}
      aria-hidden="true"
    />
  );
}
