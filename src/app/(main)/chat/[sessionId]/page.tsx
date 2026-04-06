"use client";

import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import { api } from "@/lib/api";
import type { MessageResponse, CreateMessageRequest } from "@/lib/types";
import Header from "@/components/layout/Header";
import { Send } from "lucide-react";

function ChatBubble({ msg }: { msg: MessageResponse }) {
  const isUser = msg.senderType === "user";
  return (
    <div className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}>
      <div
        className={`
          max-w-[80%] px-4 py-3 text-base whitespace-pre-wrap
          ${isUser
            ? "bg-primary-500 text-white rounded-2xl rounded-br-md"
            : "bg-gray-100 text-gray-900 rounded-2xl rounded-bl-md"
          }
        `}
      >
        {msg.content}
      </div>
      <span className="text-xs text-gray-400 mt-1">
        {new Date(msg.createdAt).toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" })}
      </span>
    </div>
  );
}

export default function ChatConversationPage() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const [messages, setMessages] = useState<MessageResponse[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    api.get<MessageResponse[]>(`/chats/sessions/${sessionId}/messages`)
      .then(setMessages)
      .catch(() => {});
  }, [sessionId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSend() {
    if (!input.trim() || sending) return;
    setSending(true);
    try {
      const body: CreateMessageRequest = { senderType: "user", content: input.trim() };
      const msg = await api.post<MessageResponse>(`/chats/sessions/${sessionId}/messages`, body);
      setMessages((prev) => [...prev, msg]);
      setInput("");
    } catch {
      alert("메시지 전송에 실패했습니다.");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="min-h-dvh flex flex-col">
      <Header title="상담" showBackButton />
      <div className="flex-1 overflow-y-auto px-5 pt-4 pb-20 flex flex-col gap-4" role="log">
        {messages.map((msg) => (
          <ChatBubble key={msg.id} msg={msg} />
        ))}
        <div ref={bottomRef} />
      </div>

      <div className="fixed bottom-16 left-1/2 -translate-x-1/2 w-full max-w-md bg-white border-t border-gray-100 px-4 py-3 flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
          placeholder="메시지를 입력하세요"
          className="flex-1 bg-gray-100 rounded-full px-4 py-3 text-base outline-none"
          disabled={sending}
        />
        <button
          onClick={handleSend}
          disabled={!input.trim() || sending}
          className={`w-10 h-10 rounded-full flex items-center justify-center ${input.trim() ? "bg-primary-500 text-white" : "bg-gray-200 text-gray-400"}`}
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
