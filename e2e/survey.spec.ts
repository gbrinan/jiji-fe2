import { test, expect } from "@playwright/test";
import { mockSupabaseAuth, mockProfileApi, mockMrsApi } from "./helpers";

test.describe("MRS Survey", () => {
  test.beforeEach(async ({ page }) => {
    await mockSupabaseAuth(page);
    await mockProfileApi(page);
    await mockMrsApi(page);
    await page.goto("/survey/mrs");
  });

  test("loads questionnaire and shows first page", async ({ page }) => {
    // First question should be visible
    await expect(page.getByText("테스트 질문 1")).toBeVisible();

    // Should show 5 questions on first page
    for (let i = 1; i <= 5; i++) {
      await expect(page.getByText(`테스트 질문 ${i}`)).toBeVisible();
    }

    // Question 6 should not be visible on page 1
    await expect(page.getByText("테스트 질문 6")).not.toBeVisible();
  });

  test("shows intro message on first page", async ({ page }) => {
    await expect(
      page.getByText("지금부터 몇 가지 간단한 질문을 드릴게요.")
    ).toBeVisible();
  });

  test("shows Likert scale options", async ({ page }) => {
    await expect(page.getByText("없음").first()).toBeVisible();
    await expect(page.getByText("약간").first()).toBeVisible();
    await expect(page.getByText("보통").first()).toBeVisible();
    await expect(page.getByText("심함").first()).toBeVisible();
    await expect(page.getByText("매우 심함").first()).toBeVisible();
  });

  test("다음 button is disabled until all questions answered", async ({ page }) => {
    const nextBtn = page.getByRole("button", { name: "다음" });
    await expect(nextBtn).toBeDisabled();

    // Answer all 5 questions on page 1
    const radios = page.locator("button[role='radio']");
    for (let i = 0; i < 5; i++) {
      // Click "없음" (first option) for each question — every 5th radio button
      await radios.nth(i * 5).click();
    }

    await expect(nextBtn).toBeEnabled();
  });

  test("navigates to page 2 after answering all page 1 questions", async ({ page }) => {
    // Answer all 5 questions on page 1
    const radios = page.locator("button[role='radio']");
    for (let i = 0; i < 5; i++) {
      await radios.nth(i * 5).click();
    }

    await page.getByRole("button", { name: "다음" }).click();

    // Page 2 should show question 6
    await expect(page.getByText("테스트 질문 6")).toBeVisible();
    // Previous button should appear
    await expect(page.getByRole("button", { name: "이전" })).toBeVisible();
  });

  test("이전 button returns to previous page", async ({ page }) => {
    // Answer page 1
    const radios = page.locator("button[role='radio']");
    for (let i = 0; i < 5; i++) {
      await radios.nth(i * 5).click();
    }
    await page.getByRole("button", { name: "다음" }).click();

    // Go back
    await page.getByRole("button", { name: "이전" }).click();

    await expect(page.getByText("테스트 질문 1")).toBeVisible();
  });

  test("full survey completion: answer all, submit, navigate to result", async ({ page }) => {
    // Page 1: answer 5 questions
    let radios = page.locator("button[role='radio']");
    for (let i = 0; i < 5; i++) {
      await radios.nth(i * 5).click();
    }
    await page.getByRole("button", { name: "다음" }).click();

    // Page 2: answer 5 questions
    radios = page.locator("button[role='radio']");
    for (let i = 0; i < 5; i++) {
      await radios.nth(i * 5).click();
    }
    await page.getByRole("button", { name: "다음" }).click();

    // Page 3 (last): answer 1 question, then submit
    radios = page.locator("button[role='radio']");
    await radios.nth(0).click();

    await page.getByRole("button", { name: "완료" }).click();

    // Should navigate to result page
    await page.waitForURL("**/survey/result", { timeout: 5000 });
    await expect(page).toHaveURL(/\/survey\/result/);
  });
});

test.describe("MRS Survey - Error Handling", () => {
  test("shows error when questionnaire fails to load", async ({ page }) => {
    await mockSupabaseAuth(page);
    await mockProfileApi(page);

    // Mock API to return error
    await page.route(
      "https://jiji-production-ee02.up.railway.app/api/v1/survey/mrs",
      (route) => route.fulfill({ status: 500, body: "Internal Server Error" })
    );

    await page.goto("/survey/mrs");

    await expect(page.getByText("설문을 불러오는데 실패했습니다")).toBeVisible();
    await expect(page.getByRole("button", { name: "다시 시도" })).toBeVisible();
  });
});
