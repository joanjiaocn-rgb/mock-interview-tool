# PRD: Interview English Coach - 48-Hour Prep Kit

## Status
- Stage: PRD v1
- Date: 2026-08-15
- Product direction: Pivot from a generic AI mock interview tool to a 48-hour English behavioral interview prep kit.
- Repository note: This document is a local product source file. It does not need special GitHub handling beyond normal project commits.

## One-Sentence Positioning
Interview English Coach helps non-native English candidates turn one real job description and one resume into a 48-hour behavioral interview prep kit: risk map, story match, top questions, English answer drafts, practice feedback, and a last-minute cheat sheet.

## Core Judgment
The broad "AI mock interview" market is crowded and hard to win with a lightweight v0. The sharper opportunity is the urgent pre-interview moment: a candidate has an English interview soon, knows their experience, but cannot quickly decide what stories to use or how to say them in professional English.

The product should win by being:
- Specific: built around one JD, one resume, and one upcoming interview.
- Fast: useful within 10-15 minutes, not after a long onboarding flow.
- Concrete: produces a prep kit the user can review before the interview.
- Bilingual where helpful: Chinese strategy can explain the logic, while the final answer remains natural English.
- Privacy-conscious: browser-side v0, no account, no payment, no video storage.

## Primary ICP
Primary user: Chinese-speaking or other non-native English candidates preparing for an English behavioral interview within the next 48 hours.

High-intent scenarios:
- "I have a behavioral interview tomorrow and do not know which stories to prepare."
- "I can write my resume, but my spoken answer sounds translated or vague."
- "I pasted the JD into ChatGPT, but the output is generic and not organized for practice."
- "I need a short cheat sheet before the interview, not a whole course."

Secondary users:
- International students preparing for internship or new-grad interviews.
- Career switchers applying to English-speaking roles.
- Candidates who already have 3-5 project stories but need to map them to likely questions.

## Product Promise
After pasting a JD and resume, the user should receive a compact prep kit with:
1. Interview Risk Map: the 4-6 competencies the role is likely to test.
2. Story Match: which resume story should answer each high-probability question.
3. Top Questions: 6-12 behavioral questions ranked by relevance.
4. Answer Drafts: STAR-based English drafts that use the user's own experience.
5. Practice Feedback: score and concrete edits after the user rewrites an answer.
6. Last-Minute Cheat Sheet: stories, questions, reusable phrases, warnings, and practiced answers.

## MVP Scope
Must include:
- JD input.
- Resume or experience notes input.
- Role and seniority selection.
- 8 / 10 / 12 question set sizes, while visually emphasizing the first 6 as the core prep kit.
- Risk Map derived from JD/resume role signals.
- Story Match per question.
- Chinese strategy note per question.
- STAR outline per question.
- English answer draft per question.
- Text practice answer input.
- Feedback score across clarity, structure, specificity, English phrasing, and confidence.
- Exportable 48-hour prep kit as a text file.
- Privacy, Terms, Contact, sitemap, robots, llms.txt, Bing verification file, and GA4 event tracking.

## Not Do
Do not build in v1:
- Video interview.
- Human coaching.
- Peer mock interviews.
- Full interview course.
- Large generic question bank.
- Algorithm, system design, case interview, or coding interview coverage.
- Employer-specific claims.
- Job offer guarantees.
- Account system, saved sessions, or payment.

Voice practice is a likely v2 feature. It should be added before video because it improves spoken confidence without creating the same storage, privacy, and UX burden.

## Core User Flow
1. User lands on the home page and sees "Build my 48-hour prep kit."
2. User opens `/practice`.
3. User selects target role and level.
4. User pastes one real JD.
5. User pastes resume bullets, project notes, metrics, or 3-5 stories.
6. User clicks "Build prep kit."
7. The workspace shows:
   - Risk Map: role signals to prepare for.
   - Story Match: the best story anchor for the current question.
   - Top Questions: high-probability behavioral questions.
   - Answer Method: why they ask, Chinese strategy, STAR outline.
   - English Draft: a starting answer to adapt.
8. User rewrites one answer in their own English.
9. User clicks "Get feedback."
10. User exports the 48-hour prep kit.

## Page Matrix
| Route | Index | Primary Intent | Purpose |
| --- | --- | --- | --- |
| `/` | yes | 48-hour English interview prep kit | Explain the urgent use case and route users to the tool. |
| `/practice` | yes | Build interview prep kit | Core tool page for JD/resume input, risk map, story match, questions, practice, and export. |
| `/how-to` | yes | How to use interview prep kit | First-time guide for the 48-hour workflow. |
| `/answer-builder` | yes | STAR interview answer builder | Static SEO support page for answer structure. |
| `/examples` | yes | English interview answer examples | Example answers with strategy notes. |
| `/interview-cheat-sheet` | no | Interview cheat sheet | Result-oriented support page for export structure. |
| `/pricing` | yes | Free v0 scope | Explain free scope and future paid direction without charging now. |
| `/privacy` | yes | Privacy | Explain browser-side handling and analytics boundaries. |
| `/terms` | yes | Terms | Educational-use limits and no outcome guarantee. |
| `/contact` | yes | Contact | Support and feedback. |

## Data Contract
```json
{
  "session": {
    "targetRole": "Product Manager",
    "level": "mid",
    "jobDescription": "string",
    "resumeText": "string",
    "riskMap": [
      {
        "signal": "stakeholder alignment",
        "source": "jd | resume | role",
        "prepAdvice": "string"
      }
    ],
    "questions": [
      {
        "id": "q-1",
        "question": "string",
        "reason": "string",
        "storyMatch": "string",
        "chineseStrategy": "string",
        "starOutline": {
          "situation": "string",
          "task": "string",
          "action": "string",
          "result": "string"
        },
        "englishDraft": "string",
        "phraseAlternatives": ["string"]
      }
    ],
    "mockAnswers": [
      {
        "questionId": "q-1",
        "answerText": "string",
        "feedback": {
          "clarity": 1,
          "structure": 1,
          "specificity": 1,
          "englishPhrasing": 1,
          "confidence": 1,
          "summary": "string",
          "rewriteMoves": ["string"]
        }
      }
    ],
    "prepKit": {
      "topQuestions": ["string"],
      "riskMap": ["string"],
      "storyBank": ["string"],
      "phrasesToUse": ["string"],
      "phrasesToAvoid": ["string"],
      "practicedAnswers": ["string"],
      "lastMinutePlan": ["string"]
    }
  }
}
```

## Compliance and Trust Boundaries
- State clearly that JD, resume, notes, and answers may contain personal information.
- Keep v1 browser-side by default.
- Do not store resumes, transcripts, or answers in a production account.
- Do not send resume text, JD text, answer text, or notes to analytics.
- Do not claim guaranteed interview performance, job offers, recruiter accuracy, or official employer feedback.
- Generated drafts must be based on user-provided experience and should avoid inventing achievements.

## Acceptance Criteria
Real user task:
"I have an English behavioral interview in 48 hours. I paste the JD and resume, get the likely interview risks, know which stories to use, practice one answer, and export a cheat sheet I can review before the call."

The product is acceptable when:
- The first screen communicates the 48-hour prep kit value.
- The practice page uses "Build prep kit" language, not generic "practice set" language.
- The tool shows a visible Risk Map.
- Each question has a visible Story Match.
- The export includes risk map, story bank, top questions, practiced answers, and notes.
- Mobile users can complete the flow without horizontal overflow.
- Build and Playwright smoke tests pass.

## Next Decisions
- Add voice practice in v2 if text prep shows engagement.
- Decide whether to keep the brand name "Interview English Coach" or rename around "Prep Kit."
- Validate which audience converts better: Chinese-speaking candidates, international students, or general non-native speakers.
- Revisit pricing only after usage data shows repeated exports or multiple-role preparation.

[NEEDS_REVIEW]
