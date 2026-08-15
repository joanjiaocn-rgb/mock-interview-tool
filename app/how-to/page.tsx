import type { Metadata } from "next";
import { ArrowRight, CheckCircle2, ClipboardList, FileText, Languages, Target } from "lucide-react";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "How to Use",
  description: "Learn the Interview English Coach 48-hour workflow: paste a job description, add your experience, build a prep kit, then practice and export.",
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
    body: "Paste one real job description. Responsibilities and requirements shape the interview risk map.",
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
    title: "Build the prep kit",
    body: "Review the risk map, pick the matched story, adapt the English draft, then score your response.",
    check: "Export the cheat sheet and rehearse the strongest stories aloud.",
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
          <h1>From job description to a 48-hour prep kit.</h1>
          <p>
            Use one real role and your real stories. The tool helps you decide what to prepare, what story to use, and how to say it in clearer English.
          </p>
          <div className="hero-actions">
            <a className="button primary" href="/practice">
              Build my prep kit
              <ArrowRight size={17} aria-hidden="true" />
            </a>
            <a className="button secondary" href="/examples">
              See an example
            </a>
          </div>
        </div>
        <div className="how-to-summary" aria-label="Practice workflow summary">
          <strong>One prep round</strong>
          <span>JD + resume</span>
          <ArrowRight size={17} aria-hidden="true" />
          <span>Risk map + story match</span>
          <ArrowRight size={17} aria-hidden="true" />
          <span>Cheat sheet export</span>
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
          <h2>Use the same four moves after choosing the right story.</h2>
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
          <strong>Ready to build the kit?</strong>
          <span>Paste your inputs, review the risks, and export a cheat sheet before the interview.</span>
        </div>
        <a className="button primary" href="/practice">
          Open prep kit
          <ArrowRight size={17} aria-hidden="true" />
        </a>
      </section>
    </main>
  );
}
