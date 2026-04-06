"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import type { ChatSessionResponse } from "@/lib/types";
import Header from "@/components/layout/Header";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Skeleton from "@/components/ui/Skeleton";

const contextLabels: Record<string, string> = {
  result: "결과 상담",
  faq: "FAQ 상담",
  question: "질문 상담",
  closing: "마무리",
};

export default function ChatListPage() {
  const router = useRouter();
  const [sessions, setSessions] = useState<ChatSessionResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    api.get<ChatSessionResponse[]>("/chats/sessions")
      .then(setSessions)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  async function createSession() {
    setCreating(true);
    try {
      const session = await api.post<ChatSessionResponse>("/chats/sessions", { context: "question" });
      router.push(`/chat/${session.id}`);
    } catch {
      alert("세션 생성에 실패했습니다.");
    } finally {
      setCreating(false);
    }
  }

  return (
    <div className="min-h-dvh flex flex-col">
      <Header title="채팅" />
      <div className="px-5 pt-4 flex-1 flex flex-col gap-3">
        <Button fullWidth loading={creating} onClick={createSession}>새 상담 시작하기</Button>

        {loading ? (
          Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} variant="card" className="h-20" />)
        ) : sessions.length === 0 ? (
          <div className="text-center py-12 text-gray-400">아직 상담 내역이 없습니다.</div>
        ) : (
          sessions.map((s) => (
            <Card
              key={s.id}
              variant="outlined"
              className="cursor-pointer hover:bg-gray-50 transition-colors"
            >
              <button onClick={() => router.push(`/chat/${s.id}`)} className="w-full text-left">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-primary-500">{contextLabels[s.context] || s.context}</span>
                  <span className="text-xs text-gray-400">
                    {new Date(s.startedAt).toLocaleDateString("ko-KR")}
                  </span>
                </div>
                {s.endedAt && <p className="text-xs text-gray-400 mt-1">종료됨</p>}
              </button>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
