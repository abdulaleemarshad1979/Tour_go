import dotenv from 'dotenv';
dotenv.config();

async function callGroq(systemPrompt, userPrompt) {
  const key = process.env.GROQ_API_KEY;
  if (!key || key.trim().length === 0) return null;
  const models = ['llama-3.3-70b-versatile', 'llama-3.3-70b-specdec', 'llama-3.1-8b-instant'];
  for (const model of models) {
    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
          ],
          response_format: { type: 'json_object' },
          temperature: 0.1,
          max_tokens: 150
        })
      });
      if (response.ok) {
        const data = await response.json();
        const content = data.choices?.[0]?.message?.content;
        if (content) return content;
      }
    } catch (err) {
      console.error(`[Groq Suggest] ${model} failed:`, err.message);
    }
  }
  return null;
}

export default async function handler(req, res) {
  const query = (req.query?.q || '').toString().trim();
  if (!query) {
    return res.status(200).json({ suggestions: [] });
  }

  const systemPrompt = 'You are an autocomplete engine. Return a list of 5 real tourist city names globally matching the query. Respond ONLY with a valid JSON object matching this envelope: {"suggestions": ["Delhi", "Jaipur"]}.';
  const userPrompt = `Suggest cities starting with or relating to: "${query}"`;

  const aiText = await callGroq(systemPrompt, userPrompt);
  if (aiText) {
    try {
      const parsed = JSON.parse(aiText);
      if (parsed && Array.isArray(parsed.suggestions)) {
        return res.status(200).json(parsed);
      }
    } catch (e) {
      console.error('[Suggest API] JSON parse fail:', e.message);
    }
  }

  // Fallback
  const seedCities = ['Delhi', 'Jaipur', 'Madurai', 'Pondicherry', 'Varanasi', 'Agra', 'Goa'];
  const matches = seedCities.filter(c => c.toLowerCase().includes(query.toLowerCase()));
  return res.status(200).json({ suggestions: matches });
}
