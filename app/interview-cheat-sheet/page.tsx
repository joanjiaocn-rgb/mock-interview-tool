import type { Metadata } from "next";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Interview Cheat Sheet",
  description: "A simple last-minute English behavioral interview prep kit and cheat sheet structure.",
  robots: {
    index: false,
    follow: true,
  },
  alternates: {
    canonical: `${site.url}/interview-cheat-sheet`,
  },
};

export default function InterviewCheatSheetPage() {
  return (
    <main className="main legal-page">
      <p className="section-kicker">Cheat Sheet</p>
      <h1>Your final review should be short enough to use before the call.</h1>
      <p>The live tool generates this as an export. A useful 48-hour prep kit should include only the risks, questions, stories, phrases, and warnings you will actually review.</p>
      <h2>Suggested Sections</h2>
      <ul>
        <li>Interview risk map</li>
        <li>Top 5 likely questions</li>
        <li>Story match for each question</li>
        <li>3 strongest STAR stories</li>
        <li>Metrics and artifacts to mention</li>
        <li>Natural English phrases to reuse</li>
        <li>Weak phrases to avoid</li>
      </ul>
    </main>
  );
}
