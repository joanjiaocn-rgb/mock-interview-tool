"use client";

import { useMemo, useRef, useState } from "react";
import {
  ArrowDownToLine,
  CheckCircle2,
  ClipboardList,
  FileText,
  Languages,
  ListChecks,
  PencilLine,
  RefreshCcw,
  Target,
  Upload,
} from "lucide-react";
import { trackAnalyticsEvent } from "@/lib/analytics";

type Role = "pm" | "data" | "software" | "design" | "marketing" | "leadership";
type Level = "early" | "mid" | "senior";
type QuestionCount = 8 | 10 | 12;
type ScoreKey = "clarity" | "structure" | "specificity" | "englishPhrasing" | "confidence";

type GeneratedQuestion = {
  id: string;
  question: string;
  reason: string;
  chineseStrategy: string;
  starOutline: {
    situation: string;
    task: string;
    action: string;
    result: string;
  };
  englishDraft: string;
  phraseAlternatives: string[];
};

const roles: Array<{ id: Role; label: string; cue: string; interviewSignal: string }> = [
  { id: "pm", label: "Product Manager", cue: "PM", interviewSignal: "prioritization and business judgment" },
  { id: "data", label: "Data Analyst", cue: "Data", interviewSignal: "analytical thinking and impact" },
  { id: "software", label: "Software Engineer", cue: "Eng", interviewSignal: "technical ownership and collaboration" },
  { id: "design", label: "UX Designer", cue: "UX", interviewSignal: "user insight and design decisions" },
  { id: "marketing", label: "Marketing", cue: "Growth", interviewSignal: "customer language and measurable experiments" },
  { id: "leadership", label: "Leadership", cue: "Lead", interviewSignal: "operating judgment and team trust" },
];

const levels: Array<{ id: Level; label: string; cue: string }> = [
  { id: "early", label: "Entry", cue: "learning" },
  { id: "mid", label: "Mid", cue: "ownership" },
  { id: "senior", label: "Senior", cue: "judgment" },
];

const questionCountOptions: Array<{ id: QuestionCount; label: string; cue: string }> = [
  { id: 8, label: "8", cue: "Quick" },
  { id: 10, label: "10", cue: "Standard" },
  { id: 12, label: "12", cue: "Deep" },
];

const baseBehavioralQuestions = [
  "Tell me about a time you handled ambiguity and still delivered a useful result.",
  "Describe a time you disagreed with a teammate or stakeholder. How did you move the work forward?",
  "Tell me about a project where the first plan did not work. What changed?",
  "Give an example of receiving difficult feedback and improving your work.",
  "Tell me about a time you had to prioritize under a tight deadline.",
  "Describe a mistake that changed how you work now.",
  "Tell me about a time you influenced someone without formal authority.",
  "Walk me through a project you are proud of. What was your personal contribution?",
  "Tell me about a time you used data or customer feedback to make a decision.",
  "Describe a situation where you had to communicate complex work simply.",
  "Tell me about a time you took ownership beyond your assigned scope.",
  "What would your previous manager say is your strongest working habit?",
];

const roleQuestions: Record<Role, string[]> = {
  pm: [
    "Tell me about a time you chose not to build a requested feature.",
    "Describe a product decision where metrics and user feedback pointed in different directions.",
    "Tell me about a launch where alignment was harder than execution.",
  ],
  data: [
    "Tell me about a time your analysis changed a business decision.",
    "Describe a moment when you found a metric or dashboard was misleading.",
    "Tell me about a time you explained uncertainty to a non-technical audience.",
  ],
  software: [
    "Tell me about a production issue or technical risk you helped resolve.",
    "Describe a time you improved quality without slowing the team down.",
    "Tell me about a technical tradeoff you had to explain to a non-engineer.",
  ],
  design: [
    "Tell me about a time user research changed your design direction.",
    "Describe a design tradeoff you made because of engineering or business constraints.",
    "Tell me about a time you handled critique and improved the work.",
  ],
  marketing: [
    "Tell me about a campaign that did not work and what you changed.",
    "Describe a time customer language improved your positioning.",
    "Tell me about a growth experiment where the result surprised you.",
  ],
  leadership: [
    "Tell me about a time you rebuilt trust after a missed commitment.",
    "Describe a conflict where you were partly wrong.",
    "Tell me about a time you raised the bar without burning out the team.",
  ],
};

const roleKeywords: Record<Role, string[]> = {
  pm: ["roadmap", "activation", "retention", "conversion", "experiment", "metrics", "user", "launch", "stakeholder", "prioritize"],
  data: ["SQL", "dashboard", "experiment", "analysis", "metric", "pipeline", "Python", "forecast", "Tableau", "Looker"],
  software: ["React", "API", "system", "database", "latency", "incident", "TypeScript", "Python", "AWS", "Cloudflare"],
  design: ["research", "prototype", "Figma", "usability", "accessibility", "design system", "journey", "interaction"],
  marketing: ["SEO", "campaign", "email", "content", "positioning", "channel", "conversion", "lifecycle", "launch"],
  leadership: ["strategy", "hiring", "coaching", "planning", "conflict", "incident", "budget", "roadmap", "performance"],
};

const rubric: Array<{ id: ScoreKey; label: string; hint: string }> = [
  { id: "clarity", label: "Clarity", hint: "Direct, easy to follow, no rambling" },
  { id: "structure", label: "Structure", hint: "Clear STAR arc with a strong ending" },
  { id: "specificity", label: "Specificity", hint: "Real details, constraints, numbers, artifacts" },
  { id: "englishPhrasing", label: "English phrasing", hint: "Natural, concise, interview-ready English" },
  { id: "confidence", label: "Confidence", hint: "Calm ownership without overclaiming" },
];

const strongPhrases = [
  "The constraint I optimized for was...",
  "My specific responsibility was...",
  "The tradeoff was...",
  "I validated this by...",
  "The measurable result was...",
  "What I would repeat next time is...",
];

const chineseThinkingLabel = "\u4e2d\u6587\u601d\u8def";
const chineseStrategyTemplate = (resumeAnchor: string) =>
  `\u76f4\u63a5\u56de\u7b54 + STAR\u3002\u7528 "${resumeAnchor}" \u8bb2\u6e05\u4f60\u505a\u4e86\u4ec0\u4e48\u3001\u4e3a\u4ec0\u4e48\u8fd9\u6837\u505a\u3001\u7ed3\u679c\u662f\u4ec0\u4e48\u3002`;

function scoreLabel(score: number) {
  if (score >= 84) return "Ready to rehearse aloud";
  if (score >= 68) return "Good draft, sharpen examples";
  if (score >= 52) return "Useful start, add evidence";
  return "Needs STAR structure first";
}

function cleanLines(text: string) {
  return text
    .split(/\r?\n|\u2022|-/)
    .map((line) => line.replace(/\s+/g, " ").trim())
    .filter((line) => line.length > 24 && line.length < 220)
    .filter((line) => !/(email|phone|address|linkedin|github)/i.test(line));
}

function firstSentence(text: string, fallback: string) {
  const match = text.replace(/\s+/g, " ").trim().match(/^.{35,150}?(?:\.|,|;|$)/);
  return match?.[0]?.replace(/[.,;]$/, "") || fallback;
}

function extractSignals(text: string, selectedRole: Role) {
  const normalized = text.toLowerCase();
  return roleKeywords[selectedRole].filter((keyword) => normalized.includes(keyword.toLowerCase())).slice(0, 6);
}

function makeEnglishDraft(roleLabel: string, resumeLine: string, jobSignal: string, index: number) {
  const openers = [
    "One example that fits this role is a project where I had to turn an unclear problem into a concrete plan.",
    "A relevant example is when I worked on an initiative with unclear requirements and real delivery pressure.",
    "I would answer this with a story where my main contribution was creating clarity and driving follow-through.",
  ];

  return `${openers[index % openers.length]} The situation was related to ${resumeLine}. My task was to connect the business need with ${jobSignal}, decide what mattered most, and keep the team focused. I took action by clarifying the goal, aligning the people involved, and using evidence instead of assumptions. The result was a more reliable outcome, and the lesson I would bring into this ${roleLabel} role is to make tradeoffs explicit early.`;
}

function generateQuestions(role: Role, level: Level, count: QuestionCount, jdText: string, resumeText: string): GeneratedQuestion[] {
  const roleMeta = roles.find((item) => item.id === role) ?? roles[0];
  const levelMeta = levels.find((item) => item.id === level) ?? levels[1];
  const jdLines = cleanLines(jdText);
  const resumeLines = cleanLines(resumeText);
  const jdSignal = extractSignals(jdText, role);
  const resumeSignal = extractSignals(resumeText, role);
  const mergedQuestions = [...roleQuestions[role], ...baseBehavioralQuestions];

  return Array.from({ length: count }, (_, index) => {
    const jdAnchor = jdLines[index % Math.max(jdLines.length, 1)] ?? firstSentence(jdText, roleMeta.interviewSignal);
    const resumeAnchor = resumeLines[index % Math.max(resumeLines.length, 1)] ?? firstSentence(resumeText, "one project or achievement from your background");
    const signal = jdSignal[index % Math.max(jdSignal.length, 1)] ?? resumeSignal[index % Math.max(resumeSignal.length, 1)] ?? roleMeta.interviewSignal;
    const question = index < 4
      ? `${mergedQuestions[index]} Please connect it to this role's need for ${signal}.`
      : mergedQuestions[index % mergedQuestions.length];

    return {
      id: `q-${index + 1}`,
      question,
      reason: `JD signal: ${signal}. The interviewer wants proof of ${levelMeta.cue}.`,
      chineseStrategy: chineseStrategyTemplate(resumeAnchor),
      starOutline: {
        situation: `Story: ${resumeAnchor}.`,
        task: `Goal + constraint around ${signal}.`,
        action: "2-3 actions you owned.",
        result: "Metric, decision, or lesson.",
      },
      englishDraft: makeEnglishDraft(roleMeta.label, resumeAnchor, signal, index),
      phraseAlternatives: strongPhrases.slice(index % 3, index % 3 + 3),
    };
  });
}

function readinessScore(scores: Record<ScoreKey, number>) {
  const total = rubric.reduce((sum, item) => sum + scores[item.id], 0);
  return Math.round((total / (rubric.length * 5)) * 100);
}

export function InterviewStudio() {
  const [role, setRole] = useState<Role>("pm");
  const [level, setLevel] = useState<Level>("mid");
  const [questionCount, setQuestionCount] = useState<QuestionCount>(10);
  const [jdText, setJdText] = useState("");
  const [resumeText, setResumeText] = useState("");
  const [resumeName, setResumeName] = useState("");
  const [activeQuestion, setActiveQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [notes, setNotes] = useState("");
  const [scores, setScores] = useState<Record<ScoreKey, number>>({
    clarity: 3,
    structure: 3,
    specificity: 2,
    englishPhrasing: 3,
    confidence: 3,
  });
  const answerRef = useRef<HTMLTextAreaElement | null>(null);

  const questions = useMemo(() => generateQuestions(role, level, questionCount, jdText, resumeText), [role, level, questionCount, jdText, resumeText]);
  const currentQuestion = questions[activeQuestion] ?? questions[0];
  const activeAnswer = answers[activeQuestion] ?? "";
  const score = readinessScore(scores);
  const roleMeta = roles.find((item) => item.id === role) ?? roles[0];
  const jdSignals = extractSignals(jdText, role);
  const resumeSignals = extractSignals(resumeText, role);
  const answeredCount = answers.filter((answer) => answer.trim()).length;

  const reportAnalyticsEvent = (eventName: string, data: Record<string, string | number | boolean> = {}) => {
    trackAnalyticsEvent(eventName, {
      selected_role: role,
      selected_level: level,
      question_count: questionCount,
      ...data,
    });
  };

  const updateAnswer = (value: string) => {
    setAnswers((current) => {
      const next = [...current];
      next[activeQuestion] = value;
      return next;
    });
  };

  const handleResumeFile = async (file?: File) => {
    if (!file) return;

    const text = await file.text();
    setResumeText(text);
    setResumeName(file.name);
    reportAnalyticsEvent("resume_uploaded", { size: file.size });
  };

  const focusGeneratedRound = () => {
    setActiveQuestion(0);
    window.setTimeout(() => answerRef.current?.focus(), 0);
    reportAnalyticsEvent("prep_round_generated", {
      jd_chars: jdText.length,
      resume_chars: resumeText.length,
    });
  };

  const resetWorkspace = () => {
    setActiveQuestion(0);
    setAnswers([]);
    setNotes("");
    setScores({
      clarity: 3,
      structure: 3,
      specificity: 2,
      englishPhrasing: 3,
      confidence: 3,
    });
    reportAnalyticsEvent("workspace_reset");
  };

  const downloadCheatSheet = () => {
    reportAnalyticsEvent("cheat_sheet_export");

    const report = [
      "Interview English Coach - Cheat Sheet",
      `Role: ${roleMeta.label}`,
      `Level: ${levels.find((item) => item.id === level)?.label}`,
      `Readiness score: ${score}/100 - ${scoreLabel(score)}`,
      "",
      "Top questions:",
      ...questions.slice(0, 6).map((question, index) => `${index + 1}. ${question.question}`),
      "",
      "Story bank:",
      ...cleanLines(resumeText).slice(0, 5).map((line) => `- ${line}`),
      "",
      "English phrases to reuse:",
      ...strongPhrases.map((phrase) => `- ${phrase}`),
      "",
      "Answers:",
      ...questions.flatMap((question, index) => [
        `${index + 1}. ${question.question}`,
        answers[index]?.trim() ? answers[index].trim() : question.englishDraft,
        "",
      ]),
      "Coach notes:",
      notes.trim() || "[No notes recorded]",
    ].join("\n");

    const blob = new Blob([report], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "interview-english-cheat-sheet.txt";
    anchor.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section className="studio-band" id="studio" aria-label="English interview preparation studio">
      <div className="studio-header">
        <div>
          <p className="section-kicker">
            <Languages size={16} aria-hidden="true" />
            Free behavioral interview prep
          </p>
          <h2>Paste the JD and your resume. Get questions, Chinese strategy, English drafts, and a cheat sheet.</h2>
        </div>
        <div className="timer-block" aria-live="polite">
          <CheckCircle2 size={18} aria-hidden="true" />
          <span>Free practice</span>
        </div>
      </div>

      <div className="studio-grid">
        <aside className="setup-panel" aria-label="Interview setup">
          <div className="control-group">
            <h3>Target role</h3>
            <select
              aria-label="Target role"
              className="select-input"
              onChange={(event) => {
                const nextRole = event.target.value as Role;
                setRole(nextRole);
                setActiveQuestion(0);
                reportAnalyticsEvent("role_change", { selected_role: nextRole });
              }}
              value={role}
            >
              {roles.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))}
            </select>
            <p className="role-focus">Focus: {roleMeta.interviewSignal}</p>
          </div>

          <div className="control-group">
            <h3>Level</h3>
            <div className="segmented-control" role="group" aria-label="Interview level">
              {levels.map((item) => (
                <button
                  className={item.id === level ? "segment active" : "segment"}
                  key={item.id}
                  onClick={() => {
                    setLevel(item.id);
                    setActiveQuestion(0);
                    reportAnalyticsEvent("level_change", { selected_level: item.id });
                  }}
                  type="button"
                >
                  <span>{item.label}</span>
                  <small>{item.cue}</small>
                </button>
              ))}
            </div>
          </div>

          <div className="control-group">
            <h3>Question set</h3>
            <div className="segmented-control" role="group" aria-label="Question count">
              {questionCountOptions.map((item) => (
                <button
                  className={item.id === questionCount ? "segment active" : "segment"}
                  aria-label={`${item.id} questions`}
                  key={item.id}
                  onClick={() => {
                    setQuestionCount(item.id);
                    setActiveQuestion(0);
                    reportAnalyticsEvent("question_count_change", { question_count: item.id });
                  }}
                  type="button"
                >
                  <span>{item.label}</span>
                  <small>{item.cue}</small>
                </button>
              ))}
            </div>
          </div>

          <div className="control-group resume-control">
            <h3>Job description</h3>
            <textarea
              aria-label="Job description"
              className="resume-text"
              onChange={(event) => setJdText(event.target.value)}
              placeholder="Paste the JD here. Include responsibilities, requirements, and interview focus if you have it."
              value={jdText}
            />
          </div>

          <div className="control-group resume-control">
            <h3>Resume or experience notes</h3>
            <label className="resume-dropzone" htmlFor="resume-file">
              <Upload size={16} aria-hidden="true" />
              <span>{resumeName || "Upload TXT / MD"}</span>
              <input
                accept=".txt,.md,.csv,.json,text/plain,text/markdown"
                id="resume-file"
                onChange={(event) => handleResumeFile(event.target.files?.[0])}
                type="file"
              />
            </label>
            <textarea
              aria-label="Resume or experience notes"
              className="resume-text"
              onChange={(event) => setResumeText(event.target.value)}
              placeholder="Paste resume bullets, projects, metrics, tools, or 3-5 stories you want to use."
              value={resumeText}
            />
            <div className="resume-actions">
              <button className="resume-build-button" onClick={focusGeneratedRound} type="button">
                <ClipboardList size={16} aria-hidden="true" />
                Create practice set
              </button>
              <button
                className="resume-clear-button"
                onClick={() => {
                  setJdText("");
                  setResumeText("");
                  setResumeName("");
                  resetWorkspace();
                }}
                type="button"
              >
                Clear
              </button>
            </div>
            <p className={jdText || resumeText ? "resume-status active" : "resume-status"}>
              {jdText || resumeText
                ? `Using ${jdSignals.length + resumeSignals.length || "general"} signal${jdSignals.length + resumeSignals.length === 1 ? "" : "s"} from your inputs.`
                : "Paste a JD and resume to make the questions more specific."}
            </p>
            {jdSignals.concat(resumeSignals).length > 0 ? (
              <div className="resume-signal-list" aria-label="Detected signals">
                {[...new Set([...jdSignals, ...resumeSignals])].map((signal) => (
                  <span key={signal}>{signal}</span>
                ))}
              </div>
            ) : null}
          </div>
        </aside>

        <div className="practice-panel">
          <div className="question-bar">
            <span className="question-count-label">
              Question {activeQuestion + 1} of {questions.length}
              <small>{roleMeta.label}</small>
            </span>
            <div className="question-actions">
              <button className="interview-start-button" onClick={focusGeneratedRound} type="button">
                <ClipboardList size={17} aria-hidden="true" />
                Update practice set
              </button>
              <button className="voice-command" onClick={downloadCheatSheet} type="button">
                <ArrowDownToLine size={17} aria-hidden="true" />
                Export cheat sheet
              </button>
            </div>
          </div>

          <div className="question-display">
            <p className="interviewer-label">High-probability interviewer question</p>
            <h3>{currentQuestion.question}</h3>
          </div>

          <div className="question-tabs" role="tablist" aria-label="Question list">
            {questions.map((question, index) => (
              <button
                aria-selected={index === activeQuestion}
                className={index === activeQuestion ? "question-tab active" : "question-tab"}
                key={question.id}
                onClick={() => setActiveQuestion(index)}
                role="tab"
                type="button"
              >
                {index + 1}
              </button>
            ))}
          </div>

          <div className="coach-card-grid">
            <article>
              <p>Why they ask</p>
              <span>{currentQuestion.reason}</span>
            </article>
            <article>
              <p>{chineseThinkingLabel}</p>
              <span>{currentQuestion.chineseStrategy}</span>
            </article>
          </div>

          <div className="star-grid" aria-label="STAR answer outline">
            {Object.entries(currentQuestion.starOutline).map(([key, value]) => (
              <article key={key}>
                <strong>{key}</strong>
                <span>{value}</span>
              </article>
            ))}
          </div>

          <label className="answer-label" htmlFor="draft">
            English draft to adapt
          </label>
          <textarea className="answer-box compact" id="draft" readOnly value={currentQuestion.englishDraft} />

          <label className="answer-label" htmlFor="answer">
            Your practiced answer
          </label>
          <textarea
            className="answer-box"
            id="answer"
            onChange={(event) => updateAnswer(event.target.value)}
            placeholder="Rewrite the draft in your own words. Keep I-statements, add exact metrics, and end with what you learned."
            ref={answerRef}
            value={activeAnswer}
          />

          <div className="coach-strip" aria-label="Natural English phrase alternatives">
            {currentQuestion.phraseAlternatives.map((phrase) => (
              <span key={phrase}>
                <PencilLine size={14} aria-hidden="true" />
                {phrase}
              </span>
            ))}
          </div>
        </div>

        <aside className="score-panel" aria-label="Answer review and cheat sheet">
          <div className="readiness-meter">
            <div>
              <p>Readiness</p>
              <strong>{score}/100</strong>
            </div>
            <span>{scoreLabel(score)}</span>
          </div>

          <div className="rubric-stack">
            {rubric.map((item) => (
              <label className="rubric-row" key={item.id}>
                <span>
                  <strong>{item.label}</strong>
                  <small>{item.hint}</small>
                </span>
                <input
                  aria-label={`${item.label} score`}
                  max="5"
                  min="1"
                  onChange={(event) =>
                    setScores((current) => ({
                      ...current,
                      [item.id]: Number(event.target.value),
                    }))
                  }
                  type="range"
                  value={scores[item.id]}
                />
                <b>{scores[item.id]}</b>
              </label>
            ))}
          </div>

          <label className="answer-label" htmlFor="notes">
            Review notes
          </label>
          <textarea
            className="notes-box"
            id="notes"
            onChange={(event) => setNotes(event.target.value)}
            placeholder="Write gaps, missing metrics, better verbs, and follow-up questions."
            value={notes}
          />

          <div className="cheat-sheet">
            <h3>Interview Cheat Sheet</h3>
            <ul>
              <li>Story: {cleanLines(resumeText)[0] ?? "prepare one quantified story"}</li>
              <li>Signal: {jdSignals[0] ?? roleMeta.interviewSignal}</li>
              <li>Use: {strongPhrases[0]}</li>
              <li>Avoid: "I just helped with..."</li>
            </ul>
          </div>

          <div className="report-actions">
            <button className="button primary" onClick={downloadCheatSheet} type="button">
              <ArrowDownToLine size={17} aria-hidden="true" />
              Export
            </button>
            <button className="button secondary" onClick={resetWorkspace} type="button">
              <RefreshCcw size={17} aria-hidden="true" />
              Reset
            </button>
          </div>
        </aside>
      </div>

      <div className="session-summary" aria-label="Session summary">
        <div>
          <CheckCircle2 size={18} aria-hidden="true" />
          <span>{answeredCount} practiced</span>
        </div>
        <div>
          <ListChecks size={18} aria-hidden="true" />
          <span>{questionCount}-question behavioral prep</span>
        </div>
        <div>
          <FileText size={18} aria-hidden="true" />
          <span>No payment or account required</span>
        </div>
        <div>
          <Target size={18} aria-hidden="true" />
          <span>Chinese strategy + English answer</span>
        </div>
      </div>
    </section>
  );
}
