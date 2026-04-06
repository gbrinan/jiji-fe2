"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import type { HrtAbsoluteQuestionnaire, HrtAbsoluteResult, HrtAnswerItem } from "@/lib/types";
import Header from "@/components/layout/Header";
import Button from "@/components/ui/Button";
import ProgressBar from "@/components/ui/ProgressBar";
import Card from "@/components/ui/Card";
import Skeleton from "@/components/ui/Skeleton";

const optionLabels: Record<string, string> = { YES: "예", NO: "아니오", DONT_KNOW: "모르겠음" };

export default function HrtAbsolutePage() {
  const router = useRouter();
  const [questionnaire, setQuestionnaire] = useState<HrtAbsoluteQuestionnaire | null>(null);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api.get<HrtAbsoluteQuestionnaire>("/api/v1/survey/hrt/absolute")
      .then(setQuestionnaire)
      .finally(() => setLoading(false));
  }, []);

  if (loading || !questionnaire) {
    return (
      <div>
        <Header title="호르몬 치료 금기사항 확인" showBackButton />
        <div className="px-5 pt-4 flex flex-col gap-4">
          <Skeleton variant="bar" />
          <Skeleton variant="card" />
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
      const payload: HrtAnswerItem[] = questions.map((q) => ({
        questionId: q.id,
        answer: answers[q.id] ?? "NO",
      }));
      const result = await api.post<HrtAbsoluteResult>("/api/v1/survey/hrt/absolute", { answers: payload });
      if (result.diagnosis.nextAction === "START_HRT_RELATIVE") {
        router.push("/survey/hrt-relative");
      } else {
        router.push("/chat");
      }
    } catch {
      alert("제출에 실패했습니다.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-dvh flex flex-col">
      <Header title="호르몬 치료 금기사항 확인" showBackButton />
      <div className="px-5 pt-4 flex-1 flex flex-col">
        <ProgressBar current={currentIdx + 1} total={questions.length} />
        <Card variant="elevated" padding="lg" className="mt-4 flex-1">
          <p className="text-sm text-gray-400 mb-1">{currentIdx + 1}번</p>
          <p className="text-lg font-medium text-gray-900 mb-6">{q.prompt}</p>
          <div className="flex gap-3">
            {q.answer.options.map((opt) => {
              const selected = answers[q.id] === opt;
              return (
                <button
                  key={opt}
                  onClick={() => setAnswers({ ...answers, [q.id]: opt })}
                  className={`
                    flex-1 text-center py-3 rounded-xl border transition-all font-medium
                    ${selected ? "border-primary-500 bg-blue-50 text-primary-600" : "border-gray-200 text-gray-700"}
                  `}
                >
                  {optionLabels[opt] || opt}
                </button>
              );
            })}
          </div>
        </Card>
        <div className="flex gap-3 py-4">
          {currentIdx > 0 && <Button variant="secondary" onClick={() => setCurrentIdx(currentIdx - 1)}>이전</Button>}
          {isLast ? (
            <Button fullWidth loading={submitting} onClick={handleSubmit} disabled={!answers[q.id]}>제출</Button>
          ) : (
            <Button fullWidth onClick={() => setCurrentIdx(currentIdx + 1)} disabled={!answers[q.id]}>다음</Button>
          )}
        </div>
      </div>
    </div>
  );
}
