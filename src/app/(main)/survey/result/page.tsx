"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { MrsResult, MrsNextAction } from "@/lib/types";
import ChatLayout from "@/components/layout/ChatLayout";
import AiBubble from "@/components/features/AiBubble";

const severityColor: Record<string, string> = {
  정상: "text-green-600",
  경도: "text-yellow-600",
  중등도: "text-orange-600",
  중증: "text-red-600",
};

const nextActionLabels: Record<MrsNextAction, string> = {
  EXPERT_CONSULTATION: "전문의 상담 필요",
  CBT_GUIDANCE: "인지행동치료 안내",
  START_HRT_ABSOLUTE: "내게 맞는 치료법 확인하기",
  NON_HORMONAL_QA: "비호르몬성 치료 안내",
  LIFESTYLE_GUIDANCE: "생활습관 개선 안내",
};

function DomainRow({ icon, label, score, total }: { icon: string; label: string; score: number; total: number }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
      <div className="flex items-center gap-2 text-sm text-gray-700">
        <span>{icon}</span> {label}
      </div>
      <span className="text-sm font-semibold text-gray-900">{score} <span className="text-gray-400 font-normal">/{total}</span></span>
    </div>
  );
}

export default function ResultPage() {
  const router = useRouter();
  const [result, setResult] = useState<MrsResult | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem("mrs_result");
    if (stored) setResult(JSON.parse(stored));
  }, []);

  if (!result) {
    return (
      <ChatLayout showTimestamp subtitle="분석이 완료되었습니다.">
        <div className="text-center py-12 text-gray-400">결과 데이터가 없습니다.</div>
      </ChatLayout>
    );
  }

  const { diagnosis, symptoms } = result;
  const sevClass = Object.entries(severityColor).find(([k]) => diagnosis.severityLabel.includes(k))?.[1] || "text-gray-900";

  function handleAction() {
    if (diagnosis.nextAction === "START_HRT_ABSOLUTE") {
      router.push("/survey/hrt-absolute");
    } else {
      router.push("/chat");
    }
  }

  return (
    <ChatLayout showTimestamp subtitle="분석이 완료되었습니다.">
      {/* AI Intro */}
      <div className="mb-4">
        <AiBubble>
          답변하시느라 고생 많으셨어요. 작성해주신 내용을 바탕으로 분석한 결과를 정리해보았습니다.
        </AiBubble>
      </div>

      {/* Score Card */}
      <div className="bg-white/90 backdrop-blur rounded-2xl p-5 shadow-sm mb-4 ml-10">
        <div className="flex items-center gap-2 mb-3">
          <span>📊</span>
          <span className="text-sm font-medium text-gray-600">진단 종합 점수</span>
          <span className="ml-auto text-xs text-primary-500 font-medium">상위 {diagnosis.topPercentileLabel}</span>
        </div>
        <div className="flex items-baseline gap-1 mb-4">
          <span className="text-4xl font-bold text-gray-900">{diagnosis.summaryScore}</span>
          <span className={`text-lg font-semibold ${sevClass}`}>점</span>
          <span className={`text-base font-semibold ${sevClass} ml-1`}>{diagnosis.severityLabel}</span>
          <span className="text-sm text-gray-400 ml-1">/총 {diagnosis.totalPossibleScore}점 만점</span>
        </div>

        <div className="bg-gray-50 rounded-xl p-3">
          <DomainRow icon="💪" label="신체 증상" score={symptoms.physical.score} total={symptoms.physical.total} />
          <DomainRow icon="🧠" label="심리 증상" score={symptoms.psychological.score} total={symptoms.psychological.total} />
          <DomainRow icon="🩺" label="비뇨생식기" score={symptoms.urinary.score} total={symptoms.urinary.total} />
        </div>
      </div>

      {/* AI Comment */}
      <div className="mb-4">
        <AiBubble showAvatar={false}>
          특히 심리적인 부분에서 어려움이 크셨군요. 최근 느끼시는 우울감이나 불안은 호르몬 변화로 인한 자연스러운 현상이에요.
        </AiBubble>
      </div>
      <div className="mb-4">
        <AiBubble showAvatar={false}>
          지금 상태는 조금 더 체계적인 관리가 필요한 단계에요. 치료 방향을 찾기 위해 30초 정도면 끝나는 간단한 체크를 먼저 해볼까요?
        </AiBubble>
      </div>

      {/* CTA Buttons */}
      <div className="flex flex-col gap-3 ml-10 mb-6">
        <button
          onClick={handleAction}
          className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold text-sm"
        >
          {nextActionLabels[diagnosis.nextAction]}
        </button>
        <button
          onClick={() => router.push("/home")}
          className="w-full py-3 rounded-2xl border border-primary-400 text-primary-500 font-semibold text-sm bg-white/60"
        >
          괜찮아요
        </button>
      </div>
    </ChatLayout>
  );
}
