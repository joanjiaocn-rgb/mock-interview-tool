import { callOpenRouter, cleanList, cleanString, jsonResponse, readJson, truncateText } from "../_shared/openrouter.js";

const scoreKeys = ["clarity", "structure", "specificity", "englishPhrasing", "confidence"];

function cleanScore(value) {
  const number = Math.round(Number(value));
  return Math.max(1, Math.min(5, Number.isFinite(number) ? number : 3));
}

function sanitizeFeedback(value) {
  const scores = scoreKeys.reduce((next, key) => {
    next[key] = cleanScore(value?.scores?.[key]);
    return next;
  }, {});

  return {
    summary: cleanString(value?.summary, "Useful draft. Make the answer more specific before rehearsing."),
    strengths: cleanList(value?.strengths, ["You have a starting answer to refine."]).slice(0, 3),
    improvements: cleanList(value?.improvements, ["Add one concrete action, one result, and one stronger ending."]).slice(0, 4),
    rewriteMoves: cleanList(value?.rewriteMoves, ["Add: My specific responsibility was...", "Add: The result was..."]).slice(0, 3),
    scores,
  };
}

export async function onRequestPost({ request, env }) {
  const body = await readJson(request);

  if (!body) {
    return jsonResponse({ error: "INVALID_JSON" }, 400);
  }

  const answer = truncateText(body.answer, 5000);

  if (answer.trim().length < 40) {
    return jsonResponse({ error: "ANSWER_TOO_SHORT" }, 400);
  }

  try {
    const result = await callOpenRouter(
      env,
      [
        {
          role: "system",
          content:
            "You are a precise English behavioral interview coach for non-native speakers. Return only valid JSON. Feedback must quote or refer to the user's actual answer. Do not give generic advice. Do not invent achievements.",
        },
        {
          role: "user",
          content: JSON.stringify({
            task: "Score and coach this interview answer.",
            requiredJsonSchema: {
              summary: "one specific sentence about the biggest improvement",
              strengths: ["2-3 specific strengths based on the user's answer"],
              improvements: ["3-4 specific next improvements, each tied to the question or answer"],
              rewriteMoves: ["2-3 short concrete sentence-level edits the user can apply"],
              scores: {
                clarity: "1-5",
                structure: "1-5",
                specificity: "1-5",
                englishPhrasing: "1-5",
                confidence: "1-5",
              },
            },
            roleSignal: truncateText(body.roleSignal, 500),
            question: truncateText(body.question?.question, 1400),
            reason: truncateText(body.question?.reason, 1000),
            storyMatch: truncateText(body.question?.storyMatch, 1200),
            suggestedDraft: truncateText(body.question?.englishDraft, 1800),
            userAnswer: answer,
          }),
        },
      ],
      { maxTokens: 1800, temperature: 0.18 },
    );

    return jsonResponse({ source: "openrouter", feedback: sanitizeFeedback(result) });
  } catch (error) {
    return jsonResponse({ error: "AI_FEEDBACK_FAILED", message: error instanceof Error ? error.message : "Unknown error" }, 502);
  }
}
