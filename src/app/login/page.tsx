"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
    <div className="min-h-dvh flex flex-col">
      <div className="bg-gradient-to-br from-primary-500 to-primary-600 min-h-[200px] flex items-center justify-center">
        <h1 className="text-[28px] font-bold text-white tracking-wider">JIJI</h1>
      </div>
      <div className="-mt-10 flex-1 bg-white rounded-t-3xl px-5 pt-8 pb-8">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input label="이메일" type="email" placeholder="email@example.com" value={email} onChange={setEmail} required />
          <Input label="비밀번호" type="password" placeholder="6자 이상" value={password} onChange={setPassword} required />
          {error && <p className="text-sm text-red-500">{error}</p>}
          <Button type="submit" fullWidth loading={loading}>로그인</Button>
        </form>
        <p className="text-center text-sm text-gray-500 mt-6">
          계정이 없으신가요?{" "}
          <Link href="/signup" className="text-primary-500 font-medium">회원가입</Link>
        </p>
      </div>
    </div>
  );
}
