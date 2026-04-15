"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { mrsApi } from "@/lib/api";
import type { MrsQuestion, MrsAnswerItem, MrsResult, MrsDomain } from "@/lib/types";
import Header from "@/components/layout/Header";
import Button from "@/components/ui/Button";
import Skeleton from "@/components/ui/Skeleton";

const DOMAIN_LABELS: Record<MrsDomain, string> = {
  SOMATIC: "신체 증상",
  PSYCHOLOGICAL: "심리 증상",
  UROGENITAL: "비뇨생식기",
};

const DOMAIN_COLORS: Record<MrsDomain, string> = {
  SOMATIC: "#0486FF",
  PSYCHOLOGICAL: "#8B5CF6",
  UROGENITAL: "#EC4899",
};

const LIKERT_OPTIONS = [
  { value: 0, label: "없음", emoji: "😄" },
  { value: 1, label: "약간", emoji: "😊" },
  { value: 2, label: "보통", emoji: "😐" },
  { value: 3, label: "심함", emoji: "😣" },
  { value: 4, label: "매우 심함", emoji: "😖" },
];

const QUESTIONS_PER_PAGE = 1;

export default function MrsSurveyPage() {
  const router = useRouter();
  const [questions, setQuestions] = useState<MrsQuestion[]>([]);
  const [page, setPage] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    mrsApi.getQuestionnaire()
      .then((data) => {
        setQuestions(data.questions);
        setLoading(false);
      })
      .catch(() => {
        setError("설문을 불러오는데 실패했습니다");
        setLoading(false);
      });
  }, []);

  const totalPages = Math.ceil(questions.length / QUESTIONS_PER_PAGE);
  const isLastPage = page === totalPages - 1;
  const pageQuestions = questions.slice(
    page * QUESTIONS_PER_PAGE,
    (page + 1) * QUESTIONS_PER_PAGE
  );

  const allPageAnswered = pageQuestions.every((q) => answers[q.id] !== undefined);

  const handleAnswer = (questionId: number, value: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleNext = () => {
    if (!isLastPage) {
      setPage((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePrev = () => {
    if (page > 0) {
      setPage((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setError("");
    try {
      const answerItems: MrsAnswerItem[] = questions.map((q) => ({
        questionId: q.id,
        answer: answers[q.id] ?? 0,
      }));
      const result: MrsResult = await mrsApi.submit({ answers: answerItems });
      sessionStorage.setItem("mrsResult", JSON.stringify(result));
      router.push("/survey/result");
    } catch {
      setError("제출에 실패했습니다. 다시 시도해 주세요.");
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-dvh bg-figma-gradient">
        <Header showBackButton showHomeButton showProfileIcons transparent />
        <div className="px-5 py-6 flex flex-col gap-4">
          <Skeleton variant="card" height="120px" />
          <Skeleton variant="card" height="200px" />
          <Skeleton variant="card" height="200px" />
        </div>
      </div>
    );
  }

  if (error && questions.length === 0) {
    return (
      <div className="min-h-dvh bg-figma-gradient">
        <Header showBackButton showHomeButton showProfileIcons transparent />
        <div className="px-5 py-12 text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <Button variant="secondary" onClick={() => window.location.reload()}>
            다시 시도
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-figma-gradient flex flex-col">
      <Header showBackButton showHomeButton showProfileIcons transparent />

      <div className="flex-1 px-4 pb-4 flex flex-col">
        {/* Intro message (page 1 only) */}
        {page === 0 && (
          <div className="bg-white rounded-3xl border border-[#fafafa] shadow-sm p-5 mb-6">
            <p className="text-base font-medium text-[#1e1e1e] leading-[25px]">
              지금부터 몇 가지 간단한 질문을 드릴게요.{"\n"}
              모든 답변은 안전하게 보호되며, 의료 상담 이외의 목적으로는 활용되지 않습니다.
            </p>
          </div>
        )}

        {/* Questions */}
        <div className="flex flex-col gap-6">
          {pageQuestions.map((question, idx) => {
            const globalIndex = page * QUESTIONS_PER_PAGE + idx;
            const questionNum = String(globalIndex + 1).padStart(2, "0");
            const selected = answers[question.id];

            return (
              <div key={question.id} className="flex flex-col gap-3">
                {/* Domain badge */}
                <span
                  className="rounded-full px-3 py-1 text-xs font-medium text-white self-start"
                  style={{ backgroundColor: DOMAIN_COLORS[question.domain] }}
                >
                  {DOMAIN_LABELS[question.domain]}
                </span>

                {/* Question number */}
                <span className="text-sm font-semibold text-primary-600">{questionNum}</span>

                {/* Question text */}
                <h3 className="text-lg font-bold text-[#1e1e1e] leading-7">
                  {question.prompt}
                </h3>

                {/* Emoji Likert scale */}
                <div className="flex justify-between items-start pt-1">
                  {LIKERT_OPTIONS.map((option) => {
                    const isSelected = selected === option.value;
                    return (
                      <button
                        key={option.value}
                        type="button"
                        role="radio"
                        aria-checked={isSelected}
                        onClick={() => handleAnswer(question.id, option.value)}
                        disabled={submitting}
                        className="flex flex-col items-center gap-1.5 min-w-[52px]"
                      >
                        <span className={`text-2xl transition-transform ${isSelected ? "scale-125" : ""}`}>
                          {option.emoji}
                        </span>
                        <span className={`text-xs tracking-[0.18px] ${
                          isSelected ? "font-semibold text-primary-600" : "font-medium text-[#94a3b8]"
                        }`}>
                          {option.label}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Divider between questions */}
                {idx < pageQuestions.length - 1 && (
                  <div className="h-px bg-gray-100 mt-2" />
                )}
              </div>
            );
          })}
        </div>

        {error && <p className="text-sm text-red-500 text-center mt-4">{error}</p>}

        {/* Navigation buttons */}
        <div className="flex gap-3 mt-8 pb-4">
          {page > 0 && (
            <Button variant="secondary" onClick={handlePrev} disabled={submitting} className="flex-1">
              이전
            </Button>
          )}
          {isLastPage ? (
            <Button
              variant="primary"
              onClick={handleSubmit}
              loading={submitting}
              disabled={!allPageAnswered}
              className="flex-1"
            >
              완료
            </Button>
          ) : (
            <Button
              variant="primary"
              onClick={handleNext}
              disabled={!allPageAnswered}
              fullWidth={page === 0}
              className={page > 0 ? "flex-1" : ""}
            >
              다음
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
