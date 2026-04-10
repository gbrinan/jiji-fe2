"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { MrsResult } from "@/lib/types";
import { chatApi } from "@/lib/api";
import Header from "@/components/layout/Header";
import Button from "@/components/ui/Button";
import ResultDomainBar from "@/components/ui/ResultDomainBar";
import Skeleton from "@/components/ui/Skeleton";
import { Send } from "lucide-react";

function getStoredResult(): MrsResult | null {
  if (typeof window === "undefined") return null;
  const stored = sessionStorage.getItem("mrsResult");
  if (!stored) return null;
  try { return JSON.parse(stored); } catch { return null; }
}

function getSeverityColor(label: string) {
  switch (label) {
    case "정상": return { text: "text-green-600", bg: "bg-green-50", border: "border-green-200" };
    case "경증": return { text: "text-orange-500", bg: "bg-orange-50", border: "border-orange-200" };
    default: return { text: "text-red-500", bg: "bg-red-50", border: "border-red-200" };
  }
}

export default function ResultPage() {
  const router = useRouter();
  const [result] = useState<MrsResult | null>(getStoredResult);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    if (!result) router.replace("/survey/mrs");
  }, [result, router]);

  const handleAction = async (action: string) => {
    if (!result) return;
    if (action === "hrt") {
      router.push("/survey/hrt/absolute");
      return;
    }
    setActionLoading(true);
    try {
      const session = await chatApi.createSession({ context: "result", surveyResultId: String(result.id) });
      router.push(`/chat/${session.id}`);
    } catch (err) {
      console.error("Failed to create chat session:", err);
      router.push("/chat");
    }
  };

  if (!result) {
    return (
      <div className="min-h-dvh bg-figma-gradient">
        <Header showBackButton showHomeButton showProfileIcons transparent />
        <div className="px-5 py-6 flex flex-col gap-4">
          <Skeleton variant="card" height="200px" />
          <Skeleton variant="card" height="150px" />
        </div>
      </div>
    );
  }

  const { diagnosis, symptoms } = result;
  const severity = getSeverityColor(diagnosis.severityLabel);
  const now = new Date();
  const timeStr = `오늘 ${now.getHours() >= 12 ? "오후" : "오전"} ${now.getHours() % 12 || 12}:${String(now.getMinutes()).padStart(2, "0")}`;
  const isHrt = diagnosis.nextAction === "START_HRT_ABSOLUTE";

  return (
    <div className="min-h-dvh bg-figma-gradient flex flex-col">
      <Header showBackButton showHomeButton showProfileIcons transparent />

      <div className="flex-1 px-5 pb-4 flex flex-col">
        {/* Time badge */}
        <div className="flex justify-center mb-4">
          <span className="bg-white/60 backdrop-blur-sm rounded-full px-4 py-1.5 text-sm text-gray-600">{timeStr}</span>
        </div>

        {/* AI Avatar + Name */}
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center">
            <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
          </div>
          <span className="text-sm font-medium text-gray-500">JIJI AI</span>
        </div>

        {/* AI Message Bubble 1 */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl rounded-tl-md px-4 py-3 mb-3 max-w-[85%] shadow-sm">
          <p className="text-base text-gray-900 leading-relaxed">
            {diagnosis.severityLabel === "정상"
              ? "검사 결과가 정상 범위입니다."
              : "작성해 주신 내용을 분석하여 결과를 정리해 보았습니다."}
          </p>
        </div>

        {/* Score Card */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-5 mb-3 shadow-sm">
          {/* Header */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-primary-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
              <span className="text-sm font-medium text-gray-700">진단 종합 점수</span>
            </div>
            <span className={`text-sm font-medium ${severity.text}`}>상위 {diagnosis.topPercentileLabel}</span>
          </div>

          {/* Score */}
          <div className="mb-2">
            <span className="text-[32px] font-bold text-gray-900">{diagnosis.summaryScore}점</span>
            <span className={`text-base font-medium ml-2 px-2 py-0.5 rounded-md ${severity.text} ${severity.bg}`}>{diagnosis.severityLabel}</span>
          </div>
          <p className="text-sm text-gray-400 mb-4">/총 {diagnosis.totalPossibleScore}점 만점</p>

          {/* Domain breakdown with progress bars */}
          <div className="flex flex-col gap-4">
            <ResultDomainBar label="신체 증상" score={symptoms.physical.score} total={symptoms.physical.total} color="bg-primary-500" />
            <ResultDomainBar label="심리 증상" score={symptoms.psychological.score} total={symptoms.psychological.total} color="bg-violet-500" />
            <ResultDomainBar label="비뇨생식기" score={symptoms.urinary.score} total={symptoms.urinary.total} color="bg-pink-500" />
          </div>
        </div>

        {/* AI recommendation bubble */}
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center">
            <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
          </div>
          <span className="text-sm font-medium text-gray-500">JIJI AI</span>
        </div>
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl rounded-tl-md px-4 py-3 mb-3 max-w-[85%] shadow-sm">
          <p className="text-base text-gray-900 leading-relaxed">
            지금 상태는 조금 더 체계적인 관리가 필요한 단계예요.{"\n"}
            가장 잘 맞는 치료 방향을 찾기 위해 간단한 체크를 먼저 해볼까요?
          </p>
        </div>

        {/* Action buttons — multiple options per Figma */}
        <div className="mt-2 flex flex-col gap-2 ml-10">
          {isHrt ? (
            <Button variant="danger" onClick={() => handleAction("hrt")} loading={actionLoading} fullWidth>
              호르몬 치료법을 알아볼까요?
            </Button>
          ) : (
            <Button variant="danger" onClick={() => handleAction("result")} loading={actionLoading} fullWidth>
              호르몬 치료법을 알아볼까요?
            </Button>
          )}
          <Button variant="secondary" onClick={() => handleAction("hormonal_qa")} fullWidth>
            호르몬 치료 질문 할래요?
          </Button>
          <Button variant="secondary" onClick={() => handleAction("non_hormonal_qa")} fullWidth>
            비호르몬 치료 질문 할래요?
          </Button>
          <button onClick={() => router.push("/home")} className="text-sm font-medium text-gray-400 py-2 text-center">
            괜찮아요, 나중에 할게요
          </button>
        </div>

        <div className="flex-1" />

        {/* Chat input */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl px-5 py-4 flex items-center gap-3 mt-4">
          <p className="flex-1 text-base text-gray-400">여기에 질문을 입력해주세요.</p>
          <Send className="w-5 h-5 text-gray-400" />
        </div>
      </div>
    </div>
  );
}
