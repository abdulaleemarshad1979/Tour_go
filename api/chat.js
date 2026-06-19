import dotenv from 'dotenv';
dotenv.config();

async function callGroq(systemPrompt, messages) {
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
            ...messages
          ],
          temperature: 0.7,
          max_tokens: 1024
        })
      });
      if (response.ok) {
        const data = await response.json();
        const content = data.choices?.[0]?.message?.content;
        if (content) return content;
      }
    } catch (err) {
      console.error(`[Groq Chat] ${model} failed:`, err.message);
    }
  }
  return null;
}

async function callGemini(systemPrompt, messages) {
  const key = process.env.GEMINI_API_KEY;
  if (!key) return null;
  try {
    // Convert messages array into Gemini Content structure
    const contents = messages.map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }]
    }));

    // Prepend system prompt to the first message or as systemInstruction if supported
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent?key=${key}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: systemPrompt }] },
          contents,
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 2048
          }
        })
      }
    );
    if (res.ok) {
      const data = await res.json();
      const content = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (content) return content;
    }
  } catch (err) {
    console.error(`[Gemini Chat] Error:`, err.message);
  }
  return null;
}

async function callOpenRouter(systemPrompt, messages) {
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
          ...messages
        ],
        max_tokens: 2048
      })
    });
    if (res.ok) {
      const data = await res.json();
      const content = data?.choices?.[0]?.message?.content;
      if (content) return content;
    }
  } catch (err) {
    console.error(`[OpenRouter Chat] Error:`, err.message);
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

  const { messages = [], city = 'India' } = body;
  if (messages.length === 0) {
    return res.status(400).json({ error: 'Missing messages array parameter' });
  }

  const systemPrompt = `You are a world-class travel guide and sensory storyteller for TourGo. Answer the traveler's question about the city of "${city}" in an engaging, cinematic, helpful travel documentary style. Be concise, atmospheric, and highly insightful.`;

  const provider = (body.provider || req.query?.provider || 'auto').toString().trim().toLowerCase();

  let reply = null;
  let engine = 'Offline';

  if (provider === 'groq') {
    reply = await callGroq(systemPrompt, messages);
    engine = 'Groq';
  } else if (provider === 'gemini') {
    reply = await callGemini(systemPrompt, messages);
    engine = 'Gemini';
  } else if (provider === 'openrouter') {
    reply = await callOpenRouter(systemPrompt, messages);
    engine = 'OpenRouter';
  } else {
    // Auto Mode: Groq + Gemini + OpenRouter all fire concurrently via Promise.allSettled()
    const [groqRes, geminiRes, orRes] = await Promise.allSettled([
      callGroq(systemPrompt, messages),
      callGemini(systemPrompt, messages),
      callOpenRouter(systemPrompt, messages)
    ]);

    // Preference order: Groq -> Gemini -> OpenRouter
    if (groqRes.status === 'fulfilled' && groqRes.value) {
      reply = groqRes.value;
      engine = 'Groq';
    } else if (geminiRes.status === 'fulfilled' && geminiRes.value) {
      reply = geminiRes.value;
      engine = 'Gemini';
    } else if (orRes.status === 'fulfilled' && orRes.value) {
      reply = orRes.value;
      engine = 'OpenRouter';
    }
  }

  if (reply) {
    console.log(`[Chat API] Handled query using: ${engine}`);
    return res.status(200).json({ reply });
  }

  // Final offline fallback text
  return res.status(200).json({
    reply: `That is an interesting question about this destination. I recommend exploring the historic lanes, talking to the local artisans, and tasting the local secret recipe. Let me know if you would like me to detail coordinates or schedule details!`
  });
}
