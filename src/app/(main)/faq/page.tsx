"use client";

import { useState, useEffect } from "react";
import { faqApi } from "@/lib/api";
import type { FaqResponse } from "@/lib/types";
import Header from "@/components/layout/Header";
import Skeleton from "@/components/ui/Skeleton";
import { ChevronDown } from "lucide-react";

export default function FaqPage() {
  const [faqs, setFaqs] = useState<FaqResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [openId, setOpenId] = useState<string | null>(null);

  useEffect(() => {
    faqApi.getAll()
      .then(setFaqs)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-dvh bg-figma-gradient flex flex-col">
      <Header showBackButton showHomeButton showProfileIcons transparent />

      {/* FAQ label */}
      <div className="flex justify-center mb-4">
        <span className="bg-white/60 backdrop-blur-sm rounded-full px-6 py-1.5 text-sm font-medium text-gray-700">FAQ</span>
      </div>

      <div className="px-5 flex-1">
        {loading ? (
          <div className="flex flex-col gap-3">
            {Array.from({ length: 5 }, (_, i) => <Skeleton key={i} variant="card" height="56px" />)}
          </div>
        ) : faqs.length === 0 ? (
          <p className="text-center text-gray-500 py-12">등록된 FAQ가 없습니다</p>
        ) : (
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl border border-[#fafafa] overflow-hidden">
            {faqs.map((faq, index) => (
              <div key={faq.id} className={index > 0 ? "border-t border-gray-100" : ""}>
                <button
                  onClick={() => setOpenId(openId === faq.id ? null : faq.id)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left"
                >
                  <span className="text-base font-medium text-gray-900 flex-1 pr-2">
                    <span className="text-primary-500 font-semibold">Q. </span>
                    {faq.question}
                  </span>
                  <ChevronDown className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform duration-200 ${openId === faq.id ? "rotate-180" : ""}`} />
                </button>
                {openId === faq.id && (
                  <div className="px-5 pb-4">
                    <div className="bg-blue-50/50 rounded-xl p-4">
                      <p className="text-base text-gray-700 leading-relaxed whitespace-pre-wrap">{faq.answer}</p>
                    </div>
                    {faq.dataBox && (
                      <div className="mt-3 bg-blue-50 rounded-xl p-4">
                        <p className="text-sm font-semibold text-primary-600 mb-2">{faq.dataBox.title}</p>
                        <ul className="list-disc pl-4 space-y-1">
                          {faq.dataBox.items.map((item, i) => (
                            <li key={i} className="text-sm text-gray-700">{item}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
