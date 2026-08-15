import type { Metadata } from "next";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "STAR Answer Builder",
  description: "Build clearer English behavioral interview answers with a simple STAR structure for non-native speakers.",
  keywords: site.keywords,
  authors: [{ name: site.authorName }],
  alternates: {
    canonical: `${site.url}/answer-builder`,
  },
};

const steps = [
  ["Situation", "Set the scene in one sentence. Keep company, team, and problem context short."],
  ["Task", "Name the responsibility you personally owned and the constraint that made it hard."],
  ["Action", "Use I-statements and explain two or three concrete actions, tradeoffs, or decisions."],
  ["Result", "End with a measurable outcome, a decision improvement, or a lesson you can reuse."],
];

export default function AnswerBuilderPage() {
  return (
    <main className="main legal-page">
      <p className="section-kicker">Answer Builder</p>
      <h1>Build a behavioral answer that sounds specific in English.</h1>
      <p>
        Use this page as the static reference for the main practice tool. The safest interview answer usually starts direct, follows STAR, and avoids vague phrases like "I helped a lot."
      </p>
      <div className="rubric-cards compact-cards">
        {steps.map(([title, body]) => (
          <article key={title}>
            <h3>{title}</h3>
            <p>{body}</p>
          </article>
        ))}
      </div>
      <h2>Useful English Frames</h2>
      <ul>
        <li>The constraint I optimized for was...</li>
        <li>My specific responsibility was...</li>
        <li>The tradeoff was...</li>
        <li>I validated this by...</li>
        <li>The measurable result was...</li>
      </ul>
    </main>
  );
}
