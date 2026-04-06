"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase";
import { Mail, Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      router.replace("/survey/mrs");
    } catch {
      setError("이메일 또는 비밀번호가 올바르지 않습니다.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-dvh relative overflow-hidden">
      {/* Gradient Background with Blur Ellipses */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#dce8f8] via-[#e8dff0] to-[#f0e6d8]" />
      <div className="absolute -left-20 bottom-40 w-[400px] h-[400px] rounded-full bg-[#c8d8f0]/60 blur-[80px]" />
      <div className="absolute right-[-60px] bottom-60 w-[300px] h-[300px] rounded-full bg-[#e0d0e8]/50 blur-[60px]" />

      {/* Content */}
      <div className="relative z-10 min-h-dvh flex flex-col px-4">
        {/* Top Bar */}
        <div className="flex items-center justify-between pt-14 pb-6">
          <span className="text-2xl font-bold text-primary-700">JiJi</span>
          <button className="px-4 py-2 rounded-full border border-gray-300 bg-white/60 backdrop-blur text-sm font-medium text-gray-700">
            병원 로그인
          </button>
        </div>

        {/* Hero Text */}
        <div className="text-center pt-4 pb-8">
          <p className="text-xl font-semibold text-gray-900 leading-relaxed">
            나만의 밸런스를 찾는
          </p>
          <p className="text-xl font-semibold text-gray-900 leading-relaxed">
            여정을 계속하세요.
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl px-6 py-7 shadow-sm">
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* Email */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1.5 block">이메일</label>
              <div className="relative">
                <input
                  type="email"
                  placeholder="이메일을 입력해주세요."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-13 px-4 pr-12 rounded-xl bg-gray-50 border border-gray-200 text-base outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 placeholder:text-gray-400"
                  required
                />
                <Mail className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1.5 block">비밀번호</label>
              <div className="relative">
                <input
                  type={showPw ? "text" : "password"}
                  placeholder="비밀번호를 입력해주세요."
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-13 px-4 pr-12 rounded-xl bg-gray-50 border border-gray-200 text-base outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 placeholder:text-gray-400"
                  required
                />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-4 top-1/2 -translate-y-1/2">
                  {showPw ? <EyeOff className="w-5 h-5 text-gray-400" /> : <Eye className="w-5 h-5 text-gray-400" />}
                </button>
              </div>
            </div>

            {/* Remember + Forgot */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-gray-600">
                <input type="checkbox" className="w-4 h-4 rounded border-gray-300" />
                로그인 유지
              </label>
              <button type="button" className="text-sm text-gray-600 underline">비밀번호 찾기</button>
            </div>

            {error && <p className="text-sm text-red-500 text-center">{error}</p>}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-14 rounded-2xl bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold text-base disabled:opacity-50 transition-all"
            >
              {loading ? "로그인 중..." : "로그인 하기"}
            </button>

            {/* Signup Link */}
            <p className="text-center text-sm text-gray-500">
              아직 계정이 없으신가요?{" "}
              <Link href="/signup" className="text-primary-500 font-semibold">회원가입</Link>
            </p>
          </form>
        </div>

        {/* SNS Login */}
        <div className="mt-auto pb-10 pt-8">
          <p className="text-center text-sm text-gray-500 mb-4">SNS 계정으로 로그인 하기</p>
          <div className="flex justify-center gap-4">
            <button className="w-12 h-12 rounded-full bg-[#03C75A] flex items-center justify-center text-white font-bold text-lg">N</button>
            <button className="w-12 h-12 rounded-full bg-[#FEE500] flex items-center justify-center text-[#3C1E1E] font-bold text-xs">TALK</button>
            <button className="w-12 h-12 rounded-full bg-black flex items-center justify-center text-white text-lg">&#xF8FF;</button>
          </div>
        </div>
      </div>
    </div>
  );
}
