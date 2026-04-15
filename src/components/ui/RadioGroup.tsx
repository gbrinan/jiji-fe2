"use client";

interface HrtOption {
  value: string;
  label: string;
}

interface HrtRadioGroupProps {
  questionId: number;
  options: HrtOption[];
  selectedValue: string | null;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export function HrtRadioGroup({
  questionId,
  options,
  selectedValue,
  onChange,
  disabled = false,
}: HrtRadioGroupProps) {
  return (
    <div role="radiogroup" aria-labelledby={`question-${questionId}`} className="flex gap-3">
      {options.map((option) => {
        const selected = selectedValue === option.value;
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={selected}
            disabled={disabled}
            onClick={() => onChange(option.value)}
            className={`
              flex-1 text-center py-3 rounded-xl border font-medium transition-all duration-150
              ${selected
                ? option.value === "DONT_KNOW"
                  ? "bg-gray-50 border-gray-400 text-gray-700"
                  : "bg-blue-50 border-primary-500 text-primary-700"
                : "bg-white border-gray-200 text-gray-700 hover:border-gray-300"
              }
              ${disabled ? "opacity-50 pointer-events-none" : ""}
            `}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
