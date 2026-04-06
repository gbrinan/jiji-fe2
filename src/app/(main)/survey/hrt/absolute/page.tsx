"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { hrtApi } from "@/lib/api";
import type { HrtAbsoluteQuestion, HrtAnswerItem } from "@/lib/types";
import Header from "@/components/layout/Header";
import ProgressBar from "@/components/ui/ProgressBar";
import Button from "@/components/ui/Button";
import SurveyQuestionCard from "@/components/features/SurveyQuestionCard";
import { HrtRadioGroup } from "@/components/ui/RadioGroup";
import Skeleton from "@/components/ui/Skeleton";

const HRT_OPTIONS = [
  { value: "YES", label: "예" },
  { value: "NO", label: "아니오" },
  { value: "DONT_KNOW", label: "모르겠음" },
];

export default function HrtAbsolutePage() {
  const router = useRouter();
  const [questions, setQuestions] = useState<HrtAbsoluteQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    hrtApi.getAbsoluteQuestionnaire()
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

  const handleAnswer = (value: string) => {
    if (!currentQuestion) return;
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: value }));
  };

  const handleNext = () => {
    if (!isLastQuestion) setCurrentIndex((prev) => prev + 1);
  };

  const handlePrev = () => {
    if (currentIndex > 0) setCurrentIndex((prev) => prev - 1);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setError("");
    try {
      const answerItems: HrtAnswerItem[] = questions.map((q) => ({
        questionId: q.id,
        answer: answers[q.id] ?? "NO",
      }));
      const result = await hrtApi.submitAbsolute({ answers: answerItems });

      if (result.diagnosis.nextAction === "START_HRT_RELATIVE") {
        router.push("/survey/hrt/relative");
      } else {
        // EXPERT_CONSULTATION - redirect to chat or info page
        router.push("/chat");
      }
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
          <Skeleton variant="card" height="250px" />
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
          <Button variant="secondary" onClick={() => window.location.reload()}>다시 시도</Button>
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
            prompt={currentQuestion.prompt}
          >
            <HrtRadioGroup
              questionId={currentQuestion.id}
              options={HRT_OPTIONS}
              selectedValue={answers[currentQuestion.id] ?? null}
              onChange={handleAnswer}
              disabled={submitting}
            />
          </SurveyQuestionCard>
        )}

        {error && <p className="text-sm text-red-500 text-center">{error}</p>}

        <div className="flex gap-3">
          {currentIndex > 0 && (
            <Button variant="secondary" onClick={handlePrev} disabled={submitting} className="flex-1">이전</Button>
          )}
          {isLastQuestion ? (
            <Button variant="primary" onClick={handleSubmit} loading={submitting} disabled={!hasAnswer} className="flex-1">제출</Button>
          ) : (
            <Button variant="primary" onClick={handleNext} disabled={!hasAnswer} fullWidth={currentIndex === 0}>다음</Button>
          )}
        </div>
      </div>
    </div>
  );
}
