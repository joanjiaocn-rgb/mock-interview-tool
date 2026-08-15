import type { Metadata } from "next";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Pricing",
  description: "Interview English Coach is free in the current v0 and does not include paid plans or checkout.",
  keywords: site.keywords,
  authors: [{ name: site.authorName }],
  alternates: {
    canonical: `${site.url}/pricing`,
  },
};

export default function PricingPage() {
  return (
    <main className="main legal-page">
      <p className="section-kicker">Pricing</p>
      <h1>Free for the current v0.</h1>
      <p>
        Interview English Coach currently has no payment, subscription, checkout, or account requirement. The goal of this version is to test whether a narrow 48-hour English interview prep kit is useful.
      </p>
      <div className="pricing-table single-pricing">
        <div>
          <strong>Free v0</strong>
          <span>$0</span>
          <p>JD input, resume input, risk map, story match, likely questions, Chinese strategy, STAR outlines, English drafts, self-scoring, notes, and prep kit export.</p>
        </div>
      </div>
    </main>
  );
}
