# Compliance Review v0

## Data Handling
- User answers: browser state only in v0.
- Resume text: browser state only in v0; plain text upload or pasted content is used to tailor interview prompts.
- Voice transcripts: browser state only in v0.
- Coach notes: browser state only in v0.
- Exported report: generated locally as a text file.
- Audio: recorded locally in the browser session for playback; not uploaded or stored by this site.
- Video: not recorded.
- Accounts: not enabled.
- Payments: not enabled.
- AI API: not enabled.
- Analytics: Google Analytics 4 via Google tag; page views and interaction events only. Resume text, answer text, microphone audio, and transcripts are not sent.

## Legal Routes
- /privacy
- /terms
- /contact

## P0 Risks Before Production
- If AI feedback is added, update Privacy and Terms to disclose provider, retention, and data use.
- If analytics vendors or consent controls are changed, update Privacy and Terms to match the actual events and cookie behavior.
- If PDF/DOCX parsing or server-side resume storage is added, update Privacy and Terms before launch.
- If server-side audio transcription is added, disclose provider, retention, deletion, and user consent.
- If accounts are added, define authentication, deletion, session retention, and breach contact paths.
- If payments are added, define refunds, tax handling, failed payments, and entitlement limits.
- If video recording or server-side audio storage is added, add explicit consent and storage/deletion policy.

## Claims Review
Current copy avoids employment guarantees and official endorsement claims.
