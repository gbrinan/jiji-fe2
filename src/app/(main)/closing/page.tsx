"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { usersApi } from "@/lib/api";
import type { ProfileResponse } from "@/lib/types";
import Header from "@/components/layout/Header";
import Skeleton from "@/components/ui/Skeleton";
import { GanttChart, Pill, Send, Check } from "lucide-react";

interface TaskItem {
  key: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  completed: boolean;
}

export default function ClosingPage() {
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

  // Determine completed tasks from sessionStorage
  const hasMrsResult = typeof window !== "undefined" && !!sessionStorage.getItem("mrsResult");
  const hasHrtResult =
    typeof window !== "undefined" &&
    (!!sessionStorage.getItem("hrtAbsoluteResult") || !!sessionStorage.getItem("hrtRelativeResult"));

  const tasks: TaskItem[] = [
    {
      key: "mrs",
      label: "갱년기 증상 평가",
      description: "빠르게 진단하세요",
      icon: <GanttChart className="w-6 h-6 text-slate-600" />,
      completed: hasMrsResult,
    },
    {
      key: "hrt",
      label: "호르몬 치료 가능 여부",
      description: "주의사항을 알아봅니다.",
      icon: <Pill className="w-6 h-6 text-slate-600" />,
      completed: hasHrtResult,
    },
  ];

  const handleTaskClick = (task: TaskItem) => {
    if (task.completed) return;
    if (task.key === "mrs") router.push("/survey/mrs");
    if (task.key === "hrt") router.push("/survey/hrt/absolute");
  };

  const handleChatInput = () => {
    router.push("/chat");
  };

  if (loading) {
    return (
      <div className="min-h-dvh bg-figma-gradient">
        <Header showBackButton showHomeButton showProfileIcons transparent />
        <div className="px-5 py-6 flex flex-col gap-4">
          <Skeleton variant="card" height="120px" />
          <Skeleton variant="card" height="200px" />
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

        {/* AI message group */}
        <div className="flex gap-3 items-start">
          {/* Avatar */}
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-rose-200 to-rose-300 flex-shrink-0 overflow-hidden" />

          <div className="flex flex-col gap-3 flex-1">
            <span className="text-xs text-slate-700 leading-[15px]">JIJI AI</span>

            {/* Message 1 */}
            <div className="bg-white/90 rounded-bl-2xl rounded-br-2xl rounded-tr-2xl p-4 shadow-sm max-w-[280px]">
              <p className="text-base font-medium text-[#1e1e1e] leading-[25px]">
                {displayName}님, 오늘 정말 고생 하셨어요
              </p>
            </div>

            {/* Message 2 */}
            <div className="bg-white/90 rounded-bl-2xl rounded-br-2xl rounded-tr-2xl p-4 shadow-sm max-w-[280px]">
              <p className="text-base font-medium text-[#1e1e1e] leading-[25px]">
                오늘 우리는 이런 일들을 함께 했어요.{"\n"}
                다 완료해주시면 제가 {displayName}님을 더 잘 도울 수 있어요.
              </p>
            </div>

            {/* Task cards */}
            {tasks.map((task) => (
              <button
                key={task.key}
                onClick={() => handleTaskClick(task)}
                disabled={task.completed}
                className="w-full backdrop-blur-[8px] bg-white border border-slate-300 rounded-2xl shadow-[0px_4px_30px_0px_rgba(0,0,0,0.05)] p-[17px] flex items-center gap-3 text-left"
              >
                {/* Icon */}
                <div className="w-12 h-12 bg-slate-100 border border-slate-300 rounded-xl flex items-center justify-center flex-shrink-0">
                  {task.icon}
                </div>

                {/* Text */}
                <div className="flex-1 min-w-0">
                  <p className="text-base font-semibold text-[#1e1e1e] leading-[25px] tracking-[0.08px]">
                    {task.label}
                  </p>
                  <p className="text-xs text-[#94a3b8] leading-5 tracking-[0.18px]">
                    {task.description}
                  </p>
                </div>

                {/* Status */}
                <span className={`text-base font-semibold tracking-[0.08px] flex-shrink-0 ${
                  task.completed ? "text-slate-500/50" : "text-primary-500"
                }`}>
                  {task.completed ? "완료" : "시작"}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1" />

        {/* Chat input */}
        <button
          onClick={handleChatInput}
          className="bg-white rounded-2xl border border-[#fafafa] shadow-xs px-4 h-14 flex items-center gap-3 mt-4 w-full text-left"
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
