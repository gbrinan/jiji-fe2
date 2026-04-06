"use client";

import { useState, useEffect } from "react";
import { usersApi } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import type { ProfileResponse } from "@/lib/types";
import Header from "@/components/layout/Header";
import Button from "@/components/ui/Button";
import Skeleton from "@/components/ui/Skeleton";

export default function ProfilePage() {
  const { logout } = useAuth();
  const [profile, setProfile] = useState<ProfileResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    usersApi.getMe()
      .then(setProfile)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const calculateAge = (birthDate: string | null) => {
    if (!birthDate) return null;
    const birth = new Date(birthDate);
    const now = new Date();
    return now.getFullYear() - birth.getFullYear();
  };

  const age = profile?.birthDate ? calculateAge(profile.birthDate) : null;

  return (
    <div className="min-h-dvh bg-figma-gradient flex flex-col">
      <Header showBackButton showHomeButton showProfileIcons transparent />

      <div className="px-5 flex flex-col">
        {loading ? (
          <div className="flex flex-col gap-4 mt-4">
            <Skeleton variant="text" width="200px" height="28px" />
            <Skeleton variant="card" height="200px" />
          </div>
        ) : (
          <>
            {/* User name + age */}
            <div className="flex items-center gap-3 mt-4 mb-6">
              <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                <svg className="w-5 h-5 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" />
                </svg>
              </div>
              <h1 className="text-xl font-bold text-gray-900">
                {profile?.name || "사용자"}님{age ? ` (${age}세)` : ""}
              </h1>
            </div>

            {/* Info card - read only */}
            <div className="bg-white rounded-3xl border border-[#fafafa] shadow-sm p-5 mb-6">
              <div className="flex flex-col divide-y divide-gray-100">
                <div className="py-4 first:pt-0">
                  <p className="text-xs text-gray-400 mb-1">이메일</p>
                  <p className="text-base font-medium text-gray-900">{profile?.email}</p>
                </div>
                <div className="py-4">
                  <p className="text-xs text-gray-400 mb-1">생년월일</p>
                  <p className="text-base font-medium text-gray-900">{profile?.birthDate || "-"}</p>
                </div>
                <div className="py-4 last:pb-0">
                  <p className="text-xs text-gray-400 mb-1">언어</p>
                  <p className="text-base font-medium text-gray-900">한국어</p>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <Button variant="secondary" fullWidth className="mb-4">
              프로필 수정
            </Button>
            <button onClick={logout} className="text-base text-gray-400 text-center w-full py-2">
              로그아웃
            </button>
          </>
        )}
      </div>
    </div>
  );
}
