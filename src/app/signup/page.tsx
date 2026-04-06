"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api, setToken } from "@/lib/api";
import type { AuthResponse, SignUpRequest } from "@/lib/types";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirm) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const res = await api.post<AuthResponse>("/api/v1/auth/signup", {
        email,
        password,
        name,
      } satisfies SignUpRequest);
      setToken(res.accessToken);
      localStorage.setItem("jiji_user", JSON.stringify(res.user));
      router.replace("/onboarding");
    } catch {
      setError("회원가입에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-dvh flex flex-col">
      <div className="bg-gradient-to-br from-primary-500 to-primary-600 min-h-[200px] flex items-center justify-center">
        <h1 className="text-[28px] font-bold text-white tracking-wider">JIJI</h1>
      </div>
      <div className="-mt-10 flex-1 bg-white rounded-t-3xl px-5 pt-8 pb-8">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input label="이름" value={name} onChange={setName} required placeholder="홍길동" />
          <Input label="이메일" type="email" value={email} onChange={setEmail} required placeholder="email@example.com" />
          <Input label="비밀번호" type="password" value={password} onChange={setPassword} required placeholder="6자 이상" />
          <Input label="비밀번호 확인" type="password" value={confirm} onChange={setConfirm} required placeholder="비밀번호 재입력" />
          {error && <p className="text-sm text-red-500">{error}</p>}
          <Button type="submit" fullWidth loading={loading}>회원가입</Button>
        </form>
        <p className="text-center text-sm text-gray-500 mt-6">
          이미 계정이 있으신가요?{" "}
          <Link href="/login" className="text-primary-500 font-medium">로그인</Link>
        </p>
      </div>
    </div>
  );
}
