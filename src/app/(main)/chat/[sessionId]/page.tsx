"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { chatApi, agentApi } from "@/lib/api";
import type { MessageResponse } from "@/lib/types";
import ChatLayout from "@/components/layout/ChatLayout";
import Skeleton from "@/components/ui/Skeleton";

export default function ChatConversationPage() {
  const params = useParams();
  const router = useRouter();
  const sessionId = params.sessionId as string;
  const [messages, setMessages] = useState<MessageResponse[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  const fetchMessages = useCallback(async () => {
    try {
      const msgs = await chatApi.getMessages(sessionId);
      setMessages(msgs);
      return msgs;
    } catch (err) {
      console.error("Failed to fetch messages:", err);
      return null;
    }
  }, [sessionId]);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      await fetchMessages();
      if (!cancelled) setLoading(false);
    }
    load();
    return () => { cancelled = true; };
  }, [fetchMessages]);

  const handleSend = async () => {
    if (!inputValue.trim() || sending) return;
    const content = inputValue.trim();
    setInputValue("");
    setSending(true);

    try {
      // 1. Save user message to BE
      const userMsg = await chatApi.sendMessage(sessionId, {
        senderType: "user",
        content,
      });
      setMessages((prev) => [...prev, userMsg]);

      // 2. Call agent for AI response
      const agentResponse = await agentApi.chat(content, sessionId);

      if (agentResponse.needReauth) {
        router.push("/login");
        return;
      }

      // 3. Save assistant response to BE
      const assistantMsg = await chatApi.sendMessage(sessionId, {
        senderType: "assistant",
        content: agentResponse.reply,
        metadata: {
          module: agentResponse.module,
          contraindicationLevel: agentResponse.contraindicationLevel,
          emergencyTriggered: agentResponse.emergencyTriggered,
        },
      });
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      console.error("Failed to send message:", err);
      // Show error as a temporary assistant message
      setMessages((prev) => [
        ...prev,
        {
          id: `error-${Date.now()}`,
          sessionId,
          senderType: "assistant",
          content: "죄송합니다. 일시적인 오류가 발생했어요. 다시 시도해 주세요.",
          metadata: null,
          createdAt: new Date().toISOString(),
        },
      ]);
    } finally {
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

  const handleEndSession = async () => {
    try {
      await chatApi.endSession(sessionId);
    } catch {
      // Session may already be ended
    }
    router.push("/closing");
  };

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
      onEndSession={handleEndSession}
    />
  );
}
