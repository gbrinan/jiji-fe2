"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { faqApi } from "@/lib/api";
import type { FaqResponse } from "@/lib/types";
import Header from "@/components/layout/Header";
import Skeleton from "@/components/ui/Skeleton";
import { ChevronUp, ChevronDown } from "lucide-react";

const CATEGORY_LABELS: Record<string, string> = {
  hormonal: "호르몬 치료 FAQ",
  "non-hormonal": "비호르몬 치료 FAQ",
  lifestyle: "생활 습관 FAQ",
};

function FaqContent() {
  const searchParams = useSearchParams();
  const category = searchParams.get("category") || undefined;
  const headingLabel = (category && CATEGORY_LABELS[category]) || "FAQ";

  const [faqs, setFaqs] = useState<FaqResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [openIds, setOpenIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    setLoading(true);
    faqApi
      .getAll(category)
      .then(setFaqs)
      .catch(() => setFaqs([]))
      .finally(() => setLoading(false));
  }, [category]);

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

      {/* FAQ pill label — changes with selected category */}
      <div className="flex justify-center mb-4">
        <span className="bg-black/5 rounded-full px-3 py-1 shadow-sm text-sm font-medium text-slate-700 tracking-[0.21px]">
          {headingLabel}
        </span>
      </div>

      <div className="px-4 flex-1 pb-8">
        {loading ? (
          <div className="flex flex-col gap-3">
            {Array.from({ length: 5 }, (_, i) => <Skeleton key={i} variant="card" height="56px" />)}
          </div>
        ) : faqs.length === 0 ? (
          <p className="text-center text-gray-500 py-12">등록된 FAQ가 없습니다</p>
        ) : (
          <div className="bg-white rounded-3xl border border-[#fafafa] shadow-md px-[9px] pt-[13px] pb-[21px] flex flex-col gap-4">
            {faqs.map((faq) => {
              const isOpen = openIds.has(faq.id);
              return (
                <div key={faq.id}>
                  {/* Question row */}
                  <button
                    onClick={() => toggleId(faq.id)}
                    className="w-full flex items-center gap-1 min-h-[36px] px-1 py-[7.5px] text-left"
                  >
                    <p className={`flex-1 text-[18px] font-semibold leading-7 tracking-[0px] ${isOpen ? "text-primary-600" : "text-gray-900"}`}>
                      <span className="text-primary-600">Q. </span>
                      {faq.question}
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
                        <p className="text-[18px] font-medium leading-7 text-slate-700 whitespace-pre-wrap">
                          {faq.answer}
                        </p>
                      </div>
                      {faq.dataBox && (
                        <div className="border-l-2 border-primary-500 pl-[14px] mt-2">
                          <p className="text-base font-semibold text-primary-600 mb-1">{faq.dataBox.title}</p>
                          <ul className="list-disc pl-4 space-y-1">
                            {faq.dataBox.items.map((item, i) => (
                              <li key={i} className="text-base text-slate-700">{item}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
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
