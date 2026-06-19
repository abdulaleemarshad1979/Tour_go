export async function fetchPexelsImage(query: string, fallbackQuery = 'travel landscape'): Promise<string | null> {
  const key = ((import.meta as any).env?.VITE_PEXELS_API_KEY as string) || '';
  if (!key) return null;

  try {
    const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=5&orientation=landscape`;
    const res = await fetch(url, { headers: { Authorization: key } });
    if (res.ok) {
      const data = await res.json();
      const photo = data.photos?.[0];
      if (photo) return photo.src.large2x || photo.src.original;
    }
  } catch (err) {
    console.error('Client Pexels fetch error:', err);
  }

  if (query !== fallbackQuery) {
    return fetchPexelsImage(fallbackQuery);
  }
  return null;
}
