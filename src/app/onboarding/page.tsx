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

  return (
    <div className="min-h-dvh flex flex-col bg-white px-5 pt-[max(env(safe-area-inset-top),12px)]">
      {/* Step indicator */}
      <div className="flex items-center justify-center gap-2 py-6">
        {Array.from({ length: totalSteps }, (_, i) => (
          <div
            key={i}
            className={`w-3 h-3 rounded-full ${i + 1 <= step ? "bg-primary-500" : "bg-gray-200"}`}
          />
        ))}
      </div>
      <p className="text-sm text-gray-500 text-center mb-2">{step}/{totalSteps}</p>

      <div className="flex-1 flex flex-col justify-center">
        {step === 1 && (
          <div className="flex flex-col gap-4">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">생년월일을 입력해 주세요</h2>
            <Input type="date" label="생년월일" value={birthDate} onChange={setBirthDate} />
          </div>
        )}
        {step === 2 && (
          <div className="flex flex-col gap-4">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">키를 입력해 주세요</h2>
            <Input type="number" label="키 (cm)" placeholder="160" value={height} onChange={setHeight} helperText="50~250cm" />
          </div>
        )}
        {step === 3 && (
          <div className="flex flex-col gap-4">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">체중을 입력해 주세요</h2>
            <Input type="number" label="체중 (kg)" placeholder="55" value={weight} onChange={setWeight} helperText="20~300kg" />
          </div>
        )}

        {error && <p className="text-sm text-red-500 mt-4">{error}</p>}
      </div>

      <div className="flex gap-3 pb-8">
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
  );
}
