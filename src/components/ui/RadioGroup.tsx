"use client";

interface LikertOption {
  value: number;
  label: string;
}

interface LikertRadioGroupProps {
  questionId: number;
  options: LikertOption[];
  selectedValue: number | null;
  onChange: (value: number) => void;
  disabled?: boolean;
}

export function LikertRadioGroup({
  questionId,
  options,
  selectedValue,
  onChange,
  disabled = false,
}: LikertRadioGroupProps) {
  return (
    <div role="radiogroup" aria-labelledby={`question-${questionId}`} className="flex flex-col gap-3">
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
              flex items-center gap-3 min-h-[48px] px-4 py-3 rounded-xl border transition-all duration-150
              ${selected ? "border-primary-500 bg-blue-50" : "border-gray-200 bg-white hover:border-gray-300"}
              ${disabled ? "opacity-50 pointer-events-none" : ""}
            `}
          >
            <span className={`
              w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0
              ${selected ? "border-primary-500" : "border-gray-300"}
            `}>
              {selected && <span className="w-2.5 h-2.5 rounded-full bg-primary-500" />}
            </span>
            <span className="text-base text-gray-900">{option.label}</span>
          </button>
        );
      })}
    </div>
  );
}

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
