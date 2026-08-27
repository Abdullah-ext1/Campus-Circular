import { resources, intentMappings } from "../data/mockData.js";

export async function parseIntentWithGroq(query) {
  const apiKey = import.meta.env.VITE_GROQ_API_KEY || import.meta.env.GROQ_API_KEY;

  if (!apiKey) {
    console.warn("Groq API key not found in env, using local intelligent kit matcher.");
    return fallbackIntentParser(query);
  }

  const systemPrompt = `You are the AI Intent Engine for Campus Circular, a college peer lending platform.
Given a student's search query (e.g., "reel shoot", "presentation", "podcast", "jam session", "fest event", "drone shoot"), analyze what physical equipment/gear they need.

Available Categories in Catalog:
- camera (Canon EOS R6, Sony A7 III)
- tripod (Manfrotto Tripod)
- microphone (Rode VideoMic Pro+)
- lighting (Godox LED Light, Aputure Amaran Light)
- laptop (MacBook Pro)
- tablet (iPad Pro)
- instrument (Yamaha Acoustic Guitar, Novation MIDI Keyboard)
- projector (BenQ Projector)
- speaker (JBL PartyBox Speaker)
- tool (Bosch Cordless Drill, Sewing Machine)
- drone (DJI Mini 3 Pro Drone)

You MUST respond strictly in valid JSON format with NO markdown wrapping.
JSON Structure:
{
  "kitName": "String title for the kit (e.g. Reel & Video Production Kit)",
  "kitDescription": "String summary explaining why these items were bundled together",
  "categoryList": ["camera", "tripod", "microphone", "lighting"],
  "bundleDiscount": 10
}`;

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey.trim()}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Student Query: "${query}"` }
        ],
        temperature: 0.2,
        response_format: { type: "json_object" }
      })
    });

    if (!response.ok) {
      console.error("Groq API call error:", response.status, await response.text());
      return fallbackIntentParser(query);
    }

    const data = await response.json();
    const parsedContent = JSON.parse(data.choices[0].message.content);

    // Map returned categories to actual items in catalog
    const matchedResources = [];
    const usedIds = new Set();

    (parsedContent.categoryList || []).forEach((cat) => {
      // Find item in catalog matching this category
      const matches = resources.filter((r) => r.category === cat && !usedIds.has(r.id));
      matches.forEach((item) => {
        matchedResources.push(item);
        usedIds.add(item.id);
      });
    });

    // If no items matched specific categories, try matching query terms against catalog tags/names
    if (matchedResources.length === 0) {
      return fallbackIntentParser(query);
    }

    return {
      isAiGenerated: true,
      kitName: parsedContent.kitName || "Custom Campus Kit",
      kitDescription: parsedContent.kitDescription || `AI-recommended bundle tailored for "${query}"`,
      resources: matchedResources,
      bundleDiscount: parsedContent.bundleDiscount || 10,
    };
  } catch (err) {
    console.error("Groq AI processing error:", err);
    return fallbackIntentParser(query);
  }
}

export function fallbackIntentParser(query) {
  const lower = query.toLowerCase();
  
  // Custom fallback rules for common searches like "shoot", "reel", "video"
  if (lower.includes("shoot") || lower.includes("reel") || lower.includes("film") || lower.includes("video") || lower.includes("vlog")) {
    const kit = intentMappings[0]; // Content Creator Kit: Camera, Tripod, Mic, Light
    return {
      ...kit,
      isAiGenerated: false,
      resources: kit.resourceIds.map((id) => resources.find((r) => r.id === id)).filter(Boolean),
    };
  }

  const matched = intentMappings.find((mapping) =>
    mapping.keywords.some((kw) => lower.includes(kw))
  );
  const kit = matched || intentMappings[0];
  return {
    ...kit,
    isAiGenerated: false,
    resources: kit.resourceIds.map((id) => resources.find((r) => r.id === id)).filter(Boolean),
  };
}
