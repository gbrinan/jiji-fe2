interface ActionCardProps {
  icon?: string;
  title: string;
  description?: string;
  items?: string[];
  variant?: "blue" | "white";
}

export default function ActionCard({ icon, title, description, items, variant = "blue" }: ActionCardProps) {
  const bg = variant === "blue" ? "bg-blue-50 border-blue-100" : "bg-white";
  return (
    <div className={`rounded-2xl p-4 ${bg} border border-gray-100 shadow-sm ml-10`}>
      <div className="flex items-center gap-2 mb-2">
        {icon && <span>{icon}</span>}
        <p className="text-sm font-semibold text-primary-600">{title}</p>
      </div>
      {description && <p className="text-sm text-gray-600">{description}</p>}
      {items && (
        <div className="flex flex-col gap-1.5 mt-2">
          {items.map((item, i) => (
            <div key={i} className="flex items-center gap-2 text-sm text-gray-700">
              <span className="text-primary-500">✓</span> {item}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
