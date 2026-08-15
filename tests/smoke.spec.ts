import { expect, test } from "@playwright/test";
import { readFile } from "node:fs/promises";

test("home page exposes the English interview prep workflow", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: "Build your 48-hour English interview prep kit.", level: 1 })).toBeVisible();
  await expect(page.getByText("Interview Risk Map", { exact: true })).toBeVisible();
  await page.getByRole("link", { name: /build my prep kit/i }).first().click();
  await expect(page.getByRole("heading", { name: /build a prep kit for your next english interview/i })).toBeVisible();
  await expect(page.getByRole("heading", { name: /build the risk map, match your stories/i })).toBeVisible();
  await expect(page.getByLabel("English interview prep kit studio")).toHaveAttribute("data-ready", "true");
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
  await page.getByRole("button", { name: "Build prep kit", exact: true }).click();
  await expect(page.getByText(/Using .* signals from your inputs/i)).toBeVisible();
  await expect(page.getByLabel("English interview prep kit studio").getByText("\u4e2d\u6587\u601d\u8def")).toBeVisible();
  await expect(page.getByLabel("Interview Risk Map")).toBeVisible();
  await expect(page.getByLabel("Story Match").first()).toBeVisible();
  await expect(page.getByText("Prep method")).toBeVisible();
  await expect(page.getByLabel(/Example answer to adapt/)).toBeVisible();
  const firstDraft = await page.getByLabel(/Example answer to adapt/).inputValue();
  await page.getByRole("tab", { name: "2", exact: true }).click();
  const secondDraft = await page.getByLabel(/Example answer to adapt/).inputValue();
  expect(secondDraft).not.toBe(firstDraft);

  const practicedAnswer = "I led a React dashboard reliability project where API errors were creating support escalations. My task was to identify the failure pattern, align product and engineering on the tradeoff, and improve the experience without delaying launch. I mapped the failure modes, added retry behavior, wrote TypeScript checks, and led the incident review. The result was a 28% API latency improvement and fewer repeat escalations.";
  await page.getByLabel("Your practiced answer").fill(practicedAnswer);
  await page.getByRole("button", { name: /^Get feedback$/ }).first().click();
  await expect(page.getByRole("heading", { name: "What to keep and improve" })).toBeVisible();
  await expect(page.getByText("Try these edits")).toBeVisible();
  await expect(page.getByLabel("English interview prep kit studio").getByText(/Readiness/i)).toBeVisible();
  const reviewNotes = page.getByLabel("Your review notes (optional)");
  await expect(reviewNotes).toHaveValue("");
  await reviewNotes.fill("Needs a concrete production example and clearer metric.");
  await expect(page.getByText("1 practiced")).toBeVisible();
  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "Export Markdown", exact: true }).click();
  const download = await downloadPromise;
  const downloadPath = await download.path();
  expect(downloadPath).not.toBeNull();
  expect(download.suggestedFilename()).toBe("interview-english-prep-kit.md");
  const report = await readFile(downloadPath!, "utf8");
  expect(report).toContain("# 48-Hour English Interview Prep Kit");
  expect(report).toContain("## Interview Risk Map");
  expect(report).toContain("## Story Match");
  expect(report).toContain("## Suggested Answer Drafts");
  expect(report).toContain(`**Suggested answer draft:** ${firstDraft}`);
  expect(report).toContain(`**Your practiced answer:** ${practicedAnswer}`);
  expect(report).toContain("## Last-Minute Checklist");
  expect(report).not.toContain("One example that fits this role");
});

test("prep kit export includes suggested drafts before the user practices", async ({ page }) => {
  await page.goto("/practice");

  await page.getByLabel("Target role").selectOption("data");
  await page.getByLabel("Job description").fill("Data Analyst role focused on SQL, dashboards, funnel analysis, retention, experiments, and stakeholder communication.");
  await page.getByLabel("Resume or experience notes").fill(
    "Data Analyst with 3 years of experience who built Tableau dashboards, analyzed signup funnel drop-off, improved completion rate by 14%, and explained A/B test tradeoffs to product and marketing teams.",
  );
  await page.getByRole("button", { name: "Build prep kit", exact: true }).click();
  const firstDraft = await page.getByLabel(/Example answer to adapt/).inputValue();

  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "Export Markdown", exact: true }).click();
  const download = await downloadPromise;
  const downloadPath = await download.path();
  expect(downloadPath).not.toBeNull();
  expect(download.suggestedFilename()).toBe("interview-english-prep-kit.md");
  const report = await readFile(downloadPath!, "utf8");

  expect(report).toContain("## Suggested Answer Drafts");
  expect(report).toContain(`**Suggested answer draft:** ${firstDraft}`);
  expect(report).toContain("[No practiced answers yet]");
});

test("mobile layout avoids horizontal overflow", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/practice");

  await expect(page.getByLabel("English interview prep kit studio")).toHaveAttribute("data-ready", "true");
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
  expect(overflow).toBe(false);
  await expect(page.getByLabel("Target role")).toBeVisible();
});

test("how-to page explains the first practice round", async ({ page }) => {
  await page.goto("/how-to");

  await expect(page.getByRole("heading", { name: "From job description to a 48-hour prep kit.", level: 1 })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Add the role" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Build the prep kit" })).toBeVisible();
  await expect(page.getByRole("heading", { name: /after choosing the right story/i })).toBeVisible();
  await expect(page.getByRole("link", { name: /open prep kit/i })).toBeVisible();
});
