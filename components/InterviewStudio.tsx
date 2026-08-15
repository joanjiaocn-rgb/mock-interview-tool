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
  LoaderCircle,
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

type BuildInputs = {
  role: Role;
  level: Level;
  questionCount: QuestionCount;
  jdText: string;
  resumeText: string;
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

function hasAnyTerm(text: string, terms: string[]) {
  return terms.some((term) => text.includes(term));
}

function matchingTerms(text: string, terms: string[]) {
  return terms.filter((term) => text.includes(term));
}

function sentenceSnippet(text: string, terms: string[]) {
  const lowerTerms = terms.map((term) => term.toLowerCase());
  const sentence = splitSentences(text).find((item) => {
    const lower = item.toLowerCase();
    return lowerTerms.some((term) => lower.includes(term));
  });

  if (!sentence) return "";

  return sentence.length > 96 ? `${sentence.slice(0, 93).trim()}...` : sentence;
}

function uniqueLimit(items: string[], limit: number) {
  return items.filter(Boolean).filter((item, index, all) => all.indexOf(item) === index).slice(0, limit);
}

function questionFocus(question: string) {
  const lower = question.toLowerCase();

  if (/(disagree|conflict|critique|feedback)/.test(lower)) {
    if (/feedback|critique/.test(lower)) {
      return {
        label: "feedback or critique",
        evidence: ["feedback", "critique", "changed", "improved", "asked", "adjusted", "learned"],
        expected: "who gave the feedback, what you changed, and how the next version improved",
        rewrite: "Add: The feedback was that..., so I changed... and checked whether...",
      };
    }

    return {
      label: "disagreement or conflict",
      evidence: ["disagreed", "conflict", "perspective", "stakeholder", "teammate", "alignment", "agreed", "resolved"],
      expected: "the other person's view, the decision criteria, and how you reached alignment",
      rewrite: "Add: The disagreement was between... We compared the options by... and agreed to...",
    };
  }
  if (/(ambig|unclear|prioritize|deadline|tradeoff)/.test(lower)) {
    return {
      label: "decision under constraints",
      evidence: ["ambiguous", "unclear", "constraint", "priority", "prioritized", "tradeoff", "deadline", "options", "decided"],
      expected: "the constraint, the options you weighed, and why your choice was reasonable",
      rewrite: "Add: The constraint was... I compared... and chose... because...",
    };
  }
  if (/(mistake|did not work|failure|issue|risk|production)/.test(lower)) {
    return {
      label: "failure recovery",
      evidence: ["mistake", "failed", "issue", "risk", "root cause", "recovered", "fixed", "verified", "prevented"],
      expected: "what went wrong, your recovery action, and how you prevented the same issue later",
      rewrite: "Add: The issue appeared when... I fixed it by... and prevented it later by...",
    };
  }
  if (/(data|metric|customer|research|experiment)/.test(lower)) {
    return {
      label: "evidence-led decision",
      evidence: ["data", "metric", "analysis", "customer", "research", "experiment", "dashboard", "segment", "tested", "measured"],
      expected: "the signal you found, the decision it changed, and the measured result",
      rewrite: "Add: The data showed... That changed our decision from... to... We measured...",
    };
  }
  if (/(influence|without formal authority|alignment|trust|team)/.test(lower)) {
    return {
      label: "influence and collaboration",
      evidence: ["influenced", "aligned", "stakeholder", "partner", "trust", "buy-in", "team", "convinced", "shared"],
      expected: "who needed convincing, what you changed in your communication, and what they did next",
      rewrite: "Add: The person I needed to influence cared about... I reframed the message as...",
    };
  }
  if (/(complex|simply|communicate)/.test(lower)) {
    return {
      label: "clear communication",
      evidence: ["explained", "communicated", "audience", "simple", "technical", "decision", "summary", "follow-up"],
      expected: "the audience, what was hard to understand, and how your explanation changed the decision",
      rewrite: "Add: The audience needed to decide... so I simplified the message by...",
    };
  }
  return {
    label: "personal ownership",
    evidence: ["owned", "led", "built", "created", "decided", "improved", "launched", "shipped"],
    expected: "the part you personally owned, the action you took, and the outcome",
    rewrite: "Add: My specific ownership was... I decided to... The outcome was...",
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
  const weakPhraseUsed = weakPhrases.find((phrase) => lower.includes(phrase));
  const usedOwnershipVerbs = matchingTerms(lower, ownershipVerbs);
  const metricMatch = trimmed.match(/\b\d+(\.\d+)?\s?(%|x|k|m|hours?|days?|weeks?|users?|customers?|revenue|dollars?)?\b|\$/i)?.[0];
  const focusSnippet = sentenceSnippet(trimmed, focus.evidence);
  const resultSnippet = sentenceSnippet(trimmed, resultWords);
  const questionEvidence = hasAnyTerm(lower, focus.evidence);
  const hasQuestionSignal = roleSignal
    .split(/\s+|\/|,|and/)
    .filter((word) => word.length > 5)
    .some((word) => lower.includes(word.toLowerCase()));
  const hasStoryAnchor = question.storyMatch
    .toLowerCase()
    .split(/\s+/)
    .filter((word) => word.length > 6)
    .slice(0, 6)
    .some((word) => lower.includes(word));

  const clarity = clampScore(
    2 +
      (words.length >= 55 ? 1 : 0) +
      (words.length >= 90 && words.length <= 190 ? 1 : 0) +
      (sentences.length >= 3 && sentences.length <= 8 ? 1 : 0) -
      (words.length > 240 ? 1 : 0),
  );
  const structure = clampScore(1 + (hasContext ? 1 : 0) + (hasChallenge ? 1 : 0) + (hasResult ? 1 : 0) + (hasStarWords >= 2 ? 1 : 0));
  const specificity = clampScore(1 + (hasMetric ? 2 : 0) + (questionEvidence ? 1 : 0) + (hasStoryAnchor ? 1 : 0));
  const englishPhrasing = clampScore(3 + (sentences.length >= 3 ? 1 : 0) + (hasWeakPhrase ? -1 : 0) + (words.length > 220 ? -1 : 0));
  const confidence = clampScore(2 + (hasFirstPerson ? 1 : 0) + (hasOwnership ? 1 : 0) + (hasWeakPhrase ? -1 : 0) + (hasResult ? 1 : 0));
  const scores = { clarity, structure, specificity, englishPhrasing, confidence };
  const score = readinessScore(scores);

  const strengths = uniqueLimit(
    [
      hasContext ? `Sets a usable context${sentences[0] ? `: "${sentenceSnippet(trimmed, [sentences[0].slice(0, 20).toLowerCase()]) || sentences[0].slice(0, 90)}"` : "."}` : "",
      questionEvidence && focusSnippet ? `Has some ${focus.label} evidence: "${focusSnippet}"` : "",
      usedOwnershipVerbs.length ? `Shows ownership with verbs like ${usedOwnershipVerbs.slice(0, 2).join(" and ")}.` : "",
      metricMatch ? `Includes a concrete proof point (${metricMatch}).` : "",
      resultSnippet ? `Mentions an outcome: "${resultSnippet}"` : "",
      hasReflection ? "Includes a learning point, which helps the answer feel mature." : "",
      hasStoryAnchor ? "Uses material from the generated story match instead of sounding generic." : "",
    ],
    3,
  );

  const improvements = uniqueLimit(
    [
      !questionEvidence ? `[Question fit] This is a ${focus.label} question. Add ${focus.expected}.` : "",
      genericOpening ? `[Opening] Start with the real situation, not a template phrase like "${trimmed.split(/\s+/).slice(0, 4).join(" ")}..."` : "",
      !hasContext ? "[Setup] Name the project, team, or user group before explaining what you did." : "",
      !hasChallenge ? `[Tension] Explain what made the story hard: the risk, constraint, disagreement, or tradeoff.` : "",
      ownershipCount < 2 ? `[Action depth] Add two specific actions or decisions you personally owned during the ${focus.label}.` : "",
      !hasMetric ? "[Evidence] Add a number, timeline, scope, or observable before/after result." : "",
      !hasResult ? "[Ending] Close with what improved, changed, shipped, or was decided because of your work." : "",
      !hasReflection && /(feedback|critique|mistake|failure|did not work)/i.test(question.question)
        ? "[Learning] Since this question tests maturity, add one sentence about what you changed afterward."
        : "",
      !hasQuestionSignal ? `[Role fit] Tie the final sentence back to ${roleSignal}.` : "",
      !hasFirstPerson ? "[Ownership] Use I-statements so the interviewer can separate your contribution from the team's work." : "",
      weakPhraseUsed ? `[Language] Replace "${weakPhraseUsed}" with a precise action verb or result.` : "",
      words.length < 70 ? "[Depth] This is still short. Add one action, one obstacle, and one outcome." : "",
      words.length > 220 ? "[Concision] This is long for a spoken answer. Cut background and keep the strongest 90 seconds." : "",
    ],
    4,
  );

  const rewriteMoves = uniqueLimit(
    [
      !questionEvidence ? focus.rewrite : "",
      !hasContext ? "Add: The situation was... and the stake was..." : "",
      ownershipCount < 2 ? "Add: I decided to... / I changed..." : "",
      !hasMetric ? "Add: We measured this by... / The result was..." : "",
      !hasResult ? "End with: As a result..." : "",
      weakPhraseUsed ? `Replace "${weakPhraseUsed}" with "owned", "led", "built", or the exact action.` : "",
      hasResult && hasMetric && hasReflection ? "Keep this structure and rehearse it aloud in 60-90 seconds." : "",
    ],
    3,
  );

  const topGap = improvements[0]?.replace(/^\[[^\]]+\]\s*/, "") ?? `Keep sharpening the ${focus.label}.`;

  return {
    summary: score >= 75
      ? `Strong draft for a ${focus.label} question. Next upgrade: ${topGap}`
      : score >= 58
        ? `Relevant start for a ${focus.label} question. Biggest gap: ${topGap}`
        : `This needs a clearer ${focus.label} story before polishing English. Start with: ${topGap}`,
    strengths: strengths.length ? strengths : ["You have a draft to work from, but it needs more concrete interview evidence."],
    improvements: improvements.length
      ? improvements
      : [`[Polish] The structure is usable. Make one sentence more vivid and rehearse the ${focus.label} aloud.`],
    rewriteMoves,
    scores,
  };
}

type PrepKitResult = {
  riskMap: RiskItem[];
  questions: GeneratedQuestion[];
  source?: string;
};

async function postJson<T>(url: string, payload: unknown): Promise<T | null> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 28000);

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    if (!response.ok) return null;

    return (await response.json()) as T;
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

function isValidPrepKit(value: unknown): value is PrepKitResult {
  const candidate = value as PrepKitResult;
  return Array.isArray(candidate?.riskMap) && candidate.riskMap.length > 0 && Array.isArray(candidate?.questions) && candidate.questions.length > 0;
}

function isValidFeedback(value: unknown): value is { feedback: ReviewFeedback; source?: string } {
  const candidate = value as { feedback?: ReviewFeedback };
  return Boolean(
    candidate?.feedback?.summary &&
      Array.isArray(candidate.feedback.strengths) &&
      Array.isArray(candidate.feedback.improvements) &&
      Array.isArray(candidate.feedback.rewriteMoves) &&
      candidate.feedback.scores,
  );
}

async function requestAiPrepKit(inputs: BuildInputs) {
  const result = await postJson<PrepKitResult>("/api/prep-kit", inputs);
  return isValidPrepKit(result) ? result : null;
}

async function requestAiFeedback(answer: string, question: GeneratedQuestion, roleSignal: string) {
  const result = await postJson<{ feedback: ReviewFeedback; source?: string }>("/api/answer-feedback", {
    answer,
    question,
    roleSignal,
  });
  return isValidFeedback(result) ? result.feedback : null;
}

export function InterviewStudio() {
  const [isReady, setIsReady] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isReviewing, setIsReviewing] = useState(false);
  const [role, setRole] = useState<Role>("pm");
  const [level, setLevel] = useState<Level>("mid");
  const [questionCount, setQuestionCount] = useState<QuestionCount>(10);
  const [jdText, setJdText] = useState("");
  const [resumeText, setResumeText] = useState("");
  const [resumeName, setResumeName] = useState("");
  const [generatedInputs, setGeneratedInputs] = useState<BuildInputs>({
    role: "pm",
    level: "mid",
    questionCount: 10,
    jdText: "",
    resumeText: "",
  });
  const [aiPrepKit, setAiPrepKit] = useState<PrepKitResult | null>(null);
  const [generationSource, setGenerationSource] = useState<"ai" | "local" | "">("");
  const [builtSignature, setBuiltSignature] = useState("");
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
  const generationStatusRef = useRef<HTMLDivElement | null>(null);
  const buildTimerRef = useRef<number | null>(null);

  const localQuestions = useMemo(
    () => generateQuestions(generatedInputs.role, generatedInputs.level, generatedInputs.questionCount, generatedInputs.jdText, generatedInputs.resumeText),
    [generatedInputs],
  );
  const localRiskMap = useMemo(() => buildRiskMap(generatedInputs.role, generatedInputs.level, generatedInputs.jdText, generatedInputs.resumeText), [generatedInputs]);
  const questions = aiPrepKit?.questions.length ? aiPrepKit.questions : localQuestions;
  const riskMap = aiPrepKit?.riskMap.length ? aiPrepKit.riskMap : localRiskMap;
  const currentQuestion = questions[activeQuestion] ?? questions[0];
  const activeAnswer = answers[activeQuestion] ?? "";
  const activeFeedback = feedbacks[activeQuestion];
  const canReviewAnswer = activeAnswer.trim().length >= 40;
  const score = activeFeedback ? readinessScore(activeFeedback.scores) : null;
  const roleMeta = roles.find((item) => item.id === generatedInputs.role) ?? roles[0];
  const selectedRoleMeta = roles.find((item) => item.id === role) ?? roles[0];
  const jdSignals = extractSignals(jdText, role);
  const resumeSignals = extractSignals(resumeText, role);
  const detectedSignals = [...new Set([...jdSignals, ...resumeSignals])];
  const generatedSignals = [
    ...new Set([...extractSignals(generatedInputs.jdText, generatedInputs.role), ...extractSignals(generatedInputs.resumeText, generatedInputs.role)]),
  ];
  const storyBank = cleanLines(generatedInputs.resumeText).slice(0, 5);
  const answeredCount = answers.filter((answer) => answer.trim()).length;
  const inputSignature = `${role}|${level}|${questionCount}|${jdText}|${resumeText}`;
  const buildStatus = isGenerating ? "building" : builtSignature === inputSignature ? "built" : builtSignature ? "stale" : "idle";

  useEffect(() => {
    setIsReady(true);
  }, []);

  useEffect(() => {
    return () => {
      if (buildTimerRef.current) {
        window.clearTimeout(buildTimerRef.current);
      }
    };
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

  const reviewAnswer = async () => {
    if (!canReviewAnswer) return;

    setIsReviewing(true);
    const aiFeedback = await requestAiFeedback(activeAnswer, currentQuestion, roleMeta.interviewSignal);
    const feedback = aiFeedback ?? evaluateAnswer(activeAnswer, currentQuestion, roleMeta.interviewSignal);
    setIsReviewing(false);
    setScores(feedback.scores);
    setFeedbacks((current) => {
      const next = [...current];
      next[activeQuestion] = feedback;
      return next;
    });
    reportAnalyticsEvent("answer_feedback_generated", {
      answer_chars: activeAnswer.length,
      readiness_score: readinessScore(feedback.scores),
      ai_used: Boolean(aiFeedback),
    });
  };

  const handleResumeFile = async (file?: File) => {
    if (!file) return;

    const text = await file.text();
    setResumeText(text);
    setResumeName(file.name);
    reportAnalyticsEvent("resume_uploaded", { size: file.size });
  };

  const focusGeneratedRound = async () => {
    if (buildTimerRef.current) {
      window.clearTimeout(buildTimerRef.current);
    }

    const nextInputs = {
      role,
      level,
      questionCount,
      jdText,
      resumeText,
    };
    const nextRiskMap = buildRiskMap(role, level, jdText, resumeText);

    setIsGenerating(true);
    setActiveQuestion(0);
    setAnswers([]);
    setFeedbacks([]);
    setAiPrepKit(null);
    setGenerationSource("");
    setScores({
      clarity: 3,
      structure: 3,
      specificity: 2,
      englishPhrasing: 3,
      confidence: 3,
    });
    generationStatusRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    reportAnalyticsEvent("prep_kit_generated", {
      jd_chars: jdText.length,
      resume_chars: resumeText.length,
      risk_count: nextRiskMap.length,
    });
    const startedAt = Date.now();
    const aiResult = await requestAiPrepKit(nextInputs);
    const elapsed = Date.now() - startedAt;

    if (elapsed < 650) {
      await new Promise((resolve) => {
        buildTimerRef.current = window.setTimeout(resolve, 650 - elapsed);
      });
    }

    setGeneratedInputs(nextInputs);
    setAiPrepKit(aiResult);
    setGenerationSource(aiResult ? "ai" : "local");
    setBuiltSignature(inputSignature);
    setIsGenerating(false);
    window.setTimeout(() => generationStatusRef.current?.focus(), 0);
    reportAnalyticsEvent("prep_kit_build_finished", {
      ai_used: Boolean(aiResult),
      risk_count: aiResult?.riskMap.length ?? nextRiskMap.length,
      question_count: aiResult?.questions.length ?? questionCount,
    });
  };

  const resetWorkspace = () => {
    if (buildTimerRef.current) {
      window.clearTimeout(buildTimerRef.current);
    }
    setIsGenerating(false);
    setBuiltSignature("");
    setAiPrepKit(null);
    setGenerationSource("");
    setGeneratedInputs({
      role: "pm",
      level: "mid",
      questionCount: 10,
      jdText: "",
      resumeText: "",
    });
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
            `### Question ${index + 1}`,
            "",
            `**Question:** ${question.question}`,
            "",
            `**Suggested answer draft:** ${question.englishDraft}`,
            "",
            `**Your practiced answer:** ${answer}`,
            "",
          ]
        : [];
    });

    const suggestedAnswerDrafts = questions.slice(0, 6).flatMap((question, index) => [
      `### Question ${index + 1}`,
      "",
      `**Question:** ${question.question}`,
      "",
      `**Story match:** ${question.storyMatch}`,
      "",
      `**Suggested answer draft:** ${question.englishDraft}`,
      "",
    ]);

    const report = [
      "# 48-Hour English Interview Prep Kit",
      "",
      "## Overview",
      "",
      `- **Role:** ${roleMeta.label}`,
      `- **Level:** ${levels.find((item) => item.id === level)?.label}`,
      `- **Readiness score:** ${score ?? "Not reviewed"}${score ? ` - ${scoreLabel(score)}` : ""}`,
      "",
      "## Interview Risk Map",
      "",
      ...riskMap.map((item, index) => `${index + 1}. **${item.signal}** (${item.source}) - ${item.prepAdvice}`),
      "",
      "## Top Questions",
      "",
      ...questions.slice(0, 6).map((question, index) => `${index + 1}. ${question.question}`),
      "",
      "## Story Match",
      "",
      ...questions.slice(0, 6).map((question, index) => `${index + 1}. ${question.storyMatch}`),
      "",
      "## Suggested Answer Drafts",
      "",
      ...suggestedAnswerDrafts,
      "## Story Bank",
      "",
      ...(storyBank.length ? storyBank.map((line) => `- ${line}`) : ["- Add 3-5 concrete stories before your interview."]),
      "",
      "## English Phrases To Reuse",
      "",
      ...strongPhrases.map((phrase) => `- ${phrase}`),
      "",
      "## Practiced Answers",
      "",
      ...(practicedAnswers.length ? practicedAnswers : ["[No practiced answers yet]"]),
      "",
      "## Last-Minute Checklist",
      "",
      "- Rehearse the 3 strongest stories aloud.",
      "- Add one metric, scope, or timeline to each key answer.",
      "- Keep answers near 60-90 seconds when spoken.",
      "- Avoid vague phrases like \"helped a lot\" or \"I just\".",
      "",
      "## Your Review Notes",
      "",
      notes.trim() || "[No notes recorded]",
    ].join("\n");

    const blob = new Blob([report], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "interview-english-prep-kit.md";
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
            <p className="role-focus">Focus: {selectedRoleMeta.interviewSignal}</p>
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
              <button aria-busy={isGenerating} className="resume-build-button" disabled={isGenerating} onClick={focusGeneratedRound} type="button">
                {isGenerating ? <LoaderCircle className="spin-icon" size={16} aria-hidden="true" /> : <ClipboardList size={16} aria-hidden="true" />}
                {isGenerating ? "Building..." : buildStatus === "built" ? "Rebuild prep kit" : "Build prep kit"}
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
                ? `Found ${detectedSignals.length || "general"} signal${detectedSignals.length === 1 ? "" : "s"} in your inputs. Click Build to generate the kit.`
                : "Paste a JD and resume to make the questions more specific."}
            </p>
            {detectedSignals.length > 0 ? (
              <div className="resume-signal-list" aria-label="Detected signals">
                {detectedSignals.map((signal) => (
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

        <div className={buildStatus === "built" ? "practice-panel generated" : "practice-panel"}>
          <div className="question-bar">
            <span className="question-count-label">
              Question {activeQuestion + 1} of {questions.length}
              <small>{roleMeta.label}</small>
            </span>
            <div className="question-actions">
              <button aria-busy={isGenerating} className="interview-start-button" disabled={isGenerating} onClick={focusGeneratedRound} type="button">
                {isGenerating ? <LoaderCircle className="spin-icon" size={17} aria-hidden="true" /> : <ClipboardList size={17} aria-hidden="true" />}
                {isGenerating ? "Building..." : "Rebuild prep kit"}
              </button>
              <button className="voice-command" onClick={downloadCheatSheet} type="button">
                <ArrowDownToLine size={17} aria-hidden="true" />
                Export Markdown Kit
              </button>
            </div>
          </div>

          <div className={`generation-status ${buildStatus}`} aria-live="polite" ref={generationStatusRef} role="status" tabIndex={-1}>
            <div className="generation-status-main">
              {buildStatus === "building" ? (
                <LoaderCircle className="spin-icon" size={18} aria-hidden="true" />
              ) : buildStatus === "built" ? (
                <CheckCircle2 size={18} aria-hidden="true" />
              ) : (
                <ClipboardList size={18} aria-hidden="true" />
              )}
              <span>
                <strong>
                  {buildStatus === "building"
                    ? "Building your prep kit"
                    : buildStatus === "built"
                      ? "Prep kit built"
                      : buildStatus === "stale"
                        ? "Inputs changed"
                        : "Ready to build"}
                </strong>
                <small>
                  {buildStatus === "building"
                    ? "Sending the role and experience to the AI coach, then checking the draft structure."
                    : buildStatus === "built"
                      ? generationSource === "ai"
                        ? "AI-generated risk map, question set, story matches, and answer drafts are ready."
                        : "Backup local draft is ready. AI is unavailable, but you can still practice and export."
                      : buildStatus === "stale"
                        ? "Click Rebuild prep kit to refresh the results with your latest inputs."
                        : "Click Build prep kit to turn your JD and resume into a practice plan."}
                </small>
              </span>
            </div>
            <div className="generation-status-metrics" aria-label="Generated prep kit summary">
              <span>{riskMap.length} risks</span>
              <span>{questions.length} questions</span>
              <span>{Math.min(6, questions.length)} drafts</span>
              <span>{generatedSignals.length || "general"} signals</span>
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
            <button aria-busy={isReviewing} className="feedback-button" disabled={!canReviewAnswer || isReviewing} onClick={reviewAnswer} type="button">
              {isReviewing ? <LoaderCircle className="spin-icon" size={17} aria-hidden="true" /> : <ClipboardCheck size={17} aria-hidden="true" />}
              {isReviewing ? "Reviewing..." : "Get feedback"}
            </button>
            <span>{canReviewAnswer ? "AI reviews this answer first; local scoring is used if AI is unavailable." : "Write at least 40 characters to unlock feedback."}</span>
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
              Export Markdown
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
