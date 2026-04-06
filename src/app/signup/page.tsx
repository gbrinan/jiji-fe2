"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase";
import { Mail, Eye, EyeOff, ChevronRight } from "lucide-react";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (password !== confirm) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }
    if (!agreed) {
      setError("개인 정보 수집 및 이용에 동의해주세요.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;
      router.replace("/onboarding");
    } catch {
      setError("회원가입에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-dvh relative overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#dce8f8] via-[#e8dff0] to-[#f0e6d8]" />
      <div className="absolute -left-20 bottom-20 w-[400px] h-[400px] rounded-full bg-[#c8d8f0]/60 blur-[80px]" />

      <div className="relative z-10 min-h-dvh flex flex-col px-4">
        {/* Header */}
        <div className="pt-14 pb-2 text-center">
          <p className="text-base font-medium text-gray-600">회원가입</p>
        </div>

        {/* Hero Text */}
        <div className="text-center pt-4 pb-8">
          <p className="text-xl font-semibold text-gray-900 leading-relaxed">맞춤형 건강 관리를 위해</p>
          <p className="text-xl font-semibold text-gray-900 leading-relaxed">정보를 입력해주세요.</p>
        </div>

        {/* Form Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl px-6 py-7 shadow-sm">
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1.5 block">이메일</label>
              <div className="relative">
                <input type="email" placeholder="hello@example.com" value={email} onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-13 px-4 pr-12 rounded-xl bg-gray-50 border border-gray-200 text-base outline-none focus:ring-2 focus:ring-primary-500/30 placeholder:text-gray-400" required />
                <Mail className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1.5 block">비밀번호</label>
              <div className="relative">
                <input type={showPw ? "text" : "password"} placeholder="비밀번호(8자 이상)" value={password} onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-13 px-4 pr-12 rounded-xl bg-gray-50 border border-gray-200 text-base outline-none focus:ring-2 focus:ring-primary-500/30 placeholder:text-gray-400" required />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-4 top-1/2 -translate-y-1/2">
                  {showPw ? <EyeOff className="w-5 h-5 text-gray-400" /> : <Eye className="w-5 h-5 text-gray-400" />}
                </button>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1.5 block">비밀번호 확인</label>
              <div className="relative">
                <input type={showConfirm ? "text" : "password"} placeholder="비밀번호(8자 이상)" value={confirm} onChange={(e) => setConfirm(e.target.value)}
                  className="w-full h-13 px-4 pr-12 rounded-xl bg-gray-50 border border-gray-200 text-base outline-none focus:ring-2 focus:ring-primary-500/30 placeholder:text-gray-400" required />
                <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-4 top-1/2 -translate-y-1/2">
                  {showConfirm ? <EyeOff className="w-5 h-5 text-gray-400" /> : <Eye className="w-5 h-5 text-gray-400" />}
                </button>
              </div>
            </div>

            {/* Terms */}
            <label className="flex items-center justify-between py-2">
              <div className="flex items-center gap-2">
                <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="w-5 h-5 rounded border-gray-300" />
                <span className="text-sm text-gray-700">개인 정보 수집 및 이용 동의 (필수)</span>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </label>

            {error && <p className="text-sm text-red-500 text-center">{error}</p>}

            <button type="submit" disabled={loading}
              className="w-full h-14 rounded-2xl bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold text-base disabled:opacity-50 transition-all">
              {loading ? "처리 중..." : "다음"}
            </button>

            <p className="text-center text-sm text-gray-500">
              이미 계정이 있으신가요?{" "}
              <Link href="/login" className="text-primary-500 font-semibold underline">로그인</Link>
            </p>
          </form>
        </div>

        {/* Step Dots */}
        <div className="flex justify-center gap-2 py-6">
          <div className="w-8 h-2 rounded-full bg-gray-800" />
          <div className="w-2 h-2 rounded-full bg-gray-300" />
          <div className="w-2 h-2 rounded-full bg-gray-300" />
          <div className="w-2 h-2 rounded-full bg-gray-300" />
        </div>
      </div>
    </div>
  );
}
