"use client";

import { ChevronDown } from "lucide-react";

interface AccordionProps {
  question: string;
  answer: string;
  dataBox?: { title: string; items: string[] } | null;
  footerMessage?: string | null;
  isOpen: boolean;
  onToggle: () => void;
}

export default function Accordion({
  question,
  answer,
  dataBox,
  footerMessage,
  isOpen,
  onToggle,
}: AccordionProps) {
  const panelId = `accordion-panel-${question.slice(0, 20).replace(/\s/g, "-")}`;

  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
      <button
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={panelId}
        className="flex justify-between items-center w-full px-4 py-4 min-h-[56px] text-left"
      >
        <span className="text-base font-medium text-gray-900 flex-1 pr-2">{question}</span>
        <ChevronDown
          className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>
      {isOpen && (
        <div id={panelId} className="px-4 pb-4">
          <p className="text-base text-gray-600">{answer}</p>
          {dataBox && (
            <div className="mt-3 bg-blue-50 rounded-lg p-4">
              <p className="text-sm font-semibold text-primary-600 mb-2">{dataBox.title}</p>
              <ul className="list-disc pl-4 space-y-1">
                {dataBox.items.map((item, i) => (
                  <li key={i} className="text-sm text-gray-700">{item}</li>
                ))}
              </ul>
            </div>
          )}
          {footerMessage && (
            <p className="mt-3 text-sm text-gray-500 italic">{footerMessage}</p>
          )}
        </div>
      )}
    </div>
  );
}
