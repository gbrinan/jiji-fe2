import { test, expect } from "@playwright/test";
import { mockSupabaseAuth, mockProfileApi, mockFaqApi } from "./helpers";

test.describe("FAQ Page", () => {
  test.beforeEach(async ({ page }) => {
    await mockSupabaseAuth(page);
    await mockProfileApi(page);
    await mockFaqApi(page);
    await page.goto("/faq");
  });

  test("renders FAQ pill label", async ({ page }) => {
    await expect(page.locator("span:has-text('FAQ')").first()).toBeVisible();
  });

  test("renders FAQ questions", async ({ page }) => {
    await expect(page.getByText("갱년기 증상은 언제부터 시작되나요?")).toBeVisible();
    await expect(page.getByText("호르몬 치료는 안전한가요?")).toBeVisible();
  });

  test("questions start collapsed", async ({ page }) => {
    // Answers should not be visible initially
    await expect(
      page.getByText("갱년기 증상은 보통 45-55세 사이에 시작됩니다.")
    ).not.toBeVisible();
  });

  test("clicking a question expands the answer", async ({ page }) => {
    await page.getByText("갱년기 증상은 언제부터 시작되나요?").click();

    await expect(
      page.getByText("갱년기 증상은 보통 45-55세 사이에 시작됩니다.")
    ).toBeVisible();
  });

  test("answer has blue left border", async ({ page }) => {
    await page.getByText("갱년기 증상은 언제부터 시작되나요?").click();

    const answerBorder = page.locator(".border-l-2.border-primary-500").first();
    await expect(answerBorder).toBeVisible();
  });

  test("clicking again collapses the answer", async ({ page }) => {
    // Expand
    await page.getByText("갱년기 증상은 언제부터 시작되나요?").click();
    await expect(
      page.getByText("갱년기 증상은 보통 45-55세 사이에 시작됩니다.")
    ).toBeVisible();

    // Collapse
    await page.getByText("갱년기 증상은 언제부터 시작되나요?").click();
    await expect(
      page.getByText("갱년기 증상은 보통 45-55세 사이에 시작됩니다.")
    ).not.toBeVisible();
  });

  test("multiple FAQs can be open simultaneously", async ({ page }) => {
    await page.getByText("갱년기 증상은 언제부터 시작되나요?").click();
    await page.getByText("호르몬 치료는 안전한가요?").click();

    // Both answers visible
    await expect(
      page.getByText("갱년기 증상은 보통 45-55세 사이에 시작됩니다.")
    ).toBeVisible();
    await expect(
      page.getByText("전문의와 상담 후 개인에 맞는 치료를 결정하는 것이 중요합니다.")
    ).toBeVisible();
  });

  test("shows dataBox when present", async ({ page }) => {
    await page.getByText("호르몬 치료는 안전한가요?").click();

    await expect(page.getByText("HRT 관련 통계")).toBeVisible();
    await expect(page.getByText("5년 미만 사용 시 안전성 확인")).toBeVisible();
    await expect(page.getByText("정기 검진 필수")).toBeVisible();
  });

  test("Q. prefix is displayed in primary color", async ({ page }) => {
    const qPrefix = page.locator("span.text-primary-600:has-text('Q.')").first();
    await expect(qPrefix).toBeVisible();
  });
});

test.describe("FAQ Page - Empty State", () => {
  test("shows empty message when no FAQs", async ({ page }) => {
    await mockSupabaseAuth(page);
    await mockProfileApi(page);

    await page.route(
      "https://jiji-production-ee02.up.railway.app/api/v1/chats/faq",
      (route) =>
        route.fulfill({
          status: 200,
          contentType: "application/json",
          body: "[]",
        })
    );

    await page.goto("/faq");
    await expect(page.getByText("등록된 FAQ가 없습니다")).toBeVisible();
  });
});
