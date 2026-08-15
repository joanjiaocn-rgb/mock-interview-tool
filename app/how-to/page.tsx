import type { Metadata } from "next";
import { ArrowRight, CheckCircle2, ClipboardList, FileText, Languages, Target } from "lucide-react";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "How to Use",
  description: "Learn the three-step Interview English Coach workflow: add a job description, add your experience, then practice and refine each answer.",
  keywords: site.keywords,
  authors: [{ name: site.authorName }],
  alternates: {
    canonical: `${site.url}/how-to`,
  },
};

const steps = [
  {
    icon: FileText,
    number: "01",
    title: "Add the role",
    body: "Paste one real job description. Responsibilities and requirements help shape the question set.",
    check: "A complete JD is useful, but a short role summary also works.",
  },
  {
    icon: ClipboardList,
    number: "02",
    title: "Add your evidence",
    body: "Paste resume bullets, project notes, metrics, or three to five stories you want to use.",
    check: "Remove sensitive details. Concrete actions and results matter most.",
  },
  {
    icon: Languages,
    number: "03",
    title: "Practice one answer",
    body: "Read the question, scan the answer method, adapt the English draft, then score your response.",
    check: "Use your own words and end with a result or lesson.",
  },
];

const method = [
  ["Answer first", "Give a direct one-sentence response before adding context."],
  ["Choose one story", "Use one example with a clear problem, decision, and outcome."],
  ["Show your action", "Say what you personally did, not only what the team did."],
  ["Land the result", "Close with a metric, changed decision, or reusable lesson."],
];

export default function HowToPage() {
  return (
    <main className="main how-to-page">
      <section className="how-to-hero">
        <div>
          <p className="section-kicker">
            <Target size={16} aria-hidden="true" />
            How to use
          </p>
          <h1>From job description to a practiced answer.</h1>
          <p>
            Use one real role and one real story. The tool helps you structure the answer and express it in clearer English.
          </p>
          <div className="hero-actions">
            <a className="button primary" href="/practice">
              Start free practice
              <ArrowRight size={17} aria-hidden="true" />
            </a>
            <a className="button secondary" href="/examples">
              See an example
            </a>
          </div>
        </div>
        <div className="how-to-summary" aria-label="Practice workflow summary">
          <strong>One practice round</strong>
          <span>JD + resume</span>
          <ArrowRight size={17} aria-hidden="true" />
          <span>10 likely questions</span>
          <ArrowRight size={17} aria-hidden="true" />
          <span>1 answer at a time</span>
        </div>
      </section>

      <section className="how-step-list" aria-label="How to use the interview coach">
        {steps.map((step) => {
          const Icon = step.icon;
          return (
            <article key={step.number}>
              <div className="how-step-number">{step.number}</div>
              <div className="how-step-icon">
                <Icon size={20} aria-hidden="true" />
              </div>
              <div>
                <h2>{step.title}</h2>
                <p>{step.body}</p>
                <span>
                  <CheckCircle2 size={15} aria-hidden="true" />
                  {step.check}
                </span>
              </div>
            </article>
          );
        })}
      </section>

      <section className="content-band method-reference">
        <div className="content-heading">
          <p className="section-kicker">
            <Languages size={16} aria-hidden="true" />
            The answer method
          </p>
          <h2>Use the same four moves for every behavioral question.</h2>
        </div>
        <div className="method-reference-grid">
          {method.map(([title, body], index) => (
            <article key={title}>
              <span>{index + 1}</span>
              <div>
                <h3>{title}</h3>
                <p>{body}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="how-to-cta">
        <div>
          <strong>Ready for the first question?</strong>
          <span>Paste your inputs, create a set, and work through one answer at a time.</span>
        </div>
        <a className="button primary" href="/practice">
          Open practice
          <ArrowRight size={17} aria-hidden="true" />
        </a>
      </section>
    </main>
  );
}
