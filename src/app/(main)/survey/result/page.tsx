"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { MrsResult } from "@/lib/types";
import { chatApi } from "@/lib/api";
import Header from "@/components/layout/Header";
import Button from "@/components/ui/Button";
import Skeleton from "@/components/ui/Skeleton";
import { Send } from "lucide-react";

function getStoredResult(): MrsResult | null {
  if (typeof window === "undefined") return null;
  const stored = sessionStorage.getItem("mrsResult");
  if (!stored) return null;
  try { return JSON.parse(stored); } catch { return null; }
}

export default function ResultPage() {
  const router = useRouter();
  const [result] = useState<MrsResult | null>(getStoredResult);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    if (!result) router.replace("/survey/mrs");
  }, [result, router]);

  const handleAction = async () => {
    if (!result) return;
    const { nextAction } = result.diagnosis;
    if (nextAction === "START_HRT_ABSOLUTE") {
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
  const now = new Date();
  const timeStr = `오늘 ${now.getHours() >= 12 ? "오후" : "오전"} ${now.getHours() % 12 || 12}:${String(now.getMinutes()).padStart(2, "0")}`;

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
          <div className="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center text-sm">&#x1f9e0;</div>
          <span className="text-sm font-medium text-gray-500">JIJI AI</span>
        </div>

        {/* AI Message Bubble 1 */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl rounded-tl-md px-4 py-3 mb-3 max-w-[85%] shadow-sm">
          <p className="text-base text-gray-900 leading-relaxed">
            {diagnosis.severityLabel === "정상"
              ? "검사 결과가 정상 범위입니다."
              : `답변하시느라 고생 많으셨어요.\n작성해주신 내용을 바탕으로 분석한 결과를 정리해보았습니다.`}
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
            <span className="text-sm font-medium text-primary-500">상위 {diagnosis.topPercentileLabel}</span>
          </div>

          {/* Score */}
          <div className="mb-4">
            <span className="text-[32px] font-bold text-gray-900">{diagnosis.summaryScore}점</span>
            <span className="text-base font-medium text-gray-500 ml-1">{diagnosis.severityLabel}</span>
            <span className="text-sm text-gray-400 ml-1">/총 {diagnosis.totalPossibleScore}점 만점</span>
          </div>

          {/* Domain breakdown */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between px-4 py-3 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-primary-100 flex items-center justify-center">
                  <svg className="w-3.5 h-3.5 text-primary-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
                </div>
                <span className="text-sm font-medium text-gray-700">신체 증상</span>
              </div>
              <span className="text-sm font-semibold text-gray-900">{symptoms.physical.score} <span className="text-gray-400 font-normal">/{symptoms.physical.total}</span></span>
            </div>
            <div className="flex items-center justify-between px-4 py-3 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-violet-100 flex items-center justify-center">
                  <svg className="w-3.5 h-3.5 text-violet-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M8 15h8M9 9h.01M15 9h.01"/></svg>
                </div>
                <span className="text-sm font-medium text-gray-700">심리 증상</span>
              </div>
              <span className="text-sm font-semibold text-gray-900">{symptoms.psychological.score} <span className="text-gray-400 font-normal">/{symptoms.psychological.total}</span></span>
            </div>
            <div className="flex items-center justify-between px-4 py-3 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-pink-100 flex items-center justify-center">
                  <svg className="w-3.5 h-3.5 text-pink-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>
                </div>
                <span className="text-sm font-medium text-gray-700">비뇨생식기</span>
              </div>
              <span className="text-sm font-semibold text-gray-900">{symptoms.urinary.score} <span className="text-gray-400 font-normal">/{symptoms.urinary.total}</span></span>
            </div>
          </div>
        </div>

        {/* AI recommendation bubble */}
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center text-sm">&#x1f9e0;</div>
          <span className="text-sm font-medium text-gray-500">JIJI AI</span>
        </div>
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl rounded-tl-md px-4 py-3 mb-3 max-w-[85%] shadow-sm">
          <p className="text-base text-gray-900 leading-relaxed">
            지금 상태는 조금 더 체계적인 관리가 필요한 단계예요.{"\n"}
            가장 잘 맞는 치료 방향을 찾기 위해 간단한 체크를 먼저 해볼까요?
          </p>
        </div>

        {/* Action buttons */}
        <div className="mt-2 flex flex-col gap-2 items-center">
          <Button variant="primary" onClick={handleAction} loading={actionLoading} className="w-auto px-8">
            내게 맞는 치료법 확인하기
          </Button>
          <button onClick={() => router.push("/home")} className="text-base font-medium text-primary-500 py-2">
            괜찮아요
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
