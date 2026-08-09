import type { Metadata } from "next";
import {
  ArrowRight,
  BadgeCheck,
  BarChart3,
  BriefcaseBusiness,
  Clock4,
  LockKeyhole,
  MessageSquareText,
} from "lucide-react";
import { InterviewStudio } from "@/components/InterviewStudio";
import { site, siteIds } from "@/lib/site";

export const metadata: Metadata = {
  title: "Mock Interview Tool | Practice Interviews With Timed Feedback",
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
      name: "Mock Interview Tool",
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
          name: "Is this mock interview tool free?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "The current public v0 is free and runs in the browser. Paid scoring and account features are not enabled in this build.",
          },
        },
        {
          "@type": "Question",
          name: "Does it record audio or video?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "It can record microphone audio locally in the browser for answer playback. It does not upload audio to a production server or record video.",
          },
        },
      ],
    },
  ],
};

const proofItems = [
  { value: "6", label: "role tracks" },
  { value: "5-10", label: "questions per round" },
  { value: "5-point", label: "scoring rubric" },
  { value: "0", label: "server-side answer storage" },
];

export default function HomePage() {
  return (
    <main className="main">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(pageSchema) }} />
      <section className="hero" aria-label="Mock Interview Tool">
        <div className="hero-copy-block">
          <p className="section-kicker">
            <BriefcaseBusiness size={16} aria-hidden="true" />
            Interview practice for serious candidates
          </p>
          <h1>Mock Interview Tool</h1>
          <p className="hero-copy">
            Practice 5-10 question interview rounds with role-specific prompts, answer notes, a practical scoring rubric, and a report you can use for the next drill.
          </p>
          <div className="hero-actions">
            <a className="button primary" href="#studio">
              Start interview
              <ArrowRight size={17} aria-hidden="true" />
            </a>
            <a className="button secondary" href="#rubric">
              View rubric
            </a>
          </div>
        </div>

        <div className="hero-visual" aria-label="Interview workflow preview">
          <div className="signal-rail">
            <span>Prep</span>
            <span className="active">Live</span>
            <span>Review</span>
          </div>
          <div className="interview-card">
            <div className="interview-card-top">
              <div>
                <p>Product Manager</p>
                <strong>Mixed Loop</strong>
              </div>
              <span>08:00</span>
            </div>
            <h2>Prioritize follow-up prompts, video replay, or resume-aware practice.</h2>
            <div className="mini-transcript">
              <span>Answer structure</span>
              <div style={{ width: "92%" }} />
              <div style={{ width: "78%" }} />
              <div style={{ width: "64%" }} />
            </div>
            <div className="score-grid">
              <span>Structure 4</span>
              <span>Evidence 3</span>
              <span>Clarity 4</span>
            </div>
          </div>
          <div className="floating-note">
            <MessageSquareText size={16} aria-hidden="true" />
            Push for tradeoffs, not theater.
          </div>
        </div>
      </section>

      <section className="proof-band" aria-label="Product capabilities">
        {proofItems.map((item) => (
          <div key={item.label}>
            <strong>{item.value}</strong>
            <span>{item.label}</span>
          </div>
        ))}
      </section>

      <InterviewStudio />

      <section className="content-band" id="rubric">
        <div className="content-heading">
          <p className="section-kicker">
            <BarChart3 size={16} aria-hidden="true" />
            Rubric
          </p>
          <h2>Score the answer on the things interviewers actually probe.</h2>
        </div>
        <div className="rubric-cards">
          <article>
            <h3>Structure</h3>
            <p>Can the interviewer follow the answer without assembling it themselves?</p>
          </article>
          <article>
            <h3>Evidence</h3>
            <p>Does the answer include concrete stakes, constraints, numbers, or artifacts?</p>
          </article>
          <article>
            <h3>Depth</h3>
            <p>Does the candidate explain tradeoffs, risks, and how judgment changed?</p>
          </article>
          <article>
            <h3>Follow-up</h3>
            <p>Can the candidate handle pressure without drifting into a rehearsed monologue?</p>
          </article>
        </div>
      </section>

      <section className="content-band split-band" id="pricing">
        <div>
          <p className="section-kicker">
            <LockKeyhole size={16} aria-hidden="true" />
            Pricing
          </p>
          <h2>Free local-first v0.</h2>
          <p>
            This version does not connect paid checkout, accounts, server storage, video recording, or automated scoring. Resume text, interview answers, and local audio clips stay in the browser session.
          </p>
        </div>
        <div className="pricing-table">
          <div>
            <strong>Free</strong>
            <span>$0</span>
            <p>5-10 question rounds, resume-tailored prompts, local audio recording, browser transcript when supported, timer, notes, manual rubric, and text report export.</p>
          </div>
          <div>
            <strong>Pro concept</strong>
            <span>TBD</span>
            <p>Follow-up prompts, saved sessions, transcript review, and coach templates. Not enabled in this build.</p>
          </div>
        </div>
      </section>

      <section className="content-band faq-band" id="faq">
        <p className="section-kicker">
          <BadgeCheck size={16} aria-hidden="true" />
          FAQ
        </p>
        <div className="faq-list">
          <article>
            <h2>Can I use it for technical interviews?</h2>
            <p>Yes. Pick Software and Technical to get architecture, debugging, data modeling, and launch-readiness prompts.</p>
          </article>
          <article>
            <h2>Does the tool guarantee interview results?</h2>
            <p>No. It is a practice aid, not an employment guarantee. The goal is better structure, stronger evidence, and calmer repetition.</p>
          </article>
          <article>
            <h2>Where are my answers stored?</h2>
            <p>In this v0, resume text, answers, notes, and recorded audio clips stay in the browser session. There is no production account or server storage wired up.</p>
          </article>
          <article>
            <h2>How long should one drill take?</h2>
            <p>Choose 5, 7, or 10 prompts. Standard rounds use about four minutes per prompt; case rounds use about six minutes per prompt.</p>
          </article>
        </div>
      </section>

      <section className="content-band launch-band">
        <div>
          <p className="section-kicker">
            <Clock4 size={16} aria-hidden="true" />
            Next gates
          </p>
          <h2>Before public launch, connect evidence instead of pretending.</h2>
          <p>
            The local build is ready for review. Production deployment, analytics, GSC/Bing submission, public posting, payments, and automated scoring still require owner confirmation and credentials.
          </p>
        </div>
      </section>
    </main>
  );
}
