"use client";

import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Header from "@/components/layout/Header";
import { ChevronUp, ChevronDown } from "lucide-react";
import {
  FAQ_CONTENT,
  FAQ_CATEGORY_LABELS,
  isFaqCategory,
  type HardcodedFaqItem,
} from "@/data/faq-content";

const ANSWER_PENDING = "답변 준비 중입니다.";

/**
 * Render the answer text. If the Figma node provided an `emphasis`
 * substring, render it bold — otherwise plain text. Empty answer →
 * placeholder message.
 */
function AnswerText({ item }: { item: HardcodedFaqItem }) {
  if (!item.answer) {
    return (
      <p className="text-[18px] font-medium leading-7 text-slate-400">
        {ANSWER_PENDING}
      </p>
    );
  }

  if (item.emphasis && item.answer.includes(item.emphasis)) {
    const [before, after] = item.answer.split(item.emphasis);
    return (
      <p className="text-[18px] font-medium leading-7 text-slate-700 whitespace-pre-wrap">
        {before}
        <span className="font-bold">{item.emphasis}</span>
        {after}
      </p>
    );
  }

  return (
    <p className="text-[18px] font-medium leading-7 text-slate-700 whitespace-pre-wrap">
      {item.answer}
    </p>
  );
}

function FaqContent() {
  const searchParams = useSearchParams();
  const rawCategory = searchParams.get("category");
  const category = isFaqCategory(rawCategory) ? rawCategory : "non-hormonal";
  // Default heading shown when /faq is opened with no category — falls
  // back to generic "FAQ" pill until user branches from a survey flow.
  const headingLabel = rawCategory
    ? FAQ_CATEGORY_LABELS[category]
    : "FAQ";

  const items = useMemo(() => FAQ_CONTENT[category], [category]);
  const [openIds, setOpenIds] = useState<Set<string>>(
    () => new Set([items[0]?.id].filter(Boolean) as string[]),
  );

  const toggleId = (id: string) => {
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="min-h-dvh bg-figma-gradient flex flex-col">
      <Header showBackButton showHomeButton showProfileIcons transparent />

      {/* FAQ pill label — reflects selected category */}
      <div className="flex justify-center mb-4">
        <span className="bg-black/5 rounded-full px-3 py-1 shadow-sm text-sm font-medium text-slate-700 tracking-[0.21px]">
          {headingLabel}
        </span>
      </div>

      <div className="px-4 flex-1 pb-8">
        <div className="bg-white rounded-3xl border border-[#fafafa] shadow-md px-[9px] pt-[13px] pb-[21px] flex flex-col gap-4">
          {items.map((item) => {
            const isOpen = openIds.has(item.id);
            return (
              <div key={item.id}>
                {/* Question row */}
                <button
                  onClick={() => toggleId(item.id)}
                  className="w-full flex items-center gap-1 min-h-[36px] px-1 py-[7.5px] text-left"
                >
                  <p
                    className={`flex-1 text-[18px] font-semibold leading-7 tracking-[0px] ${
                      isOpen ? "text-primary-600" : "text-gray-900"
                    }`}
                  >
                    <span className="text-primary-600">Q. </span>
                    {item.question}
                  </p>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-primary-600 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  )}
                </button>

                {/* Answer area with left blue border */}
                {isOpen && (
                  <div className="pl-2 mt-2">
                    <div className="border-l-2 border-primary-500 pl-[14px]">
                      <AnswerText item={item} />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function FaqPage() {
  return (
    <Suspense fallback={<div className="min-h-dvh bg-figma-gradient" />}>
      <FaqContent />
    </Suspense>
  );
}
