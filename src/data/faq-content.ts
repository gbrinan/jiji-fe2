/**
 * Hardcoded FAQ content mirroring Figma design file Z0QbepTW9xahclWA7MF0dZ
 *  - Hormone FAQ: node 3604:19216 (호르몬 FAQ)
 *  - Non-hormone FAQ: node 3577:13107 (비호르몬 FAQ)
 *
 * Only the first question of each page is shown expanded in the Figma
 * mockup, so only its answer is reproduced verbatim. The remaining
 * questions are kept in the same order as Figma, with `answer: ""`
 * rendered by the FAQ page as a "답변 준비 중입니다" placeholder.
 */

export interface HardcodedFaqItem {
  id: string;
  question: string;
  /** Verbatim Figma answer. Empty string = placeholder in UI. */
  answer: string;
  /**
   * Optional emphasis span inside the answer (rendered bold). Used for
   * Q1 of hormone FAQ ("유방암 발생이 감소").
   */
  emphasis?: string;
}

export type FaqCategoryKey = "hormonal" | "non-hormonal";

export const FAQ_CONTENT: Record<FaqCategoryKey, HardcodedFaqItem[]> = {
  // ─────────────────────────────────────────────────────────────────
  // 호르몬 FAQ — Figma node 3604:19216
  // ─────────────────────────────────────────────────────────────────
  hormonal: [
    {
      id: "hormonal-1",
      question: "호르몬제를 먹으면 유방암에 걸리나요?",
      answer:
        "자궁 유무에 따라 다릅니다. 자궁이 있으면 복합요법 복용 시 위험이 아주 조금 증가(1,000명 중 1명 미만)하지만, 자궁을 제거한 경우 에스트로겐 단독 복용은 오히려 유방암 발생이 감소합니다.",
      emphasis: "유방암 발생이 감소",
    },
    {
      id: "hormonal-2",
      question: "호르몬 치료는 언제 시작하는 것이 가장 좋나요?",
      answer: "",
    },
    {
      id: "hormonal-3",
      question: "호르몬 약을 먹고 있는데 피가 비쳐요. (부정출혈) 정상인가요?",
      answer: "",
    },
    {
      id: "hormonal-4",
      question: "호르몬제를 먹으면 갱년기 증상이 바로 좋아지나요?",
      answer: "",
    },
    {
      id: "hormonal-5",
      question: "호르몬제를 먹으면 살이 찌나요?",
      answer: "",
    },
  ],

  // ─────────────────────────────────────────────────────────────────
  // 비호르몬 FAQ — Figma node 3577:13107
  // ─────────────────────────────────────────────────────────────────
  "non-hormonal": [
    {
      id: "non-hormonal-1",
      question: "왜 호르몬 치료 대신 다른 치료를 찾나요?",
      answer:
        "호르몬 치료는 유방암 같은 병이 생길까 봐 걱정되거나, 유방 통증이나 출혈 같은 부작용 때문에 꺼리는 분들이 있어요. 그래서 호르몬이 아닌 다른 치료법에 대한 관심이 높아졌어요.",
    },
    {
      id: "non-hormonal-2",
      question: "비호르몬 치료로 안면홍조를 '완치'할 수 있나요?",
      answer: "",
    },
    {
      id: "non-hormonal-3",
      question: "안면홍조에 먹는 비호르몬 '약'도 있나요?",
      answer: "",
    },
    {
      id: "non-hormonal-4",
      question: "'생약'도 효과가 있나요?",
      answer: "",
    },
    {
      id: "non-hormonal-5",
      question: "잠을 잘 못 자는데, 이것도 비호르몬 치료가 있나요?",
      answer: "",
    },
  ],
};

export const FAQ_CATEGORY_LABELS: Record<FaqCategoryKey, string> = {
  hormonal: "호르몬 치료 FAQ",
  "non-hormonal": "비호르몬 치료 FAQ",
};

export function isFaqCategory(value: unknown): value is FaqCategoryKey {
  return value === "hormonal" || value === "non-hormonal";
}
