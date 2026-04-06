"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import type { MrsQuestionnaire, MrsResult, MrsAnswerItem } from "@/lib/types";
import ChatLayout from "@/components/layout/ChatLayout";
import AiBubble from "@/components/features/AiBubble";
import Button from "@/components/ui/Button";
import Skeleton from "@/components/ui/Skeleton";

const emojis = ["😊", "🙂", "😐", "😟", "😫"];
const labels = ["없음", "약간", "보통", "심함", "매우 심함"];

export default function MrsSurveyPage() {
  const router = useRouter();
  const [questionnaire, setQuestionnaire] = useState<MrsQuestionnaire | null>(null);
  const [page, setPage] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api.get<MrsQuestionnaire>("/api/v1/survey/mrs")
      .then(setQuestionnaire)
      .finally(() => setLoading(false));
  }, []);

  if (loading || !questionnaire) {
    return (
      <ChatLayout showTimestamp hideInput>
        <AiBubble><Skeleton variant="text" /><Skeleton variant="text" className="w-2/3" /></AiBubble>
      </ChatLayout>
    );
  }

  const questions = questionnaire.questions;
  const pageSize = 5;
  const totalPages = Math.ceil(questions.length / pageSize);
  const pageQuestions = questions.slice(page * pageSize, (page + 1) * pageSize);
  const isLastPage = page === totalPages - 1;
  const allPageAnswered = pageQuestions.every((q) => answers[q.id] !== undefined);

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
      alert("제출에 실패했습니다.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <ChatLayout showTimestamp hideInput>
      {/* AI Intro */}
      <div className="mb-6">
        <AiBubble>
          지금부터 몇 가지 간단한 질문을 드릴게요.
          모든 답변은 안전하게 보호되며, 의료 상담 이외의 목적으로는 활용되지 않습니다.
        </AiBubble>
      </div>

      {/* Questions */}
      <div className="bg-white/80 backdrop-blur rounded-3xl p-5 shadow-sm flex flex-col gap-6">
        {pageQuestions.map((q, idx) => {
          const globalIdx = page * pageSize + idx;
          return (
            <div key={q.id}>
              <p className="text-xs text-primary-500 font-semibold mb-1">{String(globalIdx + 1).padStart(2, "0")}</p>
              <p className="text-base font-semibold text-gray-900 mb-1">{q.prompt}</p>
              <div className="flex justify-between mt-3">
                {q.answer.options.map((val) => {
                  const selected = answers[q.id] === val;
                  return (
                    <button
                      key={val}
                      onClick={() => setAnswers({ ...answers, [q.id]: val })}
                      className="flex flex-col items-center gap-1"
                    >
                      <span
                        className={`text-2xl transition-all ${selected ? "scale-125" : "grayscale opacity-60"}`}
                      >
                        {emojis[val]}
                      </span>
                      <span
                        className={`text-[10px] ${selected ? "text-primary-600 font-semibold" : "text-gray-400"}`}
                      >
                        {labels[val]}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Navigation */}
      <div className="flex gap-3 mt-6 pb-4">
        {page > 0 && (
          <button
            onClick={() => setPage(page - 1)}
            className="flex-none px-6 py-3.5 rounded-2xl border border-gray-300 bg-white text-gray-700 font-semibold text-sm"
          >
            이전
          </button>
        )}
        {isLastPage ? (
          <Button fullWidth loading={submitting} onClick={handleSubmit} disabled={!allPageAnswered}>
            제출
          </Button>
        ) : (
          <button
            onClick={() => setPage(page + 1)}
            disabled={!allPageAnswered}
            className="flex-1 py-3.5 rounded-2xl bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold text-sm disabled:opacity-40"
          >
            다음
          </button>
        )}
      </div>

      {/* Page Dots */}
      <div className="flex justify-center gap-2 pb-4">
        {Array.from({ length: totalPages }).map((_, i) => (
          <div key={i} className={`h-2 rounded-full transition-all ${i === page ? "w-8 bg-gray-800" : "w-2 bg-gray-300"}`} />
        ))}
      </div>
    </ChatLayout>
  );
}
