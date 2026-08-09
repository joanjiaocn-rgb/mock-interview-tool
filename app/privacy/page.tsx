import type { Metadata } from "next";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy policy for Mock Interview Tool.",
  alternates: {
    canonical: `${site.url}/privacy`,
  },
};

export default function PrivacyPage() {
  return (
    <main className="main legal-page">
      <p className="section-kicker">Privacy</p>
      <h1>Privacy Policy</h1>
      <p>Last updated: August 9, 2026.</p>
      <p>
        Mock Interview Tool is currently a local-first browser tool. Resume text, interview answers, notes, scoring changes, microphone recordings, voice transcripts, and exported reports are processed in your browser during the session.
      </p>
      <h2>Data We Collect</h2>
      <p>This v0 does not require an account, does not record video, and does not send resume text, interview answers, or microphone recordings to a production server.</p>
      <h2>Resume Text</h2>
      <p>
        Resume upload currently supports plain text formats or pasted resume content. The text is used in the browser to tailor practice questions for the current session.
      </p>
      <h2>Voice Input</h2>
      <p>
        Voice answer mode uses your browser microphone permission, records audio locally for session playback, and uses browser speech recognition for live transcript when available. Audio is not uploaded or stored by this site.
      </p>
      <h2>Analytics</h2>
      <p>Analytics are not configured in this local build. If analytics are added later, this policy should be updated before public launch.</p>
      <h2>Third-Party Services</h2>
      <p>No payment, automated scoring, authentication, email, or storage provider is connected in this build.</p>
      <h2>Contact</h2>
      <p>For privacy questions, email {site.supportEmail}.</p>
    </main>
  );
}
