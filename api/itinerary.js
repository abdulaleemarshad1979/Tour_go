import dotenv from 'dotenv';
dotenv.config();

async function callGemini(prompt) {
  const key = process.env.GEMINI_API_KEY;
  if (!key) return null;
  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent?key=${key}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            responseMimeType: 'application/json',
            temperature: 0.7,
            maxOutputTokens: 8192
          }
        })
      }
    );
    if (!res.ok) return null;
    const data = await res.json();
    return data?.candidates?.[0]?.content?.parts?.[0]?.text || null;
  } catch (err) {
    console.error('[Gemini Itinerary] Error:', err.message);
    return null;
  }
}

async function callOpenRouter(systemPrompt, userPrompt) {
  const key = process.env.OPENROUTER_API_KEY;
  if (!key) return null;
  try {
    const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${key}`,
        'HTTP-Referer': process.env.APP_URL || 'https://tour-go-dun.vercel.app/',
        'X-Title': 'TourGo Travel Platform',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'anthropic/claude-3.5-sonnet',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        response_format: { type: 'json_object' },
        max_tokens: 4096
      })
    });
    if (res.ok) {
      const data = await res.json();
      return data?.choices?.[0]?.message?.content || null;
    }
  } catch (err) {
    console.error('[OpenRouter Itinerary] Error:', err.message);
  }
  return null;
}

export default async function handler(req, res) {
  let body = req.body || {};
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch (e) {}
  }

  const { city, days = 3, budget = 'moderate', interests = 'sightseeing', type } = body;
  if (!city) {
    return res.status(400).json({ error: 'Missing city parameter' });
  }

  const finalInterests = interests || type || 'sightseeing';

  const systemPrompt = 'You are a travel itinerary generator. Output only valid JSON with no markdown and no backticks.';
  const userPrompt = `Generate a daily travel itinerary for "${city}" for ${days} days with a ${budget} budget and interests: "${finalInterests}".
Format the output as a valid JSON object matching exactly this structure:
{
  "itinerary": [
    {
      "day": 1,
      "places": ["Place Name 1", "Place Name 2"],
      "tips": ["Local tip or dining spot to try", "Custom travel tip"]
    }
  ]
}
Ensure there is no extra text outside the JSON object.`;

  let rawResult = await callGemini(userPrompt);
  let engine = 'Gemini';

  if (!rawResult) {
    rawResult = await callOpenRouter(systemPrompt, userPrompt);
    engine = 'OpenRouter';
  }

  if (rawResult) {
    try {
      const cleaned = rawResult.trim().replace(/^```json/, '').replace(/```$/, '').trim();
      const parsed = JSON.parse(cleaned);
      if (parsed && Array.isArray(parsed.itinerary)) {
        console.log(`[Itinerary API] Handled request using: ${engine}`);
        return res.status(200).json(parsed);
      }
    } catch (pe) {
      console.error('[Itinerary API] JSON parse failed:', pe.message);
    }
  }

  // Fallback / Offline response
  console.log(`[Itinerary API] Utilized offline fallback`);
  return res.status(200).json({
    itinerary: Array.from({ length: Number(days) || 3 }, (_, i) => ({
      day: i + 1,
      places: [`Famous landmark of ${city} (Day ${i + 1})`, `Hidden local gem of ${city} (Day ${i + 1})`],
      tips: [
        'Sample local spiced tea at a nearby street lane.',
        'Carry physical cash notes for quick guide fees.'
      ]
    }))
  });
}
