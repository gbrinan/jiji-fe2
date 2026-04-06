"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const supabase = createClient();
      const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
      if (authError) throw authError;
      router.replace("/survey/mrs");
    } catch (err) {
      setError(err instanceof Error ? err.message : "로그인에 실패했습니다");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-dvh flex flex-col">
      {/* Blue gradient header */}
      <div className="bg-gradient-to-br from-primary-500 to-primary-600 min-h-[200px] flex items-center justify-center px-5 pt-[max(env(safe-area-inset-top),12px)]">
        <h1 className="text-[28px] font-bold text-white tracking-wider">JIJI</h1>
      </div>

      {/* White card form overlapping header */}
      <div className="flex-1 bg-white rounded-t-3xl -mt-8 px-5 pt-8 pb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">로그인</h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            type="email"
            label="이메일"
            placeholder="이메일을 입력하세요"
            value={email}
            onChange={setEmail}
            autoComplete="email"
            required
          />
          <Input
            type="password"
            label="비밀번호"
            placeholder="비밀번호를 입력하세요"
            value={password}
            onChange={setPassword}
            autoComplete="current-password"
            required
          />

          {error && (
            <p className="text-sm text-red-500">{error}</p>
          )}

          <Button type="submit" variant="primary" fullWidth loading={loading} className="mt-2">
            로그인
          </Button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          계정이 없으신가요?{" "}
          <Link href="/signup" className="text-primary-500 font-medium">
            회원가입
          </Link>
        </p>
      </div>
    </div>
  );
}
