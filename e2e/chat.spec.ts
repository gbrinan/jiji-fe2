import { test, expect } from "@playwright/test";
import { mockSupabaseAuth, mockProfileApi, mockChatApi } from "./helpers";

test.describe("Chat Session List", () => {
  test.beforeEach(async ({ page }) => {
    await mockSupabaseAuth(page);
    await mockProfileApi(page);
    await mockChatApi(page);
    await page.goto("/chat");
  });

  test("renders session list with context labels", async ({ page }) => {
    await expect(page.getByText("검사 결과 상담")).toBeVisible();
    await expect(page.getByText("FAQ 상담")).toBeVisible();
  });

  test("shows 새 상담 시작 button", async ({ page }) => {
    await expect(page.getByRole("button", { name: "새 상담 시작" })).toBeVisible();
  });

  test("completed session shows 완료 badge", async ({ page }) => {
    await expect(page.getByText("완료")).toBeVisible();
  });

  test("clicking a session triggers navigation to chat detail", async ({ page }) => {
    // Mock the chat detail API for sess-001
    await page.route("**/chats/sessions/sess-001", (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          id: "sess-001",
          userId: "user-001",
          surveyResultId: null,
          context: "result",
          startedAt: "2025-06-01T09:00:00Z",
          endedAt: null,
        }),
      })
    );
    await page.route("**/chats/sessions/sess-001/messages", (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: "[]",
      })
    );

    await page.getByText("검사 결과 상담").click();
    await page.waitForURL(/\/chat\/sess-001/, { timeout: 10000 });
  });

  test("새 상담 시작 creates session and triggers navigation", async ({ page }) => {
    // Mock the new session's detail endpoints
    await page.route("**/chats/sessions/sess-003", (route) =>
      route.fulfill({
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
      })
    );
    await page.route("**/chats/sessions/sess-003/messages", (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: "[]",
      })
    );

    await page.getByRole("button", { name: "새 상담 시작" }).click();
    await page.waitForURL(/\/chat\/sess-003/, { timeout: 10000 });
  });
});

test.describe("Chat Session List - Empty State", () => {
  test("shows empty state when no sessions", async ({ page }) => {
    await mockSupabaseAuth(page);
    await mockProfileApi(page);

    await page.route(
      "https://jiji-production-ee02.up.railway.app/chats/sessions",
      (route) => {
        if (route.request().method() === "GET") {
          return route.fulfill({
            status: 200,
            contentType: "application/json",
            body: "[]",
          });
        }
        return route.continue();
      }
    );

    await page.goto("/chat");
    await expect(page.getByText("아직 상담 내역이 없습니다")).toBeVisible();
  });
});
