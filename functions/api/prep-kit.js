import { callOpenRouter, clampNumber, cleanList, cleanString, jsonResponse, readJson, truncateText } from "../_shared/openrouter.js";

const roles = {
  pm: "Product Manager",
  data: "Data Analyst",
  software: "Software Engineer",
  design: "UX Designer",
  marketing: "Marketing",
  leadership: "Leadership",
};

const levels = {
  early: "entry",
  mid: "mid-level",
  senior: "senior",
};

function sanitizeRiskMap(value) {
  return Array.isArray(value)
    ? value
        .map((item) => ({
          signal: cleanString(item?.signal),
          source: ["jd", "resume", "role"].includes(item?.source) ? item.source : "role",
          prepAdvice: cleanString(item?.prepAdvice),
        }))
        .filter((item) => item.signal && item.prepAdvice)
        .slice(0, 6)
    : [];
}

function sanitizeQuestions(value, count) {
  return Array.isArray(value)
    ? value
        .map((item, index) => ({
          id: `q-${index + 1}`,
          question: cleanString(item?.question),
          reason: cleanString(item?.reason),
          storyMatch: cleanString(item?.storyMatch, "Use one concrete story from your resume."),
          chineseStrategy: cleanString(item?.chineseStrategy, "用 STAR 结构回答：背景、任务、行动、结果。"),
          starOutline: {
            situation: cleanString(item?.starOutline?.situation, "Name the project and context."),
            task: cleanString(item?.starOutline?.task, "State the goal and constraint."),
            action: cleanString(item?.starOutline?.action, "Explain the actions you owned."),
            result: cleanString(item?.starOutline?.result, "End with a result, metric, or lesson."),
          },
          englishDraft: cleanString(item?.englishDraft),
          phraseAlternatives: cleanList(item?.phraseAlternatives, [
            "The constraint I optimized for was...",
            "My specific responsibility was...",
            "The measurable result was...",
          ]).slice(0, 3),
        }))
        .filter((item) => item.question && item.englishDraft)
        .slice(0, count)
    : [];
}

export async function onRequestPost({ request, env }) {
  const body = await readJson(request);

  if (!body) {
    return jsonResponse({ error: "INVALID_JSON" }, 400);
  }

  const role = roles[body.role] ? body.role : "pm";
  const level = levels[body.level] ? body.level : "mid";
  const questionCount = clampNumber(Number(body.questionCount), [8, 10, 12], 10);
  const jdText = truncateText(body.jdText, 8000);
  const resumeText = truncateText(body.resumeText, 10000);

  if (!jdText.trim() && !resumeText.trim()) {
    return jsonResponse({ error: "MISSING_INPUT" }, 400);
  }

  try {
    const result = await callOpenRouter(
      env,
      [
        {
          role: "system",
          content:
            "You are an English behavioral interview coach for non-native speakers. Return only valid JSON. Do not invent achievements, employers, metrics, or tools. If evidence is missing, use bracketed placeholders like [metric] or [project].",
        },
        {
          role: "user",
          content: JSON.stringify({
            task: "Create a 48-hour interview prep kit from this JD and resume.",
            role: roles[role],
            level: levels[level],
            questionCount,
            requiredJsonSchema: {
              riskMap: [{ signal: "string", source: "jd|resume|role", prepAdvice: "string" }],
              questions: [
                {
                  question: "behavioral interview question tied to the role",
                  reason: "why this question is likely",
                  storyMatch: "specific resume story or gap to use",
                  chineseStrategy: "concise Chinese explanation of answer strategy",
                  starOutline: {
                    situation: "string",
                    task: "string",
                    action: "string",
                    result: "string",
                  },
                  englishDraft: "natural 60-90 second English answer draft using only user evidence and placeholders for missing proof",
                  phraseAlternatives: ["3 reusable English phrases"],
                },
              ],
            },
            jobDescription: jdText,
            resumeOrExperienceNotes: resumeText,
          }),
        },
      ],
      { maxTokens: 4200, temperature: 0.28 },
    );

    const riskMap = sanitizeRiskMap(result.riskMap);
    const questions = sanitizeQuestions(result.questions, questionCount);

    if (!riskMap.length || questions.length < Math.min(4, questionCount)) {
      return jsonResponse({ error: "LOW_QUALITY_OUTPUT" }, 502);
    }

    return jsonResponse({ source: "openrouter", riskMap, questions });
  } catch (error) {
    return jsonResponse({ error: "AI_PREP_KIT_FAILED", message: error instanceof Error ? error.message : "Unknown error" }, 502);
  }
}
