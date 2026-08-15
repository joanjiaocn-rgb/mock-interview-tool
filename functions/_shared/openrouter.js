const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

export function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
    },
  });
}

export async function readJson(request) {
  try {
    return await request.json();
  } catch {
    return null;
  }
}

export function truncateText(value, maxLength) {
  return typeof value === "string" ? value.slice(0, maxLength) : "";
}

export function clampNumber(value, allowed, fallback) {
  return allowed.includes(value) ? value : fallback;
}

export function cleanString(value, fallback = "") {
  return typeof value === "string" && value.trim() ? value.trim().slice(0, 1800) : fallback;
}

export function cleanList(value, fallback = []) {
  return Array.isArray(value)
    ? value.map((item) => cleanString(item)).filter(Boolean).slice(0, 6)
    : fallback;
}

function parseJsonObject(content) {
  const text = Array.isArray(content)
    ? content.map((part) => (typeof part?.text === "string" ? part.text : "")).join("\n")
    : String(content ?? "");
  const stripped = text.replace(/^```(?:json)?/i, "").replace(/```$/i, "").trim();
  const start = stripped.indexOf("{");
  const end = stripped.lastIndexOf("}");

  if (start === -1 || end === -1 || end <= start) {
    throw new Error("Model did not return a JSON object.");
  }

  return JSON.parse(stripped.slice(start, end + 1));
}

export async function callOpenRouter(env, messages, { maxTokens = 1600, temperature = 0.35 } = {}) {
  if (!env.OPENROUTER_API_KEY) {
    throw new Error("OPENROUTER_API_KEY is not configured.");
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 25000);

  try {
    const response = await fetch(OPENROUTER_URL, {
      method: "POST",
      signal: controller.signal,
      headers: {
        authorization: `Bearer ${env.OPENROUTER_API_KEY}`,
        "content-type": "application/json",
        "http-referer": env.OPENROUTER_SITE_URL || "https://mock-interview.space",
        "x-title": env.OPENROUTER_SITE_NAME || "Mock Interview Space",
      },
      body: JSON.stringify({
        model: env.OPENROUTER_MODEL || "google/gemini-2.5-flash-lite",
        messages,
        temperature,
        max_tokens: maxTokens,
        response_format: { type: "json_object" },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`OpenRouter request failed: ${response.status} ${errorText.slice(0, 220)}`);
    }

    const payload = await response.json();
    const content = payload?.choices?.[0]?.message?.content;
    return parseJsonObject(content);
  } finally {
    clearTimeout(timeout);
  }
}
