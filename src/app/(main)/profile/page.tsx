"use client";

import { useState, useEffect } from "react";
import { usersApi } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import type { ProfileResponse } from "@/lib/types";
import Header from "@/components/layout/Header";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Skeleton from "@/components/ui/Skeleton";
import { User } from "lucide-react";

export default function ProfilePage() {
  const { logout } = useAuth();
  const [profile, setProfile] = useState<ProfileResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Edit state
  const [name, setName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");

  useEffect(() => {
    usersApi.getMe()
      .then((data) => {
        setProfile(data);
        setName(data.name || "");
        setBirthDate(data.birthDate || "");
        setHeight(data.height ? String(data.height) : "");
        setWeight(data.weight ? String(data.weight) : "");
      })
      .catch(() => setError("프로필을 불러오는데 실패했습니다"))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const updated = await usersApi.updateMe({
        name: name || undefined,
        birthDate: birthDate || undefined,
        height: height ? Number(height) : undefined,
        weight: weight ? Number(weight) : undefined,
      });
      setProfile(updated);
      setSuccess("저장되었습니다");
      setTimeout(() => setSuccess(""), 3000);
    } catch {
      setError("저장에 실패했습니다");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-dvh bg-gradient-to-b from-blue-50 to-white">
      {/* Extended header with avatar */}
      <Header extended>
        <div className="flex flex-col items-center pb-6 pt-4">
          <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center mb-3">
            <User className="w-10 h-10 text-white" />
          </div>
          {loading ? (
            <Skeleton variant="text" width="120px" className="bg-white/30" />
          ) : (
            <>
              <p className="text-lg font-semibold text-white">{profile?.name || "사용자"}</p>
              <p className="text-sm text-white/80">{profile?.email}</p>
            </>
          )}
        </div>
      </Header>

      <div className="px-5 -mt-6 pb-8 flex flex-col gap-4">
        {loading ? (
          <>
            <Skeleton variant="card" height="200px" />
            <Skeleton variant="card" height="200px" />
          </>
        ) : (
          <>
            {/* User Info */}
            <Card variant="elevated" padding="lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">기본 정보</h3>
              <div className="flex flex-col gap-4">
                <Input label="이름" type="text" value={name} onChange={setName} />
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-medium text-gray-700">이메일</span>
                  <p className="h-12 px-4 rounded-xl border border-gray-200 bg-gray-50 flex items-center text-base text-gray-500">
                    {profile?.email}
                  </p>
                </div>
              </div>
            </Card>

            {/* Health Info */}
            <Card variant="elevated" padding="lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">건강 정보</h3>
              <div className="flex flex-col gap-4">
                <Input label="생년월일" type="date" value={birthDate} onChange={setBirthDate} />
                <Input label="키 (cm)" type="number" value={height} onChange={setHeight} placeholder="160" />
                <Input label="체중 (kg)" type="number" value={weight} onChange={setWeight} placeholder="55" />
              </div>
            </Card>

            {error && <p className="text-sm text-red-500 text-center">{error}</p>}
            {success && <p className="text-sm text-green-600 text-center">{success}</p>}

            <Button variant="primary" fullWidth onClick={handleSave} loading={saving}>
              저장
            </Button>

            <Button variant="danger" fullWidth onClick={logout}>
              로그아웃
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
