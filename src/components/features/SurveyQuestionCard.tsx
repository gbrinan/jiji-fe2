import Badge from "@/components/ui/Badge";
import type { MrsDomain } from "@/lib/types";

interface SurveyQuestionCardProps {
  questionNumber: number;
  totalQuestions: number;
  domain?: MrsDomain;
  prompt: string;
  children: React.ReactNode;
}

const domainLabels: Record<MrsDomain, { label: string; variant: "somatic" | "psychological" | "urogenital" }> = {
  SOMATIC: { label: "신체", variant: "somatic" },
  PSYCHOLOGICAL: { label: "심리", variant: "psychological" },
  UROGENITAL: { label: "비뇨기", variant: "urogenital" },
};

export default function SurveyQuestionCard({
  questionNumber,
  totalQuestions,
  domain,
  prompt,
  children,
}: SurveyQuestionCardProps) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-sm text-gray-400">Q{questionNumber}/{totalQuestions}</span>
        {domain && domainLabels[domain] && (
          <Badge variant={domainLabels[domain].variant} label={domainLabels[domain].label} size="sm" />
        )}
      </div>
      <p id={`question-${questionNumber}`} className="text-lg font-medium text-gray-900 mb-6">
        {prompt}
      </p>
      {children}
    </div>
  );
}
