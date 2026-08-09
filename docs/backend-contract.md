# Backend Contract Draft

## Current Backend
None. v0 is static and browser-only.

## Future Cloudflare-First Architecture
- Cloudflare Pages for frontend.
- Workers API for saved sessions, AI scoring, and account actions.
- D1 for users, sessions, rubric scores, entitlements, and audit logs.
- R2 only if server-side resume storage, audio, or video assets are added.
- Queues for async scoring jobs if AI feedback is added.

## Draft Endpoints
| Endpoint | Method | Auth | Purpose |
| --- | --- | --- | --- |
| /api/sessions | POST | required | Create saved interview session |
| /api/sessions/:id | GET | owner | Read saved session |
| /api/sessions/:id | PATCH | owner | Update answers, notes, scores |
| /api/score | POST | paid entitlement | Request AI scoring |
| /api/export/:id | GET | owner | Download report |

## Env Vars
- SESSION_SECRET
- AI_PROVIDER_API_KEY
- DATABASE_URL or D1 binding
- STRIPE_SECRET_KEY if paid plans are added
- STRIPE_WEBHOOK_SECRET if paid plans are added

Secrets must not be committed.
