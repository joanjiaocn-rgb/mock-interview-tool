"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowDownToLine,
  CheckCircle2,
  ClipboardList,
  Clock3,
  FileText,
  ListChecks,
  Mic,
  Mic2,
  MicOff,
  Pause,
  PencilLine,
  Play,
  RefreshCcw,
  RotateCcw,
  TimerReset,
  Upload,
  Volume2,
} from "lucide-react";
import { trackAnalyticsEvent } from "@/lib/analytics";

type BrowserSpeechAlternative = {
  transcript: string;
  confidence: number;
};

type BrowserSpeechResult = {
  isFinal: boolean;
  0: BrowserSpeechAlternative;
};

type BrowserSpeechResultList = {
  length: number;
  [index: number]: BrowserSpeechResult;
};

type BrowserSpeechEvent = Event & {
  resultIndex: number;
  results: BrowserSpeechResultList;
};

type BrowserSpeechErrorEvent = Event & {
  error: string;
};

type BrowserSpeechRecognition = {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: ((event: BrowserSpeechEvent) => void) | null;
  onerror: ((event: BrowserSpeechErrorEvent) => void) | null;
  onend: (() => void) | null;
};

type BrowserSpeechRecognitionConstructor = new () => BrowserSpeechRecognition;

declare global {
  interface Window {
    SpeechRecognition?: BrowserSpeechRecognitionConstructor;
    webkitSpeechRecognition?: BrowserSpeechRecognitionConstructor;
  }
}

type Role = "software" | "product" | "design" | "data" | "marketing" | "leadership";
type Level = "junior" | "mid" | "senior";
type Format = "behavioral" | "technical" | "case" | "mixed";
type QuestionCount = 5 | 7 | 10;

const roles: Array<{ id: Role; label: string; cue: string }> = [
  { id: "software", label: "Software", cue: "systems, tradeoffs, implementation clarity" },
  { id: "product", label: "Product", cue: "prioritization, metrics, user insight" },
  { id: "design", label: "UX Design", cue: "critique, process, constraints" },
  { id: "data", label: "Data", cue: "analysis, assumptions, impact" },
  { id: "marketing", label: "Marketing", cue: "positioning, channels, experiments" },
  { id: "leadership", label: "Leadership", cue: "judgment, conflict, operating rhythm" },
];

const levels: Array<{ id: Level; label: string }> = [
  { id: "junior", label: "Junior" },
  { id: "mid", label: "Mid-level" },
  { id: "senior", label: "Senior" },
];

const formats: Array<{ id: Format; label: string }> = [
  { id: "mixed", label: "Mixed loop" },
  { id: "behavioral", label: "Behavioral" },
  { id: "technical", label: "Technical" },
  { id: "case", label: "Case" },
];

const questionCountOptions: Array<{ id: QuestionCount; label: string; cue: string }> = [
  { id: 5, label: "5 prompts", cue: "focused screen" },
  { id: 7, label: "7 prompts", cue: "standard loop" },
  { id: 10, label: "10 prompts", cue: "deep round" },
];

const questionBank: Record<Role, Record<Format, string[]>> = {
  software: {
    mixed: [
      "Walk me through a complex project where the first design was wrong. What changed and why?",
      "Design a resilient notification service for interview scheduling across email, SMS, and in-app messages.",
      "Tell me about a production incident you helped resolve. What signals did you use?",
      "How would you decide whether to ship a quick fix or rework the underlying architecture?",
    ],
    behavioral: [
      "Tell me about a time you disagreed with a technical direction and changed the outcome.",
      "Describe a situation where you had to mentor someone under delivery pressure.",
      "What is a mistake in code review that changed how you work?",
      "Give an example of balancing quality with a deadline.",
    ],
    technical: [
      "Design an interview scheduling API with retries, idempotency, and audit history.",
      "How would you debug a page that is fast locally but slow in production?",
      "Explain how you would model permissions for free and paid interview sessions.",
      "What tradeoffs would you consider for storing transcripts and scoring feedback?",
    ],
    case: [
      "A mock interview product has high trial usage but low second-session return. Diagnose the problem.",
      "Your automated scoring workflow costs more than expected. Redesign the quota and fallback plan.",
      "A competitor launched video practice. Decide what to build next.",
      "Users report feedback feels generic. Propose an experiment to improve perceived value.",
    ],
  },
  product: {
    mixed: [
      "Define the MVP for a browser-based mock interview product for job seekers.",
      "A user says the feedback feels too harsh. How do you investigate and improve it?",
      "What metrics would you use to judge whether practice sessions create real value?",
      "Prioritize three features: follow-up prompts, video replay, resume-aware questions.",
    ],
    behavioral: [
      "Tell me about a time you killed a feature people liked.",
      "Describe a decision where you had weak data but needed to move.",
      "Give an example of aligning engineering, design, and leadership under ambiguity.",
      "Tell me about a time your product judgment was challenged.",
    ],
    technical: [
      "Design the data contract for a mock interview session and scoring report.",
      "How should the product handle failed scoring responses without breaking trust?",
      "What would you track in analytics without collecting sensitive interview answers?",
      "Explain a pricing entitlement model for free and paid sessions.",
    ],
    case: [
      "The product gets organic traffic but very few completed interviews. What do you change?",
      "Should this product launch as a free tool, freemium SaaS, or paid cohort service?",
      "A university wants team accounts. Scope the first B2B version.",
      "Interview prep traffic is seasonal. Build a retention plan.",
    ],
  },
  design: {
    mixed: [
      "Critique the first-run experience for a mock interview tool.",
      "Design an interface that helps candidates answer better without distracting them.",
      "How would you show scoring feedback so it feels useful instead of punitive?",
      "Walk through your design process for a dense professional dashboard.",
    ],
    behavioral: [
      "Tell me about a time you simplified a complex workflow.",
      "Describe a time research contradicted your design instinct.",
      "Give an example of handling critique from a non-designer.",
      "Tell me about a design tradeoff that helped engineering ship faster.",
    ],
    technical: [
      "Design the information architecture for interview setup, live practice, and report review.",
      "What states should exist for recording, scoring, quota limits, and export?",
      "How would you make the timer and notes accessible on mobile?",
      "Define reusable components for question cards, rubrics, and report sections.",
    ],
    case: [
      "Users abandon setup because it feels like a form. Redesign the flow.",
      "Recruiters want structured interview kits. Adapt the candidate tool for them.",
      "The mobile experience has low completion. Diagnose and propose changes.",
      "Make feedback easier to trust without adding fake authority.",
    ],
  },
  data: {
    mixed: [
      "How would you measure whether mock interviews improve readiness?",
      "A feature increases session starts but lowers completion. What do you investigate?",
      "Design an experiment for adaptive follow-up questions.",
      "Explain an analysis you would run before changing pricing.",
    ],
    behavioral: [
      "Tell me about a time your analysis changed a team decision.",
      "Describe a time you found a metric was misleading.",
      "Give an example of communicating uncertainty to leadership.",
      "Tell me about a project where data quality was the hard part.",
    ],
    technical: [
      "Model events for interview setup, question progress, scoring, and export.",
      "How would you detect generic answers from session data without reading private content?",
      "Create a funnel for first-session completion.",
      "What privacy boundaries would you set for analytics in an interview tool?",
    ],
    case: [
      "Conversion dropped after adding a sign-in step. Diagnose with limited data.",
      "Free users generate high compute cost. Propose a measurement plan.",
      "SEO traffic grows but product activation is flat. What is happening?",
      "Build a dashboard for weekly product review.",
    ],
  },
  marketing: {
    mixed: [
      "Position a mock interview tool for candidates who already use ChatGPT.",
      "Choose the first three acquisition channels and explain the tradeoffs.",
      "Create a launch plan for a privacy-first interview practice tool.",
      "How would you turn interview anxiety into useful product messaging?",
    ],
    behavioral: [
      "Tell me about a campaign that failed and what you changed.",
      "Describe a time you had to make a message more specific.",
      "Give an example of working with product on activation.",
      "Tell me about a time you used customer language to improve conversion.",
    ],
    technical: [
      "Define landing page sections for SEO and conversion.",
      "How would you measure channel quality beyond traffic?",
      "What claims should be avoided for a career advice product?",
      "Design a lifecycle email after a candidate completes one session.",
    ],
    case: [
      "Organic traffic lands on a generic interview questions page. Turn it into tool activation.",
      "Product Hunt brought signups but no retained users. What is your postmortem?",
      "A competitor owns broad keywords. Find wedge pages.",
      "Build a low-budget launch plan for the first 14 days.",
    ],
  },
  leadership: {
    mixed: [
      "Tell me about a time you rebuilt trust after a missed commitment.",
      "How do you diagnose a team that ships often but quality is falling?",
      "A senior stakeholder wants a risky launch date. What do you do?",
      "Describe how you would coach a team through ambiguous priorities.",
    ],
    behavioral: [
      "Tell me about a conflict where you were partly wrong.",
      "Describe a time you changed your operating cadence.",
      "Give an example of developing someone into a larger role.",
      "Tell me about a decision you would make differently now.",
    ],
    technical: [
      "Define a launch readiness gate for a product with scoring, payments, and user content.",
      "How would you structure incident review for a candidate-facing product?",
      "Design accountability across product, engineering, design, SEO, and ops.",
      "What signals would tell you to kill, iterate, or scale this site?",
    ],
    case: [
      "The site is useful but not growing. Decide where the team spends the next month.",
      "A privacy concern appears after launch. Lead the response.",
      "Revenue is small but engagement is strong. Make a resource allocation call.",
      "Two teams disagree on building video feedback. Resolve the decision.",
    ],
  },
};

const formatRoundOrder: Record<Format, Format[]> = {
  mixed: ["mixed", "behavioral", "technical", "case"],
  behavioral: ["behavioral", "mixed", "technical", "case"],
  technical: ["technical", "case", "mixed", "behavioral"],
  case: ["case", "mixed", "technical", "behavioral"],
};

const levelPrompts: Record<Level, string[]> = {
  junior: [
    "Explain a recent project step by step. Where did you need help, and what did you learn?",
    "Tell me about feedback you received and how your work changed afterward.",
    "What would you ask your manager in week one so you can contribute faster?",
  ],
  mid: [
    "Tell me about a decision where you owned the outcome without waiting for perfect direction.",
    "How do you balance delivery speed with quality when the timeline gets tight?",
    "Describe how you align partners when product, design, and engineering see the problem differently.",
  ],
  senior: [
    "How do you set direction when the signals are incomplete or conflicting?",
    "Describe a time you raised the quality bar for a team without slowing delivery.",
    "What risk would you watch in the first 90 days of this role, and how would you reduce it?",
  ],
};

const rubric = [
  { id: "structure", label: "Structure", hint: "Clear setup, steps, and conclusion" },
  { id: "evidence", label: "Evidence", hint: "Specific details, numbers, tradeoffs" },
  { id: "clarity", label: "Clarity", hint: "Concise language and direct answer" },
  { id: "depth", label: "Depth", hint: "Risks, alternatives, and reasoning" },
  { id: "followup", label: "Follow-up", hint: "Handles probing without drifting" },
];

const frameworkTips = [
  "Start with a one-sentence answer before the backstory.",
  "Name the constraint you optimized for.",
  "Use a concrete artifact: metric, incident, user quote, decision log, prototype, or launch result.",
  "End with the lesson and what you would repeat next time.",
];

const roleSkillSignals: Record<Role, string[]> = {
  software: ["React", "Next.js", "TypeScript", "Node", "API", "SQL", "Python", "AWS", "Cloudflare", "Kubernetes", "GraphQL", "Redis"],
  product: ["roadmap", "activation", "retention", "conversion", "research", "experiments", "metrics", "stakeholders", "launch", "growth"],
  design: ["research", "prototype", "Figma", "usability", "accessibility", "design system", "journey", "wireframe", "visual", "interaction"],
  data: ["SQL", "Python", "dashboard", "experiment", "forecast", "model", "analytics", "pipeline", "metrics", "Tableau", "Looker"],
  marketing: ["SEO", "content", "lifecycle", "campaign", "positioning", "email", "paid", "organic", "conversion", "launch"],
  leadership: ["strategy", "hiring", "coaching", "planning", "stakeholder", "incident", "budget", "roadmap", "performance", "conflict"],
};

const actionSignals = [
  "built",
  "launched",
  "led",
  "owned",
  "designed",
  "managed",
  "improved",
  "reduced",
  "increased",
  "migrated",
  "shipped",
  "created",
  "optimized",
  "coordinated",
  "implemented",
];

function formatTime(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (totalSeconds % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
}

function scoreLabel(score: number) {
  if (score >= 82) return "Ready for a hard loop";
  if (score >= 66) return "Solid, needs sharper evidence";
  if (score >= 48) return "Useful draft, keep practicing";
  return "Needs structure before live interviews";
}

function getRoundSeconds(selectedFormat: Format, targetCount: QuestionCount) {
  const minutesPerPrompt = selectedFormat === "case" ? 6 : 4;
  return targetCount * minutesPerPrompt * 60;
}

function dedupeQuestions(source: string[]) {
  const seen = new Set<string>();
  return source.filter((question) => {
    const key = question.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function buildQuestionRound(selectedRole: Role, selectedFormat: Format, selectedLevel: Level, targetCount: QuestionCount) {
  const otherFormatQuestions = formatRoundOrder[selectedFormat]
    .filter((item) => item !== selectedFormat)
    .flatMap((item) => questionBank[selectedRole][item]);

  return dedupeQuestions([...questionBank[selectedRole][selectedFormat], ...levelPrompts[selectedLevel], ...otherFormatQuestions]).slice(0, targetCount);
}

function extractResumeHighlights(resumeText: string, selectedRole: Role) {
  const normalized = resumeText.replace(/\s+/g, " ").trim();
  const lines = resumeText
    .split(/\r?\n|\u2022|-/)
    .map((line) => line.replace(/\s+/g, " ").trim())
    .filter((line) => line.length > 28 && line.length < 180)
    .filter((line) => !/(email|phone|linkedin|github|address)/i.test(line));

  const achievementLines = lines.filter((line) => {
    const lower = line.toLowerCase();
    return actionSignals.some((signal) => lower.includes(signal)) || /\d+%|\$\d+|\d+x|\b\d{2,}\b/i.test(line);
  });

  const skills = roleSkillSignals[selectedRole].filter((signal) => normalized.toLowerCase().includes(signal.toLowerCase()));
  const fallbackLines = lines.length ? lines : normalized.match(/.{60,130}(?:\s|$)/g) ?? [];

  return {
    achievements: (achievementLines.length ? achievementLines : fallbackLines).slice(0, 5),
    skills: skills.slice(0, 6),
  };
}

function buildResumeQuestions(resumeText: string, selectedRole: Role, selectedFormat: Format, selectedLevel: Level, targetCount: QuestionCount) {
  if (resumeText.trim().length < 80) return [];

  const { achievements, skills } = extractResumeHighlights(resumeText, selectedRole);
  const firstAchievement = achievements[0] ?? "one project on your resume";
  const secondAchievement = achievements[1] ?? "a result you listed";
  const thirdAchievement = achievements[2] ?? "another project from your resume";
  const skillText = skills.length ? skills.join(", ") : roles.find((item) => item.id === selectedRole)?.cue ?? "your strongest skills";
  const roleLabel = roles.find((item) => item.id === selectedRole)?.label ?? "this role";
  const levelLabel = levels.find((item) => item.id === selectedLevel)?.label ?? "target";

  const tailored = [
    `Your resume mentions: "${firstAchievement}". Walk me through the context, your exact role, and the result.`,
    `Pick one achievement from your resume and explain the tradeoff behind it. What did you choose not to do?`,
    `I see signals around ${skillText}. Where have you used that strength under real constraints?`,
    `Tell me about "${secondAchievement}". What would a former teammate say you personally contributed?`,
    `Which resume claim would a ${roleLabel} interviewer challenge first, and what evidence would you use?`,
    `Walk through a moment where ${skillText} helped you make a better decision.`,
    `Use "${thirdAchievement}" to explain scope, collaborators, and the hardest constraint.`,
    `What did this experience teach you that matters for a ${levelLabel} ${roleLabel} role?`,
    `What would you do in the first 30 days if the next role asked for the same strengths?`,
    "Which part of your resume should I probe next, and what is the strongest evidence behind it?",
  ];

  if (selectedFormat === "technical") {
    tailored[1] = `Based on your resume, design the system or workflow behind "${firstAchievement}". Where were the failure points?`;
    tailored[3] = `Choose a technical decision from your resume. How did you validate it and what would you change now?`;
    tailored[5] = `Walk through the architecture, data flow, or workflow behind "${secondAchievement}".`;
    tailored[8] = "Which implementation detail on your resume would you expect a strong interviewer to inspect?";
  }

  if (selectedFormat === "case") {
    tailored[1] = `A hiring manager is skeptical of "${firstAchievement}". What evidence would you use to make the case?`;
    tailored[3] = `Turn one resume achievement into a 30-day plan for the role you want next. What would you measure?`;
    tailored[6] = `Use "${thirdAchievement}" as a case: what problem, options, decision, and result would you present?`;
    tailored[8] = "If you had to repeat this work with half the resources, what would you change first?";
  }

  if (selectedFormat === "behavioral") {
    tailored[1] = `Tell me about a hard moment behind "${firstAchievement}". What did you learn that changed how you work?`;
    tailored[3] = `Use one resume example to show how you handled disagreement, ambiguity, or pressure.`;
    tailored[6] = `Use "${thirdAchievement}" to show ownership, judgment, and follow-through.`;
    tailored[8] = "Which story on your resume best shows resilience, and what did it cost?";
  }

  return dedupeQuestions([...tailored, ...buildQuestionRound(selectedRole, selectedFormat, selectedLevel, targetCount)]).slice(0, targetCount);
}

export function InterviewStudio() {
  const answerRef = useRef<HTMLTextAreaElement>(null);
  const recognitionRef = useRef<BrowserSpeechRecognition | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<BlobPart[]>([]);
  const audioStreamRef = useRef<MediaStream | null>(null);
  const voiceBaseRef = useRef("");
  const [role, setRole] = useState<Role>("product");
  const [level, setLevel] = useState<Level>("mid");
  const [format, setFormat] = useState<Format>("mixed");
  const [questionCount, setQuestionCount] = useState<QuestionCount>(7);
  const [activeQuestion, setActiveQuestion] = useState(0);
  const [seconds, setSeconds] = useState(() => getRoundSeconds(format, questionCount));
  const [running, setRunning] = useState(false);
  const [answers, setAnswers] = useState<string[]>([]);
  const [notes, setNotes] = useState("");
  const [resumeText, setResumeText] = useState("");
  const [resumeName, setResumeName] = useState("");
  const [useResumeQuestions, setUseResumeQuestions] = useState(false);
  const [resumeStatus, setResumeStatus] = useState("Upload a text resume or paste one below.");
  const [speechSupported, setSpeechSupported] = useState(false);
  const [mediaSupported, setMediaSupported] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isPromptReading, setIsPromptReading] = useState(false);
  const [recordingUrl, setRecordingUrl] = useState("");
  const [voiceStatus, setVoiceStatus] = useState("Voice mode checks your browser capabilities after the page loads.");
  const [scores, setScores] = useState<Record<string, number>>({
    structure: 3,
    evidence: 2,
    clarity: 3,
    depth: 2,
    followup: 2,
  });

  const resumeQuestions = useMemo(() => buildResumeQuestions(resumeText, role, format, level, questionCount), [format, level, questionCount, resumeText, role]);
  const resumeHighlights = useMemo(() => extractResumeHighlights(resumeText, role), [resumeText, role]);
  const questions = useMemo(
    () => (useResumeQuestions && resumeQuestions.length ? resumeQuestions : buildQuestionRound(role, format, level, questionCount)),
    [format, level, questionCount, resumeQuestions, role, useResumeQuestions],
  );

  useEffect(() => {
    setActiveQuestion(0);
    setAnswers([]);
    setSeconds(getRoundSeconds(format, questionCount));
    setRunning(false);
  }, [role, format, level, questionCount]);

  useEffect(() => {
    if (!running) return;

    const interval = window.setInterval(() => {
      setSeconds((current) => {
        if (current <= 1) {
          setRunning(false);
          return 0;
        }

        return current - 1;
      });
    }, 1000);

    return () => window.clearInterval(interval);
  }, [running]);

  useEffect(() => {
    const canTranscribe = Boolean(window.SpeechRecognition || window.webkitSpeechRecognition);
    const canRecord = typeof navigator.mediaDevices?.getUserMedia === "function" && typeof window.MediaRecorder !== "undefined";

    setSpeechSupported(canTranscribe);
    setMediaSupported(canRecord);
    setVoiceStatus(
      canRecord
        ? canTranscribe
          ? "Voice mode is ready: recording plus live transcript."
          : "Recording is ready. Live transcript needs Chrome or Edge speech recognition."
        : "This browser cannot record from the microphone here.",
    );

    return () => {
      recognitionRef.current?.abort();
      if (mediaRecorderRef.current?.state === "recording") {
        mediaRecorderRef.current.stop();
      }
      audioStreamRef.current?.getTracks().forEach((track) => track.stop());
      window.speechSynthesis?.cancel();
    };
  }, []);

  useEffect(() => {
    return () => {
      if (recordingUrl) {
        URL.revokeObjectURL(recordingUrl);
      }
    };
  }, [recordingUrl]);

  const score = useMemo(() => {
    const average = Object.values(scores).reduce((sum, value) => sum + value, 0) / rubric.length;
    const answerBonus = Math.min(12, answers.filter(Boolean).length * 3);
    const noteBonus = notes.trim().length > 80 ? 6 : notes.trim().length > 20 ? 3 : 0;
    return Math.min(100, Math.round((average / 5) * 82 + answerBonus + noteBonus));
  }, [answers, notes, scores]);

  const activeAnswer = answers[activeQuestion] ?? "";
  const analyticsContext = {
    role,
    level,
    format,
    question_count: questionCount,
    resume_mode: useResumeQuestions ? "resume" : "bank",
  };

  const reportAnalyticsEvent = (
    eventName: string,
    params: Record<string, string | number | boolean> = {},
    overrides: Partial<typeof analyticsContext> = {},
  ) => {
    trackAnalyticsEvent(eventName, {
      ...analyticsContext,
      ...overrides,
      ...params,
    });
  };

  const updateAnswer = (value: string) => {
    setAnswers((current) => {
      const next = [...current];
      next[activeQuestion] = value;
      return next;
    });
  };

  const handleResumeTextChange = (value: string) => {
    setResumeText(value);
    setUseResumeQuestions(false);
    setResumeStatus(value.trim().length >= 80 ? "Resume text loaded. Build a tailored interview when ready." : "Add more resume detail to tailor the questions.");
  };

  const handleResumeFile = (file?: File) => {
    if (!file) return;

    const lowerName = file.name.toLowerCase();
    const supported = file.type.startsWith("text/") || /\.(txt|md|csv|json)$/i.test(lowerName);

    setResumeName(file.name);

    if (!supported) {
      setUseResumeQuestions(false);
      setResumeStatus("For PDF or DOCX in this local v0, paste the resume text into the box instead.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const text = String(reader.result ?? "");
      setResumeText(text);
      setUseResumeQuestions(false);
      setResumeStatus(text.trim().length >= 80 ? "Resume file loaded. Build a tailored interview when ready." : "The file was read, but it needs more resume detail.");
    };
    reader.onerror = () => {
      setResumeStatus("Could not read this file. Paste the resume text instead.");
    };
    reader.readAsText(file);
  };

  const buildTailoredRound = () => {
    if (resumeQuestions.length === 0) {
      setResumeStatus("Add at least a few resume bullets before building a tailored round.");
      return;
    }

    setUseResumeQuestions(true);
    setActiveQuestion(0);
    setAnswers([]);
    setRunning(false);
    setSeconds(getRoundSeconds(format, questionCount));
    setResumeStatus(`Tailored ${questionCount}-question round is active.`);
    reportAnalyticsEvent("resume_round_build", {
      resume_source: resumeName ? "file" : "paste",
    });
    window.setTimeout(() => answerRef.current?.focus(), 0);
  };

  const clearResume = () => {
    setResumeText("");
    setResumeName("");
    setUseResumeQuestions(false);
    setResumeStatus("Upload a text resume or paste one below.");
  };

  const downloadReport = () => {
    reportAnalyticsEvent("export_report");

    const report = [
      "Mock Interview Practice Report",
      `Role: ${roles.find((item) => item.id === role)?.label}`,
      `Level: ${levels.find((item) => item.id === level)?.label}`,
      `Format: ${formats.find((item) => item.id === format)?.label}`,
      `Questions: ${questions.length}`,
      `Resume-tailored: ${useResumeQuestions ? "Yes" : "No"}`,
      `Readiness score: ${score}/100 - ${scoreLabel(score)}`,
      "",
      "Questions and answers:",
      ...questions.flatMap((question, index) => [
        `${index + 1}. ${question}`,
        answers[index]?.trim() ? answers[index].trim() : "[No answer recorded]",
        "",
      ]),
      "Rubric:",
      ...rubric.map((item) => `${item.label}: ${scores[item.id]}/5`),
      "",
      "Coach notes:",
      notes.trim() || "[No notes recorded]",
    ].join("\n");

    const blob = new Blob([report], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "mock-interview-report.txt";
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const resetRound = () => {
    reportAnalyticsEvent("reset_round");
    setRunning(false);
    setSeconds(getRoundSeconds(format, questionCount));
    setActiveQuestion(0);
    setAnswers([]);
    setNotes("");
    setScores({
      structure: 3,
      evidence: 2,
      clarity: 3,
      depth: 2,
      followup: 2,
    });
  };

  const toggleInterview = () => {
    reportAnalyticsEvent(running ? "interview_pause" : "interview_start");
    setRunning((current) => !current);
    window.setTimeout(() => answerRef.current?.focus(), 0);
  };

  const readPrompt = () => {
    if (!("speechSynthesis" in window)) {
      setVoiceStatus("Prompt reading is not available in this browser.");
      return;
    }

    if (isPromptReading) {
      window.speechSynthesis.cancel();
      setIsPromptReading(false);
      setVoiceStatus("Prompt reading stopped.");
      reportAnalyticsEvent("prompt_read", { action: "stop" });
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(questions[activeQuestion]);
    const voices = window.speechSynthesis.getVoices();
    const voice = voices.find((item) => item.lang === "en-US") ?? voices.find((item) => item.lang.startsWith("en"));

    if (voice) {
      utterance.voice = voice;
    }

    utterance.lang = "en-US";
    utterance.rate = 0.92;
    utterance.pitch = 0.98;
    utterance.onstart = () => {
      setIsPromptReading(true);
      setVoiceStatus("Reading the prompt aloud.");
      reportAnalyticsEvent("prompt_read", { action: "start" });
    };
    utterance.onend = () => {
      setIsPromptReading(false);
      setVoiceStatus(isRecording ? "Recording answer." : "Prompt reading finished.");
    };
    utterance.onerror = () => {
      setIsPromptReading(false);
      setVoiceStatus("The browser blocked prompt reading. Check tab audio and browser speech settings.");
    };

    window.speechSynthesis.speak(utterance);
    setVoiceStatus("Reading the prompt aloud.");
  };

  const stopVoiceInput = () => {
    reportAnalyticsEvent("record_answer", { action: "stop" });
    recognitionRef.current?.stop();
    recognitionRef.current = null;
    if (mediaRecorderRef.current?.state === "recording") {
      mediaRecorderRef.current.stop();
    }
    mediaRecorderRef.current = null;
    audioStreamRef.current?.getTracks().forEach((track) => track.stop());
    audioStreamRef.current = null;
    setIsListening(false);
    setIsRecording(false);
      setVoiceStatus("Recording stopped. You can play the audio and edit the transcript.");
  };

  const startVoiceInput = async () => {
    if (typeof navigator.mediaDevices?.getUserMedia !== "function" || typeof window.MediaRecorder === "undefined") {
      setVoiceStatus("Microphone recording is not available in this browser or page context.");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;

      if (recordingUrl) {
        URL.revokeObjectURL(recordingUrl);
        setRecordingUrl("");
      }

      audioChunksRef.current = [];
      audioStreamRef.current = stream;
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: recorder.mimeType || "audio/webm" });
        const url = URL.createObjectURL(audioBlob);
        setRecordingUrl(url);
        audioStreamRef.current?.getTracks().forEach((track) => track.stop());
        audioStreamRef.current = null;
        setIsRecording(false);
        setIsListening(false);
      };

      if (Recognition) {
        recognitionRef.current?.abort();
        const recognition = new Recognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = "en-US";
        voiceBaseRef.current = activeAnswer.trim();

        recognition.onresult = (event) => {
          let finalText = "";
          let interimText = "";

          for (let index = event.resultIndex; index < event.results.length; index += 1) {
            const result = event.results[index];
            const transcript = result[0]?.transcript ?? "";

            if (result.isFinal) {
              finalText += `${transcript} `;
            } else {
              interimText += transcript;
            }
          }

          const base = voiceBaseRef.current;
          const nextAnswer = [base, finalText.trim(), interimText.trim()].filter(Boolean).join(" ");
          updateAnswer(nextAnswer);

          if (finalText.trim()) {
            voiceBaseRef.current = [base, finalText.trim()].filter(Boolean).join(" ");
          }
        };

        recognition.onerror = (event) => {
          setIsListening(false);
          setVoiceStatus(
            event.error === "not-allowed"
              ? "Microphone permission was blocked for live transcript."
              : `Recording continues, but live transcript stopped: ${event.error}.`,
          );
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
        recognition.start();
        setIsListening(true);
      }

      recorder.start();
      setRunning(true);
      setIsRecording(true);
      reportAnalyticsEvent("record_answer", {
        action: "start",
        live_transcript: Boolean(Recognition),
      });
      setVoiceStatus(Recognition ? "Recording and transcribing. Answer out loud." : "Recording audio. Live transcript is not available in this browser.");
      window.setTimeout(() => answerRef.current?.focus(), 0);
    } catch (error) {
      setIsRecording(false);
      setIsListening(false);
      setVoiceStatus(error instanceof DOMException && error.name === "NotAllowedError" ? "Microphone permission was blocked." : "Could not start microphone recording.");
    }
  };

  return (
    <section className="studio-band" id="studio" aria-label="Mock interview practice studio">
      <div className="studio-header">
        <div>
          <p className="section-kicker">
            <Mic2 size={16} aria-hidden="true" />
            Live practice workspace
          </p>
          <h2>Run a realistic interview round, then grade the answer while it is still fresh.</h2>
        </div>
        <div className="timer-block" aria-live="polite">
          <Clock3 size={18} aria-hidden="true" />
          <span>{formatTime(seconds)}</span>
        </div>
      </div>

      <div className="studio-grid">
        <aside className="setup-panel" aria-label="Interview setup">
          <div className="control-group">
            <h3>Role</h3>
          <div className="choice-list">
              {roles.map((item) => (
                <button
                  className={item.id === role ? "choice-button active" : "choice-button"}
                  key={item.id}
                  onClick={() => {
                    setRole(item.id);
                    reportAnalyticsEvent("role_change", { selected_role: item.id }, { role: item.id });
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
            <h3>Level</h3>
            <div className="segmented-control" role="group" aria-label="Interview level">
              {levels.map((item) => (
                <button
                  className={item.id === level ? "segment active" : "segment"}
                  key={item.id}
                  onClick={() => {
                    setLevel(item.id);
                    reportAnalyticsEvent("level_change", { selected_level: item.id }, { level: item.id });
                  }}
                  type="button"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div className="control-group">
            <h3>Format</h3>
            <div className="segmented-control stacked" role="group" aria-label="Interview format">
              {formats.map((item) => (
                <button
                  className={item.id === format ? "segment active" : "segment"}
                  key={item.id}
                  onClick={() => {
                    setFormat(item.id);
                    reportAnalyticsEvent("format_change", { selected_format: item.id }, { format: item.id });
                  }}
                  type="button"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div className="control-group">
            <h3>Round length</h3>
            <div className="segmented-control" role="group" aria-label="Question count">
              {questionCountOptions.map((item) => (
                <button
                  className={item.id === questionCount ? "segment active" : "segment"}
                  key={item.id}
                  onClick={() => {
                    setQuestionCount(item.id);
                    reportAnalyticsEvent("round_length_change", { selected_question_count: item.id }, { question_count: item.id });
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
            <h3>Resume</h3>
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
              aria-label="Resume text"
              className="resume-text"
              onChange={(event) => handleResumeTextChange(event.target.value)}
              placeholder="Paste resume bullets, recent projects, metrics, and tools here."
              value={resumeText}
            />
            <div className="resume-actions">
              <button className="resume-build-button" onClick={buildTailoredRound} type="button">
                <ClipboardList size={16} aria-hidden="true" />
                Build from resume
              </button>
              <button className="resume-clear-button" onClick={clearResume} type="button">
                Clear
              </button>
            </div>
            <p className={useResumeQuestions ? "resume-status active" : "resume-status"}>{resumeStatus}</p>
            {resumeHighlights.skills.length > 0 ? (
              <div className="resume-signal-list" aria-label="Resume signals">
                {resumeHighlights.skills.map((signal) => (
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
              <small>{Math.round(getRoundSeconds(format, questionCount) / 60)} min round</small>
            </span>
            <div className="question-actions">
              <button className="interview-start-button" onClick={toggleInterview} type="button">
                {running ? <Pause size={17} aria-hidden="true" /> : <Play size={17} aria-hidden="true" />}
                {running ? "Pause interview" : "Start interview"}
              </button>
              <button className="voice-command" onClick={readPrompt} type="button">
                <Volume2 size={17} aria-hidden="true" />
                {isPromptReading ? "Stop prompt" : "Read prompt"}
              </button>
              <button
                className={isRecording ? "voice-command active" : "voice-command"}
                disabled={!mediaSupported}
                onClick={isRecording ? stopVoiceInput : startVoiceInput}
                type="button"
              >
                {isRecording ? <MicOff size={17} aria-hidden="true" /> : <Mic size={17} aria-hidden="true" />}
                {isRecording ? "Stop recording" : "Record answer"}
              </button>
              <button
                aria-label={running ? "Pause timer" : "Start timer"}
                className="icon-command"
                onClick={toggleInterview}
                title={running ? "Pause timer" : "Start timer"}
                type="button"
              >
                {running ? <Pause size={17} /> : <Play size={17} />}
              </button>
              <button
                aria-label="Reset timer"
                className="icon-command"
                onClick={() => {
                  setRunning(false);
                  setSeconds(getRoundSeconds(format, questionCount));
                }}
                title="Reset timer"
                type="button"
              >
                <TimerReset size={17} />
              </button>
            </div>
          </div>

          <div className="question-display">
            <p className="interviewer-label">Interviewer prompt</p>
            <h3>{questions[activeQuestion]}</h3>
          </div>

          <div className={isRecording || isListening || isPromptReading ? "voice-status active" : "voice-status"} aria-live="polite">
            <Mic2 size={15} aria-hidden="true" />
            <span>{voiceStatus}</span>
          </div>

          {recordingUrl ? (
            <div className="recording-review" aria-label="Recorded answer playback">
              <audio controls src={recordingUrl} />
              <span>{speechSupported ? "Audio saved for this browser session." : "Audio saved. Use Chrome or Edge for live transcript."}</span>
            </div>
          ) : null}

          <div className="question-tabs" role="tablist" aria-label="Question list">
            {questions.map((question, index) => (
              <button
                aria-selected={index === activeQuestion}
                className={index === activeQuestion ? "question-tab active" : "question-tab"}
                key={question}
                onClick={() => setActiveQuestion(index)}
                role="tab"
                type="button"
              >
                {index + 1}
              </button>
            ))}
          </div>

          <label className="answer-label" htmlFor="answer">
            Candidate answer draft
          </label>
          <textarea
            className="answer-box"
            id="answer"
            onChange={(event) => updateAnswer(event.target.value)}
            placeholder="Use Situation, Action, Result, Reflection. Keep it specific; vague confidence is expensive in interviews."
            ref={answerRef}
            value={activeAnswer}
          />

          <div className="coach-strip" aria-label="Answer framework tips">
            {frameworkTips.map((tip) => (
              <span key={tip}>
                <PencilLine size={14} aria-hidden="true" />
                {tip}
              </span>
            ))}
          </div>
        </div>

        <aside className="score-panel" aria-label="Interview scoring panel">
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
            Coach notes
          </label>
          <textarea
            className="notes-box"
            id="notes"
            onChange={(event) => setNotes(event.target.value)}
            placeholder="Add gaps, reusable phrases, follow-up questions, and next practice drills."
            value={notes}
          />

          <div className="report-actions">
            <button className="button primary" onClick={downloadReport} type="button">
              <ArrowDownToLine size={17} aria-hidden="true" />
              Export report
            </button>
            <button className="button secondary" onClick={resetRound} type="button">
              <RotateCcw size={17} aria-hidden="true" />
              Reset
            </button>
          </div>
        </aside>
      </div>

      <div className="session-summary" aria-label="Session summary">
        <div>
          <CheckCircle2 size={18} aria-hidden="true" />
          <span>{answers.filter(Boolean).length} answered</span>
        </div>
        <div>
          <ListChecks size={18} aria-hidden="true" />
          <span>{useResumeQuestions ? `${questionCount}-question resume round` : `${questionCount}-question ${roles.find((item) => item.id === role)?.label} loop`}</span>
        </div>
        <div>
          <FileText size={18} aria-hidden="true" />
          <span>Local report export</span>
        </div>
        <button className="text-command" onClick={resetRound} type="button">
          <RefreshCcw size={16} aria-hidden="true" />
          New drill
        </button>
      </div>
    </section>
  );
}
