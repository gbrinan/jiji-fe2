"use client";

import { ChevronLeft, Bell } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface HeaderProps {
  title?: string;
  showBackButton?: boolean;
  showHomeButton?: boolean;
  onBack?: () => void;
  rightAction?: React.ReactNode;
  showLogo?: boolean;
  showProfileIcons?: boolean;
  transparent?: boolean;
  children?: React.ReactNode;
}

export default function Header({
  title,
  showBackButton = false,
  showHomeButton = false,
  onBack,
  rightAction,
  showLogo = false,
  showProfileIcons = false,
  transparent = false,
  children,
}: HeaderProps) {
  const router = useRouter();

  return (
    <header
      className={`w-full px-4 pt-[max(env(safe-area-inset-top),12px)] pb-3 ${
        transparent ? "" : "bg-white/80 backdrop-blur-sm"
      }`}
    >
      <div className="flex items-center justify-between h-11">
        <div className="flex items-center gap-2">
          {showBackButton && (
            <button
              onClick={onBack || (() => router.back())}
              className="w-10 h-10 flex items-center justify-center -ml-2"
            >
              <ChevronLeft className="w-6 h-6 text-gray-700" />
            </button>
          )}
          {showHomeButton && (
            <Link href="/home" className="w-10 h-10 flex items-center justify-center -ml-2">
              <svg className="w-6 h-6 text-gray-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1" />
              </svg>
            </Link>
          )}
          {showLogo && (
            <p className="text-[30px] font-bold text-slate-300 tracking-[1px] leading-[34px]">JiJi</p>
          )}
        </div>
        {title && <h1 className="text-base font-semibold text-gray-900 absolute left-1/2 -translate-x-1/2">{title}</h1>}
        <div className="flex items-center gap-2">
          {showProfileIcons && (
            <>
              <button className="w-10 h-10 rounded-full bg-primary-500 flex items-center justify-center">
                <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </button>
              <button className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center">
                <Bell className="w-5 h-5 text-gray-600" />
              </button>
            </>
          )}
          {rightAction}
        </div>
      </div>
      {children}
    </header>
  );
}
