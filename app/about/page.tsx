import type { Metadata } from "next";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description: "About the Mock Interview Tool practice workspace.",
  alternates: {
    canonical: `${site.url}/about`,
  },
};

export default function AboutPage() {
  return (
    <main className="main legal-page">
      <p className="section-kicker">About</p>
      <h1>Built for candidates who need sharper practice, not louder motivation.</h1>
      <p>
        Mock Interview Tool turns interview prep into a repeatable workflow: choose a role, practice against realistic prompts, score the answer, and export a report for the next round.
      </p>
      <h2>Current Scope</h2>
      <ul>
        <li>Role-specific question sets for software, product, design, data, marketing, and leadership interviews.</li>
        <li>Timed practice, answer notes, rubric scoring, and local text export.</li>
        <li>No production account, payment, video, transcript, or automated scoring backend in this v0.</li>
      </ul>
    </main>
  );
}
