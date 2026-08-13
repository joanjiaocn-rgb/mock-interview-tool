import type { Metadata } from "next";
import { ArrowRight, HelpCircle } from "lucide-react";
import { InterviewStudio } from "@/components/InterviewStudio";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Practice",
  description: "Free English behavioral interview practice with JD-aware questions, Chinese strategy, STAR outlines, and English answer drafts.",
  alternates: {
    canonical: `${site.url}/practice`,
  },
};

export default function PracticePage() {
  return (
    <main className="main">
      <section className="practice-page-intro">
        <div>
          <p className="section-kicker">Practice</p>
          <h1>Build one interview answer at a time.</h1>
          <p>Set up the role on the left, answer in the center, and use the method guide on the right.</p>
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
