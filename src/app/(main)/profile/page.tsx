"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import type { ProfileResponse, UpdateProfileRequest } from "@/lib/types";
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
  const [name, setName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");

  useEffect(() => {
    api.get<ProfileResponse>("/api/v1/users/me")
      .then((p) => {
        setProfile(p);
        setName(p.name || "");
        setBirthDate(p.birthDate || "");
        setHeight(p.height?.toString() || "");
        setWeight(p.weight?.toString() || "");
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  async function handleSave() {
    setSaving(true);
    try {
      const body: UpdateProfileRequest = { name };
      if (birthDate) body.birthDate = birthDate;
      if (height) body.height = Number(height);
      if (weight) body.weight = Number(weight);
      const updated = await api.patch<ProfileResponse>("/api/v1/users/me", body);
      setProfile(updated);
    } catch {
      alert("저장에 실패했습니다.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-dvh flex flex-col">
      <Header extended>
        <div className="flex flex-col items-center py-4">
          <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mb-2">
            <User className="w-8 h-8 text-white" />
          </div>
          {loading ? (
            <Skeleton variant="text" className="w-24 !bg-white/30" />
          ) : (
            <>
              <p className="font-semibold text-white">{profile?.name || "사용자"}</p>
              <p className="text-sm text-white/80">{profile?.email}</p>
            </>
          )}
        </div>
      </Header>

      <div className="-mt-6 px-5 flex-1 flex flex-col gap-4">
        {loading ? (
          <Card variant="elevated"><Skeleton variant="card" /></Card>
        ) : (
          <>
            <Card variant="elevated" padding="lg">
              <h3 className="text-sm font-semibold text-gray-500 mb-4">기본 정보</h3>
              <div className="flex flex-col gap-4">
                <Input label="이름" value={name} onChange={setName} />
                <div>
                  <label className="text-sm font-medium text-gray-700">이메일</label>
                  <p className="h-12 px-4 rounded-xl border border-gray-200 bg-gray-50 flex items-center text-gray-500">
                    {profile?.email}
                  </p>
                </div>
              </div>
            </Card>

            <Card variant="elevated" padding="lg">
              <h3 className="text-sm font-semibold text-gray-500 mb-4">건강 정보</h3>
              <div className="flex flex-col gap-4">
                <Input label="생년월일" type="date" value={birthDate} onChange={setBirthDate} />
                <Input label="키 (cm)" type="number" value={height} onChange={setHeight} placeholder="160" />
                <Input label="체중 (kg)" type="number" value={weight} onChange={setWeight} placeholder="55" />
              </div>
            </Card>

            <Button fullWidth loading={saving} onClick={handleSave}>저장</Button>
            <Button variant="danger" fullWidth onClick={logout}>로그아웃</Button>
          </>
        )}
      </div>
    </div>
  );
}
