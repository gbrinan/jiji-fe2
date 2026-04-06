"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import type { MrsQuestionnaire, MrsResult, MrsAnswerItem, MrsDomain } from "@/lib/types";
import Header from "@/components/layout/Header";
import Button from "@/components/ui/Button";
import ProgressBar from "@/components/ui/ProgressBar";
import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";
import Skeleton from "@/components/ui/Skeleton";

const domainLabels: Record<MrsDomain, { label: string; variant: "somatic" | "psychological" | "urogenital" }> = {
  SOMATIC: { label: "신체", variant: "somatic" },
  PSYCHOLOGICAL: { label: "심리", variant: "psychological" },
  UROGENITAL: { label: "비뇨기", variant: "urogenital" },
};

const likertLabels = ["없음", "경미", "중등", "심함", "매우 심함"];

export default function MrsSurveyPage() {
  const router = useRouter();
  const [questionnaire, setQuestionnaire] = useState<MrsQuestionnaire | null>(null);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get<MrsQuestionnaire>("/api/v1/survey/mrs")
      .then(setQuestionnaire)
      .catch(() => setError("설문을 불러올 수 없습니다."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div>
        <Header title="갱년기 증상 평가" showBackButton />
        <div className="px-5 pt-4 flex flex-col gap-4">
          <Skeleton variant="bar" />
          <Skeleton variant="card" />
        </div>
      </div>
    );
  }

  if (error || !questionnaire) {
    return (
      <div>
        <Header title="갱년기 증상 평가" showBackButton />
        <div className="px-5 pt-8 text-center">
          <p className="text-red-500 mb-4">{error || "오류가 발생했습니다."}</p>
          <Button variant="secondary" onClick={() => window.location.reload()}>다시 시도</Button>
        </div>
      </div>
    );
  }

  const questions = questionnaire.questions;
  const q = questions[currentIdx];
  const isLast = currentIdx === questions.length - 1;

  async function handleSubmit() {
    setSubmitting(true);
    try {
      const payload: MrsAnswerItem[] = questions.map((q) => ({
        questionId: q.id,
        answer: answers[q.id] ?? 0,
      }));
      const result = await api.post<MrsResult>("/api/v1/survey/mrs", { answers: payload });
      sessionStorage.setItem("mrs_result", JSON.stringify(result));
      router.push("/survey/result");
    } catch {
      setError("제출에 실패했습니다.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-dvh flex flex-col">
      <Header title="갱년기 증상 평가" showBackButton />
      <div className="px-5 pt-4 flex-1 flex flex-col">
        <ProgressBar current={currentIdx + 1} total={questions.length} />

        <Card variant="elevated" padding="lg" className="mt-4 flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm text-gray-400">{currentIdx + 1}번</span>
            <Badge variant={domainLabels[q.domain].variant} label={domainLabels[q.domain].label} />
          </div>
          <p className="text-lg font-medium text-gray-900 mb-6">{q.prompt}</p>

          <div className="flex flex-col gap-3" role="radiogroup">
            {q.answer.options.map((val) => {
              const selected = answers[q.id] === val;
              return (
                <button
                  key={val}
                  role="radio"
                  aria-checked={selected}
                  onClick={() => setAnswers({ ...answers, [q.id]: val })}
                  className={`
                    flex items-center gap-3 min-h-[48px] px-4 py-3 rounded-xl border text-left transition-all
                    ${selected ? "border-primary-500 bg-blue-50" : "border-gray-200 bg-white"}
                  `}
                >
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selected ? "border-primary-500" : "border-gray-300"}`}>
                    {selected && <div className="w-2.5 h-2.5 rounded-full bg-primary-500" />}
                  </div>
                  <span className="text-base text-gray-900">
                    {val} - {likertLabels[val]}
                  </span>
                </button>
              );
            })}
          </div>
        </Card>

        <div className="flex gap-3 py-4">
          {currentIdx > 0 && (
            <Button variant="secondary" onClick={() => setCurrentIdx(currentIdx - 1)}>이전</Button>
          )}
          {isLast ? (
            <Button fullWidth loading={submitting} onClick={handleSubmit} disabled={answers[q.id] === undefined}>
              제출
            </Button>
          ) : (
            <Button fullWidth onClick={() => setCurrentIdx(currentIdx + 1)} disabled={answers[q.id] === undefined}>
              다음
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
