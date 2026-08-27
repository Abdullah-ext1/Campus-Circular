// ============================================
// CAMPUS CIRCULAR — Groq AI Recommendation Service
// Calls Groq API to analyze user intent and return recommended resources
// ============================================

import { resources, intentMappings, getResource } from "../data/mockData.js";

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

/**
 * Recommend equipment kit based on user need description
 * @param {string} userQuery - User's description of what they need (e.g. "I need to make a reel for my club event")
 * @returns {Promise<{ recommendedIds: number[], reasoning: Record<number, string>, kitTitle: string, kitDescription: string }>}
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
Your goal is to parse a student's project or task intent (e.g., "I need to make a reel", "I need to perform at open mic", "I need to host a presentation") and select 2 to 4 equipment items from our campus catalog that perfectly meet their needs.

Available Campus Resources Catalog:
${JSON.stringify(catalogSummary, null, 2)}

Respond strictly in valid JSON format with no markdown formatting or commentary:
{
  "kitTitle": "Creative short title for the bundle (e.g., Reel Production Kit)",
  "kitDescription": "Brief overview of why these items work together for the task",
  "recommendedIds": [array of resource IDs selected from catalog],
  "reasoning": {
    "resourceId": "Brief 1-sentence reason why this specific item is needed"
  }
}`;

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
        temperature: 0.2,
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
    return {
      kitTitle: parsed.kitTitle || "AI Matched Gear Bundle",
      kitDescription: parsed.kitDescription || "Curated equipment for your request",
      recommendedIds: parsed.recommendedIds || [1, 3, 4],
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
  const matched = intentMappings.find((mapping) =>
    mapping.keywords.some((kw) => lower.includes(kw))
  );

  const kit = matched || intentMappings[0];
  const reasoningMap = {};
  kit.resourceIds.forEach((id) => {
    const res = getResource(id);
    reasoningMap[id] = `Essential ${res ? res.category : "item"} for your setup.`;
  });

  return {
    kitTitle: kit.kitName,
    kitDescription: kit.kitDescription,
    recommendedIds: kit.resourceIds,
    reasoning: reasoningMap,
  };
}
