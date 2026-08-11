import type { Metadata } from "next";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Pricing",
  description: "Interview English Coach is free in the current v0 and does not include paid plans or checkout.",
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
        Interview English Coach currently has no payment, subscription, checkout, or account requirement. The goal of this version is to test whether the narrow English behavioral interview workflow is useful.
      </p>
      <div className="pricing-table single-pricing">
        <div>
          <strong>Free v0</strong>
          <span>$0</span>
          <p>JD input, resume input, likely questions, Chinese strategy, STAR outlines, English drafts, self-scoring, notes, and cheat sheet export.</p>
        </div>
      </div>
    </main>
  );
}
