// ============================================
// CAMPUS CIRCULAR — Groq AI Recommendation Service
// Calls Groq API to analyze user intent and return recommended resources
// ============================================

import { resources, intentMappings, getResource } from "../data/mockData.js";

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

// List of physical equipment keywords for fallback validation
const PHYSICAL_GEAR_KEYWORDS = [
  "camera", "lens", "tripod", "mic", "microphone", "light", "lighting", "softbox",
  "laptop", "macbook", "tablet", "ipad", "wacom", "drawing", "guitar", "midi",
  "keyboard", "synth", "projector", "speaker", "sound", "audio", "drill", "tool",
  "sewing", "drone", "scooter", "vr", "quest", "tent", "camping", "ps5", "console",
  "shoot", "reel", "vlog", "video", "film", "movie", "recording", "jam", "event",
  "presentation", "pitch", "podcast", "equipment", "gear", "hardware"
];

/**
 * Recommend equipment kit based on user need description
 * @param {string} userQuery - User's description of what they need (e.g. "I need to make a reel for my club event")
 * @returns {Promise<{ hasResults: boolean, recommendedIds: number[], reasoning: Record<number, string>, kitTitle: string, kitDescription: string }>}
 */
export async function recommendResourcesWithGroq(userQuery) {
  if (!GROQ_API_KEY || GROQ_API_KEY.includes("your_key_here")) {
    console.warn("Groq API key missing or default; falling back to local matching.");
    return fallbackLocalRecommendation(userQuery);
  }

  // Simplified resource catalog for context
  const catalogSummary = resources.map((r) => ({
    id: r.id,
    name: r.name,
    category: r.category,
    description: r.description,
    tags: r.tags,
    dailyRate: r.dailyRate,
  }));

  const systemPrompt = `You are Campus Circular's AI Resource Matcher.
Your job is to analyze a student's request and determine if they are asking for physical campus equipment/gear (e.g. cameras, lenses, tripods, mics, lights, laptops, drawing tablets, instruments, projectors, speakers, tools, drones, scooters, camping tents, VR headsets).

Available Campus Resources Catalog:
${JSON.stringify(catalogSummary, null, 2)}

STRICT RELEVANCY RULES:
1. If the student's request is NOT asking for physical equipment/gear to borrow (for example, if they are talking about exams like "tomorrow is my graphics exam", study advice, non-hardware tasks, general chatter, or if no catalog items are relevant), respond strictly with:
{
  "hasResults": false,
  "kitTitle": "No Relevant Gear Found",
  "kitDescription": "No physical campus equipment matches your request. Try searching for specific gear like cameras, laptops, drawing tablets, instruments, or event equipment.",
  "recommendedIds": [],
  "reasoning": {}
}

2. Only if the student's request genuinely requires physical campus equipment, select 1 to 4 matching resource IDs from our catalog and respond strictly with:
{
  "hasResults": true,
  "kitTitle": "Creative short title for the bundle",
  "kitDescription": "Brief overview of why these items work together for the task",
  "recommendedIds": [array of resource IDs selected from catalog],
  "reasoning": {
    "resourceId": "Brief 1-sentence reason why this specific item is needed"
  }
}

Respond strictly in valid JSON format with no markdown formatting.`;

  try {
    const response = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userQuery },
        ],
        temperature: 0.1,
        response_format: { type: "json_object" },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Groq API error response:", errorText);
      return fallbackLocalRecommendation(userQuery);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    if (!content) {
      return fallbackLocalRecommendation(userQuery);
    }

    const parsed = JSON.parse(content);
    const recIds = parsed.recommendedIds || [];
    const hasResults = parsed.hasResults !== false && recIds.length > 0;

    return {
      hasResults,
      kitTitle: parsed.kitTitle || (hasResults ? "AI Matched Gear Bundle" : "No Relevant Gear Found"),
      kitDescription: parsed.kitDescription || (hasResults ? "Curated equipment for your request" : "No physical campus equipment matches your request."),
      recommendedIds: hasResults ? recIds : [],
      reasoning: parsed.reasoning || {},
    };
  } catch (error) {
    console.error("Error invoking Groq API:", error);
    return fallbackLocalRecommendation(userQuery);
  }
}

/**
 * Fallback matching using local intent mappings if API is unavailable
 */
function fallbackLocalRecommendation(userQuery) {
  const lower = userQuery.toLowerCase();

  // Check if query contains any gear-related keywords
  const isGearRelated = PHYSICAL_GEAR_KEYWORDS.some((kw) => lower.includes(kw));

  if (!isGearRelated) {
    return {
      hasResults: false,
      kitTitle: "No Relevant Gear Found",
      kitDescription: "No physical campus equipment matches your request. Try searching for specific gear like cameras, laptops, drawing tablets, instruments, or event equipment.",
      recommendedIds: [],
      reasoning: {},
    };
  }

  const matched = intentMappings.find((mapping) =>
    mapping.keywords.some((kw) => lower.includes(kw))
  );

  if (!matched) {
    return {
      hasResults: false,
      kitTitle: "No Relevant Gear Found",
      kitDescription: "No physical campus equipment matches your request. Try searching for specific gear like cameras, laptops, drawing tablets, instruments, or event equipment.",
      recommendedIds: [],
      reasoning: {},
    };
  }

  const kit = matched;
  const reasoningMap = {};
  kit.resourceIds.forEach((id) => {
    const res = getResource(id);
    reasoningMap[id] = `Essential ${res ? res.category : "item"} for your setup.`;
  });

  return {
    hasResults: true,
    kitTitle: kit.kitName,
    kitDescription: kit.kitDescription,
    recommendedIds: kit.resourceIds,
    reasoning: reasoningMap,
  };
}
