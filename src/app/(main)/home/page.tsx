"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { usersApi } from "@/lib/api";
import type { ProfileResponse } from "@/lib/types";
import Header from "@/components/layout/Header";
import { Heart, Moon, ChevronDown, Send } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<ProfileResponse | null>(null);

  useEffect(() => {
    usersApi.getMe().then(setProfile).catch(() => {});
  }, []);

  const now = new Date();
  const day = String(now.getDate()).padStart(2, "0");
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const weekday = now.toLocaleDateString("ko-KR", { weekday: "long" }).replace("요일", "");

  const displayName = profile?.name || user?.email?.split("@")[0] || "사용자";

  // Format last report date (placeholder — replace with real data when available)
  const formatReportDate = () => {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    const h = String(d.getHours()).padStart(2, "0");
    const min = String(d.getMinutes()).padStart(2, "0");
    return `${y}년 ${m}월 ${dd}일 ${h}:${min}분 기록`;
  };

  return (
    <div className="min-h-dvh bg-figma-gradient flex flex-col">
      <Header showLogo showProfileIcons transparent />

      <div className="flex-1 px-4 flex flex-col">
        {/* Greeting */}
        <div className="mt-12 mb-4">
          <h1 className="text-[30px] font-medium text-slate-700/80 tracking-[1px] leading-[34px]">안녕하세요, {displayName}님</h1>
        </div>

        {/* Date display */}
        <div className="flex items-center gap-3 mb-6">
          <div className="flex items-center gap-4 text-[48px] leading-[52px] tracking-[-0.2px]">
            <span className="font-semibold text-[#1e1e1e]">{day}</span>
            <span className="font-semibold text-[rgba(60,60,67,0.3)]">{month}</span>
          </div>
          <div>
            <p className="text-sm text-slate-700 tracking-[0.21px] leading-5">Today</p>
            <p className="text-sm text-slate-700 tracking-[0.21px] leading-5">{weekday}요일</p>
          </div>
          <button className="ml-auto w-11 h-11 rounded-full bg-white flex items-center justify-center">
            <span className="text-xl">😊</span>
          </button>
        </div>

        {/* Action cards */}
        <div className="flex gap-4 mb-4">
          {/* 진단 시작 — dark card */}
          <Link href="/survey/mrs" className="flex-1 bg-[#334155] rounded-3xl p-4 flex flex-col gap-4 shadow-xs overflow-hidden">
            <div className="w-10 h-10 rounded-full bg-[#475569] flex items-center justify-center">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-lg font-semibold text-[#f8fafc] leading-7">진단 시작</p>
              <p className="text-xs text-[#94a3b8] tracking-[0.18px] leading-5">체계적인 진단 관리</p>
            </div>
          </Link>

          {/* 수면 기록 — white card */}
          <div className="flex-1 bg-white rounded-3xl p-4 flex flex-col gap-4 shadow-xs overflow-hidden">
            <div className="w-10 h-10 rounded-full bg-[#f1f5f9] flex items-center justify-center">
              <Moon className="w-6 h-6 text-slate-700" />
            </div>
            <div>
              <p className="text-lg font-semibold text-[#020617] leading-7">수면 기록</p>
              <p className="text-xs text-[#94a3b8] tracking-[0.18px] leading-5">어젯밤 수면은 편안했나요?</p>
            </div>
          </div>
        </div>

        {/* 내 레포트 확인하기 */}
        <Link href="/report" className="w-full bg-white rounded-2xl px-4 py-4 flex items-center justify-between mb-4 shadow-xs overflow-hidden">
          <div>
            <p className="text-lg font-semibold text-[#1e1e1e] leading-7">내 레포트 확인하기</p>
            <p className="text-xs text-[#94a3b8] tracking-[0.18px] leading-5">{formatReportDate()}</p>
          </div>
          <div className="w-11 h-11 rounded-full bg-[#f1f5f9] flex items-center justify-center">
            <svg className="w-6 h-6 text-slate-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 3v18h18"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/></svg>
          </div>
        </Link>

        {/* Down chevron */}
        <div className="flex justify-center mb-4">
          <ChevronDown className="w-6 h-6 text-gray-400" />
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Chat input */}
        <div className="bg-white rounded-2xl border border-[#fafafa] shadow-xs px-4 h-14 flex items-center gap-3 mb-6">
          <p className="flex-1 text-base text-[rgba(60,60,67,0.3)] tracking-[0.08px]">여기에 질문을 입력해주세요.</p>
          <Send className="w-5 h-5 text-gray-400" />
        </div>
      </div>
    </div>
  );
}
