import { expect, test, type APIRequestContext, type Page } from "@playwright/test";

const apiBaseUrl =
  process.env.E2E_API_URL ||
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "http://localhost:4000/api/v1";
const apiRootUrl = apiBaseUrl.replace(/\/api\/v1\/?$/, "");
const generatedUserEmail = `e2e-user-${Date.now()}@example.com`;
const userEmail = generatedUserEmail;
const userPassword = "Password123";
const adminEmail = process.env.E2E_ADMIN_EMAIL || "admin@example.com";
const adminPassword = process.env.E2E_ADMIN_PASSWORD || "Password123";
let adminCredentialsWork = false;

const uniqueEmail = () => `e2e-${Date.now()}@example.com`;
const formError = (page: Page) => page.locator("p.text-\\[\\#ff7777\\], p.text-red-200").first();

async function visibleFormError(page: Page) {
  return formError(page).textContent({ timeout: 300 }).catch(() => "No visible error");
}

async function ensureBackendIsRunning(request: APIRequestContext) {
  const response = await request.get(apiRootUrl);
  expect(
    response.ok(),
    `Backend API is not reachable at ${apiRootUrl}. Start it with: cd backend; npm.cmd run dev`,
  ).toBeTruthy();
}

async function ensureUserExists(request: APIRequestContext) {
  const registerResponse = await request.post(`${apiBaseUrl}/auth/register`, {
    data: {
      fullName: "E2E Trekker",
      email: userEmail,
      phoneNumber: "9812345678",
      password: userPassword,
    },
  });
  const registerText = await registerResponse.text();
  expect(
    registerResponse.ok() || registerText.includes("Email already exists"),
    `Could not create e2e user through ${apiBaseUrl}/auth/register. Response: ${registerText}`,
  ).toBeTruthy();

  const loginResponse = await request.post(`${apiBaseUrl}/auth/login`, {
    data: {
      email: userEmail,
      password: userPassword,
    },
  });
  expect(
    loginResponse.ok(),
    `E2E user was created but cannot login. Response: ${await loginResponse.text()}`,
  ).toBeTruthy();
}

async function checkAdminCredentials(request: APIRequestContext) {
  if (!process.env.E2E_ADMIN_EMAIL || !process.env.E2E_ADMIN_PASSWORD) {
    adminCredentialsWork = false;
    return;
  }

  const loginResponse = await request.post(`${apiBaseUrl}/auth/login`, {
    data: {
      email: adminEmail,
      password: adminPassword,
    },
  });

  if (!loginResponse.ok()) {
    adminCredentialsWork = false;
    return;
  }

  const body = await loginResponse.json();
  adminCredentialsWork = body?.data?.user?.role === "admin";
}

async function login(page: Page, email = userEmail, password = userPassword) {
  await page.goto("/login");
  await page.getByPlaceholder("Enter your email").fill(email);
  await page.getByPlaceholder("Enter your password").fill(password);
  await page.getByRole("button", { name: /login/i }).click();
  await expect(
    page.getByText(/welcome back|trek dashboard/i).first(),
    `User login failed. App error: ${await visibleFormError(page)}`,
  ).toBeVisible();
}

async function adminLogin(page: Page) {
  await page.goto("/admin/login");
  await page.getByPlaceholder("admin@example.com").fill(adminEmail);
  await page.getByPlaceholder("Enter password").fill(adminPassword);
  await page.getByRole("button", { name: /login as admin/i }).click();
  await expect(page, `Admin login failed. Check E2E_ADMIN_EMAIL/E2E_ADMIN_PASSWORD and make sure that account has role admin. App error: ${await visibleFormError(page)}`).toHaveURL(/\/admin\/dashboard/);
}

test.describe("authentication and access control", () => {
  test.beforeAll(async ({ request }) => {
    await ensureBackendIsRunning(request);
    await ensureUserExists(request);
  });

  test("01 registers a new user account", async ({ page }) => {
    await page.goto("/register");
    await page.getByPlaceholder("Enter your name").fill("E2E Trekker");
    await page.getByPlaceholder("Enter your email").fill(uniqueEmail());
    await page.getByPlaceholder("Enter your phone number").fill("9812345678");
    await page.getByPlaceholder("Enter your password").fill("Password123");
    await page.getByPlaceholder("Confirm password").fill("Password123");
    await page.getByRole("button", { name: /sign up/i }).click();
    await expect(page.getByText(/account created|created successfully|user created/i)).toBeVisible();
  });

  test("02 validates registration password mismatch", async ({ page }) => {
    await page.goto("/register");
    await page.getByPlaceholder("Enter your name").fill("E2E Trekker");
    await page.getByPlaceholder("Enter your email").fill(uniqueEmail());
    await page.getByPlaceholder("Enter your phone number").fill("9812345678");
    await page.getByPlaceholder("Enter your password").fill("Password123");
    await page.getByPlaceholder("Confirm password").fill("Different123");
    await page.getByRole("button", { name: /sign up/i }).click();
    await expect(page.getByText(/password and confirm password do not match/i)).toBeVisible();
  });

  test("03 logs in a registered user", async ({ page }) => {
    await login(page);
    await expect(page.getByText(/dashboard|home/i).first()).toBeVisible();
  });

  test("04 shows validation for bad login credentials", async ({ page }) => {
    await page.goto("/login");
    await page.getByPlaceholder("Enter your email").fill("wrong@example.com");
    await page.getByPlaceholder("Enter your password").fill("wrongpass");
    await page.getByRole("button", { name: /login/i }).click();
    await expect(page.getByText(/invalid|failed/i)).toBeVisible();
  });

  test("05 redirects unauthenticated dashboard users to login", async ({ page }) => {
    await page.goto("/dashboard");
    await expect(page).toHaveURL(/\/login/);
  });

  test("06 redirects unauthenticated admin users to admin login", async ({ page }) => {
    await page.goto("/admin/dashboard");
    await expect(page).toHaveURL(/\/admin\/login/);
  });
});

test.describe("user dashboard journeys", () => {
  test.beforeAll(async ({ request }) => {
    await ensureBackendIsRunning(request);
    await ensureUserExists(request);
  });

  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test("07 navigates between dashboard trails and stays", async ({ page }) => {
    await page.getByRole("link", { name: /trails/i }).first().click();
    await expect(page).toHaveURL(/\/dashboard\/trails/);
    await page.getByRole("link", { name: /stay/i }).first().click();
    await expect(page).toHaveURL(/\/dashboard\/stay/);
  });

  test("08 searches dashboard trails or stays", async ({ page }) => {
    await page.goto("/dashboard");
    await page.getByLabel(/search trails and stays/i).fill("Everest");
    await expect(page.getByText(/trail|stay|no trails or stays/i).first()).toBeVisible();
  });

  test("09 reads a trail detail page from the trails listing", async ({ page }) => {
    await page.goto("/dashboard/trails");
    await page.getByRole("link", { name: /view|explore|details/i }).first().click();
    await expect(page).toHaveURL(/\/dashboard\/trails\/.+/);
  });

  test("10 creates a stay booking from a stay detail page", async ({ page }) => {
    await page.goto("/dashboard/stay");
    await page.getByRole("link", { name: /book|view|details/i }).first().click();
    await page.getByRole("link", { name: /book/i }).first().click();
    await page.getByPlaceholder(/name/i).fill("E2E Trekker");
    await page.getByPlaceholder(/you@example.com/i).fill(userEmail);
    await page.getByRole("textbox", { name: /phone/i }).fill("9812345678");
    await page.getByLabel(/check-in|start date|date/i).first().fill("2026-08-01");
    await page.getByLabel(/check-out|end date/i).first().fill("2026-08-03");
    await page.getByRole("button", { name: /confirm/i }).click();
    await expect(page).toHaveURL(/\/dashboard\/booking-history/);
  });

  test("11 reads booking history after login", async ({ page }) => {
    await page.goto("/dashboard/booking-history");
    await expect(page.getByText(/booking/i).first()).toBeVisible();
  });
});

test.describe("admin CRUD and filtering", () => {
  test.skip(
    !process.env.E2E_ADMIN_EMAIL || !process.env.E2E_ADMIN_PASSWORD,
    "Set E2E_ADMIN_EMAIL and E2E_ADMIN_PASSWORD to run admin e2e tests.",
  );

  test.beforeAll(async ({ request }) => {
    await ensureBackendIsRunning(request);
    await checkAdminCredentials(request);
  });

  test.beforeEach(async ({ page }) => {
    test.skip(
      !adminCredentialsWork,
      "Provided admin credentials did not login as an admin user.",
    );
    await adminLogin(page);
  });

  test("12 creates, searches, updates, and deletes a trail as admin", async ({ page }) => {
    const title = `E2E Trail ${Date.now()}`;

    await page.goto("/admin/trails");
    await page.getByRole("link", { name: /create trail/i }).click();
    await page.locator('input[name="title"]').fill(title);
    await page.locator('input[name="altitude"]').fill("3,800m");
    await page.locator('input[name="distance"]').fill("44 km");
    await page.locator('input[name="duration"]').fill("5 Days");
    await page.locator('select[name="difficulty"]').selectOption("Mod");
    await page.locator('textarea[name="text"]').fill("Created from Playwright e2e test.");
    await page.locator('input[type="file"]').setInputFiles({
      name: "trail.png",
      mimeType: "image/png",
      buffer: Buffer.from(
        "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/p9sAAAAASUVORK5CYII=",
        "base64",
      ),
    });
    await page.getByPlaceholder("Namche Bazaar").first().fill("First stop");
    await page.getByPlaceholder("3,440m").first().fill("1,400m");
    await page.getByPlaceholder("Describe what happens at this stop.").first().fill("Start walking.");
    await page.getByPlaceholder("Namche Bazaar").nth(1).fill("Second stop");
    await page.getByPlaceholder("3,440m").nth(1).fill("2,400m");
    await page.getByPlaceholder("Describe what happens at this stop.").nth(1).fill("Reach lodge.");
    await page.getByRole("button", { name: /create trail/i }).click();
    await expect(page).toHaveURL(/\/admin\/trails/);

    await page.getByPlaceholder(/search by title/i).fill(title);
    await page.getByRole("button", { name: /^search$/i }).click();
    await expect(page.getByText(title)).toBeVisible();

    await page.getByRole("link", { name: /edit/i }).first().click();
    await page.locator('input[name="title"]').fill(`${title} Updated`);
    await page.getByRole("button", { name: /save changes/i }).click();
    await expect(page).toHaveURL(/\/admin\/trails/);

    await page.getByRole("button", { name: /delete/i }).first().click();
    await page.getByRole("button", { name: /delete trail/i }).click();
    await expect(page.getByText(/trail management/i)).toBeVisible();
  });
});
