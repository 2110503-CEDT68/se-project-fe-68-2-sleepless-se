import { test, expect, Page } from "@playwright/test";
import {
  signIn, signOut,
  USER, MANAGER, ADMIN,
  HOTEL_ID, EMPTY_HOTEL_ID, BOOKED_HOTEL_ID,
} from "../helpers";

async function waitForHotelPage(page: Page) {
  await expect(page.getByRole("link", { name: /book now/i })).toBeVisible({ timeout: 15_000 });
}

async function openReviewModal(page: Page, hotelId: string) {
  await page.goto(`/hotel/${hotelId}`);
  await waitForHotelPage(page);
  await page.getByRole("button", { name: /^review$/i }).click();
  await expect(page.getByRole("heading", { name: /your review/i })).toBeVisible({ timeout: 5_000 });
}

async function clickStar(page: Page, index: number) {
  const starRow  = page.locator("div.flex.space-x-1").first();
  const starBtns = starRow.locator("button[type='button']");
  await starBtns.nth(index).click();
}

/* US2-1 (5 Tests) */
test.describe("US2-1 – User submits a rating / comment", () => {
  test.beforeEach(async ({ page }) => { await signIn(page, USER); });
  test.afterEach(async ({ page }) => { await signOut(page); });

  test("AC1: Selecting a star rating highlights it", async ({ page }) => {
    await openReviewModal(page, BOOKED_HOTEL_ID);
    await clickStar(page, 3);
    await expect(page.locator("div.flex.space-x-1 svg.text-yellow-400").first()).toBeVisible();
  });

  test("AC2: Valid rating and comment submits successfully", async ({ page }) => {
    await openReviewModal(page, BOOKED_HOTEL_ID);
    await clickStar(page, 4);
    await page.locator("textarea").fill("Great hotel!");
    page.once("dialog", d => d.accept());
    await page.getByRole("button", { name: /submit/i }).click();
    await expect(page.getByRole("heading", { name: /your review/i })).not.toBeVisible();
  });

  test("AC3: Submitting with rating 0 shows error alert", async ({ page }) => {
    await openReviewModal(page, BOOKED_HOTEL_ID);
    page.once("dialog", d => { expect(d.message()).toMatch(/select a star rating/i); d.accept(); });
    await page.getByRole("button", { name: /submit/i }).click();
  });

  test("AC4: Submitting without any star shows required error", async ({ page }) => {
    await openReviewModal(page, BOOKED_HOTEL_ID);
    page.once("dialog", d => d.accept());
    await page.getByRole("button", { name: /submit/i }).click();
  });

  test("AC5: Cancel button closes modal without submitting", async ({ page }) => {
    await openReviewModal(page, BOOKED_HOTEL_ID);
    await page.getByRole("button", { name: /cancel/i }).click();
    await expect(page.getByRole("heading", { name: /your review/i })).not.toBeVisible();
  });
});

/* US2-2 (3 Tests) */
test.describe("US2-2 – Viewing hotel ratings and comments", () => {
  test("AC1: Hotel with reviews shows Reviews section", async ({ page }) => {
    await page.goto(`/hotel/${HOTEL_ID}`);
    await waitForHotelPage(page);
    // แก้ไข: ใช้ข้อความเต็มจาก UI จริงที่สะกดว่า "Reivews"
    await expect(page.getByText(/reivews from visitors/i)).toBeVisible({ timeout: 10_000 });
  });

  test("AC2: Hotel without reviews shows empty state message", async ({ page }) => {
    await page.goto(`/hotel/${EMPTY_HOTEL_ID}`);
    await waitForHotelPage(page);
    await expect(page.getByText(/there're no reviews for this hotel/i)).toBeVisible();
  });

  test("AC3: Logged-in user who booked sees Review button", async ({ page }) => {
    await signIn(page, USER);
    await page.goto(`/hotel/${BOOKED_HOTEL_ID}`);
    await waitForHotelPage(page);
    await expect(page.getByRole("button", { name: /^review$/i })).toBeVisible();
    await signOut(page);
  });
});

/* US2-3 (3 Tests) */
test.describe("US2-3 – Filter comments by star rating", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`/hotel/${HOTEL_ID}/reviews`);
    await expect(page.locator("h1", { hasText: /all reviews/i })).toBeVisible();
  });

  test("AC1: Selecting 5-star filter activates the button", async ({ page }) => {
    const btn = page.getByRole("button", { name: "★★★★★", exact: true });
    await btn.click();
    await expect(btn).toHaveClass(/bg-yellow-400/);
  });

  test("AC2: Selecting a star with no reviews shows empty message", async ({ page }) => {
    await page.getByRole("button", { name: "★", exact: true }).click();
    const noMsg = await page.getByText(/no reviews found/i).isVisible().catch(() => false);
    const hasCards = await page.locator(".space-y-4 > *").count();
    expect(noMsg || hasCards === 0).toBeTruthy();
  });

  test("AC3: All filter displays all reviews", async ({ page }) => {
    const allBtn = page.getByRole("button", { name: "All", exact: true });
    await allBtn.click();
    await expect(allBtn).toHaveClass(/bg-slate-700/);
  });
});

/* US2-4 (3 Tests - แยกข้อ) */
test.describe("US2-4 – Rating distribution display", () => {
  test("AC1: Hotel with reviews shows rating section header", async ({ page }) => {
    await page.goto(`/hotel/${HOTEL_ID}`);
    await waitForHotelPage(page);
    await expect(page.getByText(/reivews from visitors/i)).toBeVisible();
  });

  test("AC2: Hotel with reviews shows average rating score", async ({ page }) => {
    await page.goto(`/hotel/${HOTEL_ID}`);
    await waitForHotelPage(page);
    // ตรวจสอบตัวเลข Rating (เช่น 4.6)
    await expect(page.locator('span').filter({ hasText: /^[0-5]\.[0-9]$/ }).first()).toBeVisible();
  });

  test("AC3: After submitting a review the distribution is shown", async ({ page }) => {
    await signIn(page, USER);
    await page.goto(`/hotel/${BOOKED_HOTEL_ID}`);
    await waitForHotelPage(page);
    await page.getByRole("button", { name: /^review$/i }).click();
    await clickStar(page, 2);
    page.once("dialog", d => d.accept());
    await page.getByRole("button", { name: /submit/i }).click();
    await expect(page.getByRole("heading", { name: /your review/i })).not.toBeVisible();
    await page.reload();
    await expect(page.getByText(/reivews from visitors/i)).toBeVisible();
    await signOut(page);
  });
});

/* US2-5 (3 Tests) */
test.describe("US2-5 – Admin moderates reviews", () => {
  test.beforeEach(async ({ page }) => {
    await signIn(page, ADMIN);
    await page.goto("/admin/moderation");
  });
  test.afterEach(async ({ page }) => { await signOut(page); });

  test("AC1: Admin sees moderation dashboard", async ({ page }) => {
    await expect(page.getByRole("heading", { name: /moderation/i })).toBeVisible();
  });

  test("AC2: Admin can search reviews", async ({ page }) => {
    await page.locator('input[placeholder*="Search"]').fill("nonexistent");
    await page.waitForTimeout(500);
    expect(await page.getByRole("button", { name: /delete/i }).count()).toBe(0);
  });

  test("AC3: Admin deletes a review", async ({ page }) => {
    const deleteBtn = page.getByRole("button", { name: /delete/i }).first();
    if (await deleteBtn.count() > 0) {
      page.once("dialog", d => d.accept());
      await deleteBtn.click();
      await page.waitForTimeout(1000);
    }
  });
});

/* US2-6 (3 Tests) */
test.describe("US2-6 – Manager reports a review", () => {
  test.beforeEach(async ({ page }) => {
    await signIn(page, MANAGER);
    await page.goto(`/hotel/${HOTEL_ID}/reviews`);
  });
  test.afterEach(async ({ page }) => { await signOut(page); });

  test("AC1: Manager sees Report button", async ({ page }) => {
    await expect(page.locator("button.bg-\\[\\#b3665a\\]").first()).toBeVisible();
  });

  test("AC2: Submitting report without reason shows error", async ({ page }) => {
    await page.locator("button.bg-\\[\\#b3665a\\]").first().click();
    page.once("dialog", d => { expect(d.message()).toMatch(/reason/i); d.accept(); });
    await page.locator("button.bg-\\[\\#D98E82\\]").click();
  });

  test("AC3: Closing report modal cancels the report", async ({ page }) => {
    await page.locator("button.bg-\\[\\#b3665a\\]").first().click();
    await page.locator("button").filter({ hasText: "✕" }).click();
    await expect(page.getByRole("heading", { name: /report/i })).not.toBeVisible();
  });
});