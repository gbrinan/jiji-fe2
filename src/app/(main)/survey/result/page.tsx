"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { MrsResult, MrsNextAction } from "@/lib/types";
import Header from "@/components/layout/Header";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";

const severityVariant = (label: string) => {
  if (label.includes("정상") || label.includes("없")) return "normal" as const;
  if (label.includes("경")) return "mild" as const;
  if (label.includes("중등")) return "moderate" as const;
  return "severe" as const;
};

const nextActionInfo: Record<MrsNextAction, { label: string; description: string }> = {
  EXPERT_CONSULTATION: { label: "전문의 상담 필요", description: "증상이 심하여 전문의 상담을 권장합니다." },
  CBT_GUIDANCE: { label: "인지행동치료 안내", description: "인지행동치료를 통해 증상을 관리할 수 있습니다." },
  START_HRT_ABSOLUTE: { label: "호르몬 치료 적합성 검사", description: "호르몬 치료 가능 여부를 확인합니다." },
  NON_HORMONAL_QA: { label: "비호르몬 치료 안내", description: "호르몬 외 치료 방법을 안내합니다." },
  LIFESTYLE_GUIDANCE: { label: "생활습관 개선 안내", description: "생활습관 개선으로 증상 완화가 가능합니다." },
};

function DomainBar({ label, score, total, color }: { label: string; score: number; total: number; color: string }) {
  const pct = total > 0 ? (score / total) * 100 : 0;
  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between text-sm">
        <span className="font-medium text-gray-700">{label}</span>
        <span className="font-semibold text-gray-900">{score}/{total}</span>
      </div>
      <div className="h-3 bg-gray-100 rounded-full">
        <div className="h-3 rounded-full transition-all duration-500" style={{ width: `${pct}%`, backgroundColor: color }} />
      </div>
    </div>
  );
}

export default function ResultPage() {
  const router = useRouter();
  const [result, setResult] = useState<MrsResult | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem("mrs_result");
    if (stored) {
      setResult(JSON.parse(stored));
    }
  }, []);

  if (!result) {
    return (
      <div>
        <Header title="검사 결과" showBackButton />
        <div className="px-5 pt-8 text-center text-gray-500">결과 데이터가 없습니다.</div>
      </div>
    );
  }

  const { diagnosis, symptoms } = result;
  const action = nextActionInfo[diagnosis.nextAction];

  function handleAction() {
    if (diagnosis.nextAction === "START_HRT_ABSOLUTE") {
      router.push("/survey/hrt-absolute");
    } else {
      router.push("/chat");
    }
  }

  return (
    <div className="min-h-dvh flex flex-col">
      <Header title="검사 결과" showBackButton />
      <div className="px-5 pt-4 flex-1 flex flex-col gap-4">
        <Card variant="elevated" padding="lg">
          <div className="text-center">
            <p className="text-[28px] font-bold text-gray-900">
              {diagnosis.summaryScore}
              <span className="text-lg font-normal text-gray-400">/{diagnosis.totalPossibleScore}</span>
            </p>
            <Badge variant={severityVariant(diagnosis.severityLabel)} label={diagnosis.severityLabel} />
            <p className="text-sm text-gray-500 mt-2">{diagnosis.topPercentileLabel}</p>
          </div>
        </Card>

        <Card variant="outlined" padding="lg">
          <h3 className="text-base font-semibold text-gray-900 mb-4">영역별 점수</h3>
          <div className="flex flex-col gap-4">
            <DomainBar label="신체 증상" score={symptoms.physical.score} total={symptoms.physical.total} color="#4A90D9" />
            <DomainBar label="심리 증상" score={symptoms.psychological.score} total={symptoms.psychological.total} color="#8B5CF6" />
            <DomainBar label="비뇨기 증상" score={symptoms.urinary.score} total={symptoms.urinary.total} color="#EC4899" />
          </div>
        </Card>

        <Card variant="elevated" padding="lg">
          <h3 className="text-base font-semibold text-gray-900 mb-2">{action.label}</h3>
          <p className="text-sm text-gray-600 mb-4">{action.description}</p>
          <Button fullWidth onClick={handleAction}>{action.label}</Button>
        </Card>
      </div>
    </div>
  );
}
