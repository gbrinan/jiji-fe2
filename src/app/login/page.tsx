"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Capacitor } from "@capacitor/core";
import { Browser } from "@capacitor/browser";
import { createClient } from "@/lib/supabase";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Link from "next/link";

const NATIVE_OAUTH_REDIRECT = "app.jiji.mobile://callback";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://jiji-production-ee02.up.railway.app";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const supabase = createClient();
      const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
      if (authError) throw authError;
      router.replace("/home");
    } catch (err) {
      setError(err instanceof Error ? err.message : "로그인에 실패했습니다");
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthLogin = (provider: "kakao" | "naver" | "apple") => {
    const redirectUrl = Capacitor.isNativePlatform()
      ? NATIVE_OAUTH_REDIRECT
      : `${window.location.origin}/callback`;
    const url = `${API_URL}/api/v1/auth/oauth/${provider}?redirectUrl=${encodeURIComponent(redirectUrl)}`;
    if (Capacitor.isNativePlatform()) {
      void Browser.open({ url });
    } else {
      window.location.href = url;
    }
  };

  return (
    <div className="min-h-dvh bg-figma-gradient flex flex-col">
      {/* Status bar spacer */}
      <div className="pt-[max(env(safe-area-inset-top),12px)]" />

      {/* Header: JiJi logo + 병원 로그인 */}
      <div className="flex items-center justify-between px-4 py-3">
        <p className="text-[30px] font-bold text-slate-300 tracking-[1px] leading-[34px]">JiJi</p>
        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl border-[1.5px] border-primary-300 bg-white shadow-sm text-sm font-semibold text-gray-900">
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72l1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
          병원 로그인
        </button>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center px-4">
        {/* Centered text */}
        <div className="mt-8 mb-6 text-center">
          <p className="text-[18px] font-medium text-gray-900 leading-5 mb-4">나만의 밸런스를 찾는</p>
          <p className="text-[18px] font-medium text-gray-900 leading-5">여정을 계속하세요.</p>
        </div>

        {/* White form card */}
        <div className="w-full bg-white rounded-3xl shadow-md border border-[#fafafa] px-[17px] py-[25px]">
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {/* Form fields */}
            <div className="flex flex-col gap-3">
              <Input type="email" label="이메일" placeholder="이메일을 입력해주세요" value={email} onChange={setEmail} autoComplete="email" required />
              <Input type="password" label="비밀번호" placeholder="비밀번호를 입력해주세요." value={password} onChange={setPassword} autoComplete="current-password" required />
            </div>

            {/* Checkbox + forgot password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-base text-slate-700">
                <input type="checkbox" className="w-[18px] h-[18px] rounded border-slate-300 bg-[#f5f5f5]" />
                로그인 유지
              </label>
              <button type="button" className="text-sm font-medium text-gray-900 underline">
                비밀번호 찾기
              </button>
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}

            {/* Login button */}
            <div className="flex flex-col gap-2">
              <Button type="submit" variant="primary" size="lg" fullWidth loading={loading}>
                로그인 하기
              </Button>
              <div className="flex items-center justify-center gap-1">
                <span className="text-sm font-medium text-gray-900">아직 계정이 없으신가요?</span>
                <Link href="/signup" className="text-base font-medium text-primary-600 px-3 py-1.5">
                  회원가입
                </Link>
              </div>
            </div>
          </form>
        </div>

        {/* SNS Login */}
        <div className="w-full px-4 mt-auto mb-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-white/50" />
            <span className="text-sm font-medium text-white">SNS 계정으로 로그인 하기</span>
            <div className="flex-1 h-px bg-white/50" />
          </div>
          <div className="flex justify-center gap-4">
            {/* Naver */}
            <button className="w-11 h-11 rounded-full overflow-hidden" onClick={() => handleOAuthLogin("naver")}>
              <div className="w-full h-full bg-[#03C75A] flex items-center justify-center text-white font-bold text-xl">N</div>
            </button>
            {/* KakaoTalk */}
            <button className="w-11 h-11 rounded-full bg-[#FEE500] flex items-center justify-center overflow-hidden" onClick={() => handleOAuthLogin("kakao")}>
              <span className="font-bold text-sm text-gray-900">TALK</span>
            </button>
            {/* Apple */}
            <button className="w-11 h-11 rounded-full bg-black flex items-center justify-center" onClick={() => handleOAuthLogin("apple")}>
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
