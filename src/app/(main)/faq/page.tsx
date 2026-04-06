"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import type { FaqResponse } from "@/lib/types";
import Header from "@/components/layout/Header";
import Skeleton from "@/components/ui/Skeleton";
import { ChevronDown } from "lucide-react";

function FaqItem({ faq }: { faq: FaqResponse }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="flex justify-between items-center w-full px-4 py-4 min-h-[56px] text-left"
        aria-expanded={open}
      >
        <span className="text-base font-medium text-gray-900 flex-1 pr-2">{faq.question}</span>
        <ChevronDown className={`w-5 h-5 text-gray-400 shrink-0 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="px-4 pb-4">
          <p className="text-base text-gray-600">{faq.answer}</p>
          {faq.dataBox && (
            <div className="mt-3 bg-blue-50 rounded-lg p-4">
              <p className="text-sm font-semibold text-primary-600 mb-2">{faq.dataBox.title}</p>
              <ul className="list-disc pl-4 text-sm text-gray-700 space-y-1">
                {faq.dataBox.items.map((item, i) => <li key={i}>{item}</li>)}
              </ul>
            </div>
          )}
          {faq.footerMessage && (
            <p className="mt-3 text-sm text-gray-500 italic">{faq.footerMessage}</p>
          )}
        </div>
      )}
    </div>
  );
}

export default function FaqPage() {
  const [faqs, setFaqs] = useState<FaqResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<FaqResponse[]>("/api/v1/chats/faq")
      .then(setFaqs)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-dvh flex flex-col">
      <Header title="자주 묻는 질문" />
      <div className="px-5 pt-4 flex-1 flex flex-col gap-3">
        {loading ? (
          Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} variant="card" className="h-14" />)
        ) : faqs.length === 0 ? (
          <div className="text-center py-12 text-gray-400">등록된 FAQ가 없습니다.</div>
        ) : (
          faqs.map((faq) => <FaqItem key={faq.id} faq={faq} />)
        )}
      </div>
    </div>
  );
}
