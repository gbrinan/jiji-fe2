"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { usersApi } from "@/lib/api";
import type { ProfileResponse, MrsResult } from "@/lib/types";
import Header from "@/components/layout/Header";
import Button from "@/components/ui/Button";
import Skeleton from "@/components/ui/Skeleton";
import { Pencil, RefreshCw, Mail } from "lucide-react";

function getStoredResult(): MrsResult | null {
  if (typeof window === "undefined") return null;
  const stored = sessionStorage.getItem("mrsResult");
  if (!stored) return null;
  try { return JSON.parse(stored); } catch { return null; }
}

function calculateAge(birthDate: string | null): number | null {
  if (!birthDate) return null;
  const birth = new Date(birthDate);
  const now = new Date();
  return now.getFullYear() - birth.getFullYear();
}

function calculateBMI(height: number | null, weight: number | null): string | null {
  if (!height || !weight) return null;
  const heightM = height / 100;
  return (weight / (heightM * heightM)).toFixed(1);
}

function getBMIStatus(bmi: string | null): string {
  if (!bmi) return "-";
  const val = parseFloat(bmi);
  if (val < 18.5) return "저체중";
  if (val < 25) return "정상";
  if (val < 30) return "과체중";
  return "비만";
}

export default function ReportPage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<ProfileResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const result = getStoredResult();

  useEffect(() => {
    usersApi.getMe()
      .then((p) => {
        setProfile(p);
        setEmail(p.email);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSendEmail = async () => {
    setSending(true);
    // TODO: implement email API when available
    await new Promise((r) => setTimeout(r, 1000));
    setSent(true);
    setSending(false);
  };

  const displayName = profile?.name || user?.email?.split("@")[0] || "사용자";
  const age = profile?.birthDate ? calculateAge(profile.birthDate) : null;
  const bmi = calculateBMI(profile?.height ?? null, profile?.weight ?? null);
  const bmiStatus = getBMIStatus(bmi);
  const score = result?.diagnosis.summaryScore ?? null;
  const severityLabel = result?.diagnosis.severityLabel ?? null;

  if (loading) {
    return (
      <div className="min-h-dvh bg-figma-gradient">
        <Header showBackButton showHomeButton showProfileIcons transparent />
        <div className="px-4 py-6 flex flex-col gap-4">
          <Skeleton variant="card" height="80px" />
          <Skeleton variant="card" height="200px" />
          <Skeleton variant="card" height="300px" />
        </div>
      </div>
    );
  }

  // Mock chart data for symptoms trend (placeholder)
  const months = ["1월", "2월", "3월", "4월", "5월", "6월"];
  const chartData = {
    physical: [8, 10, 12, 9, 7, 6],
    psychological: [15, 18, 20, 22, 18, 16],
    urinary: [5, 6, 8, 7, 9, 8],
  };
  const maxVal = 30;

  return (
    <div className="min-h-dvh bg-figma-gradient flex flex-col">
      <Header showBackButton showHomeButton showProfileIcons transparent />

      <div className="flex-1 px-4 pb-8 flex flex-col gap-6">
        {/* User info bar */}
        <div className="bg-white rounded-2xl border border-[#fafafa] shadow-xs px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
              <svg className="w-5 h-5 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" />
              </svg>
            </div>
            <span className="text-base font-semibold text-[#1e1e1e]">
              {displayName}님{age ? ` (${age}세)` : ""}
            </span>
          </div>
          <button className="w-8 h-8 flex items-center justify-center">
            <Pencil className="w-4 h-4 text-gray-400" />
          </button>
        </div>

        {/* Report title + MRS score */}
        <div>
          <h1 className="text-[28px] font-bold text-[#1e1e1e] leading-[34px] mb-2">
            Your Wellness{"\n"}Report
          </h1>
          <div className="flex items-center gap-3 mt-3">
            <span className="text-[32px] font-bold text-[#1e1e1e] leading-tight">{score ?? "-"}</span>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-[#94a3b8]">MRS 점수</span>
              <span className="text-xs text-[#94a3b8]">({severityLabel ?? "미측정"})</span>
            </div>
            {severityLabel && severityLabel !== "정상" && (
              <span className="ml-auto bg-red-500 text-white text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1">
                <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
                호르몬제 복용중
              </span>
            )}
          </div>
        </div>

        {/* Health metrics table */}
        <div className="bg-white rounded-3xl border border-[#fafafa] shadow-sm overflow-hidden">
          <div className="divide-y divide-gray-100">
            <MetricRow label="호르몬 용법" value={score ? String(score) : "-"} status={score && score >= 18 ? "적합" : null} statusColor="text-red-500" />
            <MetricRow label="체질량지수 (BMI)" value={bmi ?? "-"} status={bmiStatus !== "-" ? bmiStatus : null} statusColor={bmiStatus === "정상" ? "text-green-600" : "text-orange-500"} />
            <MetricRow label="마지막 생리일" value={profile?.birthDate ? "정보 없음" : "정보 없음"} />
            <MetricRow label="혈압" value="정보 없음" />
            <MetricRow label="흡연" value="비흡연" />
          </div>
        </div>

        {/* Medical report button */}
        <Button variant="primary" fullWidth>
          <div className="flex items-center gap-2">
            <RefreshCw className="w-5 h-5" />
            <span>의사 메디컬 리포트 보기</span>
          </div>
        </Button>

        {/* Symptom trend chart */}
        <div className="bg-white rounded-3xl border border-[#fafafa] shadow-sm p-5">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-[#1e1e1e]">증상 변화</h2>
            <span className="text-xs text-[#94a3b8] bg-[#f5f5f5] rounded-lg px-2 py-1 flex items-center gap-1">
              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
              1월-6월
            </span>
          </div>

          {/* Simple SVG line chart */}
          <div className="relative h-[180px] mb-4">
            <svg viewBox="0 0 300 180" className="w-full h-full">
              {/* Grid lines */}
              {[0, 1, 2, 3].map((i) => (
                <line key={i} x1="30" y1={20 + i * 45} x2="290" y2={20 + i * 45} stroke="#f1f5f9" strokeWidth="1" />
              ))}
              {/* Y-axis labels */}
              {[30, 20, 10, 0].map((val, i) => (
                <text key={val} x="20" y={24 + i * 45} className="text-[10px]" fill="#94a3b8" textAnchor="end">{val}</text>
              ))}
              {/* X-axis labels */}
              {months.map((m, i) => (
                <text key={m} x={55 + i * 47} y={175} className="text-[10px]" fill="#94a3b8" textAnchor="middle">{m}</text>
              ))}
              {/* Physical line (green) */}
              <polyline
                points={chartData.physical.map((v, i) => `${55 + i * 47},${155 - (v / maxVal) * 135}`).join(" ")}
                fill="none" stroke="#22c55e" strokeWidth="2" strokeLinejoin="round"
              />
              {/* Psychological line (orange) */}
              <polyline
                points={chartData.psychological.map((v, i) => `${55 + i * 47},${155 - (v / maxVal) * 135}`).join(" ")}
                fill="none" stroke="#f97316" strokeWidth="2" strokeLinejoin="round"
              />
              {/* Urinary line (red) */}
              <polyline
                points={chartData.urinary.map((v, i) => `${55 + i * 47},${155 - (v / maxVal) * 135}`).join(" ")}
                fill="none" stroke="#ef4444" strokeWidth="2" strokeLinejoin="round"
              />
              {/* Data points */}
              {chartData.physical.map((v, i) => (
                <circle key={`p${i}`} cx={55 + i * 47} cy={155 - (v / maxVal) * 135} r="3" fill="#22c55e" />
              ))}
              {chartData.psychological.map((v, i) => (
                <circle key={`s${i}`} cx={55 + i * 47} cy={155 - (v / maxVal) * 135} r="3" fill="#f97316" />
              ))}
              {chartData.urinary.map((v, i) => (
                <circle key={`u${i}`} cx={55 + i * 47} cy={155 - (v / maxVal) * 135} r="3" fill="#ef4444" />
              ))}
            </svg>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-[#ef4444]" />
              <span className="text-xs text-[#94a3b8]">비뇨생식</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-[#22c55e]" />
              <span className="text-xs text-[#94a3b8]">신체적</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-[#f97316]" />
              <span className="text-xs text-[#94a3b8]">심리적</span>
            </div>
          </div>
        </div>

        {/* Email report section */}
        <div className="bg-white rounded-3xl border border-[#fafafa] shadow-sm p-5">
          <h3 className="text-base font-semibold text-[#1e1e1e] mb-3">이메일 리포트 받기</h3>
          <div className="flex items-center gap-3">
            <div className="flex-1 bg-[#f5f5f5] rounded-2xl h-12 px-4 flex items-center">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="hello@example.com"
                className="flex-1 bg-transparent text-base text-[#1e1e1e] outline-none placeholder:text-[rgba(60,60,67,0.3)]"
              />
              <Mail className="w-5 h-5 text-gray-400 flex-shrink-0" />
            </div>
          </div>
          <Button
            variant="secondary"
            fullWidth
            className="mt-3"
            onClick={handleSendEmail}
            loading={sending}
          >
            {sent ? "전송 완료!" : "전송하기"}
          </Button>
        </div>
      </div>
    </div>
  );
}

function MetricRow({ label, value, status, statusColor }: {
  label: string;
  value: string;
  status?: string | null;
  statusColor?: string;
}) {
  return (
    <div className="flex items-center justify-between px-5 py-4">
      <span className="text-sm text-[#94a3b8]">{label}</span>
      <div className="flex items-center gap-2">
        <span className="text-base font-semibold text-[#1e1e1e]">{value}</span>
        {status && (
          <span className={`text-sm font-semibold ${statusColor || "text-green-600"}`}>{status}</span>
        )}
      </div>
    </div>
  );
}
