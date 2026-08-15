import type { Metadata } from "next";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy policy for Interview English Coach.",
  keywords: site.keywords,
  authors: [{ name: site.authorName }],
  alternates: {
    canonical: `${site.url}/privacy`,
  },
};

export default function PrivacyPage() {
  return (
    <main className="main legal-page">
      <p className="section-kicker">Privacy</p>
      <h1>Privacy Policy</h1>
      <p>Last updated: August 15, 2026.</p>
      <p>
        Interview English Coach is currently a free browser-side preparation tool. Job descriptions, resume text, experience notes, risk maps, story matches, answer drafts, scoring changes, and exported prep kits are processed in your browser during the session.
      </p>
      <h2>Data We Collect</h2>
      <p>This v0 does not require an account, does not collect payment, does not record video, and does not send resume text or interview answers to a production storage account.</p>
      <h2>Resume and JD Text</h2>
      <p>
        Resume upload currently supports plain text formats or pasted resume content. Job descriptions and resume text are used to tailor risk maps, story matches, practice questions, Chinese strategy, STAR outlines, and English answer drafts for the current session.
      </p>
      <h2>Analytics</h2>
      <p>Google Analytics 4 may be used through Google tag to measure page views and product interactions. The site does not send resume text, JD text, answer text, or notes to Google Analytics. Google may process browser, device, IP, and cookie data according to its own terms.</p>
      <h2>Third-Party Services</h2>
      <p>No payment, authentication, email, saved-session, or storage provider is connected in this build. Analytics may be handled by Google Analytics 4.</p>
      <h2>Contact</h2>
      <p>For privacy questions, email {site.supportEmail}.</p>
    </main>
  );
}
