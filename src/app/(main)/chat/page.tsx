"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { chatApi } from "@/lib/api";
import type { ChatSessionResponse } from "@/lib/types";
import Header from "@/components/layout/Header";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Skeleton from "@/components/ui/Skeleton";
import { MessageCircle, Plus } from "lucide-react";

const contextLabels: Record<string, string> = {
  result: "검사 결과 상담",
  faq: "FAQ 상담",
  question: "질문 상담",
  closing: "마무리 상담",
};

export default function ChatListPage() {
  const router = useRouter();
  const [sessions, setSessions] = useState<ChatSessionResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    chatApi.getSessions()
      .then(setSessions)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleNewSession = async () => {
    try {
      const session = await chatApi.createSession({ context: "question" });
      router.push(`/chat/${session.id}`);
    } catch {}
  };

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString("ko-KR", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="min-h-dvh bg-figma-gradient">
      <Header showBackButton showHomeButton showProfileIcons transparent />

      <div className="px-5 py-6 flex flex-col gap-3">
        <Button variant="primary" fullWidth onClick={handleNewSession} leftIcon={<Plus className="w-5 h-5" />}>
          새 상담 시작
        </Button>

        {loading ? (
          Array.from({ length: 4 }, (_, i) => <Skeleton key={i} variant="card" height="80px" />)
        ) : sessions.length === 0 ? (
          <div className="text-center py-12">
            <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">아직 상담 내역이 없습니다</p>
          </div>
        ) : (
          sessions.map((session) => (
            <Card
              key={session.id}
              variant="outlined"
              onClick={() => router.push(`/chat/${session.id}`)}
              className="cursor-pointer hover:border-primary-300 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary-50 flex items-center justify-center flex-shrink-0">
                  <MessageCircle className="w-5 h-5 text-primary-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-base font-medium text-gray-900">
                    {contextLabels[session.context] || session.context}
                  </p>
                  <p className="text-sm text-gray-500">{formatDate(session.startedAt)}</p>
                </div>
                {session.endedAt && (
                  <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">완료</span>
                )}
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
