import { expect, test } from "@playwright/test";

test("home page exposes the English interview prep workflow", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: "Turn your resume into English interview answers.", level: 1 })).toBeVisible();
  await expect(page.getByText("JD-aware behavioral questions")).toBeVisible();
  await page.getByRole("link", { name: /try it free/i }).click();
  await expect(page.getByRole("heading", { name: /paste the JD and your resume/i })).toBeVisible();
  await expect(page.getByText(/Question 1 of 10/i)).toBeVisible();

  await page.getByLabel("Target role").selectOption("software");
  await page.getByRole("button", { name: /^12 questions/i }).click();
  await expect(page.getByText(/Question 1 of 12/i)).toBeVisible();
  await expect(page.getByRole("tab", { name: "10" })).toBeVisible();
  await expect(page.getByRole("tab", { name: "12" })).toBeVisible();
  await page.getByLabel("Job description").fill("Software Engineer role focused on React, API reliability, incident response, and cross-functional collaboration.");
  await page.getByLabel("Resume or experience notes").fill(
    "Software engineer who launched React dashboards, improved API latency by 28%, led incident reviews with product partners, and shipped TypeScript reliability tooling.",
  );
  await page.getByRole("button", { name: /create practice set/i }).click();
  await expect(page.getByText(/Using .* signals from your inputs/i)).toBeVisible();
  await expect(page.getByLabel("English interview preparation studio").getByText("\u4e2d\u6587\u601d\u8def")).toBeVisible();

  await page.getByLabel("Your practiced answer").fill("I would start with requirements, map failure modes, and make retries idempotent.");
  await page.getByLabel("Review notes").fill("Needs a concrete production example and clearer metric.");
  await expect(page.getByText("1 practiced")).toBeVisible();
  await expect(page.getByRole("button", { name: /export cheat sheet/i })).toBeVisible();
});

test("mobile layout avoids horizontal overflow", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/");

  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
  expect(overflow).toBe(false);
  await expect(page.getByLabel("Target role")).toBeVisible();
});
