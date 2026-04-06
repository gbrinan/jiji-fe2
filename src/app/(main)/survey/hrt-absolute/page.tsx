"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import type { HrtAbsoluteQuestionnaire, HrtAbsoluteResult, HrtAnswerItem } from "@/lib/types";
import ChatLayout from "@/components/layout/ChatLayout";
import AiBubble from "@/components/features/AiBubble";
import Skeleton from "@/components/ui/Skeleton";

const answerLabels: Record<string, string> = { YES: "네", NO: "아니오", DONT_KNOW: "잘 모르겠어요" };

export default function HrtAbsolutePage() {
  const router = useRouter();
  const [questionnaire, setQuestionnaire] = useState<HrtAbsoluteQuestionnaire | null>(null);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [currentQ, setCurrentQ] = useState(0);

  useEffect(() => {
    api.get<HrtAbsoluteQuestionnaire>("/api/v1/survey/hrt/absolute")
      .then(setQuestionnaire)
      .finally(() => setLoading(false));
  }, []);

  if (loading || !questionnaire) {
    return (
      <ChatLayout showTimestamp subtitle="안전한 호르몬 치료를 위해" hideInput>
        <AiBubble><Skeleton variant="text" /></AiBubble>
      </ChatLayout>
    );
  }

  const questions = questionnaire.questions;
  const answeredQuestions = questions.filter((_, i) => i <= currentQ);

  async function handleAnswer(qId: number, answer: string) {
    const newAnswers = { ...answers, [qId]: answer };
    setAnswers(newAnswers);

    if (currentQ < questions.length - 1) {
      setTimeout(() => setCurrentQ(currentQ + 1), 300);
    } else {
      setSubmitting(true);
      try {
        const payload: HrtAnswerItem[] = questions.map((q) => ({
          questionId: q.id,
          answer: newAnswers[q.id] ?? "NO",
        }));
        const result = await api.post<HrtAbsoluteResult>("/api/v1/survey/hrt/absolute", { answers: payload });
        if (result.diagnosis.nextAction === "START_HRT_RELATIVE") {
          router.push("/survey/hrt-relative");
        } else {
          router.push("/survey/result");
        }
      } catch {
        alert("제출에 실패했습니다.");
        setSubmitting(false);
      }
    }
  }

  return (
    <ChatLayout showTimestamp subtitle="안전한 호르몬 치료를 위해&#10;몇 가지 건강 정보를 확인해볼게요." hideInput>
      <div className="flex flex-col gap-4">
        {answeredQuestions.map((q, idx) => (
          <div key={q.id}>
            <AiBubble showAvatar={idx === 0}>{q.prompt}</AiBubble>

            {/* Answer Buttons or Selected Answer */}
            <div className="flex flex-wrap gap-2 mt-2 ml-10">
              {answers[q.id] ? (
                <div className="px-4 py-2 rounded-full bg-primary-500 text-white text-sm font-medium">
                  {answerLabels[answers[q.id]] || answers[q.id]}
                </div>
              ) : (
                q.answer.options.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => handleAnswer(q.id, opt)}
                    disabled={submitting}
                    className="px-4 py-2 rounded-full border border-primary-300 bg-white text-primary-600 text-sm font-medium hover:bg-primary-50 transition-colors disabled:opacity-50"
                  >
                    {answerLabels[opt] || opt}
                  </button>
                ))
              )}
            </div>
          </div>
        ))}

        {submitting && (
          <div className="text-center py-4">
            <div className="inline-block w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>
    </ChatLayout>
  );
}
