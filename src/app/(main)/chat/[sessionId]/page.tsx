"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import { chatApi } from "@/lib/api";
import type { MessageResponse } from "@/lib/types";
import ChatLayout from "@/components/layout/ChatLayout";
import Skeleton from "@/components/ui/Skeleton";

export default function ChatConversationPage() {
  const params = useParams();
  const sessionId = params.sessionId as string;
  const [messages, setMessages] = useState<MessageResponse[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  const fetchMessages = useCallback(async () => {
    try {
      const msgs = await chatApi.getMessages(sessionId);
      setMessages(msgs);
    } catch {}
  }, [sessionId]);

  useEffect(() => {
    fetchMessages().finally(() => setLoading(false));
  }, [fetchMessages]);

  const handleSend = async () => {
    if (!inputValue.trim() || sending) return;
    const content = inputValue.trim();
    setInputValue("");
    setSending(true);

    try {
      // Send user message
      const userMsg = await chatApi.sendMessage(sessionId, {
        senderType: "user",
        content,
      });
      setMessages((prev) => [...prev, userMsg]);

      // In a real app, the assistant response would come from a different mechanism
      // For now, we just refetch messages after a short delay
      setTimeout(async () => {
        await fetchMessages();
        setSending(false);
      }, 1000);
    } catch {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-dvh">
        <div className="bg-gradient-to-br from-primary-500 to-primary-600 h-14 rounded-b-3xl" />
        <div className="px-5 py-6 flex flex-col gap-4">
          {Array.from({ length: 4 }, (_, i) => (
            <div key={i} className={`flex ${i % 2 === 0 ? "justify-start" : "justify-end"}`}>
              <Skeleton variant="card" width={i % 2 === 0 ? "70%" : "60%"} height="60px" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <ChatLayout
      title="상담"
      messages={messages.map((m) => ({
        id: m.id,
        senderType: m.senderType as "user" | "assistant",
        content: m.content,
        createdAt: m.createdAt,
      }))}
      inputValue={inputValue}
      onInputChange={setInputValue}
      onSend={handleSend}
      inputDisabled={sending}
      showBackButton
    />
  );
}
