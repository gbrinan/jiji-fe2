"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { MrsResult, MrsNextAction } from "@/lib/types";
import { chatApi } from "@/lib/api";
import Header from "@/components/layout/Header";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import ResultDomainBar from "@/components/ui/ResultDomainBar";
import Skeleton from "@/components/ui/Skeleton";

const ACTION_CONFIG: Record<MrsNextAction, { title: string; description: string; buttonLabel: string }> = {
  EXPERT_CONSULTATION: {
    title: "전문의 상담 필요",
    description: "증상의 정도가 높아 전문의 상담을 권장합니다.",
    buttonLabel: "전문의 상담 안내",
  },
  CBT_GUIDANCE: {
    title: "인지행동치료 안내",
    description: "인지행동치료를 통해 증상을 개선할 수 있습니다.",
    buttonLabel: "인지행동치료 시작",
  },
  START_HRT_ABSOLUTE: {
    title: "호르몬 치료 적합성 검사",
    description: "호르몬 치료가 적합한지 추가 검사를 진행합니다.",
    buttonLabel: "적합성 검사 시작",
  },
  NON_HORMONAL_QA: {
    title: "비호르몬 치료 안내",
    description: "호르몬 외 다른 치료 방법을 안내해 드립니다.",
    buttonLabel: "비호르몬 치료 알아보기",
  },
  LIFESTYLE_GUIDANCE: {
    title: "생활습관 개선 안내",
    description: "생활습관 개선으로 증상을 완화할 수 있습니다.",
    buttonLabel: "생활습관 안내 시작",
  },
};

const severityVariant = (label: string) => {
  if (label.includes("정상")) return "normal" as const;
  if (label.includes("경도")) return "mild" as const;
  if (label.includes("중등")) return "moderate" as const;
  return "severe" as const;
};

export default function ResultPage() {
  const router = useRouter();
  const [result, setResult] = useState<MrsResult | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem("mrsResult");
    if (stored) {
      try {
        setResult(JSON.parse(stored));
      } catch {
        router.replace("/survey/mrs");
      }
    } else {
      router.replace("/survey/mrs");
    }
  }, [router]);

  const handleAction = async () => {
    if (!result) return;
    const { nextAction } = result.diagnosis;

    if (nextAction === "START_HRT_ABSOLUTE") {
      router.push("/survey/hrt/absolute");
      return;
    }

    // For chat-based actions, create a session and navigate
    if (nextAction === "EXPERT_CONSULTATION") {
      // Show info - could also create a chat session
      router.push("/chat");
      return;
    }

    setActionLoading(true);
    try {
      const session = await chatApi.createSession({
        context: "result",
        surveyResultId: String(result.id),
      });
      router.push(`/chat/${session.id}`);
    } catch {
      setActionLoading(false);
    }
  };

  if (!result) {
    return (
      <div>
        <Header title="검사 결과" showBackButton />
        <div className="px-5 py-6 flex flex-col gap-4">
          <Skeleton variant="card" height="200px" />
          <Skeleton variant="card" height="150px" />
        </div>
      </div>
    );
  }

  const { diagnosis, symptoms } = result;
  const action = ACTION_CONFIG[diagnosis.nextAction];

  return (
    <div className="min-h-dvh bg-gradient-to-b from-blue-50 to-white">
      <Header title="검사 결과" showBackButton />

      <div className="px-5 py-6 flex flex-col gap-4">
        {/* Score Summary Card */}
        <Card variant="elevated" padding="lg">
          <div className="text-center">
            <p className="text-[28px] font-bold text-gray-900">
              {diagnosis.summaryScore}
              <span className="text-lg font-normal text-gray-500">/{diagnosis.totalPossibleScore}</span>
            </p>
            <div className="flex justify-center gap-2 mt-3">
              <Badge variant={severityVariant(diagnosis.severityLabel)} label={diagnosis.severityLabel} />
            </div>
            {diagnosis.topPercentileLabel && (
              <p className="text-sm text-gray-500 mt-2">{diagnosis.topPercentileLabel}</p>
            )}
          </div>
        </Card>

        {/* Domain Breakdown Card */}
        <Card variant="default" padding="lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">영역별 점수</h3>
          <div className="flex flex-col gap-4">
            <ResultDomainBar
              label="신체 증상"
              score={symptoms.physical.score}
              total={symptoms.physical.total}
              color="bg-domain-physical"
            />
            <ResultDomainBar
              label="심리 증상"
              score={symptoms.psychological.score}
              total={symptoms.psychological.total}
              color="bg-domain-psychological"
            />
            <ResultDomainBar
              label="비뇨기 증상"
              score={symptoms.urinary.score}
              total={symptoms.urinary.total}
              color="bg-domain-urogenital"
            />
          </div>
        </Card>

        {/* Next Action Card */}
        <Card variant="default" padding="lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{action.title}</h3>
          <p className="text-base text-gray-600 mb-4">{action.description}</p>
          <Button variant="primary" fullWidth onClick={handleAction} loading={actionLoading}>
            {action.buttonLabel}
          </Button>
        </Card>
      </div>
    </div>
  );
}
