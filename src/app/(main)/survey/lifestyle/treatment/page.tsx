"use client";

/**
 * Lifestyle diagnosis result page — mirrors Figma node 3510:12619 ("진단결과2").
 * Rendered when MRS result.diagnosis.nextAction === "LIFESTYLE_GUIDANCE".
 * Structure parallels /survey/hrt/treatment (hormone path) so the two
 * outcome screens stay consistent.
 */

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { usersApi } from "@/lib/api";
import type { ProfileResponse } from "@/lib/types";
import Header from "@/components/layout/Header";
import Skeleton from "@/components/ui/Skeleton";
import { BarChart2, Footprints, Moon, Coffee, Info, Send } from "lucide-react";

interface Prescription {
  title: string;
  category: string;
  description: string;
  icon: React.ReactNode;
}

const PRESCRIPTIONS: Prescription[] = [
  {
    title: "하루 30분 빠르게 걷기",
    category: "유산소",
    description: "혈액순환을 돕고 체중 유지와 뼈 건강을 지켜줍니다.",
    icon: <Footprints className="w-6 h-6 text-slate-600" />,
  },
  {
    title: "수면 환경 개선하기",
    category: "휴식",
    description: "잠들기 1시간전 스마트폰을 멀리하면 수면이 좋아져요.",
    icon: <Moon className="w-6 h-6 text-slate-600" />,
  },
  {
    title: "카페인 섭취 줄이기",
    category: "식단",
    description: "커피를 적게 마시면 안면 홍조에 도움이 됩니다.",
    icon: <Coffee className="w-6 h-6 text-slate-600" />,
  },
];

export default function LifestyleTreatmentPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [profile, setProfile] = useState<ProfileResponse | null>(null);
  const [loading, setLoading] = useState(true);

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

  const handleChatInput = () => {
    router.push("/chat");
  };

  if (loading) {
    return (
      <div className="min-h-dvh bg-figma-gradient">
        <Header showBackButton showHomeButton showProfileIcons transparent />
        <div className="px-5 py-6 flex flex-col gap-4">
          <Skeleton variant="card" height="220px" />
          <Skeleton variant="card" height="280px" />
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

        <div className="flex flex-col gap-5">
          {/* Diagnosis card */}
          <div className="bg-white border border-primary-500 rounded-3xl shadow-md px-[17px] py-[25px] w-full">
            <div className="flex items-center gap-2 mb-4">
              <BarChart2 className="w-6 h-6 text-primary-600" />
              <p className="text-sm font-medium text-slate-700 tracking-[0.21px]">진단 결과</p>
            </div>

            <h1 className="text-center text-[24px] font-semibold tracking-[-1px] leading-[28.8px] text-[#1e1e1e] mb-4">
              치료가 필요하지 않아요
            </h1>

            <p className="text-[16px] font-medium text-[#94a3b8] leading-[25px]">
              현재 {displayName}님의 증상은{" "}
              <span className="font-semibold text-[#2f75f7] border-b border-primary-500">
                생활습관 개선
              </span>
              만으로도
            </p>
            <p className="text-[16px] font-medium text-[#94a3b8] leading-[25px]">
              충분히 관리할 수 있는 단계입니다.
            </p>
          </div>

          {/* AI message */}
          <div className="flex gap-3 items-start">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-rose-200 to-rose-300 flex-shrink-0 overflow-hidden" />
            <div className="flex flex-col gap-2">
              <span className="text-xs text-slate-700 leading-[15px]">JIJI AI</span>
              <div className="bg-white/90 rounded-bl-2xl rounded-br-2xl rounded-tr-2xl p-4 shadow-sm max-w-[280px]">
                <p className="text-base font-medium text-[#1e1e1e] leading-[25px]">
                  다행이에요! 약물 치료보다는 건강한 루틴을 만드는 것이 훨씬
                  효과적일 거예요. 제가 {displayName}님을 위해 맞춤형 3가지 처방을
                  준비했어요.
                </p>
              </div>
            </div>
          </div>

          {/* Recommended prescriptions */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between px-1">
              <p className="text-base font-medium text-slate-700">오늘의 추천 처방</p>
              <span className="bg-white/30 rounded-full min-h-[24px] px-2 py-[3px] flex items-center justify-center">
                <span className="text-xs font-semibold text-[#2f75f7] tracking-[0.18px]">3건</span>
              </span>
            </div>

            {PRESCRIPTIONS.map((rx) => (
              <div
                key={rx.title}
                className="backdrop-blur-[8px] bg-white border border-slate-300 rounded-2xl shadow-[0px_4px_30px_0px_rgba(0,0,0,0.05)] p-[17px] flex items-center gap-4"
              >
                <div className="w-12 h-12 bg-slate-100 border border-slate-300 rounded-xl flex items-center justify-center flex-shrink-0">
                  {rx.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <p className="text-base font-semibold text-[#1e1e1e] tracking-[0.08px] leading-[25px] truncate">
                      {rx.title}
                    </p>
                    <p className="text-xs font-medium text-[#94a3b8] leading-5 tracking-[0.18px] flex-shrink-0">
                      {rx.category}
                    </p>
                  </div>
                  <p className="text-xs text-[#94a3b8] leading-5 tracking-[0.18px]">
                    {rx.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Info note */}
          <div className="flex gap-2 items-start justify-center w-full">
            <Info className="w-6 h-6 text-[#0f172a] flex-shrink-0" />
            <p className="flex-1 text-sm text-[#0f172a] leading-5 tracking-[0.21px]">
              증상이 심해지거나 일상생활이 불편해지면 언제든 다시 진단을
              요청해주세요.
            </p>
          </div>
        </div>

        <div className="flex-1" />

        {/* Chat input */}
        <button
          onClick={handleChatInput}
          className="bg-white rounded-2xl border border-[#fafafa] shadow-xs px-4 h-14 flex items-center gap-3 w-full text-left mt-6"
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
