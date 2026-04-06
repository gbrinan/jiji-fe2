"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { hasToken } from "@/lib/api";

export default function SplashPage() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace(hasToken() ? "/survey/mrs" : "/login");
    }, 1500);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-dvh bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center">
      <h1 className="text-[28px] font-bold text-white tracking-wider">JIJI</h1>
    </div>
  );
}
