"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowDownToLine,
  ClipboardCheck,
  CheckCircle2,
  ClipboardList,
  FileText,
  HelpCircle,
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

type ReviewFeedback = {
  summary: string;
  strengths: string[];
  improvements: string[];
  rewriteMoves: string[];
  scores: Record<ScoreKey, number>;
};

type GeneratedQuestion = {
  id: string;
  question: string;
  reason: string;
  storyMatch: string;
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

type RiskItem = {
  signal: string;
  source: "jd" | "resume" | "role";
  prepAdvice: string;
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

const weakPhrases = ["helped a lot", "was responsible for", "i just", "kind of", "sort of", "maybe", "i think"];
const ownershipVerbs = ["led", "built", "created", "decided", "prioritized", "validated", "launched", "improved", "reduced", "designed", "analyzed", "shipped"];
const resultWords = ["result", "impact", "increased", "reduced", "improved", "saved", "launched", "shipped", "learned", "measured", "converted"];

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

function makeEnglishDraft(roleLabel: string, resumeLine: string, jobSignal: string, index: number, question: string) {
  const anchor = resumeLine || "a recent project";
  const lowerQuestion = question.toLowerCase();

  if (/(disagree|conflict|critique|feedback)/.test(lowerQuestion)) {
    if (/feedback/.test(lowerQuestion) || /critique/.test(lowerQuestion)) {
      return `On ${anchor}, I received feedback that my communication around ${jobSignal} was too detailed and made the main decision hard to find. I asked for one concrete example, then changed my approach by leading with the recommendation, followed by the evidence and tradeoff. I tested the new format in the next review and asked the team whether the decision was easier to follow. The result was clearer alignment, and I now tailor the level of detail to the audience.`;
    }

    return `During ${anchor}, a teammate and I disagreed about how to handle ${jobSignal}. I first asked them to explain the risk they were protecting against, then shared the user or business constraint I was optimizing for. We compared the options against the same success criteria and agreed on a smaller test before committing. That helped us move forward without turning the disagreement into a personal debate. The lesson I took from it is to make the decision criteria explicit early.`;
  }

  if (/(did not work|first plan|mistake|failure|issue|risk|production)/.test(lowerQuestion)) {
    if (/mistake/.test(lowerQuestion)) {
      return `In ${anchor}, I underestimated the coordination needed for ${jobSignal} and started implementation before the owners and dependencies were fully clear. I noticed the risk when a handoff began to slip, so I paused, mapped the dependencies, and reset the milestones with the people involved. We recovered the work and added an earlier dependency review to the process. I would not repeat the original assumption, and I now surface coordination risks before treating a plan as ready.`;
    }

    return `In ${anchor}, our first approach to ${jobSignal} did not work as expected. The early signal showed that we were solving the wrong part of the problem, so I helped isolate the failure, explained the tradeoff, and proposed a narrower second approach. We validated it with a small test before expanding the work. The result was a more reliable path to delivery, and I learned to use early evidence to change direction instead of defending the original plan.`;
  }

  if (/(data|metric|customer|research|experiment)/.test(lowerQuestion)) {
    return `While working on ${anchor}, I used data or customer feedback to investigate a decision related to ${jobSignal}. The first assumption was that the main issue was [assumption], but the evidence showed a different pattern. I compared the relevant segments, shared the finding with the team, and recommended a focused experiment rather than a broad change. We measured [metric] after the change and used the result to decide what to do next. This taught me to connect evidence to action, not just report the number.`;
  }

  if (/(influence|without formal authority|alignment|trust|team)/.test(lowerQuestion)) {
    return `In ${anchor}, I needed to influence people who did not report to me around ${jobSignal}. I started by understanding what each person needed to protect, then reframed the proposal around a shared outcome. I used a short written plan with clear owners, risks, and a next decision instead of relying on repeated persuasion. The group agreed to move forward, and I followed up with the evidence from the first milestone. That experience showed me that influence comes from clarity, context, and consistent follow-through.`;
  }

  if (/(prioritize|deadline|tight)/.test(lowerQuestion)) {
    return `On ${anchor}, I had a fixed deadline and more work than the team could complete, especially around ${jobSignal}. I separated must-have work from useful but deferrable work, made the tradeoffs visible, and confirmed the priority with the relevant stakeholders. I then protected the critical path and gave the team a simple update rhythm so new requests did not quietly expand the scope. We delivered the highest-value version on time, with [measurable result]. The key lesson was to prioritize outcomes, not just tasks.`;
  }

  if (/(complex|simply|communicate)/.test(lowerQuestion)) {
    return `For ${anchor}, I had to explain work involving ${jobSignal} to people without the same technical context. I started with the decision they needed to make, used one concrete example, and left the implementation detail in a short follow-up. I checked understanding by asking them to react to the tradeoff rather than asking whether the explanation made sense. That helped the group make a faster decision and reduced follow-up questions. Since then, I communicate complex work from the audience's decision backward.`;
  }

  if (/(proud|personal contribution)/.test(lowerQuestion)) {
    return `A project I am proud of is ${anchor}, where my personal contribution was to improve how the team handled ${jobSignal}. I clarified the problem, owned the most uncertain part of the work, and kept the key partners aligned as the solution changed. I also documented the decision so the team could maintain the result after launch. The outcome was [measurable result or user impact]. What I value most is that the work created a repeatable way for the team to make better decisions.`;
  }

  if (/(strongest working habit|manager)/.test(lowerQuestion)) {
    return `My previous manager would probably say that my strongest habit is creating clarity around ${jobSignal}. In ${anchor}, I turned a broad request into a short list of decisions, owners, and next steps, then followed up when the assumptions changed. That habit helped the team move without waiting for perfect information and made risks easier to discuss early. I am still working on balancing this strength with leaving enough room for other people to shape the solution.`;
  }

  return `In ${anchor}, I faced a situation where ${jobSignal} mattered but the path forward was not obvious. I clarified the goal, identified the main constraint, and took ownership of the next two actions rather than waiting for a perfect plan. I kept the relevant people updated, used evidence to adjust the approach, and closed with [measurable result or lesson]. This example shows how I would bring practical judgment and follow-through to a ${roleLabel} role.`;
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
      storyMatch: resumeAnchor,
      chineseStrategy: chineseStrategyTemplate(resumeAnchor),
      starOutline: {
        situation: `Story: ${resumeAnchor}.`,
        task: `Goal + constraint around ${signal}.`,
        action: "2-3 actions you owned.",
        result: "Metric, decision, or lesson.",
      },
      englishDraft: makeEnglishDraft(roleMeta.label, resumeAnchor, signal, index, question),
      phraseAlternatives: strongPhrases.slice(index % 3, index % 3 + 3),
    };
  });
}

function buildRiskMap(role: Role, level: Level, jdText: string, resumeText: string): RiskItem[] {
  const roleMeta = roles.find((item) => item.id === role) ?? roles[0];
  const levelMeta = levels.find((item) => item.id === level) ?? levels[1];
  const jdSignals = extractSignals(jdText, role).map((signal) => ({ signal, source: "jd" as const }));
  const resumeSignals = extractSignals(resumeText, role).map((signal) => ({ signal, source: "resume" as const }));
  const fallbackSignals = [
    { signal: roleMeta.interviewSignal, source: "role" as const },
    { signal: `${levelMeta.cue} under pressure`, source: "role" as const },
  ];
  const uniqueSignals = [...jdSignals, ...resumeSignals, ...fallbackSignals].filter(
    (item, index, all) => all.findIndex((candidate) => candidate.signal.toLowerCase() === item.signal.toLowerCase()) === index,
  );

  return uniqueSignals.slice(0, 6).map((item) => ({
    ...item,
    prepAdvice: `Prepare one ${levelMeta.cue} story that proves ${item.signal} with a clear action and result.`,
  }));
}

function readinessScore(scores: Record<ScoreKey, number>) {
  const total = rubric.reduce((sum, item) => sum + scores[item.id], 0);
  return Math.round((total / (rubric.length * 5)) * 100);
}

function clampScore(score: number) {
  return Math.max(1, Math.min(5, Math.round(score)));
}

function splitSentences(text: string) {
  return text
    .split(/[.!?]+/)
    .map((sentence) => sentence.trim())
    .filter(Boolean);
}

function includesAny(text: string, words: string[]) {
  const lower = text.toLowerCase();
  return words.some((word) => lower.includes(word));
}

function countAny(text: string, words: string[]) {
  const lower = text.toLowerCase();
  return words.filter((word) => lower.includes(word)).length;
}

function questionFocus(question: string) {
  const lower = question.toLowerCase();

  if (/(disagree|conflict|critique|feedback)/.test(lower)) {
    return {
      label: "the disagreement",
      improvement: "Make the disagreement visible: name the other perspective, then explain how you reached alignment.",
    };
  }
  if (/(ambig|unclear|prioritize|deadline|tradeoff)/.test(lower)) {
    return {
      label: "the decision",
      improvement: "Clarify the decision: state the constraint, the options you weighed, and why you chose this path.",
    };
  }
  if (/(mistake|did not work|failure|issue|risk|production)/.test(lower)) {
    return {
      label: "the recovery",
      improvement: "Spend one sentence on the recovery: what changed after the problem appeared and how you verified the fix.",
    };
  }
  if (/(data|metric|customer|research|experiment)/.test(lower)) {
    return {
      label: "the evidence",
      improvement: "Show the evidence chain: what signal you found, what it changed, and what happened after the decision.",
    };
  }
  if (/(influence|without formal authority|alignment|trust|team)/.test(lower)) {
    return {
      label: "the collaboration",
      improvement: "Show the collaboration move: who needed convincing, what you changed in your communication, and what they did next.",
    };
  }
  return {
    label: "your ownership",
    improvement: "Make your ownership unmistakable: name the part you personally decided, built, or changed.",
  };
}

function evaluateAnswer(answer: string, question: GeneratedQuestion, roleSignal: string): ReviewFeedback {
  const trimmed = answer.replace(/\s+/g, " ").trim();
  const lower = trimmed.toLowerCase();
  const words = trimmed.split(/\s+/).filter(Boolean);
  const sentences = splitSentences(trimmed);
  const focus = questionFocus(question.question);
  const hasMetric = /\b\d+(\.\d+)?\s?(%|x|k|m|hours?|days?|weeks?|users?|customers?|revenue|dollars?)?\b|\$/.test(lower);
  const hasFirstPerson = /\b(i|my|me)\b/i.test(trimmed);
  const hasResult = includesAny(lower, resultWords);
  const ownershipCount = countAny(lower, ownershipVerbs);
  const hasOwnership = ownershipCount > 0;
  const hasStarWords = ["situation", "task", "action", "result"].filter((word) => lower.includes(word)).length;
  const hasWeakPhrase = weakPhrases.some((phrase) => lower.includes(phrase));
  const hasContext = includesAny(lower, ["when", "during", "after", "project", "team", "customer", "launch", "production", "deadline"]);
  const hasChallenge = includesAny(lower, ["problem", "issue", "risk", "constraint", "conflict", "unclear", "disagree", "tradeoff", "failure"]);
  const hasReflection = includesAny(lower, ["learned", "lesson", "next time", "would repeat", "changed how", "takeaway"]);
  const genericOpening = /^(one example|a relevant example|i would answer|in my experience)\b/i.test(trimmed);
  const hasQuestionSignal = roleSignal
    .split(/\s+|\/|,|and/)
    .filter((word) => word.length > 5)
    .some((word) => lower.includes(word.toLowerCase()));

  const clarity = clampScore(
    2 +
      (words.length >= 55 ? 1 : 0) +
      (words.length >= 90 && words.length <= 190 ? 1 : 0) +
      (sentences.length >= 3 && sentences.length <= 8 ? 1 : 0) -
      (words.length > 240 ? 1 : 0),
  );
  const structure = clampScore(2 + (hasFirstPerson ? 1 : 0) + (hasResult ? 1 : 0) + (hasStarWords >= 2 ? 1 : 0));
  const specificity = clampScore(1 + (hasMetric ? 2 : 0) + (hasQuestionSignal ? 1 : 0) + (words.length >= 80 ? 1 : 0));
  const englishPhrasing = clampScore(3 + (sentences.length >= 3 ? 1 : 0) + (hasWeakPhrase ? -1 : 0) + (words.length > 220 ? -1 : 0));
  const confidence = clampScore(2 + (hasFirstPerson ? 1 : 0) + (hasOwnership ? 1 : 0) + (hasWeakPhrase ? -1 : 0) + (hasResult ? 1 : 0));
  const scores = { clarity, structure, specificity, englishPhrasing, confidence };
  const score = readinessScore(scores);

  const strengths = [
    hasFirstPerson ? "Uses first-person ownership, which helps the answer sound personal." : "",
    hasOwnership ? "Includes action verbs that show what you personally did." : "",
    hasResult ? "Points toward an outcome instead of stopping at the process." : "",
    hasReflection ? "Ends with a lesson or repeatable takeaway." : "",
    hasQuestionSignal ? "Connects the answer back to the role signal." : "",
  ].filter(Boolean);

  const improvements = [
    genericOpening ? `Open with ${focus.label} instead of a template sentence.` : "",
    !hasContext ? "Set the scene before the action: say who or what was affected and what was at stake." : "",
    !hasChallenge ? focus.improvement : "",
    ownershipCount < 2 ? "Add a second concrete action so the answer shows your judgment, not just your involvement." : "",
    !hasMetric ? "Add a number, timeline, scope, or observable result to make the story verifiable." : "",
    !hasResult ? "Close with the outcome: what improved, changed, or was decided because of your work." : "",
    !hasReflection ? "Finish with one reusable lesson or what you would repeat next time." : "",
    !hasFirstPerson ? "Use more I-statements so the interviewer can see your personal contribution." : "",
    hasWeakPhrase ? "Remove soft phrases like \"just\", \"kind of\", or \"helped a lot\"." : "",
    words.length < 70 ? "Expand the answer with one concrete action and one outcome." : "",
    words.length > 220 ? "Shorten the answer so it can be spoken in about 90 seconds." : "",
  ].filter(Boolean).filter((item, index, all) => all.indexOf(item) === index);

  const rewriteMoves = [
    genericOpening ? `Start with: In [project], the challenge was...` : "Keep the opening specific and brief.",
    ownershipCount < 2 ? "Add: My specific responsibility was..." : "Keep the strongest I-action in the middle.",
    !hasMetric ? "Add: The measurable result was..." : !hasReflection ? "Add: What I learned from this was..." : "Use the lesson as your final sentence.",
  ].filter((item, index, all) => all.indexOf(item) === index);

  return {
    summary: score >= 75
      ? `Strong draft. Keep the ${focus.label} clear, then rehearse it aloud.`
      : score >= 58
        ? `Useful start. Strengthen ${focus.label} and give the story a cleaner ending.`
        : `Good raw material. Build the story around ${focus.label} before polishing English.`,
    strengths: strengths.length ? strengths.slice(0, 3) : ["You have a starting answer to refine."],
    improvements: improvements.length
      ? improvements.slice(0, 4)
      : ["Your structure is working. Try a more vivid detail or a shorter opening."],
    rewriteMoves,
    scores,
  };
}

export function InterviewStudio() {
  const [isReady, setIsReady] = useState(false);
  const [role, setRole] = useState<Role>("pm");
  const [level, setLevel] = useState<Level>("mid");
  const [questionCount, setQuestionCount] = useState<QuestionCount>(10);
  const [jdText, setJdText] = useState("");
  const [resumeText, setResumeText] = useState("");
  const [resumeName, setResumeName] = useState("");
  const [activeQuestion, setActiveQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [feedbacks, setFeedbacks] = useState<Array<ReviewFeedback | undefined>>([]);
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
  const riskMap = useMemo(() => buildRiskMap(role, level, jdText, resumeText), [role, level, jdText, resumeText]);
  const currentQuestion = questions[activeQuestion] ?? questions[0];
  const activeAnswer = answers[activeQuestion] ?? "";
  const activeFeedback = feedbacks[activeQuestion];
  const canReviewAnswer = activeAnswer.trim().length >= 40;
  const score = activeFeedback ? readinessScore(activeFeedback.scores) : null;
  const roleMeta = roles.find((item) => item.id === role) ?? roles[0];
  const jdSignals = extractSignals(jdText, role);
  const resumeSignals = extractSignals(resumeText, role);
  const storyBank = cleanLines(resumeText).slice(0, 5);
  const answeredCount = answers.filter((answer) => answer.trim()).length;

  useEffect(() => {
    setIsReady(true);
  }, []);

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
    setFeedbacks((current) => {
      const next = [...current];
      next[activeQuestion] = undefined;
      return next;
    });
  };

  const reviewAnswer = () => {
    if (!canReviewAnswer) return;

    const feedback = evaluateAnswer(activeAnswer, currentQuestion, roleMeta.interviewSignal);
    setScores(feedback.scores);
    setFeedbacks((current) => {
      const next = [...current];
      next[activeQuestion] = feedback;
      return next;
    });
    reportAnalyticsEvent("answer_feedback_generated", {
      answer_chars: activeAnswer.length,
      readiness_score: readinessScore(feedback.scores),
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
    reportAnalyticsEvent("prep_kit_generated", {
      jd_chars: jdText.length,
      resume_chars: resumeText.length,
      risk_count: riskMap.length,
    });
  };

  const resetWorkspace = () => {
    setActiveQuestion(0);
    setAnswers([]);
    setFeedbacks([]);
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
    reportAnalyticsEvent("prep_kit_export");

    // Prefer the live textarea value so an immediate export never misses the latest keystroke.
    const exportAnswers = [...answers];
    const liveAnswer = answerRef.current?.value.trim();
    if (liveAnswer) {
      exportAnswers[activeQuestion] = liveAnswer;
    }

    const practicedAnswers = questions.flatMap((question, index) => {
      const answer = exportAnswers[index]?.trim();
      return answer
        ? [
            `${index + 1}. ${question.question}`,
            `Suggested answer draft: ${question.englishDraft}`,
            `Your practiced answer: ${answer}`,
            "",
          ]
        : [];
    });

    const suggestedAnswerDrafts = questions.slice(0, 6).flatMap((question, index) => [
      `${index + 1}. ${question.question}`,
      `Story match: ${question.storyMatch}`,
      `Suggested answer draft: ${question.englishDraft}`,
      "",
    ]);

    const report = [
      "Interview English Coach - 48-Hour Prep Kit",
      `Role: ${roleMeta.label}`,
      `Level: ${levels.find((item) => item.id === level)?.label}`,
      `Readiness score: ${score ?? "Not reviewed"}${score ? ` - ${scoreLabel(score)}` : ""}`,
      "",
      "Interview Risk Map:",
      ...riskMap.map((item, index) => `${index + 1}. ${item.signal} (${item.source}) - ${item.prepAdvice}`),
      "",
      "Top questions:",
      ...questions.slice(0, 6).map((question, index) => `${index + 1}. ${question.question}`),
      "",
      "Story match:",
      ...questions.slice(0, 6).map((question, index) => `${index + 1}. ${question.storyMatch}`),
      "",
      "Suggested answer drafts:",
      ...suggestedAnswerDrafts,
      "Story bank:",
      ...(storyBank.length ? storyBank.map((line) => `- ${line}`) : ["- Add 3-5 concrete stories before your interview."]),
      "",
      "English phrases to reuse:",
      ...strongPhrases.map((phrase) => `- ${phrase}`),
      "",
      "Practiced answers:",
      ...(practicedAnswers.length ? practicedAnswers : ["[No practiced answers yet]"]),
      "",
      "Your review notes:",
      notes.trim() || "[No notes recorded]",
    ].join("\n");

    const blob = new Blob([report], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "interview-english-prep-kit.txt";
    anchor.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section
      aria-busy={!isReady}
      aria-label="English interview prep kit studio"
      className="studio-band"
      data-ready={isReady}
      id="studio"
    >
      <div className="studio-header">
        <div>
          <p className="section-kicker">
            <Languages size={16} aria-hidden="true" />
            Prep kit workspace
          </p>
          <h2>Build the risk map, match your stories, then practice one answer.</h2>
        </div>
        <a className="studio-help-link" href="/how-to">
          <HelpCircle size={17} aria-hidden="true" />
          How to use
        </a>
      </div>

      <div className="studio-grid">
        <aside className="setup-panel" aria-label="Prep kit setup">
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
                Build prep kit
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
            <div className="risk-map-panel" aria-label="Interview Risk Map">
              <div className="method-panel-heading">
                <span>Interview Risk Map</span>
                <small>Top {riskMap.length}</small>
              </div>
              <div className="risk-map-list">
                {riskMap.map((risk) => (
                  <article key={`${risk.source}-${risk.signal}`}>
                    <strong>{risk.signal}</strong>
                    <span>{risk.prepAdvice}</span>
                  </article>
                ))}
              </div>
            </div>
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
                Rebuild prep kit
              </button>
              <button className="voice-command" onClick={downloadCheatSheet} type="button">
                <ArrowDownToLine size={17} aria-hidden="true" />
                Export prep kit
              </button>
            </div>
          </div>

          <div className="question-display">
            <p className="interviewer-label">High-probability interviewer question</p>
            <h3>{currentQuestion.question}</h3>
          </div>

          <div className="story-match-card" aria-label="Story Match">
            <strong>Story Match</strong>
            <span>{currentQuestion.storyMatch}</span>
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

          <label className="answer-label" htmlFor="draft">
            Example answer to adapt 示例答案（请替换成你的经历）
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

          <div className="answer-feedback-actions">
            <button className="feedback-button" disabled={!canReviewAnswer} onClick={reviewAnswer} type="button">
              <ClipboardCheck size={17} aria-hidden="true" />
              Get feedback
            </button>
            <span>{canReviewAnswer ? "Score this answer and get revision suggestions." : "Write at least 40 characters to unlock feedback."}</span>
          </div>

          <section className={activeFeedback ? "feedback-card answer-feedback-card" : "feedback-card answer-feedback-card empty"} aria-live="polite">
            <div className="feedback-card-heading">
              <div>
                <p className="feedback-eyebrow">Answer feedback</p>
                <h3>{activeFeedback ? "What to keep and improve" : "Feedback will appear here"}</h3>
              </div>
              {score ? <strong className="feedback-score">{score}/100</strong> : null}
            </div>
            {activeFeedback ? (
              <>
                <p className="feedback-summary">{activeFeedback.summary}</p>
                <div className="feedback-columns">
                  <div>
                    <strong>Working</strong>
                    <ul>
                      {activeFeedback.strengths.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <strong>Improve next</strong>
                    <ul>
                      {activeFeedback.improvements.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="rewrite-moves">
                  <strong>Try these edits</strong>
                  <div>
                    {activeFeedback.rewriteMoves.map((move) => (
                      <span key={move}>{move}</span>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <p className="feedback-empty-copy">After you submit an answer, you will get a score, specific strengths, and the next edits to make.</p>
            )}
          </section>

          <div className="coach-strip" aria-label="Natural English phrase alternatives">
            {currentQuestion.phraseAlternatives.map((phrase) => (
              <span key={phrase}>
                <PencilLine size={14} aria-hidden="true" />
                {phrase}
              </span>
            ))}
          </div>
        </div>

        <aside className="score-panel" aria-label="Answer method and score">
          <div className="method-panel">
            <div className="method-panel-heading">
              <span>Prep method</span>
              <a href="/how-to">Full guide</a>
            </div>

            <div className="method-section">
              <p>Why they ask</p>
              <span>{currentQuestion.reason}</span>
            </div>

            <div className="method-section">
              <p>Story Match</p>
              <span>{currentQuestion.storyMatch}</span>
            </div>

            <div className="method-section method-section-strategy">
              <p>{chineseThinkingLabel}</p>
              <span>{currentQuestion.chineseStrategy}</span>
            </div>

            <div className="method-star" aria-label="STAR answer outline">
              {Object.entries(currentQuestion.starOutline).map(([key, value], index) => (
                <div key={key}>
                  <b>{index + 1}</b>
                  <span>
                    <strong>{key}</strong>
                    <small>{value}</small>
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="readiness-meter">
            <div>
              <p>Readiness</p>
              <strong>{score ? `${score}/100` : "—"}</strong>
            </div>
            <span>{score ? scoreLabel(score) : "Write an answer to get feedback"}</span>
          </div>

          <div className="rubric-stack">
            <p className="rubric-heading">Self-review (optional)</p>
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
            Your review notes (optional)
          </label>
          <textarea
            className="notes-box"
            id="notes"
            onChange={(event) => setNotes(event.target.value)}
            placeholder="For your next attempt: one gap, metric, or follow-up question."
            value={notes}
          />

          <div className="cheat-sheet">
            <h3>Interview Cheat Sheet</h3>
            <ul>
              <li>Story: {storyBank[0] ?? "prepare one quantified story"}</li>
              <li>Risk: {riskMap[0]?.signal ?? roleMeta.interviewSignal}</li>
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
          <span>{questionCount}-question prep kit</span>
        </div>
        <div>
          <FileText size={18} aria-hidden="true" />
          <span>No payment or account required</span>
        </div>
        <div>
          <Target size={18} aria-hidden="true" />
          <span>Risk map + story match</span>
        </div>
      </div>
    </section>
  );
}
