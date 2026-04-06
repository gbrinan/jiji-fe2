"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Heart, Moon, BarChart3, ChevronDown } from "lucide-react";

export default function HomePage() {
  const router = useRouter();
  const { user } = useAuth();
  const now = new Date();
  const day = now.getDate().toString().padStart(2, "0");
  const month = (now.getMonth() + 1).toString().padStart(2, "0");
  const weekday = now.toLocaleDateString("ko-KR", { weekday: "short" });

  return (
    <div className="min-h-dvh relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#f0e8dc] via-[#e4daf0] to-[#c8d8f4]" />
      <div className="absolute -left-20 top-0 w-[400px] h-[400px] rounded-full bg-[#ede4d8]/60 blur-[80px]" />

      <div className="relative z-10 px-5 pt-14">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <span className="text-2xl font-bold text-primary-700">JiJi</span>
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-primary-500 flex items-center justify-center">
              <span className="text-white text-sm">👤</span>
            </div>
            <div className="w-8 h-8 flex items-center justify-center">
              <span className="text-gray-500">🔔</span>
            </div>
          </div>
        </div>

        {/* Greeting */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            안녕하세요, {user?.user_metadata?.name || "사용자"}님
          </h2>
          <div className="flex items-end gap-3">
            <span className="text-5xl font-bold text-gray-900">{day}</span>
            <span className="text-5xl font-light text-gray-300">{month}</span>
            <div className="pb-1">
              <p className="text-sm text-gray-600">Today</p>
              <p className="text-sm text-gray-600">{weekday}</p>
            </div>
            <button className="ml-auto w-10 h-10 rounded-full bg-white/60 flex items-center justify-center">
              <span className="text-lg">😊</span>
            </button>
          </div>
        </div>

        {/* Cards */}
        <div className="flex gap-3 mb-4">
          <button
            onClick={() => router.push("/survey/mrs")}
            className="flex-1 bg-gradient-to-br from-gray-700 to-gray-900 rounded-2xl p-4 text-left"
          >
            <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center mb-6">
              <Heart className="w-4 h-4 text-white" />
            </div>
            <p className="text-white font-semibold">진단 시작</p>
            <p className="text-white/60 text-xs mt-0.5">체계적인 진단 관리</p>
          </button>
          <button className="flex-1 bg-white/70 backdrop-blur rounded-2xl p-4 text-left">
            <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center mb-6">
              <Moon className="w-4 h-4 text-gray-600" />
            </div>
            <p className="text-primary-600 font-bold text-lg">7시간 35분</p>
            <div className="flex justify-between items-center">
              <p className="text-gray-500 text-xs">수면의 질</p>
              <p className="text-gray-600 text-xs font-medium">양호</p>
            </div>
          </button>
        </div>

        {/* Report Card */}
        <button className="w-full bg-white/70 backdrop-blur rounded-2xl px-4 py-4 flex items-center justify-between mb-6">
          <div>
            <p className="font-semibold text-gray-900">내 레포트 확인하기</p>
            <p className="text-xs text-gray-500 mt-0.5">{now.toLocaleDateString("ko-KR")} 기록</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-primary-50 flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-primary-500" />
          </div>
        </button>

        <div className="flex justify-center">
          <ChevronDown className="w-6 h-6 text-gray-400 animate-bounce" />
        </div>
      </div>
    </div>
  );
}
