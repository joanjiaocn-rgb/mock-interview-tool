import type { Metadata } from "next";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: "Terms of use for Interview English Coach.",
  keywords: site.keywords,
  authors: [{ name: site.authorName }],
  alternates: {
    canonical: `${site.url}/terms`,
  },
};

export default function TermsPage() {
  return (
    <main className="main legal-page">
      <p className="section-kicker">Terms</p>
      <h1>Terms of Use</h1>
      <p>Last updated: August 16, 2026.</p>
      <h2>Use of the Tool</h2>
      <p>
        Interview English Coach provides a 48-hour English behavioral interview prep kit with risk maps, story matches, likely questions, Chinese answer strategy, STAR outlines, draft answers, notes, scoring rubrics, and prep kit export. It is an educational practice tool and does not guarantee job offers, interview outcomes, or professional career advice.
      </p>
      <h2>Candidate Content</h2>
      <p>You are responsible for the content you type into the tool. When you request AI generation or feedback, your JD, resume or experience notes, selected question, suggested draft, and practiced answer may be sent to a third-party AI provider through OpenRouter. Avoid entering confidential employer data, unnecessary personal identifiers, or sensitive private information.</p>
      <h2>Free v0</h2>
      <p>The current version is free and does not include checkout, subscriptions, account storage, saved sessions, or paid entitlements.</p>
      <h2>Availability</h2>
      <p>This version is offered as a public v0 without service-level commitments. Features may change as the product evolves.</p>
      <h2>Analytics</h2>
      <p>The site may use Google Analytics 4 to measure visits and feature interactions. Analytics events are limited to usage metadata and do not include resume text, JD text, answer text, or notes.</p>
      <h2>Contact</h2>
      <p>Questions about these terms can be sent to {site.supportEmail}.</p>
    </main>
  );
}
