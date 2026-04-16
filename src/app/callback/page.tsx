"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase";

function OAuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const accessToken = searchParams.get("accessToken");
    const refreshToken = searchParams.get("refreshToken");
    const oauthError = searchParams.get("error");
    const message = searchParams.get("message");

    if (oauthError) {
      setError(message || "소셜 로그인에 실패했습니다");
      setTimeout(() => router.replace("/login"), 2000);
      return;
    }

    if (!accessToken || !refreshToken) {
      setError("인증 정보가 없습니다");
      setTimeout(() => router.replace("/login"), 2000);
      return;
    }

    const supabase = createClient();
    supabase.auth
      .setSession({ access_token: accessToken, refresh_token: refreshToken })
      .then(({ error: sessionError }) => {
        if (sessionError) {
          setError("세션 설정에 실패했습니다");
          setTimeout(() => router.replace("/login"), 2000);
          return;
        }
        router.replace("/home");
      });
  }, [searchParams, router]);

  if (error) {
    return (
      <div className="min-h-dvh bg-figma-gradient flex items-center justify-center">
        <div className="text-center">
          <p className="text-white text-lg font-medium mb-2">로그인 실패</p>
          <p className="text-white/70 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-figma-gradient flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-white text-lg font-medium">로그인 중...</p>
      </div>
    </div>
  );
}

export default function OAuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-dvh bg-figma-gradient flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-white text-lg font-medium">로그인 중...</p>
          </div>
        </div>
      }
    >
      <OAuthCallbackContent />
    </Suspense>
  );
}
