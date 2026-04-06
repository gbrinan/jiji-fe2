"use client";

import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";

interface HeaderProps {
  title?: string;
  showBackButton?: boolean;
  onBack?: () => void;
  rightAction?: React.ReactNode;
  extended?: boolean;
  children?: React.ReactNode;
}

export default function Header({
  title,
  showBackButton = false,
  onBack,
  rightAction,
  extended = false,
  children,
}: HeaderProps) {
  const router = useRouter();

  return (
    <header
      className={`
        w-full bg-gradient-to-br from-primary-500 to-primary-600 text-white
        ${extended ? "min-h-[200px] pb-20" : "rounded-b-3xl pb-6"}
        px-5 pt-[max(env(safe-area-inset-top),12px)]
      `}
    >
      <div className="flex items-center justify-between h-11">
        {showBackButton ? (
          <button
            onClick={onBack || (() => router.back())}
            className="w-10 h-10 flex items-center justify-center -ml-2"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        ) : (
          <div className="w-10" />
        )}
        {title && <h1 className="text-lg font-semibold flex-1 text-center">{title}</h1>}
        {rightAction || <div className="w-10" />}
      </div>
      {children}
    </header>
  );
}
