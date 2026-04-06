interface ProgressBarProps {
  current: number;
  total: number;
  showLabel?: boolean;
}

export default function ProgressBar({ current, total, showLabel = true }: ProgressBarProps) {
  const pct = Math.round((current / total) * 100);
  return (
    <div className="w-full">
      {showLabel && (
        <p className="text-sm text-gray-500 text-right mb-1">
          {current}/{total}
        </p>
      )}
      <div className="h-2 bg-gray-200 rounded-full w-full" role="progressbar" aria-valuenow={current} aria-valuemin={0} aria-valuemax={total}>
        <div
          className="h-2 rounded-full bg-gradient-to-r from-primary-500 to-primary-600 transition-all duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
