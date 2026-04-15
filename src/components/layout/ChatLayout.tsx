"use client";

import { useRef, useEffect } from "react";
import { ArrowUp } from "lucide-react";
import Header from "./Header";

interface ChatLayoutProps {
  title: string;
  messages: Array<{
    id: string;
    senderType: "user" | "assistant";
    content: string;
    createdAt: string;
  }>;
  inputValue: string;
  onInputChange: (value: string) => void;
  onSend: () => void;
  inputDisabled?: boolean;
  showBackButton?: boolean;
  onBack?: () => void;
  onEndSession?: () => void;
}

export default function ChatLayout({
  title,
  messages,
  inputValue,
  onInputChange,
  onSend,
  inputDisabled = false,
  showBackButton = true,
  onBack,
  onEndSession,
}: ChatLayoutProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey && inputValue.trim()) {
      e.preventDefault();
      onSend();
    }
  };

  const formatTime = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="flex flex-col min-h-dvh">
      <Header
        title={title}
        showBackButton={showBackButton}
        onBack={onBack}
        rightAction={
          onEndSession ? (
            <button
              onClick={onEndSession}
              className="text-sm font-medium text-primary-500"
            >
              상담 종료
            </button>
          ) : undefined
        }
      />

      {/* Message list */}
      <div className="flex-1 overflow-y-auto px-5 py-4" role="log">
        <div className="flex flex-col gap-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.senderType === "user" ? "items-end" : "items-start"}`}
            >
              <div
                className={`
                  max-w-[80%] px-4 py-3 text-base whitespace-pre-wrap
                  ${msg.senderType === "user"
                    ? "bg-primary-500 text-white rounded-2xl rounded-br-md"
                    : "bg-gray-100 text-gray-900 rounded-2xl rounded-bl-md"
                  }
                `}
                aria-label={`${msg.senderType === "user" ? "나" : "상담사"} ${formatTime(msg.createdAt)}`}
              >
                {msg.content}
              </div>
              <span className="text-xs text-gray-400 mt-1">{formatTime(msg.createdAt)}</span>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Chat input */}
      <div
        className="sticky bottom-0 bg-white border-t border-gray-100 px-4 py-3 flex items-center gap-3"
        style={{ paddingBottom: "max(env(safe-area-inset-bottom), 12px)" }}
      >
        <input
          type="text"
          value={inputValue}
          onChange={(e) => onInputChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="메시지를 입력하세요"
          disabled={inputDisabled}
          className="flex-1 bg-gray-100 rounded-full px-4 py-3 text-base outline-none"
        />
        <button
          onClick={onSend}
          disabled={inputDisabled || !inputValue.trim()}
          className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center text-white disabled:opacity-50 flex-shrink-0"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
