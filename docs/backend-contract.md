# Backend Contract Draft

## Current Backend
- Static Next.js export on Cloudflare Pages.
- Cloudflare Pages Functions for AI prep kit generation and answer feedback.
- No accounts, saved sessions, D1, R2, payments, or server-side resume storage.

## Future Cloudflare-First Architecture
- Cloudflare Pages for frontend.
- Workers API for saved sessions, AI scoring, and account actions.
- D1 for users, sessions, rubric scores, entitlements, and audit logs.
- R2 only if server-side resume storage, audio, or video assets are added.
- Queues for async scoring jobs if AI feedback is added.

## Draft Endpoints
| Endpoint | Method | Auth | Purpose |
| --- | --- | --- | --- |
| /api/prep-kit | POST | none | Generate risk map, questions, story matches, and suggested answer drafts through OpenRouter. |
| /api/answer-feedback | POST | none | Generate answer score, strengths, improvement suggestions, and rewrite moves through OpenRouter. |
| /api/sessions | POST | required | Create saved interview session |
| /api/sessions/:id | GET | owner | Read saved session |
| /api/sessions/:id | PATCH | owner | Update answers, notes, scores |
| /api/score | POST | paid entitlement | Request AI scoring |
| /api/export/:id | GET | owner | Download report |

## Env Vars
- OPENROUTER_API_KEY
- OPENROUTER_MODEL
- OPENROUTER_SITE_URL
- OPENROUTER_SITE_NAME
- SESSION_SECRET if saved sessions are added
- DATABASE_URL or D1 binding
- STRIPE_SECRET_KEY if paid plans are added
- STRIPE_WEBHOOK_SECRET if paid plans are added

Secrets must not be committed.
