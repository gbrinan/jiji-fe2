"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { MrsResult } from "@/lib/types";
import { chatApi, usersApi } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import type { ProfileResponse } from "@/lib/types";
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

function getHighestDomain(symptoms: MrsResult["symptoms"]): string {
  const domains = [
    { key: "physical", score: symptoms.physical.score / symptoms.physical.total },
    { key: "psychological", score: symptoms.psychological.score / symptoms.psychological.total },
    { key: "urinary", score: symptoms.urinary.score / symptoms.urinary.total },
  ];
  return domains.sort((a, b) => b.score - a.score)[0].key;
}

export default function ResultPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [result] = useState<MrsResult | null>(getStoredResult);
  const [actionLoading, setActionLoading] = useState(false);
  const [profile, setProfile] = useState<ProfileResponse | null>(null);

  useEffect(() => {
    if (!result) router.replace("/survey/mrs");
  }, [result, router]);

  useEffect(() => {
    usersApi.getMe().then(setProfile).catch(() => {});
  }, []);

  const displayName = profile?.name || user?.email?.split("@")[0] || "사용자";

  const handleAction = async () => {
    if (!result) return;
    const action = result.diagnosis.nextAction;
    if (action === "START_HRT_ABSOLUTE") {
      router.push("/survey/hrt/absolute");
      return;
    }
    // LIFESTYLE_GUIDANCE (mild symptoms) → dedicated lifestyle treatment
    // screen (Figma node 3510:12619 "진단결과2"). NON_HORMONAL_QA /
    // CBT_GUIDANCE still route to the non-hormone FAQ.
    if (action === "LIFESTYLE_GUIDANCE") {
      router.push("/survey/lifestyle/treatment");
      return;
    }
    if (action === "NON_HORMONAL_QA" || action === "CBT_GUIDANCE") {
      router.push("/faq?category=non-hormonal");
      return;
    }
    // EXPERT_CONSULTATION fallback → still open a contextual chat session
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
  const highestDomain = getHighestDomain(symptoms);

  const domainRows = [
    { key: "physical", label: "신체 증상", score: symptoms.physical.score, total: symptoms.physical.total, icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M12 8v8"/><path d="M8 12h8"/></svg>
    )},
    { key: "psychological", label: "심리 증상", score: symptoms.psychological.score, total: symptoms.psychological.total, icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.42 4.58a5.4 5.4 0 00-7.65 0l-.77.78-.77-.78a5.4 5.4 0 00-7.65 7.65l.77.77L12 20.65l7.65-7.65.77-.77a5.4 5.4 0 000-7.65z"/></svg>
    )},
    { key: "urinary", label: "비뇨생식기", score: symptoms.urinary.score, total: symptoms.urinary.total, icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2v6"/><path d="M18 2v6"/><path d="M6 8a6 6 0 006 6 6 6 0 006-6"/><circle cx="12" cy="18" r="2"/><path d="M12 16v-2"/></svg>
    )},
  ];

  return (
    <div className="min-h-dvh bg-figma-gradient flex flex-col">
      <Header showBackButton showHomeButton showProfileIcons transparent />

      <div className="flex-1 px-4 pb-4 flex flex-col">
        {/* Time badge */}
        <div className="flex justify-center mb-5">
          <span className="bg-black/5 rounded-full px-3 py-1 shadow-xs text-sm font-medium text-slate-700 tracking-[0.21px]">{timeStr}</span>
        </div>

        <div className="flex flex-col gap-5">
          {/* First AI message group */}
          <div className="flex gap-3 items-start">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-rose-200 to-rose-300 flex-shrink-0 overflow-hidden" />
            <div className="flex flex-col gap-2">
              <span className="text-xs text-slate-700 leading-[15px]">JIJI AI</span>
              <div className="bg-white/90 rounded-bl-2xl rounded-br-2xl rounded-tr-2xl p-4 shadow-sm max-w-[280px]">
                <p className="text-base font-medium text-[#1e1e1e] leading-[25px]">
                  {diagnosis.severityLabel === "정상"
                    ? `${displayName}님, 답변하시느라 수고하셨어요. 검사 결과가 정상 범위입니다.`
                    : `${displayName}님, 답변하시느라 고생 많으셨어요.\n작성해주신 내용을 바탕으로 분석한 결과를 정리해보았습니다.`}
                </p>
              </div>
            </div>
          </div>

          {/* Score Card */}
          <div className="bg-white border border-[#f1f5f9] rounded-3xl shadow-md px-[17px] py-[25px]">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <svg className="w-6 h-6 text-slate-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
                <span className="text-sm font-medium text-slate-700 tracking-[0.21px]">진단 종합 점수</span>
              </div>
              <span className="bg-white/30 rounded-full px-2 py-0.5 text-xs font-semibold text-primary-600 tracking-[0.18px]">
                상위 {diagnosis.topPercentileLabel}
              </span>
            </div>

            {/* Score */}
            <div className="flex items-center gap-3 mb-3">
              <div className="flex items-end gap-1.5">
                <span className="text-[48px] font-semibold text-[#1e1e1e] leading-[52px] tracking-[-0.2px]">{diagnosis.summaryScore}</span>
                <span className="text-[30px] font-semibold text-[#1e1e1e] leading-[34px] tracking-[1px]">점</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-lg font-semibold text-[#1e1e1e]">{diagnosis.severityLabel}</span>
                <span className="text-base font-medium text-[#94a3b8]">/총 {diagnosis.totalPossibleScore}점 만점</span>
              </div>
            </div>

            {/* Progress bar */}
            <div className="h-2 bg-slate-200 rounded-full overflow-hidden mb-4">
              <div
                className="h-2 rounded-full bg-gradient-to-r from-primary-500 to-primary-400 transition-all duration-500"
                style={{ width: `${Math.round((diagnosis.summaryScore / diagnosis.totalPossibleScore) * 100)}%` }}
              />
            </div>

            {/* Domain rows */}
            <div className="flex flex-col gap-3 pt-2">
              {domainRows.map((d) => {
                const isHighest = d.key === highestDomain;
                return (
                  <div
                    key={d.key}
                    className={`bg-[#f5f5f5] rounded-xl p-[13px] flex items-center justify-between ${
                      isHighest ? "border-2 border-[#94a3b8]" : "border border-[#f1f5f9]"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-[#1e1e1e]">{d.icon}</div>
                      <span className={`text-base ${isHighest ? "font-semibold" : "font-medium"} text-[#1e1e1e]`}>{d.label}</span>
                    </div>
                    <div className="flex items-end gap-1 text-[#94a3b8]">
                      <span className="text-sm font-bold leading-5">{d.score}</span>
                      <span className="text-[11px] leading-[16.5px]">/{d.total}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Second AI message group */}
          <div className="flex gap-3 items-start">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-rose-200 to-rose-300 flex-shrink-0 overflow-hidden" />
            <div className="flex flex-col gap-2">
              <span className="text-xs text-slate-700 leading-[15px]">JIJI AI</span>
              <div className="flex flex-col gap-3">
                {diagnosis.severityLabel !== "정상" && (
                  <>
                    <div className="bg-white/90 rounded-bl-2xl rounded-br-2xl rounded-tr-2xl p-4 shadow-sm max-w-[280px]">
                      <p className="text-base font-medium text-[#1e1e1e] leading-[25px]">
                        {displayName}님, 특히 {highestDomain === "psychological" ? "심리적인 부분" : highestDomain === "urinary" ? "비뇨생식기 부분" : "신체적인 부분"}에서 어려움이 크셨군요. 최근 느끼시는 불편함은 호르몬 변화로 인한 자연스러운 현상이에요.
                      </p>
                    </div>
                    <div className="bg-white/90 rounded-bl-2xl rounded-br-2xl rounded-tr-2xl p-4 shadow-sm max-w-[280px]">
                      <p className="text-base font-medium text-[#1e1e1e] leading-[25px]">
                        지금 상태는 조금 더 체계적인 관리가 필요한 단계예요.{"\n"}
                        {displayName}님께 가장 잘 맞는 치료 방향(호르몬 치료 포함)을 찾기 위해 30초 정도면 끝나는 간단한 체크를 먼저 해볼까요?
                      </p>
                    </div>
                  </>
                )}

                {/* CTA buttons */}
                <div className="flex flex-col gap-3 w-full">
                  {diagnosis.severityLabel !== "정상" ? (
                    <>
                      <Button variant="primary" onClick={handleAction} loading={actionLoading} fullWidth>
                        내게 맞는 치료법 확인하기
                      </Button>
                      <button
                        onClick={() => router.push("/home")}
                        className="h-14 rounded-2xl bg-white/30 shadow-sm text-lg font-semibold text-primary-600 text-center w-full"
                      >
                        괜찮아요
                      </button>
                    </>
                  ) : (
                    <Button variant="primary" onClick={() => router.push("/home")} fullWidth>
                      홈으로 돌아가기
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1" />

        {/* Chat input */}
        <div className="bg-white rounded-2xl border border-[#fafafa] shadow-xs px-4 h-14 flex items-center gap-3 mt-4">
          <p className="flex-1 text-base text-[rgba(60,60,67,0.3)] tracking-[0.08px]">여기에 질문을 입력해주세요.</p>
          <Send className="w-5 h-5 text-gray-400" />
        </div>
      </div>
    </div>
  );
}
