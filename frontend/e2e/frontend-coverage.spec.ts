import { expect, test } from "@playwright/test";

test.describe("homepage content and links", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("uses the Yeti Trek brand in the header", async ({ page }) => {
    await expect(page.getByRole("navigation").getByRole("link", { name: "Yeti Trek" })).toHaveAttribute("href", "/");
  });

  test("links the header sign up button to registration", async ({ page }) => {
    await expect(page.getByRole("navigation").getByRole("link", { name: "Sign Up" })).toHaveAttribute("href", "/register");
  });

  test("shows the hero background with accessible alternative text", async ({ page }) => {
    await expect(page.getByRole("img", { name: "Nepal mountain lodge" })).toBeVisible();
  });

  test("shows every platform statistic value", async ({ page }) => {
    for (const value of ["12,000+", "150+", "98%", "24/7"]) await expect(page.getByText(value, { exact: true })).toBeVisible();
  });

  test("shows the duration of every featured destination", async ({ page }) => {
    for (const duration of ["8 Days", "7 Days", "5 Days", "6 Days"]) await expect(page.getByText(duration, { exact: true })).toBeVisible();
  });

  test("shows all destination difficulty labels", async ({ page }) => {
    await expect(page.getByText("Hard", { exact: true })).toHaveCount(2);
    await expect(page.getByText("Moderate", { exact: true })).toHaveCount(1);
    await expect(page.getByText("Easy", { exact: true })).toHaveCount(1);
  });

  test("shows all destination type labels", async ({ page }) => {
    for (const type of ["High Altitude", "Mountain Trail", "Lake Valley", "Village Trail"]) await expect(page.getByText(type, { exact: true })).toBeVisible();
  });

  test("offers a plan link for each featured destination", async ({ page }) => {
    const links = page.getByRole("link", { name: /Plan this route/ });
    await expect(links).toHaveCount(4);
    for (let index = 0; index < 4; index += 1) await expect(links.nth(index)).toHaveAttribute("href", "/login");
  });

  test("shows the community moments section", async ({ page }) => {
    await expect(page.getByRole("heading", { name: "Trek Moments" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Login to share a moment" })).toHaveAttribute("href", "/login");
  });

  test("shows the public journal section", async ({ page }) => {
    await expect(page.getByRole("heading", { name: "Read trekking guides before you login" })).toBeVisible();
  });

  test("opens the public blog index", async ({ page }) => {
    await page.getByRole("link", { name: /Browse all blogs/ }).click();
    await expect(page).toHaveURL(/\/blogs$/);
  });

  test("shows all three about points", async ({ page }) => {
    for (const point of ["Curated routes for every level", "Carefully selected mountain stays", "Simple planning from start to finish"]) await expect(page.getByText(point, { exact: true })).toBeVisible();
  });

  test("shows the mountain stay image", async ({ page }) => {
    await expect(page.getByRole("img", { name: "Mountain stay in Nepal" })).toBeVisible();
  });

  test("shows all reasons to choose the platform", async ({ page }) => {
    for (const reason of ["Safety First Planning", "Local Route Insight", "Traveler Focused Care"]) await expect(page.getByRole("heading", { name: reason })).toBeVisible();
  });

  test("shows the footer phone number", async ({ page }) => {
    await expect(page.getByText("+977 9800000000", { exact: true })).toBeVisible();
  });

  test("shows the footer copyright", async ({ page }) => {
    await expect(page.getByText("(c) 2026 Yeti Trek. All rights reserved.", { exact: true })).toBeVisible();
  });

  test("footer destinations link targets the homepage section", async ({ page }) => {
    await expect(page.locator("footer").getByRole("link", { name: "Destinations" })).toHaveAttribute("href", "/#destinations");
  });

  test("footer contact section can be reached from navigation", async ({ page }) => {
    await page.getByRole("navigation").getByRole("link", { name: "Contact Us" }).click();
    await expect(page).toHaveURL(/#contact$/);
  });
});

test.describe("login page details", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/login");
  });

  test("labels the email field", async ({ page }) => {
    await expect(page.getByText("Email Address", { exact: true })).toBeVisible();
  });

  test("labels the password field", async ({ page }) => {
    await expect(page.getByText("Password", { exact: true })).toBeVisible();
  });

  test("email input uses the email keyboard type", async ({ page }) => {
    await expect(page.getByPlaceholder("Enter your email")).toHaveAttribute("type", "email");
  });

  test("password input masks entered text", async ({ page }) => {
    await expect(page.getByPlaceholder("Enter your password")).toHaveAttribute("type", "password");
  });

  test("keeps entered values after client validation fails", async ({ page }) => {
    await page.getByPlaceholder("Enter your email").fill("trekker@example.com");
    await page.getByRole("button", { name: /Login/ }).click();
    await expect(page.getByPlaceholder("Enter your email")).toHaveValue("trekker@example.com");
  });

  test("has a registration prompt", async ({ page }) => {
    await expect(page.getByText(/Don't have an account/)).toBeVisible();
  });
});

test.describe("registration page details", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/register");
  });

  test("shows the create account heading", async ({ page }) => {
    await expect(page.getByText("Create your account and start exploring", { exact: true })).toBeVisible();
  });

  test("email field has the correct input type", async ({ page }) => {
    await expect(page.getByPlaceholder("Enter your email")).toHaveAttribute("type", "email");
  });

  test("phone field has a stable form name", async ({ page }) => {
    await expect(page.getByPlaceholder("Enter your phone number")).toHaveAttribute("name", "phoneNumber");
  });

  test("both password fields mask text", async ({ page }) => {
    await expect(page.getByPlaceholder("Enter your password")).toHaveAttribute("type", "password");
    await expect(page.getByPlaceholder("Confirm password")).toHaveAttribute("type", "password");
  });

  test("rejects an email without an at sign", async ({ page }) => {
    await page.getByPlaceholder("Enter your name").fill("Tenzing Sherpa");
    await page.getByPlaceholder("Enter your email").fill("tenzing.example.com");
    const email = page.getByPlaceholder("Enter your email");
    await page.getByRole("button", { name: "Sign Up" }).click();
    expect(await email.evaluate((element) => (element as HTMLInputElement).validity.typeMismatch)).toBe(true);
  });

  test("trims whitespace when validating a name", async ({ page }) => {
    await page.getByPlaceholder("Enter your name").fill("   ");
    await page.getByRole("button", { name: "Sign Up" }).click();
    await expect(page.getByText("Full name is required")).toBeVisible();
  });
});

test.describe("password recovery", () => {
  test("renders recovery instructions", async ({ page }) => {
    await page.goto("/forgot-password");
    await expect(page.getByText("Enter your email and we will send you a link to create a new password.")).toBeVisible();
  });

  test("rejects an empty recovery email", async ({ page }) => {
    await page.goto("/forgot-password");
    await page.getByRole("button", { name: "Send reset link" }).click();
    await expect(page.getByText("Enter a valid email address")).toBeVisible();
  });

  test("returns from recovery to login", async ({ page }) => {
    await page.goto("/forgot-password");
    await page.getByRole("link", { name: /Back to login/ }).click();
    await expect(page).toHaveURL(/\/login$/);
  });

  test("renders both reset password fields", async ({ page }) => {
    await page.goto("/reset-password?token=test-token");
    const inputs = page.locator('input[type="password"]');
    await expect(inputs).toHaveCount(2);
  });

  test("enforces reset password minimum length", async ({ page }) => {
    await page.goto("/reset-password?token=test-token");
    const inputs = page.locator('input[type="password"]');
    await inputs.nth(0).fill("12345");
    await inputs.nth(1).fill("12345");
    await page.getByRole("button", { name: "Reset password" }).click();
    await expect(page.getByText("Password must be at least 6 characters")).toBeVisible();
  });

  test("requires matching reset passwords", async ({ page }) => {
    await page.goto("/reset-password?token=test-token");
    const inputs = page.locator('input[type="password"]');
    await inputs.nth(0).fill("secret1");
    await inputs.nth(1).fill("secret2");
    await page.getByRole("button", { name: "Reset password" }).click();
    await expect(page.getByText("Passwords do not match")).toBeVisible();
  });

  test("links reset page to another recovery request", async ({ page }) => {
    await page.goto("/reset-password");
    await expect(page.getByRole("link", { name: "Request another link" })).toHaveAttribute("href", "/forgot-password");
  });
});

test.describe("public blogs", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/blogs");
  });

  test("explains guest blog access", async ({ page }) => {
    await expect(page.getByRole("heading", { name: /Trek guides, safety notes/ })).toBeVisible();
  });

  test("shows every blog category filter", async ({ page }) => {
    for (const category of ["Trek Guides", "Safety", "Weather", "Culture", "Gear", "News", "User Stories"]) await expect(page.getByRole("link", { name: category, exact: true })).toBeVisible();
  });

  test("filters blogs using a category query", async ({ page }) => {
    await page.getByRole("link", { name: "Safety", exact: true }).click();
    await expect(page).toHaveURL(/category=Safety/);
    await expect(page.getByText(/Showing \d+ results? in Safety/)).toBeVisible();
  });

  test("shows the latest journal section", async ({ page }) => {
    await expect(page.getByRole("heading", { name: "Fresh from the trail journal" })).toBeVisible();
  });

  test("story submission requires login", async ({ page }) => {
    await page.getByRole("link", { name: /Submit story/ }).click();
    await expect(page).toHaveURL(/\/login$/);
  });
});

test.describe("admin and authorization pages", () => {
  test("admin login renders credential fields", async ({ page }) => {
    await page.goto("/admin/login");
    await expect(page.getByPlaceholder("admin@example.com")).toHaveAttribute("type", "email");
    await expect(page.getByPlaceholder("Enter password")).toHaveAttribute("type", "password");
  });

  test("admin login links back to user login", async ({ page }) => {
    await page.goto("/admin/login");
    await page.getByRole("link", { name: "Back to user login" }).click();
    await expect(page).toHaveURL(/\/login$/);
  });

  test("unauthorized page explains access denial", async ({ page }) => {
    await page.goto("/unauthorized");
    await expect(page.getByRole("heading", { name: "Access denied" })).toBeVisible();
    await expect(page.getByText("You do not have permission to open this page.")).toBeVisible();
  });

  test("unauthorized page links to dashboard", async ({ page }) => {
    await page.goto("/unauthorized");
    await expect(page.getByRole("link", { name: "Go to dashboard" })).toHaveAttribute("href", "/dashboard");
  });
});
