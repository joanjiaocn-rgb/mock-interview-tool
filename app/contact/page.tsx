import type { Metadata } from "next";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact Interview English Coach.",
  alternates: {
    canonical: `${site.url}/contact`,
  },
};

export default function ContactPage() {
  return (
    <main className="main legal-page">
      <p className="section-kicker">Contact</p>
      <h1>Contact</h1>
      <p>For support, feedback, partnerships, or launch review, email {site.supportEmail}.</p>
      <p>Do not send passwords, access tokens, full resumes, private interview transcripts, or employer-confidential material by email.</p>
    </main>
  );
}
