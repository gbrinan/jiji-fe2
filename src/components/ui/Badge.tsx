type BadgeVariant = "normal" | "mild" | "moderate" | "severe" | "somatic" | "psychological" | "urogenital";

interface BadgeProps {
  variant: BadgeVariant;
  label: string;
  size?: "sm" | "md";
}

const variantStyles: Record<BadgeVariant, string> = {
  normal: "text-green-700 bg-green-50",
  mild: "text-yellow-800 bg-yellow-50",
  moderate: "text-orange-800 bg-orange-50",
  severe: "text-red-700 bg-red-50",
  somatic: "text-primary-500 bg-blue-50",
  psychological: "text-purple-700 bg-purple-50",
  urogenital: "text-pink-700 bg-pink-50",
};

export default function Badge({ variant, label, size = "md" }: BadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center rounded-full font-medium
        ${variantStyles[variant]}
        ${size === "sm" ? "px-2 py-0.5 text-xs" : "px-3 py-1 text-sm"}
      `}
      role="status"
    >
      {label}
    </span>
  );
}
