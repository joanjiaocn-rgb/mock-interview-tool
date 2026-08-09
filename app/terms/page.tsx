import type { Metadata } from "next";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: "Terms of use for Mock Interview Tool.",
  alternates: {
    canonical: `${site.url}/terms`,
  },
};

export default function TermsPage() {
  return (
    <main className="main legal-page">
      <p className="section-kicker">Terms</p>
      <h1>Terms of Use</h1>
      <p>Last updated: August 9, 2026.</p>
      <h2>Use of the Tool</h2>
      <p>
        Mock Interview Tool provides interview practice prompts, timers, notes, scoring rubrics, and report export. It is an educational tool and does not guarantee job offers, interview outcomes, or professional career advice.
      </p>
      <h2>Candidate Content</h2>
      <p>You are responsible for the content you type into the tool. Avoid entering confidential employer data, personal identifiers, or sensitive private information.</p>
      <h2>Availability</h2>
      <p>This version is offered as a public v0 without service-level commitments. Features may change as the product evolves.</p>
      <h2>Contact</h2>
      <p>Questions about these terms can be sent to {site.supportEmail}.</p>
    </main>
  );
}
