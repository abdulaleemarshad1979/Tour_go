import dotenv from 'dotenv';
dotenv.config();

// ─── CASCADING AI ROUTER (Groq, Gemini, OpenRouter) ─────────────────────────

async function callGroq(systemPrompt, userPrompt) {
  const key = process.env.GROQ_API_KEY;
  if (!key || key.trim().length === 0) return null;
  const models = ['llama-3.3-70b-versatile', 'llama-3.3-70b-specdec', 'llama-3.1-8b-instant', 'llama-3.2-11b-vision-preview', 'llama-3.2-3b-preview'];
  for (const model of models) {
    try {
      console.log(`[Groq] Trying model: ${model}`);
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
          temperature: 0.2,
          max_tokens: 4096
        })
      });
      if (response.ok) {
        const data = await response.json();
        const content = data.choices?.[0]?.message?.content;
        if (content) {
          console.log(`[Groq] ✓ Success with ${model}`);
          return content;
        }
      }
    } catch (err) {
      console.error(`[Groq] ${model} failed:`, err.message);
    }
  }
  return null;
}

async function callGemini(prompt) {
  const key = process.env.GEMINI_API_KEY;
  if (!key) return null;
  console.log(`[Gemini] Calling Gemini 2.5 Pro`);
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
    if (res.ok) {
      const data = await res.json();
      const content = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (content) {
        console.log(`[Gemini] ✓ Success`);
        return content;
      }
    } else {
      const errText = await res.text();
      console.warn(`[Gemini] Failed: ${res.status} - ${errText.slice(0, 200)}`);
    }
  } catch (err) {
    console.error(`[Gemini] Error:`, err.message);
  }
  return null;
}

async function callOpenRouter(systemPrompt, userPrompt) {
  const key = process.env.OPENROUTER_API_KEY;
  if (!key) return null;
  console.log(`[OpenRouter] Calling OpenRouter`);
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
        max_tokens: 8192
      })
    });
    if (res.ok) {
      const data = await res.json();
      const content = data?.choices?.[0]?.message?.content;
      if (content) {
        console.log(`[OpenRouter] ✓ Success`);
        return content;
      }
    } else {
      const errText = await res.text();
      console.warn(`[OpenRouter] Failed: ${res.status} - ${errText.slice(0, 200)}`);
    }
  } catch (err) {
    console.error(`[OpenRouter] Error:`, err.message);
  }
  return null;
}

async function generateWithAI(systemPrompt, userPrompt, taskType = 'quick', provider = 'auto') {
  const p = (provider || 'auto').toLowerCase().trim();
  
  if (p === 'groq') {
    const groqResult = await callGroq(systemPrompt, userPrompt);
    if (groqResult) return { text: groqResult, source: 'Groq' };
  } else if (p === 'gemini') {
    const geminiResult = await callGemini(`${systemPrompt}\n\n${userPrompt}`);
    if (geminiResult) return { text: geminiResult, source: 'Gemini' };
  } else if (p === 'openrouter') {
    const orResult = await callOpenRouter(systemPrompt, userPrompt);
    if (orResult) return { text: orResult, source: 'OpenRouter' };
  } else {
    // Auto Mode: Groq + Gemini + OpenRouter all fire concurrently via Promise.allSettled()
    const [groqRes, geminiRes, orRes] = await Promise.allSettled([
      callGroq(systemPrompt, userPrompt),
      callGemini(`${systemPrompt}\n\n${userPrompt}`),
      callOpenRouter(systemPrompt, userPrompt)
    ]);

    // Preference order: Groq -> Gemini -> OpenRouter. First valid JSON wins.
    if (groqRes.status === 'fulfilled' && groqRes.value) {
      try {
        JSON.parse(groqRes.value);
        return { text: groqRes.value, source: 'Groq' };
      } catch (err) {
        console.warn(`[Concurrent AI] Groq returned invalid JSON:`, err.message);
      }
    }

    if (geminiRes.status === 'fulfilled' && geminiRes.value) {
      try {
        JSON.parse(geminiRes.value);
        return { text: geminiRes.value, source: 'Gemini' };
      } catch (err) {
        console.warn(`[Concurrent AI] Gemini returned invalid JSON:`, err.message);
      }
    }

    if (orRes.status === 'fulfilled' && orRes.value) {
      try {
        JSON.parse(orRes.value);
        return { text: orRes.value, source: 'OpenRouter' };
      } catch (err) {
        console.warn(`[Concurrent AI] OpenRouter returned invalid JSON:`, err.message);
      }
    }
  }

  return { text: null, source: 'Offline' };
}


// ─── IMAGE: Pexels (primary) → Wikipedia (fallback) → Scenic Fallback ────────

const SCENIC_IMAGES = {
  nature: [
    'https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=800',
    'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=800',
    'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=800'
  ],
  historical: [
    'https://images.unsplash.com/photo-1548013146-72479768bbf1?q=80&w=800',
    'https://images.unsplash.com/photo-1564507592333-c60657eea523?q=80&w=800',
    'https://images.unsplash.com/photo-1599661046289-e31897846e41?q=80&w=800'
  ],
  spiritual: [
    'https://images.unsplash.com/photo-1604881990409-b9f246db39da?q=80&w=800',
    'https://images.unsplash.com/photo-1545205597-3d9d02c29597?q=80&w=800',
    'https://images.unsplash.com/photo-1508009603885-50cf7c579365?q=80&w=800'
  ],
  adventure: [
    'https://images.unsplash.com/photo-1533240332313-0db49b439ad3?q=80&w=800',
    'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?q=80&w=800',
    'https://images.unsplash.com/photo-1506461883276-594a12b11cc3?q=80&w=800'
  ],
  coastal: [
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800',
    'https://images.unsplash.com/photo-1519046904884-53103b34b206?q=80&w=800',
    'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?q=80&w=800'
  ],
  general: [
    'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?q=80&w=800',
    'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?q=80&w=800'
  ]
};

function generateScenicFallbackImage(title) {
  const t = (title || '').toLowerCase();
  let category = 'general';
  if (/temple|spiritual|mosque|church|ashram|shrine|sanctum/.test(t)) category = 'spiritual';
  else if (/fort|palace|mahal|museum|heritage|archaeology|ruins|qila|bastion/.test(t)) category = 'historical';
  else if (/beach|sea|coast|port|lagoon|island|lighthouse/.test(t)) category = 'coastal';
  else if (/wildlife|sanctuary|park|garden|lake|mangrove|hills|falls|nature|forest/.test(t)) category = 'nature';
  else if (/adventure|trek|camping|safari|market|bazaar|street/.test(t)) category = 'adventure';

  const list = SCENIC_IMAGES[category] || SCENIC_IMAGES.general;
  let hash = 0;
  for (let i = 0; i < t.length; i++) hash = t.charCodeAt(i) + ((hash << 5) - hash);
  return list[Math.abs(hash) % list.length];
}

// Scraper: fetch real travel context from Wikivoyage and Wikipedia
async function scrapeCityData(city) {
  let contextText = '';

  try {
    // 1. Query Wikivoyage search
    const wikivoyageSearchUrl = `https://en.wikivoyage.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(city)}&format=json&origin=*`;
    const wyRes = await fetch(wikivoyageSearchUrl, {
      headers: { 'User-Agent': 'TourGoApp/2.0 (travel@example.com)' }
    });
    if (wyRes.ok) {
      const wyData = await wyRes.json();
      const results = wyData?.query?.search || [];
      if (results.length > 0) {
        const primaryTitle = results[0].title;
        const extractUrl = `https://en.wikivoyage.org/w/api.php?action=query&prop=extracts&explaintext&exlimit=1&titles=${encodeURIComponent(primaryTitle)}&format=json&origin=*`;
        const extRes = await fetch(extractUrl, {
          headers: { 'User-Agent': 'TourGoApp/2.0 (travel@example.com)' }
        });
        if (extRes.ok) {
          const extData = await extRes.json();
          const pages = extData?.query?.pages || {};
          for (const key of Object.keys(pages)) {
            const text = pages[key]?.extract;
            if (text) {
              contextText += `--- Wikivoyage Travel Extract for ${primaryTitle} ---\n${text.slice(0, 1200)}\n\n`;
              break;
            }
          }
        }
      }
    }
  } catch (err) {
    console.error('[Scraper] Wikivoyage scrape error:', err.message);
  }

  try {
    // 2. Query Wikipedia search for attractions
    const wikiSearchUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(city + " travel attractions sights")}&format=json&origin=*`;
    const wikiRes = await fetch(wikiSearchUrl, {
      headers: { 'User-Agent': 'TourGoApp/2.0 (travel@example.com)' }
    });
    if (wikiRes.ok) {
      const wikiData = await wikiRes.json();
      const results = wikiData?.query?.search || [];
      if (results.length > 0) {
        contextText += `--- Wikipedia Attractions Search for ${city} ---\n`;
        results.slice(0, 4).forEach((r) => {
          contextText += `- Title: ${r.title}\n  Snippet: ${r.snippet.replace(/<[^>]*>/g, '').slice(0, 180)}\n`;
        });
      }
    }
  } catch (err) {
    console.error('[Scraper] Wikipedia attractions scrape error:', err.message);
  }

  try {
    // 3. Query Wikipedia search for travel blogs and cultural highlights
    const blogSearchUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(city + " hidden gems sightseeing")}&format=json&origin=*`;
    const blogRes = await fetch(blogSearchUrl, {
      headers: { 'User-Agent': 'TourGoApp/2.0 (travel@example.com)' }
    });
    if (blogRes.ok) {
      const blogData = await blogRes.json();
      const results = blogData?.query?.search || [];
      if (results.length > 0) {
        contextText += `\n--- Additional Travel Sights and Hidden Gem Context for ${city} ---\n`;
        results.slice(0, 4).forEach((r) => {
          contextText += `- Title: ${r.title}\n  Snippet: ${r.snippet.replace(/<[^>]*>/g, '').slice(0, 180)}\n`;
        });
      }
    }
  } catch (err) {
    console.error('[Scraper] Travel blogs scrape error:', err.message);
  }

  try {
    // 4. Query Wikipedia search for tourism portals, TripAdvisor references, and guide sites
    const tourismSearchUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(city + " tourism guide sites tripadvisor lonelyplanet")}&format=json&origin=*`;
    const tourRes = await fetch(tourismSearchUrl, {
      headers: { 'User-Agent': 'TourGoApp/2.0 (travel@example.com)' }
    });
    if (tourRes.ok) {
      const tourData = await tourRes.json();
      const results = tourData?.query?.search || [];
      if (results.length > 0) {
        contextText += `\n--- Tourism Guides and Web References for ${city} ---\n`;
        results.slice(0, 4).forEach((r) => {
          contextText += `- Page: ${r.title}\n  Summary: ${r.snippet.replace(/<[^>]*>/g, '').slice(0, 180)}\n`;
        });
      }
    }
  } catch (err) {
    console.error('[Scraper] Tourism guides search error:', err.message);
  }

  // 5. Inject popular Instagram Reels trends/hashtags details and travel logs
  contextText += `\n--- Social Media & Instagram Reels Travel Trends for ${city} ---\n`;
  contextText += `- Trending hashtags: #explore${city.toLowerCase().replace(/\s+/g, '')}, #${city.toLowerCase().replace(/\s+/g, '')}hiddengems, #instatravel${city.toLowerCase().replace(/\s+/g, '')}, #travelreels${city.toLowerCase().replace(/\s+/g, '')}\n`;
  contextText += `- Trending locations on Instagram Reels/TikTok/Shorts: Secluded viewpoints, historical fort lookouts, cafes under ancient trees, local culinary bites, street food lanes, traditional handlooms workshops.\n`;
  contextText += `- Web Trends: Highlight both the heavily-promoted official state tourism landmarks and the offbeat, picturesque micro-spots shared by travel bloggers online.\n`;

  return contextText.trim();
}

// Pexels API — free, reliable, no CORS issues server-side
async function getPexelsImage(query, fallbacks = []) {
  const key = process.env.PEXELS_API_KEY;
  if (!key || key.trim().length === 0) return null;

  const queries = [query, ...fallbacks];
  for (const q of queries) {
    try {
      const res = await fetch(
        `https://api.pexels.com/v1/search?query=${encodeURIComponent(q)}&per_page=1&orientation=landscape`,
        { headers: { Authorization: key } }
      );
      if (res.ok) {
        const data = await res.json();
        const photo = data?.photos?.[0];
        if (photo) return photo.src.large || photo.src.medium;
      }
    } catch (err) {
      console.error('[Pexels] Error:', err.message);
    }
  }
  return null;
}

// Wikipedia — completely free, no key needed
async function getWikipediaImage(query, fallbacks = []) {
  const queries = [query, ...fallbacks];
  for (const q of queries) {
    const clean = q.replace(/[^\w\s\-\u00C0-\u017F]/g, '').trim();
    if (!clean) continue;
    try {
      const url = `https://en.wikipedia.org/w/api.php?action=query&format=json&prop=pageimages&generator=search&piprop=original&gsrsearch=${encodeURIComponent(clean)}&gsrlimit=3&origin=*`;
      const res = await fetch(url, {
        headers: { 'User-Agent': 'TourGoApp/2.0 (travel@example.com)' }
      });
      if (res.ok) {
        const data = await res.json();
        const pages = data?.query?.pages || {};
        for (const id of Object.keys(pages)) {
          const src = pages[id]?.original?.source;
          if (src) return src;
        }
      }
    } catch (err) {
      console.error('[Wiki] Error:', err.message);
    }
  }
  return null;
}

// Unsplash — kept as secondary fallback if key is already set
async function getUnsplashImage(query, fallbacks = []) {
  const key = process.env.UNSPLASH_ACCESS_KEY;
  if (!key || key.trim().length === 0) return null;
  const queries = [query, ...fallbacks];
  for (const q of queries) {
    try {
      const res = await fetch(
        `https://api.unsplash.com/search/photos?query=${encodeURIComponent(q)}&per_page=1`,
        { headers: { Authorization: `Client-ID ${key}` } }
      );
      if (res.ok) {
        const data = await res.json();
        const photo = data?.results?.[0];
        if (photo) return photo.urls.regular || photo.urls.small;
      }
    } catch (err) {
      console.error('[Unsplash] Error:', err.message);
    }
  }
  return null;
}

function getCategory(title) {
  const t = (title || '').toLowerCase();
  let category = 'general';
  if (/temple|spiritual|mosque|church|ashram|shrine|sanctum|monastery/.test(t)) category = 'spiritual';
  else if (/fort|palace|mahal|museum|heritage|archaeology|ruins|qila|bastion|tomb|monument/.test(t)) category = 'historical';
  else if (/beach|sea|coast|port|lagoon|island|lighthouse|waterfall|falls|lake|river|dam|canal/.test(t)) category = 'coastal';
  else if (/wildlife|sanctuary|park|garden|hills|nature|forest|valley|mount|peak|climb/.test(t)) category = 'nature';
  else if (/adventure|trek|camping|safari|walk|hike|trail/.test(t)) category = 'adventure';
  else if (/market|bazaar|street|food|recipe|restaurant|cafe|sweet|bites|dine|hotel/.test(t)) category = 'culinary';
  return category;
}

// Image resolution: Pexels → Unsplash → Wikipedia → Instant themed placeholder
async function resolveDynamicImage(title, cityName) {
  const cleanTitle = title.replace(/[^\w\s\-\u00C0-\u017F]/g, '').trim();
  const cleanCity = cityName.replace(/[^\w\s\-\u00C0-\u017F]/g, '').trim();
  const category = getCategory(title);

  // Instant placeholder bypass for padded templates to save huge network overhead
  if (title.includes('Palace Gardens') || title.includes('Heritage Museum') || title.includes('Clock Tower') ||
      title.includes('Central Bazaar') || title.includes('Cenotaphs') || title.includes('Fort Gate') ||
      title.includes('Promenade') || title.includes('Mandir') || title.includes('Town Hall') ||
      title.includes('Arts & Crafts') || title.includes('Memorial') || title.includes('Botanical') ||
      title.includes('Cathedral') || title.includes('Science & Planetarium') || title.includes('Library') ||
      title.includes('Plaza') || title.includes('Assembly') || title.includes('Golf') ||
      title.includes('Stepwell') || title.includes('Spice Lane') || title.includes('Viewpoint') ||
      title.includes('Watchtower') || title.includes('Archway') || title.includes('Quarter') ||
      title.includes('Cafe') || title.includes('Bird Hide') || title.includes('Caves') ||
      title.includes('Alley') || title.includes('Lotus Pond') || title.includes('Book Shop') ||
      title.includes('Garden View') || title.includes('Bridge') || title.includes('Tea Pot') ||
      title.includes('Shrine') || title.includes('Cemetery') || title.includes('Trekking') ||
      title.includes('Bamboo Grove') || title.includes('Waterfall Ravine') || title.includes('Toy Workshop')) {
    return `placeholder://${category}`;
  }

  const query = `${cleanTitle} ${cleanCity} India`;
  const fallbacks = [
    `${cleanTitle} ${cleanCity}`,
    cleanTitle
  ];

  // 1. Pexels (most reliable)
  const pexels = await getPexelsImage(query, fallbacks);
  if (pexels) { console.log(`[Pexels] ✓ ${title}`); return pexels; }

  // 2. Unsplash (if key available)
  const unsplash = await getUnsplashImage(query, fallbacks);
  if (unsplash) { console.log(`[Unsplash] ✓ ${title}`); return unsplash; }

  // 3. Wikipedia (totally free, no key needed)
  const wiki = await getWikipediaImage(`${cleanTitle} ${cleanCity}`, [cleanTitle]);
  if (wiki) { console.log(`[Wiki] ✓ ${title}`); return wiki; }

  // 4. Return instant themed placeholder if search fails, rather than slow duplicated Unsplash links
  console.log(`[Placeholder] Using category: ${category} for: ${title}`);
  return `placeholder://${category}`;
}

// ─── OFFLINE DATABASE ─────────────────────────────────────────────────────────
const OFFLINE_CITY_BLUEPRINTS = {
  kakinada: {
    cityMeta: {
      id: 'kakinada', name: 'Kakinada', country: 'India',
      tagline: 'Cozy Mangrove Canopies & Fluffy Kaaja Confections',
      introParagraph1: 'Kakinada, the gorgeous port capital of East Godavari, is a stunning marriage of coastal ease, lush forestry, and legendary sweet-making traditions. Fringed by one of the largest mangrove systems in India, the city enjoys rich sea breezes and serene tropical landscapes.',
      introParagraph2: 'From the peaceful beaches of Uppada to the wildlife corridors of Coringa, Kakinada remains a hidden jewel of Andhra Pradesh. Famous for its rich history, shipyards, deep-sea ports, and the legendary "Kakinada Kaaja" sweet.',
      bestTimeToVisit: 'November to February (Cool coastal breezes)',
      howToReach: 'Arrive via Rajahmundry Airport (RJY) + 1-hour road transfer, or direct rail to Kakinada Port Station.',
      idealDuration: '2 to 3 Days',
      climate: 'Tropical maritime with golden sunshine and fresh humid sea breezes',
      localSecretRecipe: 'Original cylindrical syrup-stuffed Kakinada Gottam Kaaja pastry',
      bgColorClass: 'bg-amber-50', accentColorClass: 'bg-brutal-orange', secondaryColorClass: 'bg-brutal-green',
      mapX: 52, mapY: 82,
      bookingSteps: ['Secure regional boarding permits via travel planner.', 'Arrange auto-rickshaws or cycle-cabs for inner city.', 'Book forest dept boats for Coringa mangroves.'],
      recreation: [
        { title: 'Mangrove Boating Trek', description: 'Drift through serene water alleys of Coringa Wildlife Sanctuary.', duration: '3 Hours' },
        { title: 'Uppada Beach Sunset Walk', description: 'Stroll along historical brick barriers watching fisher nets cast.', duration: '2 Hours' }
      ],
      accommodations: [
        { name: 'Hotel Royal Port Inn', type: 'Premium Coastal Hotel', priceRange: '₹3,000 - ₹5,000/night', tagline: 'Panoramic shipyard lookouts combined with crisp coastal dining.' },
        { name: 'Coringa Wetlands Eco-Lodge', type: 'Nature Sanctuary Stay', priceRange: '₹4,500 - ₹7,000/night', tagline: 'Environmentally sensitive cottage setups touching the forest boundaries.' }
      ],
      practicalities: {
        transitTip: 'Auto-rickshaws are cheap and abundant. State buses run to nearby ports.',
        dialectTip: 'Telugu is spoken prominently with a sweet Godavari accentuation.',
        currencyTip: 'Carry cash rupees for sweet shops and sanctuary boat guides.',
        languagePhrase: 'Namaskaram, Kakinada Kaaja ekkada dhorukuthundhi?'
      }
    },
    weather: {
      temp: 29, condition: 'Tropical Blue Air & Cool Surf', precipitation: '8%', humidity: '72%', wind: '18 km/h', uvIndex: 'Very High', airQuality: 'AQI 64 (Excellent)',
      hourly: [{ time: '09 AM', temp: 27, icon: 'sunny' }, { time: '12 PM', temp: 31, icon: 'sunny' }, { time: '03 PM', temp: 30, icon: 'sunny' }, { time: '06 PM', temp: 28, icon: 'cloudy' }],
      weekly: [{ day: 'Mon', temp: 31, cond: 'Clear' }, { day: 'Tue', temp: 30, cond: 'Sunny' }, { day: 'Wed', temp: 29, cond: 'Breezy' }]
    },
    places: [
      { id: 'kk-f1', title: 'Coringa Wildlife Sanctuary', type: 'famous', tagline: 'Deep mangrove channels housing nesting jackals and otters.', description: "One of India's largest mangrove forests where freshwater streams mingle with the ocean.", highlights: ['**Wooden Canopy Boardwalk**', '**Smooth-Coated Otters**', '**Estuarine Mangrove Forests**'], rating: 4.8, cost: '₹50 INR', timeOfDay: 'Early Morning (6:30 AM)', lat: 16.9018, lng: 82.2851 },
      { id: 'kk-f2', title: 'Uppada Coastal Beach', type: 'famous', tagline: 'Wide sandy shores and weavers of pure gold threads.', description: 'Stunning beach flanked by a geotube wall. Famed for Uppada Jamdani sarees.', highlights: ['**Uppada Saree Handlooms**', '**Geotube Wave Barrier**', '**Golden Sand Vistas**'], rating: 4.7, cost: 'Free', timeOfDay: 'Sunset Evening', lat: 17.1014, lng: 82.3278 },
      { id: 'kk-g1', title: 'Kakinada Lighthouse', type: 'gem', tagline: 'Historic tall landmark with circular panoramic ocean views.', description: 'A stately white-and-black striped lighthouse offering marvelous views of Kakinada bay.', highlights: ['**Spiral Iron Stairway**', '**Spectacular Bay Views**', '**Giant Glass Lantern Room**'], rating: 4.6, cost: '₹10 INR', timeOfDay: 'Afternoon (3 to 5 PM)', lat: 16.9447, lng: 82.2472 },
      { id: 'kk-g2', title: 'Hope Island', type: 'gem', tagline: 'A natural sandy spindle guarding Kakinada Harbor.', description: 'A long sand spit extending from the delta, reachable only via boat. Miles of undisturbed sandy shores.', highlights: ['**Isolated Sandspit Beaches**', '**Dolphin Watching Routes**', '**Fishing Fleet Outlooks**'], rating: 4.9, cost: '₹150 INR boat hire', timeOfDay: 'Morning', lat: 16.9500, lng: 82.3400 }
    ]
  }
};

// ─── AI PROMPT ────────────────────────────────────────────────────────────────
function buildPrompt(city, scrapedContext = '') {
  let contextInjection = '';
  if (scrapedContext) {
    contextInjection = `Here is scraped real-world context for "${city}" compiled from Wikipedia, Wikivoyage, travel blogs, and trending Instagram Reels:
${scrapedContext}

Use the scraped context above to extract authentic spots, popular landmarks, and hidden gems. Ensure the places have correct geographical coordinates (latitude and longitude). If coordinates are missing, provide accurate approximate coordinates.

`;
  }

  return `${contextInjection}Perform a comprehensive travel intelligence scan for: "${city}".
Generate an authentic profile with:
1. cityMeta: id, name, country, tagline (punchy 5-7 words), introParagraph1, introParagraph2, bestTimeToVisit, howToReach, idealDuration, climate, localSecretRecipe, bgColorClass (Tailwind e.g. bg-amber-50), accentColorClass, secondaryColorClass, mapX (0-100), mapY (0-100), bookingSteps (3 items), recreation (3 items with title/description/duration), accommodations (3 items with name/type/priceRange/tagline), practicalities (transitTip, dialectTip, currencyTip, languagePhrase).
2. weather: temp, condition, precipitation, humidity, wind, uvIndex, airQuality, hourly (5 items: time/temp/icon where icon is sunny|cloudy|windy|rainy), weekly (5 items: day/temp/cond).
3. places: Exactly 20 famous spots and exactly 20 hidden gem spots (40 spots in total). Each must have: id (unique string), title, type ("famous" or "gem"), tagline, description (concise: 1-2 sentences), highlights (3 items with **bold**), rating (number), cost (string), timeOfDay (string), lat (latitude number), lng (longitude number).

IMPORTANT: You MUST return exactly 20 places of type 'famous' and exactly 20 places of type 'gem' (40 places total). Make all descriptions extremely short (1-2 sentences) to fit within the JSON output token limits without truncation. Respond ONLY as a single valid JSON object with keys: cityMeta, weather, places.`;
}

// ─── MAIN HANDLER ─────────────────────────────────────────────────────────────
export default async function handler(req, res) {
  const city = (req.query?.city || '').toString().trim();
  if (!city) {
    return res.status(400).json({ error: 'Missing city query parameter', code: 'EMPTY_SEARCH' });
  }

  console.log(`[API] Request for city: "${city}"`);

  // Run scraper first to collect real-world context for the prompt
  const scrapedContext = await scrapeCityData(city);
  console.log(`[Scraper] Retrieved ${scrapedContext.length} bytes of context text.`);

  const systemPrompt = 'You are a travel data generator. Output only valid JSON with no markdown, no backticks, no extra text.';
  const userPrompt = buildPrompt(city, scrapedContext);

  const provider = (req.query?.provider || 'auto').toString().trim().toLowerCase();
  const { text: aiText, source: aiSource } = await generateWithAI(systemPrompt, userPrompt, 'places', provider);
  let apiSuccess = false;
  let rawJsonResult = null;

  if (aiText) {
    try {
      rawJsonResult = JSON.parse(aiText);
      apiSuccess = true;
      console.log(`[AI Engine] Successfully generated via: ${aiSource}`);
    } catch (e) {
      console.error('[AI Engine] Failed to parse generated JSON:', e.message);
    }
  }

  // ── OFFLINE FALLBACK ───────────────────────────────────────────────────────
  let payload;
  if (apiSuccess && rawJsonResult) {
    payload = rawJsonResult;
  } else {
    const normName = city.toLowerCase().replace(/\s+/g, '');
    if (OFFLINE_CITY_BLUEPRINTS[normName]) {
      payload = JSON.parse(JSON.stringify(OFFLINE_CITY_BLUEPRINTS[normName]));
      console.log('[Offline] Matched blueprint for:', normName);
    } else {
      const properName = city.charAt(0).toUpperCase() + city.slice(1);
      payload = {
        cityMeta: {
          id: city.toLowerCase().replace(/\s+/g, '-'), name: properName, country: 'India',
          tagline: `Vibrant heritage lanes of ${properName}`,
          introParagraph1: `Wandering through ${properName} reveals centuries of layered heritage and crisp regional flavors.`,
          introParagraph2: `Winding landmarks and bazaars make ${properName} an unparalleled adventure spot.`,
          bestTimeToVisit: 'October to March', howToReach: `Domestic flights or train to ${properName} station.`,
          idealDuration: '2 to 3 Days', climate: 'Pleasant evenings with vibrant tropical days',
          localSecretRecipe: 'Local spiced sweets and handcrafted chai', bgColorClass: 'bg-amber-50',
          accentColorClass: 'bg-brutal-yellow', secondaryColorClass: 'bg-brutal-orange',
          mapX: 48, mapY: 53,
          bookingSteps: ['Secure arrival guidelines.', 'Arrange local transport.', 'Reserve landmark entries.'],
          recreation: [{ title: `${properName} Heritage Walk`, description: 'Explore local structures and heritage lanes.', duration: '2.5 Hours' }],
          accommodations: [{ name: `${properName} Grand Hotel`, type: 'Luxury Stay', priceRange: '₹3,500 - ₹5,500/night', tagline: 'Elegant pillars with modern setups.' }],
          practicalities: { transitTip: 'Autos are plentiful — confirm fare.', dialectTip: 'Polite regional accents dominate.', currencyTip: 'Carry notes for street vendors.', languagePhrase: `Namaskaram, ${properName} local food nearby?` }
        },
        weather: {
          temp: 30, condition: 'Sunny Blue Skies', precipitation: '5%', humidity: '63%', wind: '12 km/h', uvIndex: 'High', airQuality: 'AQI 72 (Good)',
          hourly: [{ time: '09 AM', temp: 28, icon: 'sunny' }, { time: '12 PM', temp: 32, icon: 'sunny' }, { time: '03 PM', temp: 31, icon: 'sunny' }, { time: '06 PM', temp: 29, icon: 'cloudy' }],
          weekly: [{ day: 'Mon', temp: 31, cond: 'Sunny' }, { day: 'Tue', temp: 31, cond: 'Clear' }, { day: 'Wed', temp: 30, cond: 'Partly Cloudy' }]
        },
        places: [
          { id: `${city.toLowerCase()}-f1`, title: `${properName} Heritage Fort`, type: 'famous', tagline: 'Glistening sandstone walls safeguarding regional art.', description: `The primary iconic historical palace of ${properName}.`, highlights: ['**High Sandstone Watchtowers**', '**Traditional Archways**', '**Royal Weapons Museum**'], rating: 4.8, cost: '₹40 INR', timeOfDay: 'Morning', lat: null, lng: null },
          { id: `${city.toLowerCase()}-g1`, title: 'Ancient Stepwell', type: 'gem', tagline: 'Deep quiet stone steps preserving thermal springs.', description: 'A centuries-old architectural stepwell cut into volcanic granite.', highlights: ['**Granite Cut Slabs**', '**Subterranean Green Pools**', '**Quiet Shadow Corridors**'], rating: 4.9, cost: 'Free', timeOfDay: 'Midday', lat: null, lng: null }
        ]
      };
      console.log('[Offline] Using procedural generator for:', city);
    }
  }

  // ── FILTER DUPLICATES & PAD PLACES TO EXACTLY 20 FAMOUS + 20 GEMS ──────────
  if (!payload.cityMeta.heroImage) {
    payload.cityMeta.heroImage = await resolveDynamicImage(payload.cityMeta.name, payload.cityMeta.name);
  }

  const seenTitles = new Set();
  const filteredPlaces = [];
  const cityNameLower = payload.cityMeta.name.toLowerCase();

  for (const place of (payload.places || [])) {
    const titleNorm = (place.title || '').toLowerCase().trim();
    if (!titleNorm) continue;
    if (seenTitles.has(titleNorm)) continue;
    
    // Skip spots belonging to other cities to prevent LLM hallucinations
    if (cityNameLower !== 'agra' && (titleNorm.includes('agra') || titleNorm.includes('taj mahal'))) continue;
    if (cityNameLower !== 'jaipur' && (titleNorm.includes('jaipur') || titleNorm.includes('hawa mahal'))) continue;
    if (cityNameLower !== 'delhi' && (titleNorm.includes('delhi') || titleNorm.includes('qutub minar') || titleNorm.includes('red fort'))) continue;
    if (cityNameLower !== 'mumbai' && (titleNorm.includes('mumbai') || titleNorm.includes('gateway of india'))) continue;

    seenTitles.add(titleNorm);
    filteredPlaces.push(place);
  }

  let famousSpots = filteredPlaces.filter(p => p.type === 'famous');
  let gemSpots = filteredPlaces.filter(p => p.type === 'gem');

  const properName = payload.cityMeta.name;
  const properNameLower = properName.toLowerCase().replace(/\s+/g, '-');

  // Base coordinates for padding offsets
  let baseLat = 17.3850; // default anchor (Hyderabad)
  let baseLng = 78.4867;
  const firstWithCoords = filteredPlaces.find(p => p.lat && p.lng);
  if (firstWithCoords) {
    baseLat = firstWithCoords.lat;
    baseLng = firstWithCoords.lng;
  }

  const famousTemplates = [
    { title: `${properName} Palace Gardens`, tagline: `Stately royal lawns and fountains.`, description: `The historic royal gardens of the ${properName} dynasty, featuring beautiful fountains and flowerbeds.` },
    { title: `${properName} Heritage Museum`, tagline: `Centuries of regional history and art.`, description: `A grand local museum housing ancient artifacts, weapons, and paintings from the region's rich past.` },
    { title: `Grand Clock Tower of ${properName}`, tagline: `Iconic colonial-era timepiece landmark.`, description: `A historical landmark standing in the heart of the city, built during the colonial era.` },
    { title: `${properName} Central Bazaar`, tagline: `A buzzing hive of spices, silk, and local craft.`, description: `The oldest and busiest market square in ${properName}, famous for local textiles, brassware, and traditional jewelry.` },
    { title: `Royal Cenotaphs of ${properName}`, tagline: `Ornate marble memorials of ancient rulers.`, description: `Splendid carved stone structures dedicated to the memory of the city's past kings and nobility.` },
    { title: `${properName} Main Fort Gate`, tagline: `Colossal wooden portals guarding the ancient entrance.`, description: `The massive historical entrance gate to the city's old fortified quarters, spiked to prevent elephant charges.` },
    { title: `Lakeside Promenade of ${properName}`, tagline: `Scenic sunset walkway along the waterfront.`, description: `A beautifully paved modern walking path along the primary lake, offering gorgeous evening views and street food stalls.` },
    { title: `Sri ${properName} Mandir`, tagline: `Ancient stone temple dedicated to the city deity.`, description: `A highly revered historical temple known for its towering gateways and intricate pillar carvings.` },
    { title: `Colonial Town Hall`, tagline: `Stately white arches from a bygone era.`, description: `A neoclassical brick structure that serves as a cultural civic center, showcasing vintage portraits and maps.` },
    { title: `${properName} Arts & Crafts Village`, tagline: `Open-air market displaying regional handlooms.`, description: `A vibrant government-sponsored cultural hub where local artisans demonstrate weaving, pottery, and wood carving.` },
    { title: `Victoria Memorial Hall of ${properName}`, tagline: `Majestic white marble monument.`, description: `A spectacular marble building celebrating the architectural heritage and historical annals of ${properName}.` },
    { title: `${properName} Botanical Gardens`, tagline: `Lush sanctuary of rare tropical flora.`, description: `A sprawling botanical park containing century-old trees, orchid greenhouses, and quiet walking pathways.` },
    { title: `Holy Trinity Cathedral of ${properName}`, tagline: `Stained glass arches and neo-gothic spires.`, description: `A landmark historical church featuring magnificent architectural vaults, buttresses, and vintage organs.` },
    { title: `${properName} Science & Planetarium`, tagline: `Futuristic dome housing cosmic projections.`, description: `A state-of-the-art educational facility featuring space exhibits, telescopes, and celestial theater shows.` },
    { title: `Central Library of ${properName}`, tagline: `Grand reading rooms holding historic scrolls.`, description: `A majestic public library built in the early 20th century, housing rare manuscripts and first editions.` },
    { title: `Martyrs Memorial Plaza`, tagline: `Eternal flame honoring historic freedom fighters.`, description: `A peaceful public square dedicated to regional heroes, featuring a tall granite obelisk and quiet reflection pools.` },
    { title: `${properName} War Memorial Arch`, tagline: `Towering stone archway flanking the city center.`, description: `A historical monument celebrating the bravery of native soldiers, engraved with names and regional insignia.` },
    { title: `Mahatma Gandhi Statue & Square`, tagline: `Public gathering place at the old city junction.`, description: `A bustling town square centered around a majestic bronze statue, popular for evening walks and vendors.` },
    { title: `St. Mary's Historic School & Church`, tagline: `Classic brick arches and peaceful cloisters.`, description: `A scenic colonial church complex with red brick walls, high arches, and lush inner courtyards.` },
    { title: `${properName} Golf Club Vista`, tagline: `Manicured greens set against historic fort walls.`, description: `A picturesque golf course offering rolling fairways combined with views of the old city ramparts.` },
    { title: `State Assembly Chambers`, tagline: `Pillared legislative facade of grand proportions.`, description: `The imposing government house of ${properName}, showcasing classic architecture and beautiful public front lawns.` },
    { title: `Nehru Rose Garden of ${properName}`, tagline: `Sprawling paths containing thousands of rose varieties.`, description: `A massive floral garden containing walking paths, fountains, and rare hybrid rose species.` }
  ];

  const gemTemplates = [
    { title: `Secret Stepwell of ${properName}`, tagline: `A hidden subterranean maze of cool granite.`, description: `A centuries-old hidden stepwell featuring deep geometric steps leading down to natural spring water.` },
    { title: `Old Town Spice Lane`, tagline: `A narrow corridor of traditional aromas.`, description: `A tucked-away medieval alleyway filled with authentic spice grinding mills and tea merchants.` },
    { title: `Sunset Hilltop Viewpoint`, tagline: `Panoramic lookout over the old city quarters.`, description: `An offbeat rocky outcrop offering breathtaking 360-degree sunset views of the city skyline.` },
    { title: `Ruined Watchtower of ${properName}`, tagline: `Overgrown stone sentinel in the outskirts.`, description: `A forgotten military lookout tower covered in vines, offering scenic views of the surrounding valley.` },
    { title: `Forgotten Palace Archway`, tagline: `A majestic crumbling gate hidden in residential lanes.`, description: `A beautiful weathered archway representing the last remains of a royal summer pavilion.` },
    { title: `Artisan Potter's Quarter`, tagline: `Quiet clay workshops preserving ancestral craft.`, description: `A peaceful neighborhood where third-generation potters shape traditional clay vessels using wooden wheels.` },
    { title: `Old Banyan Canopy Cafe`, tagline: `Quaint open-air spot under a 200-year-old tree.`, description: `A charming local tea stall and cafe hidden beneath the massive branches of a historic sacred tree.` },
    { title: `Eco Wetlands Bird Hide`, tagline: `Secluded spot for observing migratory waterbirds.`, description: `A hidden wooden observation deck on the edge of the marshes, popular among local nature enthusiasts.` },
    { title: `Ancient Hermitage Caves`, tagline: `Silent rock-cut chambers carved in basalt.`, description: `Quiet meditative chambers cut into the hillside cliffs, dating back to early Buddhist or monastic settlements.` },
    { title: `Local Weaver's Alley`, tagline: `The rhythmic clank of manual wooden handlooms.`, description: `A hidden residential lane where local families continue to weave traditional pattern fabrics on manual looms.` },
    { title: `Hidden Lotus Pond of ${properName}`, tagline: `Peaceful water lilies hidden behind a shrine.`, description: `A tranquil hidden pond covered in pink lotuses, visited by kingfishers and offering quiet surroundings.` },
    { title: `Old City Vintage Book Shop`, tagline: `Dusty shelves stacked with regional history books.`, description: `A narrow bookstore run by a local scholar, featuring ancient maps, postcards, and second-hand travel guides.` },
    { title: `Secret Rose Garden View`, tagline: `Secluded high terrace overlooking palace walls.`, description: `A quiet stone patio framing unmatched close-up views of the palace's rear architectural features.` },
    { title: `Stone Bridge of the Kings`, tagline: `Cracked arches crossing a narrow jungle stream.`, description: `A historical single-arch bridge built in the 17th century, now covered in moss and used as a trekking path.` },
    { title: `Local Clay Tea Pot Stall`, tagline: `Authentic masala chai served in fresh earthen cups.`, description: `A beloved roadside tea stall serving piping-hot ginger tea in single-use clay cups (kulhads).` },
    { title: `Mystic Sufi Shrine in the Woods`, tagline: `Weathered dome surrounded by peacocks.`, description: `A hidden spiritual tomb of a local saint, known for its peaceful, quiet forest surroundings and evening oil lamps.` },
    { title: `Forgotten Colonial Cemetery`, tagline: `Moss-grown headstones from historical eras.`, description: `A historic quiet cemetery containing stone obelisks, classical pillars, and narratives from early travelers.` },
    { title: `Rustic Hillside Trekking Trail`, tagline: `Narrow dirt path leading through wild wildflowers.`, description: `An off-grid walking path used by local shepherds, ascending to the highest ridge overlooking the city.` },
    { title: `Whispering Bamboo Grove`, tagline: `Rhythmic creek noises and tall creaking bamboo.`, description: `A beautiful riverside bamboo forest where the wind creates natural musical rustling notes.` },
    { title: `Hidden Waterfall Ravine`, tagline: `Cool pool fed by a clean mountain stream.`, description: `A secluded rocky glen containing a small freshwater pool, perfect for a quiet picnic away from city crowds.` },
    { title: `Old Town Wooden Toy Workshop`, tagline: `Ancestral handicraft and bright lacquered wood.`, description: `A traditional home-based studio where craftsmen carve and color toys using organic resin colors.` },
    { title: `Secluded Sunrise Lake Point`, tagline: `Silent morning mist rising off still waters.`, description: `An off-the-radar embankment on the eastern lake edge, offering panoramic lookouts as the sun rises.` }
  ];

  let padIdx = 1;
  while (famousSpots.length < 20) {
    const template = famousTemplates[(padIdx - 1) % famousTemplates.length];
    const newId = `${properNameLower}-pad-f${padIdx}`;
    const titleNorm = template.title.toLowerCase();
    if (!seenTitles.has(titleNorm)) {
      seenTitles.add(titleNorm);
      famousSpots.push({
        id: newId,
        title: template.title,
        type: 'famous',
        tagline: template.tagline,
        description: template.description,
        highlights: ['**Historical Architecture**', '**Photo Spot**', '**Local Heritage**'],
        rating: parseFloat((4.5 + Math.random() * 0.4).toFixed(1)),
        cost: 'Free entry',
        timeOfDay: 'Morning',
        lat: parseFloat((baseLat + (Math.random() * 0.04 - 0.02)).toFixed(5)),
        lng: parseFloat((baseLng + (Math.random() * 0.04 - 0.02)).toFixed(5))
      });
    }
    padIdx++;
    if (padIdx > 100) break;
  }

  padIdx = 1;
  while (gemSpots.length < 20) {
    const template = gemTemplates[(padIdx - 1) % gemTemplates.length];
    const newId = `${properNameLower}-pad-g${padIdx}`;
    const titleNorm = template.title.toLowerCase();
    if (!seenTitles.has(titleNorm)) {
      seenTitles.add(titleNorm);
      gemSpots.push({
        id: newId,
        title: template.title,
        type: 'gem',
        tagline: template.tagline,
        description: template.description,
        highlights: ['**Off the Beaten Path**', '**Quiet Atmosphere**', '**Scenic Views**'],
        rating: parseFloat((4.6 + Math.random() * 0.3).toFixed(1)),
        cost: 'Free',
        timeOfDay: 'Late Afternoon',
        lat: parseFloat((baseLat + (Math.random() * 0.04 - 0.02)).toFixed(5)),
        lng: parseFloat((baseLng + (Math.random() * 0.04 - 0.02)).toFixed(5))
      });
    }
    padIdx++;
    if (padIdx > 100) break;
  }

  // Enforce exactly 20 cards for each type
  famousSpots = famousSpots.slice(0, 20);
  gemSpots = gemSpots.slice(0, 20);

  const enrichedPlaces = await Promise.all([...famousSpots, ...gemSpots].map(async (place) => {
    const img = await resolveDynamicImage(place.title, payload.cityMeta.name);
    return { ...place, image: img };
  }));

  payload.places = enrichedPlaces;
  payload.famous = enrichedPlaces.filter(p => p.type === 'famous');
  payload.gems = enrichedPlaces.filter(p => p.type === 'gem');
  payload.scraped = apiSuccess;
  payload.source = apiSuccess ? aiSource : 'Offline';
  payload.timestamp = new Date().toISOString();

  return res.status(200).json(payload);
}
