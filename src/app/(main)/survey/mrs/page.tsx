"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { mrsApi } from "@/lib/api";
import type { MrsQuestion, MrsAnswerItem, MrsResult } from "@/lib/types";
import Header from "@/components/layout/Header";
import ProgressBar from "@/components/ui/ProgressBar";
import Button from "@/components/ui/Button";
import SurveyQuestionCard from "@/components/features/SurveyQuestionCard";
import { LikertRadioGroup } from "@/components/ui/RadioGroup";
import Skeleton from "@/components/ui/Skeleton";

const LIKERT_OPTIONS = [
  { value: 0, label: "없음" },
  { value: 1, label: "경미" },
  { value: 2, label: "중등" },
  { value: 3, label: "심함" },
  { value: 4, label: "매우 심함" },
];

export default function MrsSurveyPage() {
  const router = useRouter();
  const [questions, setQuestions] = useState<MrsQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
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

  const currentQuestion = questions[currentIndex];
  const totalQuestions = questions.length;
  const isLastQuestion = currentIndex === totalQuestions - 1;
  const hasAnswer = currentQuestion ? answers[currentQuestion.id] !== undefined : false;

  const handleAnswer = (value: number) => {
    if (!currentQuestion) return;
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: value }));
  };

  const handleNext = () => {
    if (!isLastQuestion) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
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
          <Skeleton variant="bar" />
          <Skeleton variant="card" height="300px" />
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
    <div className="min-h-dvh bg-figma-gradient">
      <Header showBackButton showHomeButton showProfileIcons transparent />

      <div className="px-5 py-6 flex flex-col gap-6">
        <ProgressBar current={currentIndex + 1} total={totalQuestions} />

        {currentQuestion && (
          <SurveyQuestionCard
            questionNumber={currentIndex + 1}
            totalQuestions={totalQuestions}
            domain={currentQuestion.domain}
            prompt={currentQuestion.prompt}
          >
            <LikertRadioGroup
              questionId={currentQuestion.id}
              options={LIKERT_OPTIONS}
              selectedValue={answers[currentQuestion.id] ?? null}
              onChange={handleAnswer}
              disabled={submitting}
            />
          </SurveyQuestionCard>
        )}

        {error && <p className="text-sm text-red-500 text-center">{error}</p>}

        <div className="flex gap-3">
          {currentIndex > 0 && (
            <Button variant="secondary" onClick={handlePrev} disabled={submitting} className="flex-1">
              이전
            </Button>
          )}
          {isLastQuestion ? (
            <Button
              variant="primary"
              onClick={handleSubmit}
              loading={submitting}
              disabled={!hasAnswer}
              className="flex-1"
            >
              제출
            </Button>
          ) : (
            <Button
              variant="primary"
              onClick={handleNext}
              disabled={!hasAnswer}
              fullWidth={currentIndex === 0}
            >
              다음
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
