import { Page, expect } from "@playwright/test";

/* ──────────────────────────────────────────────
   Test Constants
─────────────────────────────────────────────── */
export const USER    = { email: "nawaponuser@gmail.com",  password: "123456"       };
export const MANAGER = { email: "manager.03@hotel.com",   password: "password1234" };
export const ADMIN   = { email: "jackson@gmail.com",      password: "12345678"     };

// Phuket Paradise – has existing reviews
export const HOTEL_ID       = "69a5408ee06f3df3d2b70d57";
// Trat Station Hotel – no reviews; user (nawapon) has a booking here
export const EMPTY_HOTEL_ID = "69a5408ee06f3df3d2b70d68";
// Grand Bangkok Hotel – user (nawapon) has a booking here, used for review-submit tests
export const BOOKED_HOTEL_ID = "69a5408ee06f3df3d2b70d64";

/* ──────────────────────────────────────────────
   Auth Helpers
─────────────────────────────────────────────── */
export async function signIn(
  page: Page,
  credentials: { email: string; password: string }
) {
  await page.goto("/auth/signin");
  await page.getByLabel("Email Address").fill(credentials.email);
  await page.getByLabel("Password").fill(credentials.password);
  await page.getByRole("button", { name: /sign in/i }).click();
  await page.waitForURL("/", { timeout: 20_000 });
}

export async function signOut(page: Page) {
  // navigate to the built-in next-auth sign-out page
  await page.goto("/api/auth/signout");
  const btn = page.getByRole("button", { name: /sign out/i });
  if (await btn.isVisible({ timeout: 3_000 }).catch(() => false)) {
    await btn.click();
    await page.waitForURL("/", { timeout: 10_000 });
  }
}

/* ──────────────────────────────────────────────
   FilterBar Helper – open the collapsible panel
─────────────────────────────────────────────── */
export async function openFilterBar(page: Page) {
  // The ChevronDown toggle sits inside the Filter header
  const toggle = page.locator(".sticky").getByRole("button").first();
  const isOpen = await page
    .locator("text=Province")
    .isVisible({ timeout: 2_000 })
    .catch(() => false);
  if (!isOpen) await toggle.click();
  await expect(page.getByText("Province")).toBeVisible();
}

/* ──────────────────────────────────────────────
   DropDown Filter Helper
─────────────────────────────────────────────── */
export async function selectDropdownOption(
  page: Page,
  filterLabel: "Province" | "District" | "Region",
  option: string
) {
  // Click the dropdown box to open it
  await page.getByText(filterLabel).locator("..").locator("div.bg-blue-200\\/50").click();
  // Wait for the options list and click the desired option
  await page.getByText(option, { exact: true }).first().click();
}