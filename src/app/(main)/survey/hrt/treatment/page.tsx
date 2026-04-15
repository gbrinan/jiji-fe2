"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { usersApi, chatApi } from "@/lib/api";
import type { ProfileResponse } from "@/lib/types";
import Header from "@/components/layout/Header";
import Button from "@/components/ui/Button";
import Skeleton from "@/components/ui/Skeleton";
import { PillBottle, Pill, Check, ChevronRight, Send } from "lucide-react";

const RECOMMENDED_TREATMENTS = [
  "에스트로겐 단독요법",
  "에스트로겐 + 프로게스틴 복합요법",
  "티볼론",
];

export default function HrtTreatmentPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [profile, setProfile] = useState<ProfileResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [emailSent, setEmailSent] = useState(false);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    usersApi
      .getMe()
      .then((p) => {
        setProfile(p);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const displayName = profile?.name || user?.email?.split("@")[0] || "사용자";

  const now = new Date();
  const timeStr = `오늘 ${now.getHours() >= 12 ? "오후" : "오전"} ${now.getHours() % 12 || 12}:${String(now.getMinutes()).padStart(2, "0")}`;

  const handleSendReport = async () => {
    setSending(true);
    // TODO: integrate with report email API when available
    await new Promise((r) => setTimeout(r, 1000));
    setEmailSent(true);
    setSending(false);
  };

  const handleGuideClick = async () => {
    try {
      const session = await chatApi.createSession({ context: "result" });
      router.push(`/chat/${session.id}`);
    } catch {
      router.push("/chat");
    }
  };

  const handleChatInput = () => {
    router.push("/chat");
  };

  if (loading) {
    return (
      <div className="min-h-dvh bg-figma-gradient">
        <Header showBackButton showHomeButton showProfileIcons transparent />
        <div className="px-5 py-6 flex flex-col gap-4">
          <Skeleton variant="card" height="200px" />
          <Skeleton variant="card" height="100px" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-figma-gradient flex flex-col">
      <Header showBackButton showHomeButton showProfileIcons transparent />

      <div className="flex-1 px-4 pb-4 flex flex-col">
        {/* Time badge */}
        <div className="flex justify-center mb-5">
          <span className="bg-black/5 rounded-full px-3 py-1 shadow-xs text-sm font-medium text-slate-700 tracking-[0.21px]">
            {timeStr}
          </span>
        </div>

        {/* Analysis complete text */}
        <p className="text-base font-medium text-slate-700 text-center mb-5">
          분석이 완료되었습니다.
        </p>

        {/* AI message group */}
        <div className="flex gap-3 items-start mb-8">
          {/* Avatar */}
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-rose-200 to-rose-300 flex-shrink-0 overflow-hidden" />

          <div className="flex flex-col gap-3 flex-1">
            <span className="text-xs text-slate-700 leading-[15px]">JIJI AI</span>

            {/* Message */}
            <div className="bg-white/90 rounded-bl-2xl rounded-br-2xl rounded-tr-2xl p-4 shadow-sm max-w-[280px]">
              <p className="text-base font-medium text-[#1e1e1e] leading-[25px]">
                {displayName}님은 호르몬 치료를 고려해볼 수 있는 상태로 보여요.
              </p>
            </div>

            {/* Recommended treatments card */}
            <div className="bg-white border border-primary-500 rounded-3xl shadow-md p-[17px] flex flex-col gap-3 w-full">
              {/* Card header */}
              <div className="flex items-center gap-2">
                <PillBottle className="w-6 h-6 text-primary-600" />
                <span className="text-base font-medium text-primary-600 leading-[25px]">
                  추천 호르몬 제제
                </span>
              </div>

              {/* Treatment list */}
              <div className="flex flex-col gap-1">
                {RECOMMENDED_TREATMENTS.map((treatment) => (
                  <div key={treatment} className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-primary-500 flex-shrink-0" />
                    <span className="text-base font-medium text-[#1e1e1e] leading-[25px]">
                      {treatment}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Send report CTA */}
            <Button
              variant="primary"
              onClick={handleSendReport}
              loading={sending}
              disabled={emailSent}
              fullWidth
            >
              {emailSent ? "보고서가 전송되었습니다" : "보고서 이메일로 받기"}
            </Button>
          </div>
        </div>

        {/* Recommended guide section */}
        <div className="flex flex-col gap-3">
          <p className="text-base font-medium text-slate-700 px-1">추천 가이드</p>

          <button
            onClick={handleGuideClick}
            className="w-full backdrop-blur-[8px] bg-white border border-slate-300 rounded-2xl shadow-[0px_4px_30px_0px_rgba(0,0,0,0.05)] p-[17px] flex items-center gap-4 text-left"
          >
            {/* Icon */}
            <div className="w-12 h-12 bg-slate-100 border border-slate-300 rounded-xl flex items-center justify-center flex-shrink-0">
              <Pill className="w-6 h-6 text-slate-600" />
            </div>

            {/* Text */}
            <div className="flex-1 min-w-0">
              <p className="text-base font-semibold text-[#1e1e1e] leading-[25px] tracking-[0.08px]">
                호르몬 치료 알아보기
              </p>
              <p className="text-xs text-[#94a3b8] leading-5 tracking-[0.18px]">
                부작용 및 주의 사항
              </p>
            </div>

            {/* Arrow */}
            <ChevronRight className="w-6 h-6 text-slate-400 flex-shrink-0" />
          </button>
        </div>

        <div className="flex-1" />

        {/* Email sent toast */}
        {emailSent && (
          <div className="flex justify-center mb-4">
            <div className="bg-slate-700/80 rounded-full px-4 py-3 shadow-md">
              <p className="text-base font-medium text-white leading-[25px]">
                보고서가 이메일로 보내졌어요.
              </p>
            </div>
          </div>
        )}

        {/* Chat input */}
        <button
          onClick={handleChatInput}
          className="bg-white rounded-2xl border border-[#fafafa] shadow-xs px-4 h-14 flex items-center gap-3 w-full text-left"
        >
          <p className="flex-1 text-base text-[rgba(60,60,67,0.3)] tracking-[0.08px]">
            여기에 질문을 입력해주세요.
          </p>
          <Send className="w-5 h-5 text-gray-400" />
        </button>
      </div>
    </div>
  );
}
