"use client";

import { useState, useEffect } from "react";
import { faqApi } from "@/lib/api";
import type { FaqResponse } from "@/lib/types";
import Header from "@/components/layout/Header";
import Accordion from "@/components/ui/Accordion";
import Skeleton from "@/components/ui/Skeleton";

export default function FaqPage() {
  const [faqs, setFaqs] = useState<FaqResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [openId, setOpenId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    faqApi.getAll(selectedCategory ?? undefined)
      .then(setFaqs)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [selectedCategory]);

  // Extract unique categories
  const categories = Array.from(new Set(faqs.map((f) => f.category).filter(Boolean))) as string[];

  return (
    <div className="min-h-dvh bg-gradient-to-b from-blue-50 to-white">
      <Header title="자주 묻는 질문" />

      <div className="px-5 py-6">
        {/* Category filter */}
        {categories.length > 0 && (
          <div className="flex gap-2 overflow-x-auto pb-4 -mx-5 px-5 scrollbar-hide">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap flex-shrink-0 transition-colors
                ${!selectedCategory ? "bg-primary-500 text-white" : "bg-white text-gray-600 border border-gray-200"}`}
            >
              전체
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap flex-shrink-0 transition-colors
                  ${selectedCategory === cat ? "bg-primary-500 text-white" : "bg-white text-gray-600 border border-gray-200"}`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* FAQ list */}
        <div className="flex flex-col gap-3">
          {loading ? (
            Array.from({ length: 5 }, (_, i) => <Skeleton key={i} variant="card" height="56px" />)
          ) : faqs.length === 0 ? (
            <p className="text-center text-gray-500 py-12">등록된 FAQ가 없습니다</p>
          ) : (
            faqs.map((faq) => (
              <Accordion
                key={faq.id}
                question={faq.question}
                answer={faq.answer}
                dataBox={faq.dataBox}
                footerMessage={faq.footerMessage}
                isOpen={openId === faq.id}
                onToggle={() => setOpenId(openId === faq.id ? null : faq.id)}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
