import { test, expect } from "@playwright/test";
import { mockSupabaseAuth, mockProfileApi } from "./helpers";

test.describe("Home Page", () => {
  test.beforeEach(async ({ page }) => {
    await mockSupabaseAuth(page);
    await mockProfileApi(page);
    await page.goto("/home");
  });

  test("displays greeting with user name", async ({ page }) => {
    await expect(page.getByText("안녕하세요, 테스트님")).toBeVisible();
  });

  test("displays current date", async ({ page }) => {
    await expect(page.getByText("Today")).toBeVisible();
    // Weekday should be visible (e.g., "월요일")
    await expect(page.locator("text=/요일/")).toBeVisible();
  });

  test("shows action cards (진단 시작, 수면 기록)", async ({ page }) => {
    await expect(page.getByText("진단 시작")).toBeVisible();
    await expect(page.getByText("체계적인 진단 관리")).toBeVisible();
    await expect(page.getByText("수면 기록")).toBeVisible();
    await expect(page.getByText("어젯밤 수면은 편안했나요?")).toBeVisible();
  });

  test("진단 시작 card links to MRS survey", async ({ page }) => {
    await page.getByText("진단 시작").click();
    await expect(page).toHaveURL(/\/survey\/mrs/);
  });

  test("shows report link", async ({ page }) => {
    await expect(page.getByText("내 레포트 확인하기")).toBeVisible();
  });

  test("report link navigates to /report", async ({ page }) => {
    await page.getByText("내 레포트 확인하기").click();
    await expect(page).toHaveURL(/\/report/);
  });

  test("shows chat input placeholder", async ({ page }) => {
    await expect(page.getByText("여기에 질문을 입력해주세요.")).toBeVisible();
  });
});
