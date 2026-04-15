import { Page, BrowserContext } from "@playwright/test";

const API_URL = "https://jiji-production-ee02.up.railway.app";
const SUPABASE_URL = "https://hoyqduezzqmmsugwatpy.supabase.co";
const SUPABASE_REF = "hoyqduezzqmmsugwatpy";
const COOKIE_NAME = `sb-${SUPABASE_REF}-auth-token`;

const MOCK_USER = {
  id: "user-001",
  aud: "authenticated",
  role: "authenticated",
  email: "test@jiji.kr",
  email_confirmed_at: "2025-01-01T00:00:00Z",
  app_metadata: { provider: "email", providers: ["email"] },
  user_metadata: {},
  created_at: "2025-01-01T00:00:00Z",
  updated_at: "2025-01-01T00:00:00Z",
};

const MOCK_SESSION = {
  access_token: "mock-access-token",
  token_type: "bearer",
  expires_in: 3600,
  expires_at: Math.floor(Date.now() / 1000) + 3600,
  refresh_token: "mock-refresh-token",
  user: MOCK_USER,
};

/**
 * @supabase/ssr createBrowserClient uses document.cookie with base64url encoding.
 * The cookie value is: "base64-" + base64url(JSON.stringify(session))
 */
function encodeSessionForCookie(session: object): string {
  const json = JSON.stringify(session);
  // base64url encode (browser-compatible)
  const base64 = Buffer.from(json, "utf-8").toString("base64url");
  return `base64-${base64}`;
}

/**
 * Mock Supabase auth: set cookie + intercept auth API endpoints.
 */
export async function mockSupabaseAuth(page: Page) {
  // 1. Intercept ALL Supabase auth REST API calls
  await page.route(`${SUPABASE_URL}/auth/v1/**`, (route) => {
    const url = route.request().url();

    if (url.includes("/auth/v1/token")) {
      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(MOCK_SESSION),
      });
    }

    if (url.includes("/auth/v1/user")) {
      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(MOCK_USER),
      });
    }

    if (url.includes("/auth/v1/signup")) {
      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(MOCK_SESSION),
      });
    }

    if (url.includes("/auth/v1/logout")) {
      return route.fulfill({ status: 204, body: "" });
    }

    return route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(MOCK_SESSION),
    });
  });

  // 2. Set the session cookie via document.cookie before page JS runs
  const encodedSession = encodeSessionForCookie(MOCK_SESSION);
  await page.addInitScript({
    content: `
      document.cookie = "${COOKIE_NAME}=${encodedSession}; path=/; max-age=34560000; samesite=lax";
    `,
  });
}

/** Mock the profile API endpoint */
export async function mockProfileApi(page: Page) {
  await page.route(`${API_URL}/api/v1/users/me`, (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        id: "user-001",
        email: "test@jiji.kr",
        name: "테스트",
        birthDate: "1975-03-15",
        height: 162,
        weight: 55,
        createdAt: "2025-01-01T00:00:00Z",
        updatedAt: "2025-01-01T00:00:00Z",
      }),
    })
  );
}

/** Mock MRS questionnaire and submit endpoints */
export async function mockMrsApi(page: Page) {
  await page.route(`${API_URL}/api/v1/survey/mrs`, (route) => {
    if (route.request().method() === "GET") {
      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          type: "MRS",
          title: "갱년기 증상 평가",
          version: 1,
          questions: Array.from({ length: 11 }, (_, i) => ({
            id: i + 1,
            domain: i < 4 ? "SOMATIC" : i < 7 ? "PSYCHOLOGICAL" : "UROGENITAL",
            prompt: `테스트 질문 ${i + 1}`,
            answer: { type: "NUMBER", options: [0, 1, 2, 3, 4] },
          })),
        }),
      });
    }
    // POST — submit
    return route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        id: 1,
        diagnosis: {
          summaryScore: 12,
          severityLabel: "moderate",
          totalPossibleScore: 44,
          topPercentileLabel: "상위 30%",
          nextAction: "START_HRT_ABSOLUTE",
        },
        symptoms: {
          physical: { score: 5, total: 16 },
          psychological: { score: 4, total: 16 },
          urinary: { score: 3, total: 12 },
        },
      }),
    });
  });
}

/** Mock chat session list and creation */
export async function mockChatApi(page: Page) {
  await page.route(`${API_URL}/chats/sessions`, (route) => {
    if (route.request().method() === "GET") {
      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([
          {
            id: "sess-001",
            userId: "user-001",
            surveyResultId: null,
            context: "result",
            startedAt: "2025-06-01T09:00:00Z",
            endedAt: null,
          },
          {
            id: "sess-002",
            userId: "user-001",
            surveyResultId: null,
            context: "faq",
            startedAt: "2025-05-28T14:00:00Z",
            endedAt: "2025-05-28T15:00:00Z",
          },
        ]),
      });
    }
    // POST — create session
    return route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        id: "sess-003",
        userId: "user-001",
        surveyResultId: null,
        context: "question",
        startedAt: new Date().toISOString(),
        endedAt: null,
      }),
    });
  });
}

/** Mock FAQ endpoint */
export async function mockFaqApi(page: Page) {
  await page.route(`${API_URL}/api/v1/chats/faq`, (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify([
        {
          id: "faq-001",
          question: "갱년기 증상은 언제부터 시작되나요?",
          answer: "갱년기 증상은 보통 45-55세 사이에 시작됩니다.",
          dataBox: null,
          footerType: null,
          footerMessage: null,
          category: "general",
          orderIndex: 1,
        },
        {
          id: "faq-002",
          question: "호르몬 치료는 안전한가요?",
          answer: "전문의와 상담 후 개인에 맞는 치료를 결정하는 것이 중요합니다.",
          dataBox: {
            title: "HRT 관련 통계",
            items: ["5년 미만 사용 시 안전성 확인", "정기 검진 필수"],
          },
          footerType: null,
          footerMessage: null,
          category: "treatment",
          orderIndex: 2,
        },
      ]),
    })
  );
}
