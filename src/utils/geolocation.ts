export async function reverseGeocode(lat: number, lon: number): Promise<string | null> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`,
      {
        headers: {
          'User-Agent': 'TourGoApp/2.0 (travel@example.com)'
        }
      }
    );
    if (!res.ok) return null;
    const data = await res.json();
    // Prefer city, fallback to town, state, county
    const city = data.address?.city || data.address?.town || data.address?.state || data.address?.county;
    return city || null;
  } catch (err) {
    console.error('Reverse geocoding failed:', err);
    return null;
  }
}
