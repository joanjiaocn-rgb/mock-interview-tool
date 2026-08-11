import type { Metadata } from "next";
import { ArrowRight, BadgeCheck, CheckCircle2, Languages, Mic, Video, XCircle } from "lucide-react";
import { InterviewStudio } from "@/components/InterviewStudio";
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
            text: "The current v0 is free and does not require payment, checkout, or an account.",
          },
        },
        {
          "@type": "Question",
          name: "Should this product include voice or video interviews?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Voice practice is a good second-stage feature. Video interviews are not recommended for the first version because they add privacy and implementation complexity before the core answer workflow is proven.",
          },
        },
      ],
    },
  ],
};

const steps = [
  { title: "Paste JD", body: "Add the role description so questions match the interview." },
  { title: "Paste resume", body: "Add bullets or stories you want to turn into answers." },
  { title: "Practice", body: "Get questions, STAR outlines, English drafts, and a cheat sheet." },
];

const features = [
  "JD-aware behavioral questions",
  "Chinese strategy before English rewriting",
  "STAR answer outlines",
  "Exportable interview cheat sheet",
];

export default function HomePage() {
  return (
    <main className="main">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(pageSchema) }} />
      <section className="simple-hero" aria-label="Interview English Coach">
        <div className="simple-hero-copy">
          <p className="section-kicker">
            <Languages size={16} aria-hidden="true" />
            Free English behavioral interview prep
          </p>
          <h1>Turn your resume into English interview answers.</h1>
          <p className="hero-copy">
            Paste a job description and your resume. Get likely behavioral interview questions, {"\u4e2d\u6587\u601d\u8def"}, STAR structure, polished English drafts, and a last-minute cheat sheet.
          </p>
          <div className="hero-actions">
            <a className="button primary" href="#studio">
              Try it free
              <ArrowRight size={17} aria-hidden="true" />
            </a>
            <a className="button secondary" href="/examples">
              See examples
            </a>
          </div>
        </div>

        <div className="quick-start-panel" aria-label="How it works">
          {steps.map((step, index) => (
            <article key={step.title}>
              <span>{index + 1}</span>
              <div>
                <h2>{step.title}</h2>
                <p>{step.body}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="feature-strip" aria-label="Core features">
        {features.map((feature) => (
          <div key={feature}>
            <CheckCircle2 size={17} aria-hidden="true" />
            <span>{feature}</span>
          </div>
        ))}
      </section>

      <InterviewStudio />

      <section className="content-band voice-video-band" id="voice-video">
        <div>
          <p className="section-kicker">
            <Mic size={16} aria-hidden="true" />
            Voice and video
          </p>
          <h2>Voice later. Video not yet.</h2>
          <p>
            The first job is to prove users want JD-aware questions and better English answers. Voice practice is useful after that because it tests delivery, pace, and confidence. Video adds privacy, storage, permission, and UX complexity before the core workflow is validated.
          </p>
        </div>
        <div className="decision-grid">
          <article>
            <Mic size={18} aria-hidden="true" />
            <h3>Phase 2: voice</h3>
            <p>Record or transcribe spoken answers, then compare spoken English with the polished draft.</p>
          </article>
          <article>
            <Video size={18} aria-hidden="true" />
            <h3>Later: video</h3>
            <p>Add only if users ask for camera rehearsal after the text and voice workflow works.</p>
          </article>
          <article>
            <XCircle size={18} aria-hidden="true" />
            <h3>Not v0</h3>
            <p>No video upload, no saved recordings, no interview outcome guarantee.</p>
          </article>
        </div>
      </section>

      <section className="content-band faq-band" id="faq">
        <p className="section-kicker">
          <BadgeCheck size={16} aria-hidden="true" />
          FAQ
        </p>
        <div className="faq-list">
          <article>
            <h2>Who is this for?</h2>
            <p>Chinese speakers, international students, and other non-native English speakers preparing for English behavioral interviews.</p>
          </article>
          <article>
            <h2>Is it free?</h2>
            <p>Yes. The current v0 has no payment, subscription, or account requirement.</p>
          </article>
          <article>
            <h2>Is my resume stored?</h2>
            <p>This v0 runs as a browser-side prep tool. Avoid entering highly sensitive personal or employer-confidential details.</p>
          </article>
          <article>
            <h2>Does it guarantee an offer?</h2>
            <p>No. It is a practice and writing aid. It cannot guarantee interviews, offers, or hiring outcomes.</p>
          </article>
        </div>
      </section>
    </main>
  );
}
