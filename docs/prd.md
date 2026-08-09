# PRD: Mock Interview Tool v0

## Positioning
Mock Interview Tool is a browser-based workspace for candidates who need realistic interview practice, timed answers, rubric scoring, and a reusable report.

## Primary ICP
- Job seekers preparing for product, software, design, data, marketing, or leadership interviews.
- Career switchers who need structure and repeated practice.
- Coaches who want a lightweight rubric for live sessions.

## User Tasks
- Choose role, seniority, interview format, and 5/7/10 question round length.
- Practice against realistic prompts with a timer.
- Record the spoken answer locally and use browser transcript when available.
- Write answer notes during or after the response.
- Score the response against a structured rubric.
- Export a text report for follow-up drills.

## MVP
- Public home page with the tool as the primary experience.
- Role-based 5-10 question round builder.
- Timer controls.
- Local browser audio recording.
- Browser speech transcript when supported.
- Manual rubric scoring.
- Browser-side report export.
- Privacy, Terms, About, Contact, sitemap, robots, llms.txt.

## Not Do
- No employment outcome guarantees.
- No server-side audio storage or video recording in v0.
- No account storage, payment, AI API, or server transcript analysis in v0.
- No public launch automation without owner review.

## Route Contract
| Route | Index | Purpose |
| --- | --- | --- |
| / | yes | Tool and primary SEO landing page |
| /about | yes | Product context |
| /privacy | yes | Privacy policy |
| /terms | yes | Terms of use |
| /contact | yes | Support route |
| /llms.txt | yes | AI-readable site summary |

## Data Contract
The current v0 uses browser state only.

```json
{
  "session": {
    "role": "product",
    "level": "mid",
    "format": "mixed",
    "questionCount": 7,
    "questions": ["string"],
    "answers": ["string"],
    "recordingUrl": "browser object URL only",
    "scores": {
      "structure": 1,
      "evidence": 1,
      "clarity": 1,
      "depth": 1,
      "followup": 1
    },
    "notes": "string",
    "readinessScore": 0
  }
}
```
