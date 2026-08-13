import type { Metadata } from "next";
import { ArrowRight, BadgeCheck, CheckCircle2, ClipboardList, Languages, Target } from "lucide-react";
import { site, siteIds } from "@/lib/site";

export const metadata: Metadata = {
  title: "Interview English Coach | Free English Interview Prep",
  description: site.description,
  alternates: {
    canonical: site.url,
  },
};

const pageSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": `${site.url}/#webpage`,
      url: site.url,
      name: "Interview English Coach",
      description: site.description,
      inLanguage: "en-US",
      datePublished: site.publishedAt,
      dateModified: site.updatedAt,
      isPartOf: { "@id": siteIds.website },
    },
    {
      "@type": "FAQPage",
      "@id": `${site.url}/#faq`,
      mainEntity: [
        {
          "@type": "Question",
          name: "Is Interview English Coach free?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "The current v0 is free and does not require payment or an account.",
          },
        },
        {
          "@type": "Question",
          name: "Should this product include voice or video interviews?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Voice practice is a good next-stage feature. Video is better left for later because it adds privacy and product complexity before the core answer workflow is proven.",
          },
        },
      ],
    },
  ],
};

const featureRows = [
  "JD-aware behavioral questions",
  "Chinese method before English draft",
  "STAR structure and review notes",
];

const steps = [
  { title: "Paste a JD", body: "Start with one real role description so the questions feel relevant." },
  { title: "Paste your resume", body: "Use bullets, project notes, or a story bank with concrete details." },
  { title: "Practice and refine", body: "Read the question, follow the method, and rewrite the answer in your own words." },
];

export default function HomePage() {
  return (
    <main className="main">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(pageSchema) }} />

      <section className="hero-split" aria-label="Interview English Coach">
        <div className="simple-hero-copy hero-lead">
          <p className="section-kicker">
            <BadgeCheck size={16} aria-hidden="true" />
            Free v0 for behavioral interviews
          </p>
          <h1>Practice English interview answers.</h1>
          <p className="hero-copy">
            Paste a JD and your resume, then get likely questions, a clear answer method, and an English draft you can adapt.
          </p>
          <div className="hero-actions">
            <a className="button primary" href="/practice">
              Start free practice
              <ArrowRight size={17} aria-hidden="true" />
            </a>
            <a className="button secondary" href="/how-to">
              How to use
            </a>
          </div>
          <div className="hero-proof">
            <span>
              <CheckCircle2 size={16} aria-hidden="true" />
              No account
            </span>
            <span>
              <CheckCircle2 size={16} aria-hidden="true" />
              No payment
            </span>
            <span>
              <CheckCircle2 size={16} aria-hidden="true" />
              Built for non-native speakers
            </span>
          </div>
        </div>

        <div className="hero-visual hero-board" aria-label="Practice preview">
          <div className="hero-board-back hero-board-back-one" />
          <div className="hero-board-back hero-board-back-two" />
          <article className="hero-board-main">
            <div className="hero-board-topline">
              <span>Practice mode</span>
              <b>Question 1 / 10</b>
            </div>
            <h2>Tell me about a time you handled ambiguity and still delivered.</h2>
            <p className="hero-board-copy">Use the method, then rewrite the draft with your own metrics and story.</p>
            <div className="hero-board-tags">
              <span>JD aware</span>
              <span>Chinese method</span>
              <span>STAR</span>
              <span>English draft</span>
            </div>
            <div className="hero-board-callout hero-board-callout-top">
              <Target size={16} aria-hidden="true" />
              Focus on one story
            </div>
            <div className="hero-board-callout hero-board-callout-right">
              <ClipboardList size={16} aria-hidden="true" />
              Create practice set
            </div>
            <div className="hero-board-callout hero-board-callout-bottom">
              <Languages size={16} aria-hidden="true" />
              Rewrite in your own English
            </div>
          </article>
        </div>
      </section>

      <section className="feature-strip" aria-label="Core features">
        {featureRows.map((feature) => (
          <div key={feature}>
            <CheckCircle2 size={17} aria-hidden="true" />
            <span>{feature}</span>
          </div>
        ))}
      </section>

      <section className="content-band how-preview">
        <div className="content-heading">
          <p className="section-kicker">
            <ClipboardList size={16} aria-hidden="true" />
            First-time flow
          </p>
          <h2>Three steps, then practice.</h2>
        </div>
        <div className="quick-start-panel compact">
          {steps.map((step, index) => (
            <article key={step.title}>
              <span>{index + 1}</span>
              <div>
                <h3>{step.title}</h3>
                <p>{step.body}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
