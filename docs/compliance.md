# Compliance Review v0

## Data Handling
- User answers: browser state in v0; sent to OpenRouter/model provider only when the user requests AI answer feedback.
- Resume text: browser state in v0; sent to OpenRouter/model provider only when the user requests AI prep kit generation.
- Voice transcripts: browser state only in v0.
- Coach notes: browser state only in v0.
- Exported report: generated locally as a Markdown file.
- Audio: recorded locally in the browser session for playback; not uploaded or stored by this site.
- Video: not recorded.
- Accounts: not enabled.
- Payments: not enabled.
- AI API: enabled through Cloudflare Pages Functions and OpenRouter. Secrets stay server-side.
- Analytics: Google Analytics 4 via Google tag; page views and interaction events only. Resume text, answer text, microphone audio, and transcripts are not sent.

## Legal Routes
- /privacy
- /terms
- /contact

## P0 Risks Before Production
- Keep Privacy and Terms aligned with the actual AI provider, routed model, retention, and data use.
- If analytics vendors or consent controls are changed, update Privacy and Terms to match the actual events and cookie behavior.
- If PDF/DOCX parsing or server-side resume storage is added, update Privacy and Terms before launch.
- If server-side audio transcription is added, disclose provider, retention, deletion, and user consent.
- If accounts are added, define authentication, deletion, session retention, and breach contact paths.
- If payments are added, define refunds, tax handling, failed payments, and entitlement limits.
- If video recording or server-side audio storage is added, add explicit consent and storage/deletion policy.

## Claims Review
Current copy avoids employment guarantees and official endorsement claims.
