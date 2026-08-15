# QA Acceptance Plan

## Public Page Checks
- Home loads at /.
- /about, /privacy, /terms, /contact load.
- /robots.txt, /sitemap.xml, /llms.txt load.
- Header and footer links are valid.
- Canonical metadata is present.
- FAQ schema is included on home.
- GA4 pageviews fire on navigation when the Google tag is configured.

## Tool Task Checks
- Select each role.
- Switch level and format.
- Switch round length between 8, 10, and 12 questions and confirm the question tabs update after building.
- Timer starts, pauses, and resets.
- Read prompt button is visible.
- Record answer button is visible and gracefully disabled if microphone recording is unavailable.
- Live transcript runs only when browser speech recognition is available; otherwise the local audio recording still works.
- Paste or upload plain text resume content and build an AI-generated or fallback resume-tailored question round.
- Question tabs change the active prompt.
- Answer textarea updates.
- Rubric sliders update readiness score.
- Export report downloads a Markdown file with suggested drafts and practiced answers.
- Reset clears current session.
- Analytics events do not include resume text, answer text, or microphone audio.
- AI endpoints keep `OPENROUTER_API_KEY` server-side and fall back gracefully if the provider is unavailable.

## Mobile Checks
- No horizontal scroll at 375px width.
- Header navigation wraps cleanly.
- Tool controls stack without overlap.
- Buttons remain touchable.

## Gate
Local QA can reach CONDITIONAL_GO after build and browser smoke. Public launch remains blocked until owner review and deployment credentials exist.
