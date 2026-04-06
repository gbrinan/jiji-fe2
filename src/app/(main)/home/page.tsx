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

  return (
    <div className="min-h-dvh bg-figma-gradient flex flex-col">
      <Header showLogo showProfileIcons transparent />

      <div className="flex-1 px-5 flex flex-col">
        {/* Greeting */}
        <div className="mt-12 mb-2">
          <h1 className="text-[28px] font-bold text-gray-900">안녕하세요, {displayName}님</h1>
        </div>

        {/* Date display */}
        <div className="flex items-end gap-3 mb-8">
          <span className="text-[48px] font-bold text-gray-900 leading-none">{day}</span>
          <span className="text-[48px] font-light text-gray-400 leading-none">{month}</span>
          <div className="mb-1">
            <p className="text-sm font-medium text-gray-700">Today</p>
            <p className="text-sm text-gray-500">{weekday}요일</p>
          </div>
          <button className="ml-auto mb-1 w-10 h-10 rounded-full bg-white/60 flex items-center justify-center text-xl">
            😊
          </button>
        </div>

        {/* Action cards */}
        <div className="flex gap-3 mb-3">
          {/* 진단 시작 */}
          <Link href="/survey/mrs" className="flex-1 bg-gray-800/5 backdrop-blur-sm rounded-3xl p-5 flex flex-col gap-3">
            <div className="w-10 h-10 rounded-full bg-white/80 flex items-center justify-center">
              <Heart className="w-5 h-5 text-gray-700" />
            </div>
            <div>
              <p className="text-base font-semibold text-gray-900">진단 시작</p>
              <p className="text-sm text-gray-500">체계적인 진단 관리</p>
            </div>
          </Link>

          {/* 수면 기록 */}
          <div className="flex-1 bg-white/60 backdrop-blur-sm rounded-3xl p-5 flex flex-col gap-3">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
              <Moon className="w-5 h-5 text-gray-700" />
            </div>
            <div>
              <p className="text-base font-semibold text-gray-900">수면 기록</p>
              <p className="text-sm text-gray-500">어젯밤 수면은 편안했나요?</p>
            </div>
          </div>
        </div>

        {/* 내 레포트 확인하기 */}
        <Link href="/survey/result" className="w-full bg-white/60 backdrop-blur-sm rounded-3xl px-5 py-4 flex items-center justify-between mb-4">
          <div>
            <p className="text-base font-semibold text-gray-900">내 레포트 확인하기</p>
            <p className="text-sm text-gray-500">최근 기록</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-primary-500/10 flex items-center justify-center">
            <svg className="w-5 h-5 text-primary-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 3v18h18"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/></svg>
          </div>
        </Link>

        {/* Down chevron */}
        <div className="flex justify-center mb-4">
          <ChevronDown className="w-5 h-5 text-gray-400" />
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Chat input */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl px-5 py-4 flex items-center gap-3 mb-6">
          <p className="flex-1 text-base text-gray-400">여기에 질문을 입력해주세요.</p>
          <Send className="w-5 h-5 text-gray-400" />
        </div>
      </div>
    </div>
  );
}
