"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import Button from "@/components/ui/Button";
import Link from "next/link";
import { ChevronRight, Mail, Eye, EyeOff } from "lucide-react";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!agreedToTerms) {
      setError("개인 정보 수집 및 이용에 동의해주세요");
      return;
    }
    if (password !== passwordConfirm) {
      setError("비밀번호가 일치하지 않습니다");
      return;
    }
    if (password.length < 8) {
      setError("비밀번호는 8자 이상이어야 합니다");
      return;
    }

    setLoading(true);
    try {
      const supabase = createClient();
      const { error: authError } = await supabase.auth.signUp({
        email,
        password,
      });
      if (authError) throw authError;
      router.replace("/onboarding");
    } catch (err) {
      setError(err instanceof Error ? err.message : "회원가입에 실패했습니다");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-dvh bg-figma-gradient flex flex-col">
      {/* Status bar spacer */}
      <div className="pt-[max(env(safe-area-inset-top),12px)]" />

      {/* Header */}
      <div className="flex items-center justify-center px-4 py-3">
        <h1 className="text-lg font-semibold text-gray-900">회원가입</h1>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center px-4">
        {/* Subtitle */}
        <div className="mt-8 mb-6 text-center">
          <p className="text-[18px] font-medium text-gray-900 leading-5 mb-4">맞춤형 건강 관리를 위해</p>
          <p className="text-[18px] font-medium text-gray-900 leading-5">정보를 입력해주세요.</p>
        </div>

        {/* White form card */}
        <div className="w-full bg-white rounded-3xl shadow-md border border-[#fafafa] px-[17px] py-[25px]">
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {/* Form fields */}
            <div className="flex flex-col gap-3">
              {/* Email field with mail icon */}
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">
                  이메일<span className="text-red-500 ml-0.5">*</span>
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="이메일을 입력해주세요"
                    autoComplete="email"
                    required
                    className="w-full h-14 px-4 pr-12 rounded-2xl border border-[#fafafa] bg-[#f5f5f5] text-base outline-none transition-all duration-150 shadow-[inset_0px_1px_2px_0px_rgba(0,0,0,0.05)] focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                  <Mail className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* Password field with eye toggle */}
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">
                  비밀번호<span className="text-red-500 ml-0.5">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="8자 이상 입력해주세요"
                    autoComplete="new-password"
                    required
                    className="w-full h-14 px-4 pr-12 rounded-2xl border border-[#fafafa] bg-[#f5f5f5] text-base outline-none transition-all duration-150 shadow-[inset_0px_1px_2px_0px_rgba(0,0,0,0.05)] focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                <p className="text-sm text-gray-500 mt-1">8자 이상</p>
              </div>

              {/* Password confirm field with eye toggle */}
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">
                  비밀번호 확인<span className="text-red-500 ml-0.5">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showPasswordConfirm ? "text" : "password"}
                    value={passwordConfirm}
                    onChange={(e) => setPasswordConfirm(e.target.value)}
                    placeholder="비밀번호를 다시 입력해주세요"
                    autoComplete="new-password"
                    required
                    className="w-full h-14 px-4 pr-12 rounded-2xl border border-[#fafafa] bg-[#f5f5f5] text-base outline-none transition-all duration-150 shadow-[inset_0px_1px_2px_0px_rgba(0,0,0,0.05)] focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswordConfirm((prev) => !prev)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                    tabIndex={-1}
                  >
                    {showPasswordConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Terms checkbox */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="w-[18px] h-[18px] rounded border-slate-300 bg-[#f5f5f5]"
                />
                개인 정보 수집 및 이용 동의 (필수)
              </label>
              <button type="button" className="p-1">
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </button>
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}

            {/* Next button */}
            <div className="flex flex-col gap-2">
              <Button type="submit" variant="primary" size="lg" fullWidth loading={loading}>
                다음
              </Button>
              <div className="flex items-center justify-center gap-1">
                <span className="text-sm font-medium text-gray-900">이미 계정이 있으신가요?</span>
                <Link href="/login" className="text-base font-medium text-primary-600 px-3 py-1.5">
                  로그인
                </Link>
              </div>
            </div>
          </form>
        </div>

        {/* Page dots */}
        <div className="flex gap-2 mt-8 mb-8">
          <div className="w-2 h-2 rounded-full bg-primary-500" />
          <div className="w-2 h-2 rounded-full bg-gray-300" />
        </div>
      </div>
    </div>
  );
}
