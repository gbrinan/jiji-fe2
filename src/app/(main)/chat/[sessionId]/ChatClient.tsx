"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { chatApi, agentApi } from "@/lib/api";
import type { MessageResponse } from "@/lib/types";
import ChatLayout from "@/components/layout/ChatLayout";
import Skeleton from "@/components/ui/Skeleton";

export default function ChatClient() {
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

    // Optimistic: render the user message immediately
    const userMsg: MessageResponse = {
      id: `local-${Date.now()}`,
      sessionId,
      senderType: "user",
      content,
      metadata: null,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMsg]);

    try {
      // Route the message through moai-jiji-chatbot (/agent/v1/chat).
      const res = await agentApi.chat(content, sessionId);

      if (res.needReauth) {
        router.replace(`/login?redirect=/chat/${sessionId}`);
        return;
      }

      if (res.emergencyTriggered) {
        router.push("/emergency");
        return;
      }

      const agentMsg: MessageResponse = {
        id: `agent-${Date.now()}`,
        sessionId,
        senderType: "assistant",
        content: res.reply,
        metadata: {
          module: res.module,
          contraindicationLevel: res.contraindicationLevel,
          shouldLogMood: res.shouldLogMood,
        },
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, agentMsg]);
    } catch (err) {
      console.error("Agent chat failed:", err);
      const errorMsg: MessageResponse = {
        id: `error-${Date.now()}`,
        sessionId,
        senderType: "assistant",
        content: "죄송해요, 잠시 후 다시 시도해주세요.",
        metadata: null,
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMsg]);
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
