"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import type { UpdateProfileRequest } from "@/lib/types";
import Header from "@/components/layout/Header";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [birthDate, setBirthDate] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleComplete() {
    setLoading(true);
    try {
      const body: UpdateProfileRequest = {};
      if (birthDate) body.birthDate = birthDate;
      if (height) body.height = Number(height);
      if (weight) body.weight = Number(weight);
      await api.patch("/api/v1/users/me", body);
      router.replace("/survey/mrs");
    } catch {
      router.replace("/survey/mrs");
    } finally {
      setLoading(false);
    }
  }

  const steps = [
    <Input key="birth" label="생년월일" type="date" value={birthDate} onChange={setBirthDate} />,
    <Input key="height" label="키 (cm)" type="number" value={height} onChange={setHeight} placeholder="160" />,
    <Input key="weight" label="체중 (kg)" type="number" value={weight} onChange={setWeight} placeholder="55" />,
  ];

  return (
    <div className="min-h-dvh flex flex-col">
      <Header title="기본 정보 입력" />
      <div className="flex-1 px-5 pt-6">
        <div className="flex gap-2 mb-8">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={`h-1.5 flex-1 rounded-full transition-colors ${i <= step ? "bg-primary-500" : "bg-gray-200"}`}
            />
          ))}
        </div>
        <p className="text-sm text-gray-500 mb-2">{step + 1}/3</p>
        <div className="mb-8">{steps[step]}</div>
        <div className="flex gap-3">
          {step > 0 && (
            <Button variant="secondary" onClick={() => setStep(step - 1)}>이전</Button>
          )}
          {step < 2 ? (
            <Button fullWidth onClick={() => setStep(step + 1)}>다음</Button>
          ) : (
            <Button fullWidth loading={loading} onClick={handleComplete}>완료</Button>
          )}
        </div>
      </div>
    </div>
  );
}
