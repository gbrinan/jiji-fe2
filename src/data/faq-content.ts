/**
 * Hardcoded FAQ content.
 *
 *  - Q1 of each category is reproduced verbatim from Figma design file
 *    Z0QbepTW9xahclWA7MF0dZ (호르몬 FAQ node 3604:19216, 비호르몬 FAQ
 *    node 3577:13107). The Figma mockups only render Q1 in the expanded
 *    state, so Q2~Q5 answers are authored here based on established
 *    guidelines:
 *      - NAMS 2022 Position Statement on Hormone Therapy
 *      - 대한폐경학회 2020 치료지침 (Korean Society of Menopause)
 *      - ACOG Practice Bulletin — Hormone Therapy
 *      - U.S. FDA non-hormonal approvals (2023, fezolinetant)
 *  - Every non-Figma answer ends with a "주치의 상담" safety clause.
 *  - Medical review is pending; treat Q2~Q5 as editorial placeholder
 *    until clinical reviewer approval.
 */

export interface HardcodedFaqItem {
  id: string;
  question: string;
  /** Full answer. Q1 is verbatim from Figma; Q2~Q5 are guideline-based. */
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
  // 호르몬 FAQ — Figma node 3604:19216 (Q1), guideline-based (Q2~Q5)
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
      answer:
        "일반적으로 폐경 후 10년 이내 또는 60세 이전에 시작할 때 이득이 가장 크고 위험은 가장 낮다고 알려져 있어요. 이 시기를 '기회의 창(window of opportunity)'이라고 부릅니다. 본인에게 맞는 시작 시점은 주치의와 상담해 정하시는 것이 좋아요.",
    },
    {
      id: "hormonal-3",
      question: "호르몬 약을 먹고 있는데 피가 비쳐요. (부정출혈) 정상인가요?",
      answer:
        "복용 초기 3~6개월에는 일시적인 부정출혈이 비교적 흔하게 나타날 수 있어요. 하지만 6개월 이후에도 지속되거나, 양이 많거나, 폐경 이후 다시 피가 비치는 경우에는 반드시 주치의 진료를 받으셔야 합니다.",
    },
    {
      id: "hormonal-4",
      question: "호르몬제를 먹으면 갱년기 증상이 바로 좋아지나요?",
      answer:
        "안면홍조·수면 장애 같은 혈관운동 증상은 보통 2~4주 내에 완화되기 시작하고, 8~12주면 충분한 효과를 느끼는 경우가 많아요. 질 건조감 같은 비뇨생식기 증상은 조금 더 시간이 걸릴 수 있어요. 효과가 부족하다면 용량 조정을 주치의와 상의하세요.",
    },
    {
      id: "hormonal-5",
      question: "호르몬제를 먹으면 살이 찌나요?",
      answer:
        "호르몬 치료 자체가 직접적으로 체중을 증가시킨다는 근거는 약합니다. 폐경기에는 호르몬 변화와 근육량 감소, 기초대사량 저하로 체중이 늘기 쉬운데, 이는 호르몬제 때문이 아니라 자연스러운 변화예요. 규칙적인 운동과 식이 관리가 함께 이뤄질 때 체중 유지에 더 도움이 됩니다.",
    },
  ],

  // ─────────────────────────────────────────────────────────────────
  // 비호르몬 FAQ — Figma node 3577:13107 (Q1), guideline-based (Q2~Q5)
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
      answer:
        "'완치'보다는 증상을 줄여주는 것이 목표예요. 비호르몬 치료는 안면홍조 빈도와 강도를 보통 40~60% 정도 감소시키는 것으로 보고되며, 호르몬 치료(70~90% 감소)보다는 효과가 다소 낮아요. 완전히 없어지지 않더라도 일상이 편해지는 정도를 목표로 해요.",
    },
    {
      id: "non-hormonal-3",
      question: "안면홍조에 먹는 비호르몬 '약'도 있나요?",
      answer:
        "네, 있어요. 저용량 항우울제(SSRI/SNRI 계열: 파록세틴·벤라팍신 등), 가바펜틴, 클로니딘이 오랫동안 사용되어 왔고, 2023년에는 안면홍조 전용 비호르몬 약 페졸리네탄트(fezolinetant)가 미국 FDA 승인을 받았어요. 모두 처방이 필요하므로 본인에게 맞는 약은 주치의와 상담해 결정하세요.",
    },
    {
      id: "non-hormonal-4",
      question: "'생약'도 효과가 있나요?",
      answer:
        "블랙코호시·콩(이소플라본)·승마 추출물 등이 일부 연구에서 경미한 효과를 보였지만, 근거 수준은 제한적이에요. 드물게 간 기능 이상 같은 부작용이 보고되기도 하고, 복용 중인 다른 약과 상호작용이 있을 수 있어서 복용 전 반드시 주치의 상담이 필요합니다.",
    },
    {
      id: "non-hormonal-5",
      question: "잠을 잘 못 자는데, 이것도 비호르몬 치료가 있나요?",
      answer:
        "네, 갱년기 수면 장애에는 불면증 인지행동치료(CBT-I)가 가장 효과적이고 안전한 1차 치료로 권장돼요. 이외에 저용량 가바펜틴이나 일부 항우울제도 도움이 될 수 있어요. 취침 시간 규칙화·카페인 제한 같은 수면 위생 개선을 먼저 시도한 뒤, 효과가 부족하면 주치의와 상의하세요.",
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
