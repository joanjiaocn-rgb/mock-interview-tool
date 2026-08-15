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
      <p>Last updated: August 16, 2026.</p>
      <p>
        Interview English Coach is currently a free preparation tool. When you build a prep kit or request answer feedback, the job description, resume or experience notes, selected question, suggested draft, and practiced answer may be sent to OpenRouter and routed model providers to generate the result. The site does not provide account storage for resumes, answers, or exported prep kits in this version.
      </p>
      <h2>Data We Collect</h2>
      <p>This v0 does not require an account, does not collect payment, does not record video, and does not save resume text or interview answers to a production storage account.</p>
      <h2>Resume and JD Text</h2>
      <p>
        Resume upload currently supports plain text formats or pasted resume content. Job descriptions and resume text are used to tailor risk maps, story matches, practice questions, Chinese strategy, STAR outlines, and English answer drafts for the current session. Avoid entering confidential employer information, government identifiers, or sensitive personal information.
      </p>
      <h2>Analytics</h2>
      <p>Google Analytics 4 may be used through Google tag to measure page views and product interactions. The site does not send resume text, JD text, answer text, or notes to Google Analytics. Google may process browser, device, IP, and cookie data according to its own terms.</p>
      <h2>Third-Party Services</h2>
      <p>AI generation and answer feedback may be handled by OpenRouter and the model provider selected for the site. Analytics may be handled by Google Analytics 4. No payment, authentication, email, saved-session, or storage provider is connected in this build.</p>
      <h2>Contact</h2>
      <p>For privacy questions, email {site.supportEmail}.</p>
    </main>
  );
}
