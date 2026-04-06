"use client";

import { ChevronLeft, Home, Bell, Send } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface ChatLayoutProps {
  children: React.ReactNode;
  showBack?: boolean;
  showTimestamp?: boolean;
  timestamp?: string;
  subtitle?: string;
  onSend?: (message: string) => void;
  inputPlaceholder?: string;
  hideInput?: boolean;
}

export default function ChatLayout({
  children,
  showBack = true,
  showTimestamp = false,
  timestamp,
  subtitle,
  onSend,
  inputPlaceholder = "여기에 질문을 입력해주세요.",
  hideInput = false,
}: ChatLayoutProps) {
  const router = useRouter();
  const [input, setInput] = useState("");

  function handleSend() {
    if (!input.trim()) return;
    onSend?.(input.trim());
    setInput("");
  }

  return (
    <div className="min-h-dvh relative overflow-hidden flex flex-col">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#f0e8dc] via-[#e4daf0] to-[#c8d8f4]" />
      <div className="absolute -left-20 top-0 w-[400px] h-[400px] rounded-full bg-[#ede4d8]/60 blur-[80px]" />
      <div className="absolute right-[-40px] bottom-40 w-[300px] h-[300px] rounded-full bg-[#d0d8f0]/50 blur-[60px]" />

      {/* Top Bar */}
      <div className="relative z-10 flex items-center justify-between px-4 pt-14 pb-2">
        <div className="flex items-center gap-2">
          {showBack && (
            <button onClick={() => router.back()} className="w-8 h-8 flex items-center justify-center">
              <ChevronLeft className="w-6 h-6 text-gray-600" />
            </button>
          )}
          <button onClick={() => router.push("/home")} className="w-8 h-8 flex items-center justify-center">
            <Home className="w-5 h-5 text-gray-600" />
          </button>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-primary-500 flex items-center justify-center">
            <span className="text-white text-sm">👤</span>
          </div>
          <button className="w-8 h-8 flex items-center justify-center">
            <Bell className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Timestamp & Subtitle */}
      {(showTimestamp || subtitle) && (
        <div className="relative z-10 text-center py-2">
          {showTimestamp && (
            <span className="inline-block px-3 py-1 rounded-full bg-white/60 text-xs text-gray-500">
              {timestamp || new Date().toLocaleString("ko-KR", { month: "long", day: "numeric", weekday: "short", hour: "2-digit", minute: "2-digit" })}
            </span>
          )}
          {subtitle && <p className="text-base font-medium text-gray-900 mt-2">{subtitle}</p>}
        </div>
      )}

      {/* Content */}
      <div className="relative z-10 flex-1 overflow-y-auto px-4 pb-20">
        {children}
      </div>

      {/* Chat Input */}
      {!hideInput && (
        <div className="relative z-10 px-4 py-3 bg-white/80 backdrop-blur border-t border-gray-100">
          <div className="flex items-center gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder={inputPlaceholder}
              className="flex-1 bg-gray-50 rounded-full px-4 py-3 text-sm outline-none placeholder:text-gray-400"
            />
            <button
              onClick={handleSend}
              className="w-10 h-10 flex items-center justify-center text-gray-400"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
