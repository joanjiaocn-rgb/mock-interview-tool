import type { Metadata } from "next";
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
      <section className="content-band page-intro">
        <p className="section-kicker">Practice</p>
        <h1>Free English behavioral interview practice.</h1>
        <p>Paste your JD and resume, generate likely questions, then rewrite the English draft into your own answer.</p>
      </section>
      <InterviewStudio />
    </main>
  );
}
