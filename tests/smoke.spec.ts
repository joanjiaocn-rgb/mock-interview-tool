import { expect, test } from "@playwright/test";

test("home page exposes the mock interview workflow", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: "Mock Interview Tool", level: 1 })).toBeVisible();
  await page.getByRole("link", { name: /start interview/i }).click();
  await expect(page.getByRole("heading", { name: /run a realistic interview round/i })).toBeVisible();
  await expect(page.getByText(/Voice mode is ready|Recording is ready|This browser cannot record/i)).toBeVisible();
  await expect(page.getByText(/Question 1 of 7/i)).toBeVisible();

  await page.getByRole("button", { name: /^Software/i }).click();
  await page.getByRole("button", { name: /^Technical$/i }).click();
  await page.getByRole("button", { name: /^10 prompts/i }).click();
  await expect(page.getByText(/Question 1 of 10/i)).toBeVisible();
  await expect(page.getByRole("tab", { name: "10" })).toBeVisible();
  await expect(page.getByText(/Design|debug|model permissions|data contract/i).first()).toBeVisible();
  await page
    .getByLabel("Resume text")
    .fill(
      "Senior product manager who launched interview scheduling workflows, improved activation by 28%, led roadmap planning with design and engineering, and shipped analytics dashboards for retention experiments.",
    );
  await page.getByRole("button", { name: /build from resume/i }).click();
  await expect(page.getByText(/your resume mentions/i)).toBeVisible();
  await expect(page.getByText(/Tailored 10-question round is active/i)).toBeVisible();

  await page.getByRole("button", { name: /^Start interview$/i }).click();
  await expect(page.getByRole("button", { name: /^Pause interview$/i })).toBeVisible();
  await expect(page.getByRole("button", { name: /read prompt/i })).toBeVisible();
  await expect(page.getByRole("button", { name: /record answer/i })).toBeVisible();

  await page.getByLabel("Candidate answer draft").fill("I would start with requirements, map failure modes, and make retries idempotent.");
  await page.getByLabel("Coach notes").fill("Needs a concrete production example and clearer metric.");
  await expect(page.getByText("1 answered")).toBeVisible();
  await expect(page.getByRole("button", { name: /export report/i })).toBeVisible();
});

test("mobile layout avoids horizontal overflow", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/");

  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
  expect(overflow).toBe(false);
  await expect(page.getByRole("button", { name: /product/i })).toBeVisible();
});
