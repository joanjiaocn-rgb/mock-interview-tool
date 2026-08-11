import type { Metadata } from "next";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description: "About Interview English Coach.",
  alternates: {
    canonical: `${site.url}/about`,
  },
};

export default function AboutPage() {
  return (
    <main className="main legal-page">
      <p className="section-kicker">About</p>
      <h1>Built for non-native speakers who need sharper English interview answers.</h1>
      <p>
        Interview English Coach helps candidates turn a job description and real experience into likely behavioral questions, Chinese answer strategy, STAR outlines, English drafts, and a compact cheat sheet.
      </p>
      <h2>Current Scope</h2>
      <ul>
        <li>Free English behavioral interview prep for Chinese speakers, international students, and other non-native English speakers.</li>
        <li>JD-aware questions, Chinese strategy, STAR answer structure, English draft rewriting, notes, scoring, and local text export.</li>
        <li>No production account, payment, video interview, saved sessions, or offer guarantee in this v0.</li>
      </ul>
    </main>
  );
}
