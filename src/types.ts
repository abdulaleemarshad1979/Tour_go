export interface SpotLocation {
  id: string;
  title: string;
  type: 'famous' | 'gem';
  tagline: string;
  description: string;
  highlights: string[]; // Content as bullets, e.g. ["**The Sunrise Trek:** Experience breathtaking views.", ...]
  image: string;
  rating: number;
  cost: string;
  timeOfDay: string;
  lat?: number | null;
  lng?: number | null;
}

export interface RecreationItem {
  title: string;
  description: string;
  duration: string;
}

export interface AccommodationItem {
  name: string;
  type: string;
  priceRange: string;
  tagline: string;
}

export interface PracticalityInfo {
  transitTip: string;
  dialectTip: string;
  currencyTip: string;
  languagePhrase: string;
}

export interface WeatherDayForecast {
  day: string;
  temp: number;
  cond: string;
}

export interface WeatherHourlyForecast {
  time: string;
  temp: number;
  icon: 'sunny' | 'cloudy' | 'rainy' | 'thunderstorm' | 'windy' | 'mist';
}

export interface WeatherData {
  temp: number;
  condition: string;
  precipitation: string;
  humidity: string;
  wind: string;
  uvIndex: string;
  airQuality: string;
  hourly: WeatherHourlyForecast[];
  weekly: WeatherDayForecast[];
}

export interface City {
  id: string;
  name: string;
  country: string;
  tagline: string; // Punchy 5-7 word headline that captures the vibe!
  heroImage: string;
  introParagraph1: string; // Sensory sights, sounds, and local flavors!
  introParagraph2: string;
  bestTimeToVisit: string;
  howToReach: string; // Logistical Details "who, what, when, how"
  idealDuration: string;
  climate: string;
  localSecretRecipe: string;
  bgColorClass: string;
  accentColorClass: string;
  secondaryColorClass: string;
  mapX: number;
  mapY: number;
  recreation?: RecreationItem[];
  accommodations?: AccommodationItem[];
  practicalities?: PracticalityInfo;
  bookingSteps?: string[];
}
