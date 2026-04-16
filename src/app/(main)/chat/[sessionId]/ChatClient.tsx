"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { chatApi } from "@/lib/api";
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
  const pollingRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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

  useEffect(() => {
    return () => {
      if (pollingRef.current) clearTimeout(pollingRef.current);
    };
  }, []);

  const handleSend = async () => {
    if (!inputValue.trim() || sending) return;
    const content = inputValue.trim();
    setInputValue("");
    setSending(true);

    try {
      const userMsg = await chatApi.sendMessage(sessionId, {
        senderType: "user",
        content,
      });
      setMessages((prev) => [...prev, userMsg]);

      const pollForReply = async (attempts = 0) => {
        if (attempts >= 10) {
          setSending(false);
          return;
        }
        pollingRef.current = setTimeout(async () => {
          const msgs = await fetchMessages();
          if (msgs && msgs.length > messages.length + 1) {
            setSending(false);
          } else {
            pollForReply(attempts + 1);
          }
        }, 1500);
      };
      pollForReply();
    } catch (err) {
      console.error("Failed to send message:", err);
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
