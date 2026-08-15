import type { Metadata } from "next";
import { ArrowRight, HelpCircle } from "lucide-react";
import { InterviewStudio } from "@/components/InterviewStudio";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Build Your 48-Hour Interview Prep Kit",
  description: "Build a free English behavioral interview prep kit with a risk map, story match, likely questions, answer drafts, feedback, and a cheat sheet.",
  keywords: site.keywords,
  authors: [{ name: site.authorName }],
  alternates: {
    canonical: `${site.url}/practice`,
  },
};

export default function PracticePage() {
  return (
    <main className="main">
      <section className="practice-page-intro">
        <div>
          <p className="section-kicker">48-hour prep kit</p>
          <h1>Build a prep kit for your next English interview.</h1>
          <p>Paste the role and your experience, then use the risk map, story match, and answer guide to prepare fast.</p>
        </div>
        <a className="button secondary" href="/how-to">
          <HelpCircle size={17} aria-hidden="true" />
          Read how it works
          <ArrowRight size={16} aria-hidden="true" />
        </a>
      </section>
      <InterviewStudio />
    </main>
  );
}
