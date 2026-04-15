import { test, expect } from "@playwright/test";

test.describe("Login Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/login");
  });

  test("renders login form with all elements", async ({ page }) => {
    await expect(page.locator("text=JiJi")).toBeVisible();
    await expect(page.locator("text=나만의 밸런스를 찾는")).toBeVisible();
    await expect(page.getByPlaceholder("이메일을 입력해주세요")).toBeVisible();
    await expect(page.getByPlaceholder("비밀번호를 입력해주세요.")).toBeVisible();
    await expect(page.getByRole("button", { name: "로그인 하기" })).toBeVisible();
    await expect(page.getByText("회원가입")).toBeVisible();
  });

  test("shows error on invalid credentials", async ({ page }) => {
    // Mock Supabase signInWithPassword to return error
    // Must use a broad glob that catches the token endpoint for password grant
    await page.route("**/auth/v1/token**", (route) => {
      const url = route.request().url();
      if (url.includes("grant_type=password")) {
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

    await page.getByPlaceholder("이메일을 입력해주세요").fill("wrong@test.com");
    await page.getByPlaceholder("비밀번호를 입력해주세요.").fill("wrongpassword");
    await page.getByRole("button", { name: "로그인 하기" }).click();

    await expect(page.locator("p.text-red-500")).toBeVisible();
  });

  test("navigates to signup page", async ({ page }) => {
    await page.getByText("회원가입").click();
    await expect(page).toHaveURL(/\/signup/);
  });

  test("shows SNS login buttons (Naver, Kakao, Apple)", async ({ page }) => {
    await expect(page.getByText("SNS 계정으로 로그인 하기")).toBeVisible();
    // Naver button (green circle with N)
    await expect(page.locator("button:has-text('N')").first()).toBeVisible();
    // KakaoTalk button
    await expect(page.locator("button:has-text('TALK')")).toBeVisible();
  });

  test("shows hospital login button", async ({ page }) => {
    await expect(page.getByText("병원 로그인")).toBeVisible();
  });
});

test.describe("Signup Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/signup");
  });

  test("renders signup form with all fields", async ({ page }) => {
    await expect(page.getByText("회원가입").first()).toBeVisible();
    await expect(page.getByPlaceholder("이메일을 입력해주세요")).toBeVisible();
    await expect(page.getByPlaceholder("8자 이상 입력해주세요")).toBeVisible();
    await expect(page.getByPlaceholder("비밀번호를 다시 입력해주세요")).toBeVisible();
    await expect(page.getByText("개인 정보 수집 및 이용 동의 (필수)")).toBeVisible();
    await expect(page.getByRole("button", { name: "다음" })).toBeVisible();
  });

  test("shows error when terms not agreed", async ({ page }) => {
    await page.getByPlaceholder("이메일을 입력해주세요").fill("new@test.com");
    await page.getByPlaceholder("8자 이상 입력해주세요").fill("password123");
    await page.getByPlaceholder("비밀번호를 다시 입력해주세요").fill("password123");

    await page.getByRole("button", { name: "다음" }).click();

    await expect(page.getByText("개인 정보 수집 및 이용에 동의해주세요")).toBeVisible();
  });

  test("shows error when passwords do not match", async ({ page }) => {
    await page.getByPlaceholder("이메일을 입력해주세요").fill("new@test.com");
    await page.getByPlaceholder("8자 이상 입력해주세요").fill("password123");
    await page.getByPlaceholder("비밀번호를 다시 입력해주세요").fill("different456");
    await page.getByText("개인 정보 수집 및 이용 동의 (필수)").click();

    await page.getByRole("button", { name: "다음" }).click();

    await expect(page.getByText("비밀번호가 일치하지 않습니다")).toBeVisible();
  });

  test("shows error when password is too short", async ({ page }) => {
    await page.getByPlaceholder("이메일을 입력해주세요").fill("new@test.com");
    await page.getByPlaceholder("8자 이상 입력해주세요").fill("short");
    await page.getByPlaceholder("비밀번호를 다시 입력해주세요").fill("short");
    await page.getByText("개인 정보 수집 및 이용 동의 (필수)").click();

    await page.getByRole("button", { name: "다음" }).click();

    await expect(page.getByText("비밀번호는 8자 이상이어야 합니다")).toBeVisible();
  });

  test("navigates to login page", async ({ page }) => {
    await page.getByText("로그인").click();
    await expect(page).toHaveURL(/\/login/);
  });
});

test.describe("Splash Page", () => {
  test("redirects unauthenticated user to login", async ({ page }) => {
    // Mock Supabase getSession to return no session
    await page.route("**/auth/v1/token?grant_type=refresh_token", (route) =>
      route.fulfill({ status: 401, body: "{}" })
    );

    await page.goto("/");
    await expect(page.getByText("JIJI")).toBeVisible();

    // Should redirect to /login after ~1.5s
    await page.waitForURL("**/login", { timeout: 5000 });
    await expect(page).toHaveURL(/\/login/);
  });
});
