import type { Metadata } from "next";
import { ArrowRight, BadgeCheck, BarChart3, BookOpen, CheckCircle2, ClipboardList, ExternalLink, Languages, Quote, Target } from "lucide-react";
import { site, siteIds } from "@/lib/site";

export const metadata: Metadata = {
  title: "48-Hour English Interview Prep Kit",
  description: site.description,
  keywords: site.keywords,
  authors: [{ name: site.authorName }],
  alternates: {
    canonical: site.url,
  },
};

const answerFirstItems = [
  {
    question: "What is a 48-hour interview prep kit?",
    answer:
      "A 48-hour interview prep kit turns one real job description and resume into the risks, stories, questions, answers, and notes to review before an English behavioral interview.",
  },
  {
    question: "What is Story Match?",
    answer:
      "Story Match chooses the resume story that best fits the question, so the answer starts from your real experience instead of a generic template.",
  },
  {
    question: "How does this tool score answers?",
    answer:
      "The current practice rubric scores 5 dimensions: clarity, structure, specificity, English phrasing, and confidence.",
  },
];

const productFacts = [
  {
    value: "8 / 10 / 12",
    label: "question set sizes",
    body: "The prep kit can generate 8, 10, or 12 behavioral interview questions from the role context.",
  },
  {
    value: "5",
    label: "rubric dimensions",
    body: "Each answer can be reviewed for clarity, structure, specificity, English phrasing, and confidence.",
  },
  {
    value: "4",
    label: "prep outputs",
    body: "The first pass emphasizes a risk map, story match, top questions, and a final cheat sheet.",
  },
  {
    value: "0",
    label: "payment steps",
    body: "The current v0 is free to try and does not require an account before practice.",
  },
];

const methodSources = [
  {
    title: "MIT CAPD on STAR",
    href: "https://capd.mit.edu/resources/the-star-method-for-behavioral-interviews/",
    quote: "S.T.A.R. is a useful acronym and an effective formula",
    note: "MIT also gives a 20% / 10% / 60% / 10% timing guide for Situation, Task, Action, and Result.",
  },
  {
    title: "Northwestern Career Advancement on STAR",
    href: "https://www.northwestern.edu/careers/jobs-internships/interviewing/the-star-approach.html",
    quote: "action should always be the longest part",
    note: "Northwestern's public guide lists 15% / 10% / 50% / 25% as a sharing guide for STAR responses.",
  },
  {
    title: "National Careers Service on STAR",
    href: "https://nationalcareers.service.gov.uk/careers-advice/interview-advice/the-star-method",
    quote: "Use the STAR method to prepare for interviews",
    note: "This supports practicing structured examples before the live interview.",
  },
];

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
      author: { "@id": siteIds.organization },
      publisher: { "@id": siteIds.organization },
      isPartOf: { "@id": siteIds.website },
      citation: methodSources.map((source) => source.href),
    },
    {
      "@type": "FAQPage",
      "@id": `${site.url}/#faq`,
      mainEntity: [
        {
          "@type": "Question",
          name: answerFirstItems[0].question,
          acceptedAnswer: {
            "@type": "Answer",
            text: answerFirstItems[0].answer,
          },
        },
        {
          "@type": "Question",
          name: answerFirstItems[1].question,
          acceptedAnswer: {
            "@type": "Answer",
            text: answerFirstItems[1].answer,
          },
        },
        {
          "@type": "Question",
          name: "How does this tool score answers?",
          acceptedAnswer: {
            "@type": "Answer",
            text: answerFirstItems[2].answer,
          },
        },
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
    {
      "@type": "ItemList",
      "@id": `${site.url}/#product-facts`,
      name: "Interview English Coach product facts",
      itemListElement: productFacts.map((fact, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: `${fact.value} ${fact.label}`,
        description: fact.body,
      })),
    },
    {
      "@type": "DefinedTermSet",
      "@id": `${site.url}/#answer-method`,
      name: "Interview English Coach answer method",
      hasDefinedTerm: [
        {
          "@type": "DefinedTerm",
          name: "Interview Risk Map",
          description: "A short list of competencies and situations the role is likely to test in a behavioral interview.",
        },
        {
          "@type": "DefinedTerm",
          name: "Story Match",
          description: "A recommendation for which resume story should answer a high-probability behavioral question.",
        },
      ],
    },
  ],
};

const faqPreview = [
  {
    question: "Why start with an interview risk map?",
    answer: "The risk map shows the skills this role is likely to test, so you can prepare the right stories before polishing sentences.",
  },
  {
    question: "Why match stories before writing answers?",
    answer: "A good behavioral answer depends on the example. Story Match keeps the answer tied to your real work instead of a polished but empty script.",
  },
  {
    question: "Should I add voice or video practice first?",
    answer: "Voice is the better next step because it improves pacing, confidence, and spoken English without adding the privacy cost of video.",
  },
  {
    question: "What should I do after I get feedback?",
    answer: "Rewrite the answer once, export the prep kit, and rehearse the strongest stories aloud before the interview.",
  },
];

const featureRows = [
  "Interview Risk Map",
  "Story Match before answer draft",
  "48-hour cheat sheet export",
];

const steps = [
  { title: "Paste the JD", body: "Use one real role so the risk map reflects the actual interview." },
  { title: "Paste your resume", body: "Use bullets, project notes, metrics, or three to five stories." },
  { title: "Build the kit", body: "Get risks, story matches, top questions, drafts, feedback, and export notes." },
];

export default function HomePage() {
  return (
    <main className="main">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(pageSchema) }} />

      <section className="hero-split" aria-label="Interview English Coach">
        <div className="simple-hero-copy hero-lead">
          <p className="section-kicker">
            <BadgeCheck size={16} aria-hidden="true" />
            Free v0 for urgent English interviews
          </p>
          <h1>Build your 48-hour English interview prep kit.</h1>
          <p className="hero-copy">
            Paste a JD and your resume, then get an interview risk map, story matches, likely questions, English drafts, feedback, and a last-minute cheat sheet.
          </p>
          <div className="hero-actions">
            <a className="button primary" href="/practice">
              Build my prep kit
              <ArrowRight size={17} aria-hidden="true" />
            </a>
            <a className="button secondary" href="/how-to">
              See how it works
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
              Built for 48-hour prep
            </span>
          </div>
        </div>

        <div className="hero-visual hero-board" aria-label="Practice preview">
          <div className="hero-board-back hero-board-back-one" />
          <div className="hero-board-back hero-board-back-two" />
          <article className="hero-board-main">
            <div className="hero-board-topline">
              <span>Prep kit mode</span>
              <b>Risk 1 / 6</b>
            </div>
            <h2>Stakeholder alignment may be tested. Which story will you use?</h2>
            <p className="hero-board-copy">Match one resume story to the risk, then turn it into a concise English answer.</p>
            <div className="hero-board-tags">
              <span>Risk map</span>
              <span>Story match</span>
              <span>Top questions</span>
              <span>Cheat sheet</span>
            </div>
            <div className="hero-board-callout hero-board-callout-top">
              <Target size={16} aria-hidden="true" />
              Pick the strongest story
            </div>
            <div className="hero-board-callout hero-board-callout-right">
              <ClipboardList size={16} aria-hidden="true" />
              Build prep kit
            </div>
            <div className="hero-board-callout hero-board-callout-bottom">
              <Languages size={16} aria-hidden="true" />
              Rehearse in English
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

      <section className="content-band answer-first-band" aria-labelledby="answer-first-title">
        <div className="content-heading">
          <p className="section-kicker">
            <Target size={16} aria-hidden="true" />
            Short answers
          </p>
          <h2 id="answer-first-title">Clear answers before the details.</h2>
        </div>
        <div className="answer-grid">
          {answerFirstItems.map((item) => (
            <article key={item.question}>
              <h3>{item.question}</h3>
              <p>
                <strong>Answer:</strong> {item.answer}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="content-band facts-band" aria-labelledby="product-facts-title">
        <div className="content-heading">
          <p className="section-kicker">
            <BarChart3 size={16} aria-hidden="true" />
            Product facts
          </p>
          <h2 id="product-facts-title">Verifiable prep-kit facts in the current v0.</h2>
        </div>
        <dl className="fact-grid">
          {productFacts.map((fact) => (
            <div key={fact.label}>
              <dt>{fact.value}</dt>
              <dd>
                <strong>{fact.label}</strong>
                <span>{fact.body}</span>
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="content-band">
        <div className="content-heading">
          <p className="section-kicker">
            <BookOpen size={16} aria-hidden="true" />
            Why this workflow
          </p>
          <h2>What makes the prep kit more useful than a generic mock interview?</h2>
        </div>
        <div className="faq-list">
          {faqPreview.map((item) => (
            <article key={item.question}>
              <h2>{item.question}</h2>
              <p>{item.answer}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="content-band">
        <div className="content-heading">
          <p className="section-kicker">
            <Quote size={16} aria-hidden="true" />
            Sources and method
          </p>
          <h2>Where did the interview structure come from?</h2>
        </div>
        <div className="faq-list">
          {methodSources.map((source) => (
            <article key={source.title}>
              <h2>{source.title}</h2>
              <blockquote cite={source.href}>
                <p>"{source.quote}"</p>
                <footer>
                  <a href={source.href} rel="noreferrer" target="_blank">
                    {source.title}
                    <ExternalLink size={14} aria-hidden="true" />
                  </a>
                </footer>
              </blockquote>
              <p>{source.note}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="content-band how-preview">
        <div className="content-heading">
          <p className="section-kicker">
            <ClipboardList size={16} aria-hidden="true" />
            First-time flow
          </p>
          <h2>Three steps, then export.</h2>
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
