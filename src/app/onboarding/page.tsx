"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { usersApi } from "@/lib/api";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [birthDate, setBirthDate] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const totalSteps = 3;

  const handleNext = () => {
    if (step < totalSteps) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleComplete = async () => {
    setLoading(true);
    setError("");
    try {
      await usersApi.updateMe({
        birthDate: birthDate || undefined,
        height: height ? Number(height) : undefined,
        weight: weight ? Number(weight) : undefined,
      });
      router.replace("/survey/mrs");
    } catch (err) {
      setError(err instanceof Error ? err.message : "저장에 실패했습니다");
    } finally {
      setLoading(false);
    }
  };

  const stepTitles = [
    "생년월일을 입력해 주세요",
    "키를 입력해 주세요",
    "체중을 입력해 주세요",
  ];

  return (
    <div className="min-h-dvh bg-figma-gradient flex flex-col">
      {/* Status bar spacer */}
      <div className="pt-[max(env(safe-area-inset-top),12px)]" />

      {/* Header with step indicator */}
      <div className="flex items-center justify-center px-4 py-3">
        <h1 className="text-lg font-semibold text-gray-900">프로필 설정</h1>
      </div>

      {/* Step dots */}
      <div className="flex items-center justify-center gap-2 mb-2">
        {Array.from({ length: totalSteps }, (_, i) => (
          <div
            key={i}
            className={`w-2 h-2 rounded-full ${i + 1 <= step ? "bg-primary-500" : "bg-gray-300"}`}
          />
        ))}
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center px-4">
        {/* Subtitle */}
        <div className="mt-8 mb-6 text-center">
          <p className="text-[18px] font-medium text-gray-900 leading-5 mb-4">맞춤형 건강 관리를 위해</p>
          <p className="text-[18px] font-medium text-gray-900 leading-5">{stepTitles[step - 1]}</p>
        </div>

        {/* White form card */}
        <div className="w-full bg-white rounded-3xl shadow-md border border-[#fafafa] px-[17px] py-[25px]">
          <div className="flex flex-col gap-6">
            {step === 1 && (
              <Input type="date" label="생년월일" value={birthDate} onChange={setBirthDate} />
            )}
            {step === 2 && (
              <Input type="number" label="키 (cm)" placeholder="160" value={height} onChange={setHeight} helperText="50~250cm" />
            )}
            {step === 3 && (
              <Input type="number" label="체중 (kg)" placeholder="55" value={weight} onChange={setWeight} helperText="20~300kg" />
            )}

            {error && <p className="text-sm text-red-500">{error}</p>}

            <div className="flex gap-3">
              {step > 1 && (
                <Button variant="secondary" onClick={handleBack} className="flex-1">
                  이전
                </Button>
              )}
              {step < totalSteps ? (
                <Button variant="primary" onClick={handleNext} fullWidth={step === 1}>
                  다음
                </Button>
              ) : (
                <Button variant="primary" onClick={handleComplete} loading={loading} className="flex-1">
                  완료
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Page dots */}
        <div className="flex gap-2 mt-8 mb-8">
          <div className={`w-2 h-2 rounded-full ${step === totalSteps ? "bg-primary-500" : "bg-gray-300"}`} />
          <div className={`w-2 h-2 rounded-full ${step === totalSteps ? "bg-gray-300" : "bg-primary-500"}`} />
        </div>
      </div>
    </div>
  );
}
