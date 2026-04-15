import { test, expect } from "@playwright/test";

test.describe("JIJI App E2E Tests", () => {
  test("Splash → Login 리다이렉트", async ({ page }) => {
    await page.goto("/");
    // Splash shows JIJI title
    await expect(page.locator("h1")).toContainText("JIJI");
    // Should redirect to /login after ~1.5s
    await page.waitForURL("**/login", { timeout: 5000 });
    await expect(page).toHaveURL(/\/login/);
  });

  test("Login 페이지 렌더링", async ({ page }) => {
    await page.goto("/login");
    await expect(page.locator("text=JiJi")).toBeVisible();
    await expect(page.locator("text=나만의 밸런스를 찾는")).toBeVisible();
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.locator("button[type='submit']")).toContainText("로그인");
    await expect(page.locator('a[href="/signup"]')).toBeVisible();
  });

  test("Signup 페이지 렌더링", async ({ page }) => {
    await page.goto("/signup");
    await expect(page.locator("text=회원가입").first()).toBeVisible();
    await expect(page.locator("text=맞춤형 건강 관리를 위해")).toBeVisible();
    const inputs = page.locator('input[type="email"], input[type="password"]');
    await expect(inputs).toHaveCount(3);
    await expect(page.locator("button[type='submit']")).toContainText("다음");
    await expect(page.locator('a[href="/login"]')).toBeVisible();
  });

  test("Login → Signup 네비게이션", async ({ page }) => {
    await page.goto("/login");
    await page.click('a[href="/signup"]');
    await expect(page).toHaveURL(/\/signup/);
    await page.click('a[href="/login"]');
    await expect(page).toHaveURL(/\/login/);
  });

  test("비인증 상태에서 /home → /login 리다이렉트", async ({ page }) => {
    await page.goto("/home");
    await page.waitForURL("**/login", { timeout: 5000 });
    await expect(page).toHaveURL(/\/login/);
  });

  test("비인증 상태에서 /survey/mrs → /login 리다이렉트", async ({ page }) => {
    await page.goto("/survey/mrs");
    await page.waitForURL("**/login", { timeout: 5000 });
    await expect(page).toHaveURL(/\/login/);
  });

  test("비인증 상태에서 /profile → /login 리다이렉트", async ({ page }) => {
    await page.goto("/profile");
    await page.waitForURL("**/login", { timeout: 5000 });
    await expect(page).toHaveURL(/\/login/);
  });

  test("비인증 상태에서 /chat → /login 리다이렉트", async ({ page }) => {
    await page.goto("/chat");
    await page.waitForURL("**/login", { timeout: 5000 });
    await expect(page).toHaveURL(/\/login/);
  });

  test("잘못된 로그인 시 에러 메시지", async ({ page }) => {
    // Mock Supabase to return auth error
    await page.route("**/auth/v1/token**", (route) => {
      if (route.request().url().includes("grant_type=password")) {
        return route.fulfill({
          status: 400,
          contentType: "application/json",
          body: JSON.stringify({
            error: "invalid_grant",
            error_description: "Invalid login credentials",
          }),
        });
      }
      return route.continue();
    });

    await page.goto("/login");
    await page.fill('input[type="email"]', "invalid@test.com");
    await page.fill('input[type="password"]', "wrongpassword");
    await page.click("button[type='submit']");
    // Should show error message (p.text-red-500)
    await expect(page.locator("p.text-red-500")).toBeVisible({ timeout: 10000 });
  });
});
