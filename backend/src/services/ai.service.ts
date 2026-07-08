import { GEMINI_API_KEY } from "../configs/constant";
import { StayService } from "./stay.service";
import { TrailService } from "./trail.service";

type Trail = Awaited<ReturnType<TrailService["getAllTrails"]>>[number];
type Stay = Awaited<ReturnType<StayService["getAllStays"]>>[number];

type GeminiResponse = {
  candidates?: {
    content?: {
      parts?: {
        text?: string;
      }[];
    };
  }[];
  message?: string;
};

type RawRecommendation = {
  type?: unknown;
  slug?: unknown;
  title?: unknown;
  reason?: unknown;
};

export type AiRecommendation = {
  type: "trail" | "stay";
  slug: string;
  title: string;
  reason: string;
  price?: string;
  difficulty?: Trail["difficulty"];
  detailHref: string;
  bookingHref?: string;
};

export type AiTrekAssistantResponse = {
  answer: string;
  recommendations: AiRecommendation[];
};

const trailService = new TrailService();
const stayService = new StayService();

const systemInstruction = `
You are Yeti Trek Assistant, the helpful AI guide inside the Yeti Trek dashboard.
Answer only about the Yeti Trek app, Nepal trekking, trails, stays, bookings, trek planning, route difficulty, safety, packing, weather preparation, and dashboard help.
Use simple student-friendly language. Keep answers concise, practical, and under two short paragraphs.
When recommending trails or stays, recommend only items from the app catalog. Do not invent names, prices, slugs, or links.
Return JSON only in this exact shape:
{
  "answer": "short helpful answer",
  "recommendations": [
    {
      "type": "trail" or "stay",
      "slug": "exact-catalog-slug",
      "title": "exact catalog title/name",
      "reason": "one short reason"
    }
  ]
}
If the user asks about something unrelated, politely guide them back to trekking or the Yeti Trek app.
`;

const appContext = `
Yeti Trek helps users discover Nepal trekking trails, compare mountain stays, plan treks, and manage trail or stay bookings from the dashboard.
The user dashboard includes Home, Stay, Trails, Profile, Booking History, trail detail pages, stay detail pages, and booking pages.
`;

export class AiService {
  async askTrekAssistant(question: string): Promise<AiTrekAssistantResponse> {
    const trimmedQuestion = question.trim();

    if (!trimmedQuestion) {
      throw new Error("Please ask a question about trekking, trails, stays, or your Yeti Trek dashboard.");
    }

    const [trails, stays] = await Promise.all([
      trailService.getAllTrails(),
      stayService.getAllStays(),
    ]);
    const localRecommendations = buildBudgetRecommendations(trimmedQuestion, trails, stays);

    if (!GEMINI_API_KEY) {
      const recommendations = normalizeRecommendations(localRecommendations, trails, stays);
      return {
        answer: buildFallbackAnswer(trimmedQuestion, recommendations),
        recommendations,
      };
    }

    const response = await generateGeminiContent(
      buildCatalogContext(trimmedQuestion, trails, stays, localRecommendations),
      trimmedQuestion,
    );
    const text = extractGeminiText(response);
    const parsed = parseAssistantJson(text);
    const recommendations = normalizeRecommendations(
      parsed.recommendations.length ? parsed.recommendations : localRecommendations,
      trails,
      stays,
    );

    return {
      answer: parsed.answer || buildFallbackAnswer(trimmedQuestion, recommendations),
      recommendations,
    };
  }
}

const generateGeminiContent = async (userContext: string, userQuery: string): Promise<GeminiResponse> => {
  const response = await fetch(
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-goog-api-key": GEMINI_API_KEY,
      },
      body: JSON.stringify({
        systemInstruction: {
          parts: [{ text: systemInstruction }],
        },
        contents: [
          {
            parts: [{ text: userContext }, { text: userQuery }],
          },
        ],
      }),
    },
  );

  const data = (await response.json()) as GeminiResponse & {
    error?: {
      message?: string;
    };
  };

  if (!response.ok) {
    if (response.status === 503) {
      throw new Error("Gemini is temporarily unavailable. Please try again in a few minutes.");
    }

    if ([400, 401, 403].includes(response.status)) {
      throw new Error("Gemini could not authorize this request. Please check the backend GEMINI_API_KEY.");
    }

    throw new Error(data.error?.message || "Unable to generate content right now.");
  }

  return data;
};

const buildCatalogContext = (
  prompt: string,
  trails: Trail[],
  stays: Stay[],
  localRecommendations: RawRecommendation[],
) => {
  const budget = getBudget(prompt);
  const trailCatalog = trails.map((trail) => ({
    type: "trail",
    slug: trail.slug,
    title: trail.title,
    difficulty: trail.difficulty,
    duration: trail.detailDuration || trail.duration,
    distance: trail.distance,
    altitude: trail.altitude,
    estimate: estimateTrailBudget(trail, stays),
    summary: trail.text,
  }));
  const stayCatalog = stays.map((stay) => ({
    type: "stay",
    slug: stay.slug,
    title: stay.name,
    price: stay.price,
    numericPrice: parsePrice(stay.price),
    distance: stay.distance,
    amenities: stay.amenities,
    summary: stay.description,
  }));

  return `
${appContext}
User budget detected: ${budget ? `NPR ${budget}` : "No clear budget given"}.
Budget-filtered app suggestions from backend data:
${JSON.stringify(localRecommendations)}
App trail catalog:
${JSON.stringify(trailCatalog)}
App stay catalog:
${JSON.stringify(stayCatalog)}
Use only exact slugs from these catalogs. Prefer the budget-filtered suggestions when they fit the question.
`;
};

const extractGeminiText = (response: GeminiResponse) => {
  return response.candidates?.[0]?.content?.parts?.map((part) => part.text || "").join("").trim() || "";
};

const parseAssistantJson = (text: string) => {
  const cleaned = text.replace(/```json|```/g, "").trim();

  try {
    const parsed = JSON.parse(cleaned) as {
      answer?: unknown;
      recommendations?: RawRecommendation[];
    };

    return {
      answer: typeof parsed.answer === "string" ? parsed.answer : cleaned,
      recommendations: Array.isArray(parsed.recommendations) ? parsed.recommendations : [],
    };
  } catch {
    return {
      answer: cleaned,
      recommendations: [],
    };
  }
};

const normalizeRecommendations = (
  recommendations: RawRecommendation[],
  trails: Trail[],
  stays: Stay[],
): AiRecommendation[] => {
  const seen = new Set<string>();
  const normalized: AiRecommendation[] = [];

  for (const recommendation of recommendations) {
    if (typeof recommendation.slug !== "string") {
      continue;
    }

    const requestedType = recommendation.type === "stay" ? "stay" : "trail";
    const key = `${requestedType}:${recommendation.slug}`;

    if (seen.has(key)) {
      continue;
    }

    if (requestedType === "stay") {
      const stay = stays.find((item) => item.slug === recommendation.slug);

      if (!stay) {
        continue;
      }

      seen.add(key);
      normalized.push({
        type: "stay",
        slug: stay.slug,
        title: stay.name,
        reason: stringOrDefault(recommendation.reason, stay.description),
        price: stay.price,
        detailHref: `/dashboard/stay/${stay.slug}`,
        bookingHref: `/dashboard/stay/${stay.slug}/booking`,
      });
      continue;
    }

    const trail = trails.find((item) => item.slug === recommendation.slug);

    if (!trail) {
      continue;
    }

    seen.add(key);
    normalized.push({
      type: "trail",
      slug: trail.slug,
      title: trail.title,
      reason: stringOrDefault(recommendation.reason, trail.text),
      difficulty: trail.difficulty,
      detailHref: `/dashboard/trails/${trail.slug}`,
      bookingHref: `/dashboard/trails/${trail.slug}/booking`,
    });
  }

  return normalized.slice(0, 4);
};

const buildBudgetRecommendations = (prompt: string, trails: Trail[], stays: Stay[]) => {
  const budget = getBudget(prompt);
  const wantsStay = /\bstay|hotel|lodge|room|accommodation\b/i.test(prompt);
  const wantsTrail = /\btrail|trek|route|hike|plan\b/i.test(prompt);
  const recommendations: RawRecommendation[] = [];

  if (!wantsStay || wantsTrail) {
    const sortedTrails = trails
      .map((trail) => ({
        trail,
        estimate: estimateTrailBudget(trail, stays),
        score: matchScore(prompt, `${trail.title} ${trail.difficulty} ${trail.text}`),
      }))
      .filter((item) => !budget || item.estimate === 0 || item.estimate <= budget)
      .sort((a, b) => b.score - a.score || a.estimate - b.estimate)
      .slice(0, 2);

    recommendations.push(
      ...sortedTrails.map(({ trail, estimate }) => ({
        type: "trail",
        slug: trail.slug,
        title: trail.title,
        reason: estimate
          ? `Fits the catalog and has an estimated lodge budget around NPR ${estimate}.`
          : `${trail.difficulty} trek from your app catalog.`,
      })),
    );
  }

  if (!wantsTrail || wantsStay) {
    const sortedStays = stays
      .map((stay) => ({
        stay,
        price: parsePrice(stay.price),
        score: matchScore(prompt, `${stay.name} ${stay.distance} ${stay.description} ${stay.amenities.join(" ")}`),
      }))
      .filter((item) => !budget || item.price === 0 || item.price <= budget)
      .sort((a, b) => b.score - a.score || a.price - b.price)
      .slice(0, 2);

    recommendations.push(
      ...sortedStays.map(({ stay }) => ({
        type: "stay",
        slug: stay.slug,
        title: stay.name,
        reason: `Matches your stay request from the app catalog at ${stay.price}.`,
      })),
    );
  }

  return recommendations;
};

const buildFallbackAnswer = (prompt: string, recommendations: AiRecommendation[]) => {
  if (recommendations.length) {
    return "Based on your question, I found these matching options from your Yeti Trek app. You can open the details or booking page from the buttons below.";
  }

  if (/\bbudget|rs|npr|price|cost|cheap|affordable\b/i.test(prompt)) {
    return "I checked your app catalog, but I could not find a clear budget match. Try asking with a number like 'stay under 3000' or 'trail within 10000'.";
  }

  return "I can help with trails, stays, bookings, packing, and trek planning inside your Yeti Trek app.";
};

const getBudget = (prompt: string) => {
  const match = prompt.replace(/,/g, "").match(/(?:rs\.?|npr|budget|under|below|within|around)?\s*(\d{3,7})/i);
  return match ? Number(match[1]) : null;
};

const parsePrice = (price: string) => {
  const match = price.replace(/,/g, "").match(/\d+/);
  return match ? Number(match[0]) : 0;
};

const estimateTrailBudget = (trail: Trail, stays: Stay[]) => {
  const waypointCount = Math.max(trail.waypoints.length, 1);
  const matchingStays = stays.slice(0, waypointCount);
  const total = matchingStays.reduce((sum, stay) => sum + parsePrice(stay.price), 0);
  return total || 0;
};

const matchScore = (prompt: string, searchableText: string) => {
  const queryWords = prompt.toLowerCase().split(/\W+/).filter((word) => word.length > 2);
  const searchable = searchableText.toLowerCase();
  return queryWords.reduce((score, word) => score + (searchable.includes(word) ? 1 : 0), 0);
};

const stringOrDefault = (value: unknown, fallback: string) => {
  if (typeof value === "string" && value.trim()) {
    return value.trim();
  }

  return fallback.length > 120 ? `${fallback.slice(0, 117)}...` : fallback;
};
