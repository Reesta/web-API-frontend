import { expect, test } from "@playwright/test";

test.describe("homepage", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("shows the main hero content", async ({ page }) => {
    await expect(page.getByRole("heading", { name: "Explore Nepal with confidence." })).toBeVisible();
    await expect(page.getByText("Discover Himalayan trails")).toBeVisible();
  });

  test("shows all primary navigation links", async ({ page }) => {
    for (const name of ["Explore", "Destinations", "Trek Moments", "Blogs", "About", "Why Us", "Contact Us"]) {
      await expect(page.getByRole("navigation").getByRole("link", { name, exact: true })).toBeAttached();
    }
  });

  test("navigates to registration from the hero", async ({ page }) => {
    await page.getByRole("link", { name: "Start Your Journey" }).click();
    await expect(page).toHaveURL(/\/register$/);
  });

  test("navigates to login from the header", async ({ page }) => {
    await page.getByRole("navigation").getByRole("link", { name: "Login" }).click();
    await expect(page).toHaveURL(/\/login$/);
  });

  test("jumps to destinations", async ({ page }) => {
    await page.getByRole("link", { name: /View Destinations/ }).click();
    await expect(page).toHaveURL(/#destinations$/);
    await expect(page.getByRole("heading", { name: "Popular routes for your next trek" })).toBeVisible();
  });

  test("displays four featured destinations", async ({ page }) => {
    for (const destination of ["Everest Base Camp", "Annapurna Sanctuary", "Gokyo Valley", "Langtang Valley"]) {
      await expect(page.getByRole("heading", { name: destination })).toBeVisible();
    }
  });

  test("displays platform statistics", async ({ page }) => {
    for (const label of ["Happy Trekkers", "Expeditions", "Success Rate", "Support"]) {
      await expect(page.getByText(label, { exact: true })).toBeVisible();
    }
  });

  test("shows contact details in the footer", async ({ page }) => {
    await expect(page.getByText("hello@yetitrek.local")).toBeVisible();
    await expect(page.getByText("Kathmandu, Nepal")).toBeVisible();
  });
});

test.describe("login", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/login");
  });

  test("renders the login form", async ({ page }) => {
    await expect(page.getByRole("heading", { name: "Login" })).toBeVisible();
    await expect(page.getByPlaceholder("Enter your email")).toBeVisible();
    await expect(page.getByPlaceholder("Enter your password")).toHaveAttribute("type", "password");
  });

  test("requires an email", async ({ page }) => {
    await page.getByRole("button", { name: /Login/ }).click();
    await expect(page.getByText("Email is required")).toBeVisible();
  });

  test("rejects an invalid email", async ({ page }) => {
    const email = page.getByPlaceholder("Enter your email");
    await email.fill("invalid-email");
    await page.getByRole("button", { name: /Login/ }).click();
    expect(await email.evaluate((element) => (element as HTMLInputElement).validity.typeMismatch)).toBe(true);
    await expect(page).toHaveURL(/\/login$/);
  });

  test("requires a password", async ({ page }) => {
    await page.getByPlaceholder("Enter your email").fill("trekker@example.com");
    await page.getByRole("button", { name: /Login/ }).click();
    await expect(page.getByText("Password is required")).toBeVisible();
  });

  test("opens forgot password", async ({ page }) => {
    await page.getByRole("link", { name: "Forgot password?" }).click();
    await expect(page).toHaveURL(/\/forgot-password$/);
    await expect(page.getByRole("heading", { name: "Forgot password?" })).toBeVisible();
  });

  test("opens registration", async ({ page }) => {
    await page.getByRole("link", { name: "Register" }).click();
    await expect(page).toHaveURL(/\/register$/);
  });

  test("opens admin login", async ({ page }) => {
    await page.getByRole("link", { name: "Login as Admin" }).click();
    await expect(page).toHaveURL(/\/admin\/login$/);
    await expect(page.getByRole("heading", { name: "Welcome back" })).toBeVisible();
  });
});

test.describe("registration", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/register");
  });

  test("renders every registration field", async ({ page }) => {
    for (const placeholder of ["Enter your name", "Enter your email", "Enter your phone number", "Enter your password", "Confirm password"]) {
      await expect(page.getByPlaceholder(placeholder)).toBeVisible();
    }
  });

  test("requires a full name", async ({ page }) => {
    await page.getByRole("button", { name: "Sign Up" }).click();
    await expect(page.getByText("Full name is required")).toBeVisible();
  });

  test("requires an email after name is entered", async ({ page }) => {
    await page.getByPlaceholder("Enter your name").fill("Tenzing Sherpa");
    await page.getByRole("button", { name: "Sign Up" }).click();
    await expect(page.getByText("Email is required")).toBeVisible();
  });

  test("requires a phone number", async ({ page }) => {
    await page.getByPlaceholder("Enter your name").fill("Tenzing Sherpa");
    await page.getByPlaceholder("Enter your email").fill("tenzing@example.com");
    await page.getByRole("button", { name: "Sign Up" }).click();
    await expect(page.getByText("Phone number is required")).toBeVisible();
  });

  test("enforces the minimum password length", async ({ page }) => {
    await page.getByPlaceholder("Enter your name").fill("Tenzing Sherpa");
    await page.getByPlaceholder("Enter your email").fill("tenzing@example.com");
    await page.getByPlaceholder("Enter your phone number").fill("9800000000");
    await page.getByPlaceholder("Enter your password").fill("12345");
    await page.getByRole("button", { name: "Sign Up" }).click();
    await expect(page.getByText("Password must be at least 6 characters")).toBeVisible();
  });

  test("requires matching passwords", async ({ page }) => {
    await page.getByPlaceholder("Enter your name").fill("Tenzing Sherpa");
    await page.getByPlaceholder("Enter your email").fill("tenzing@example.com");
    await page.getByPlaceholder("Enter your phone number").fill("9800000000");
    await page.getByPlaceholder("Enter your password").fill("secret1");
    await page.getByPlaceholder("Confirm password").fill("secret2");
    await page.getByRole("button", { name: "Sign Up" }).click();
    await expect(page.getByText("Password and confirm password do not match")).toBeVisible();
  });

  test("returns to login", async ({ page }) => {
    await page.getByRole("link", { name: "Login" }).click();
    await expect(page).toHaveURL(/\/login$/);
  });
});

test.describe("route protection and recovery", () => {
  test("redirects an anonymous dashboard visitor to login", async ({ page }) => {
    await page.goto("/dashboard");
    await expect(page).toHaveURL(/\/login\?next=%2Fdashboard$/);
  });

  test("redirects an anonymous admin visitor to admin login", async ({ page }) => {
    await page.goto("/admin/dashboard");
    await expect(page).toHaveURL(/\/admin\/login\?next=%2Fadmin%2Fdashboard$/);
  });

  test("validates the password recovery email", async ({ page }) => {
    await page.goto("/forgot-password");
    const email = page.getByPlaceholder("Enter your email");
    await email.fill("not-an-email");
    await page.getByRole("button", { name: "Send reset link" }).click();
    expect(await email.evaluate((element) => (element as HTMLInputElement).validity.typeMismatch)).toBe(true);
    await expect(page).toHaveURL(/\/forgot-password$/);
  });
});
