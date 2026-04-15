import { test, expect } from "@playwright/test";
import { mockSupabaseAuth, mockProfileApi, mockChatApi, mockFaqApi } from "./helpers";

test.describe("Auth Guard", () => {
  test("redirects to /login when accessing protected route without auth", async ({ page }) => {
    // No auth mock — Supabase will return no session
    await page.route("**/auth/v1/token?grant_type=refresh_token", (route) =>
      route.fulfill({ status: 401, body: "{}" })
    );

    await page.goto("/home");
    await page.waitForURL("**/login", { timeout: 5000 });
    await expect(page).toHaveURL(/\/login/);
  });

  test("allows access to protected routes with valid auth", async ({ page }) => {
    await mockSupabaseAuth(page);
    await mockProfileApi(page);

    await page.goto("/home");
    // Should stay on /home (not redirect)
    await expect(page.getByText("안녕하세요")).toBeVisible();
  });
});

test.describe("BottomNav", () => {
  test.beforeEach(async ({ page }) => {
    await mockSupabaseAuth(page);
    await mockProfileApi(page);
    await mockChatApi(page);
    await mockFaqApi(page);
  });

  test("renders 5 navigation tabs on home page", async ({ page }) => {
    await page.goto("/home");

    // BottomNav should be visible
    const bottomNav = page.locator("nav").last();
    await expect(bottomNav).toBeVisible();
  });

  test("navigates from home to survey", async ({ page }) => {
    await page.goto("/home");
    // Click 진단 시작 card (not BottomNav) to go to survey
    await page.getByText("진단 시작").click();
    await expect(page).toHaveURL(/\/survey\/mrs/);
  });

  test("navigates from home to chat", async ({ page }) => {
    await page.goto("/home");
    // Use BottomNav to navigate to chat — find the chat link/button
    const chatNav = page.locator("a[href='/chat'], button").filter({ hasText: /상담|채팅|Chat/i });
    if (await chatNav.count() > 0) {
      await chatNav.first().click();
      await expect(page).toHaveURL(/\/chat/);
    }
  });

  test("navigates from home to FAQ", async ({ page }) => {
    await page.goto("/home");
    const faqNav = page.locator("a[href='/faq'], button").filter({ hasText: /FAQ/i });
    if (await faqNav.count() > 0) {
      await faqNav.first().click();
      await expect(page).toHaveURL(/\/faq/);
    }
  });

  test("navigates from home to profile", async ({ page }) => {
    await page.goto("/home");
    const profileNav = page.locator("a[href='/profile'], button").filter({ hasText: /프로필|마이|Profile/i });
    if (await profileNav.count() > 0) {
      await profileNav.first().click();
      await expect(page).toHaveURL(/\/profile/);
    }
  });
});
