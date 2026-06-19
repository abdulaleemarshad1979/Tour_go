import { useState, useMemo, useEffect } from 'react';
import { CITIES, CITY_LOCATIONS } from './data';
import { City, SpotLocation, WeatherData } from './types';
import { IntroSequence } from './components/intro/IntroSequence';
import { Navbar } from './components/layout/Navbar';
import { HeroSection } from './components/hero/HeroSection';
import { DiscoveryGrid } from './components/discovery/DiscoveryGrid';
import { DestinationStory } from './components/destination/DestinationStory';
import { DestinationSpecs } from './components/destination/DestinationSpecs';
import { DestinationGuides } from './components/destination/DestinationGuides';
import { WeatherWidget } from './components/weather/WeatherWidget';
import { MapExplorer } from './components/MapExplorer';
import { TripBag } from './components/trip/TripBag';
import { BottomNav } from './components/layout/BottomNav';
import { LoadingSkeleton } from './components/ui/LoadingSkeleton';
import { Footer } from './components/layout/Footer';
import { useGeolocation } from './hooks/useGeolocation';
import { Toast } from './components/ui/Toast';
import { PlaceDetailModal } from './components/discovery/PlaceDetailModal';
import { AnimatePresence } from 'motion/react';
import { SettingsModal } from './components/settings/SettingsModal';

export default function App() {
  const [introComplete, setIntroComplete] = useState<boolean>(() => {
    return typeof window !== 'undefined' && sessionStorage.getItem('tourgo_intro_seen') === 'true';
  });

  // Typography Niche selection: luxury | modern | eco
  const [activeNiche, setActiveNiche] = useState<'luxury' | 'modern' | 'eco'>(() => {
    return (typeof window !== 'undefined' && localStorage.getItem('tourgo_niche') as 'luxury' | 'modern' | 'eco') || 'luxury';
  });

  // AI Provider choice: auto | gemini | groq | openrouter
  const [aiProvider, setAiProvider] = useState<'auto' | 'gemini' | 'groq' | 'openrouter'>(() => {
    return (typeof window !== 'undefined' && localStorage.getItem('tourgo_ai_provider') as 'auto' | 'gemini' | 'groq' | 'openrouter') || 'auto';
  });

  const [settingsOpen, setSettingsOpen] = useState<boolean>(false);

  // Sync data-typography attribute
  useEffect(() => {
    document.documentElement.setAttribute('data-typography', activeNiche);
    localStorage.setItem('tourgo_niche', activeNiche);
  }, [activeNiche]);

  useEffect(() => {
    localStorage.setItem('tourgo_ai_provider', aiProvider);
  }, [aiProvider]);

  // Active city selection state (used as lookup key for local/scraped cache)
  const [selectedCityId, setSelectedCityId] = useState<string>('delhi');
  const [cityNameQuery, setCityNameQuery] = useState<string>('Delhi');
  
  // Search state (filtering active city spots)
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // 3-way toggle filter state (ALL slots vs FAMOUS vs GEMS checkpoints)
  const [filterType, setFilterType] = useState<'all' | 'famous' | 'gem'>('all');
  
  // Pinned checklist boarding state
  const [pinnedIds, setPinnedIds] = useState<string[]>([]);

  // State caches for scraped travel intelligence objects
  const [cachedCityMeta, setCachedCityMeta] = useState<Record<string, City>>({});
  const [cachedWeatherData, setCachedWeatherData] = useState<Record<string, WeatherData>>({});
  const [dynamicPlaces, setDynamicPlaces] = useState<Record<string, SpotLocation[]>>({});
  
  const [loadingPlaces, setLoadingPlaces] = useState<boolean>(false);
  const [errorFetching, setErrorFetching] = useState<string | null>(null);

  // Overlay states
  const [tripBagOpen, setTripBagOpen] = useState(false);
  const [activeDetail, setActiveDetail] = useState<SpotLocation | null>(null);
  
  // Toast notifications state
  const [toastMessage, setToastMessage] = useState('');
  const [toastVisible, setToastVisible] = useState(false);

  // Mobile nav active tab tracker
  const [mobileActiveTab, setMobileActiveTab] = useState<'explore' | 'map' | 'gems' | 'trip' | 'settings'>('explore');

  // Trigger browser geolocation auto-detection on mount
  useGeolocation((detectedCity) => {
    setToastMessage("📍 Using your location");
    setToastVisible(true);
    handleSelectCityName(detectedCity);
  });

  // Toggle spots from the Boarding pass package list
  const handleTogglePin = (id: string) => {
    setPinnedIds((prev) =>
      prev.includes(id) ? prev.filter((pinnedId) => pinnedId !== id) : [...prev, id]
    );
  };

  // Scraper invocation for any submitted destination name query
  const handleSelectCityName = (name: string) => {
    const trimmed = name.trim();
    if (trimmed.length === 0) return;
    
    const token = trimmed.toLowerCase().replace(/\s+/g, '-');
    setCityNameQuery(trimmed);
    setSelectedCityId(token);
    setSearchQuery('');
    setFilterType('all');
  };

  // Fetch dynamic spots, weather feeds, and copywriting guides from full-stack scraper
  useEffect(() => {
    let active = true;

    const fetchCitySpots = async () => {
      setLoadingPlaces(true);
      setErrorFetching(null);
      try {
        const response = await fetch(`/api/places?city=${encodeURIComponent(cityNameQuery)}&provider=${aiProvider}`);
        if (!response.ok) {
          throw new Error(`Scraper API status ${response.status}`);
        }
        
        const contentType = response.headers.get('content-type') || '';
        if (!contentType.includes('application/json')) {
          throw new Error(
            'The travel intelligence API responded with a non-JSON document. Utilize local files.'
          );
        }
        
        const data = await response.json();
        
        if (!active) return;

        if (data && Array.isArray(data.places) && data.cityMeta && data.weather) {
          setDynamicPlaces((prev) => ({
            ...prev,
            [selectedCityId]: data.places,
          }));
          setCachedCityMeta((prev) => ({
            ...prev,
            [selectedCityId]: data.cityMeta,
          }));
          setCachedWeatherData((prev) => ({
            ...prev,
            [selectedCityId]: data.weather,
          }));
        } else {
          throw new Error('Travel scraper returned an incomplete data envelope');
        }
      } catch (err: any) {
        console.error('Failed to query scraper bot travel intelligence payload:', err);
        setErrorFetching(err.message || 'Underlying intelligence scraper bot un-responsive.');
      } finally {
        if (active) {
          setLoadingPlaces(false);
        }
      }
    };

    fetchCitySpots();

    return () => {
      active = false;
    };
  }, [selectedCityId, cityNameQuery, aiProvider]);

  // Resolve active city metadata
  const resolvedCity = useMemo<City>(() => {
    if (cachedCityMeta[selectedCityId]) {
      return cachedCityMeta[selectedCityId];
    }
    const seed = CITIES.find((c) => c.id === selectedCityId);
    if (seed) {
      return seed;
    }
    return {
      id: selectedCityId,
      name: cityNameQuery,
      country: 'India',
      tagline: 'Scraping regional sensory corridors...',
      heroImage: '',
      introParagraph1: `Initializing digital travel coordinates intelligence and real-time meteorology scanning for "${cityNameQuery}"...`,
      introParagraph2: 'Retrieving famous monuments, highly recommended spots, hidden local gems, and transport details.',
      bestTimeToVisit: 'Analyzing seasonal trends...',
      howToReach: 'Calculating logistics...',
      idealDuration: 'Estimating stay...',
      climate: 'Retrieving sensory conditions...',
      localSecretRecipe: 'Uncovering local kitchen secrets...',
      bgColorClass: 'bg-amber-50',
      accentColorClass: 'bg-brutal-yellow',
      secondaryColorClass: 'bg-brutal-orange',
      mapX: 45,
      mapY: 55,
      bookingSteps: [],
      recreation: [],
      accommodations: [],
      practicalities: {
        transitTip: 'Retrieving regional customs...',
        dialectTip: 'Retrieving regional customs...',
        currencyTip: 'Retrieving regional customs...',
        languagePhrase: 'Retrieving regional customs...'
      }
    };
  }, [selectedCityId, cityNameQuery, cachedCityMeta]);

  // Resolve active weather
  const resolvedWeather = useMemo<WeatherData | null>(() => {
    if (cachedWeatherData[selectedCityId]) {
      return cachedWeatherData[selectedCityId];
    }
    return null;
  }, [selectedCityId, cachedWeatherData]);

  // List of all dynamic cities
  const resolvedCitiesList = useMemo<City[]>(() => {
    const defaultList = [...CITIES];
    if (resolvedCity && !defaultList.some((c) => c.id === resolvedCity.id)) {
      defaultList.push(resolvedCity);
    }
    return defaultList;
  }, [resolvedCity]);

  // Filter location maps based on query string or filter tabs
  const filteredLocations = useMemo(() => {
    const rawList = dynamicPlaces[selectedCityId] || CITY_LOCATIONS[selectedCityId] || [];
    return rawList.filter((loc) => {
      const matchesSearch =
        loc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        loc.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
        loc.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        loc.highlights.some(hl => hl.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesType = filterType === 'all' || loc.type === filterType;
      return matchesSearch && matchesType;
    });
  }, [selectedCityId, dynamicPlaces, searchQuery, filterType]);

  const handleScrollToSection = (section: 'discover' | 'map') => {
    if (section === 'discover') {
      document.getElementById('discover')?.scrollIntoView({ behavior: 'smooth' });
    } else if (section === 'map') {
      document.getElementById('map-section')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleExploreAction = () => {
    setMobileActiveTab('explore');
    setFilterType('all');
    handleScrollToSection('discover');
  };

  const handleMapAction = () => {
    setMobileActiveTab('map');
    handleScrollToSection('map');
  };

  const handleGemsAction = () => {
    setMobileActiveTab('gems');
    setFilterType('gem');
    handleScrollToSection('discover');
  };

  const handleOpenTripBagAction = () => {
    setMobileActiveTab('trip');
    setTripBagOpen(true);
  };

  const handleSettingsAction = () => {
    setMobileActiveTab('settings');
    setSettingsOpen(true);
  };

  // Resolve pinned spot location objects for drawer display
  const pinnedLocations = useMemo(() => {
    const rawList = dynamicPlaces[selectedCityId] || CITY_LOCATIONS[selectedCityId] || [];
    return rawList.filter((loc) => pinnedIds.includes(loc.id));
  }, [selectedCityId, dynamicPlaces, pinnedIds]);

  return (
    <>
      {/* Cinematic Intro Sequence overlay */}
      <AnimatePresence>
        {!introComplete && (
          <IntroSequence onComplete={() => {
            sessionStorage.setItem('tourgo_intro_seen', 'true');
            setIntroComplete(true);
          }} />
        )}
      </AnimatePresence>

      {/* Main app theme wrappers */}
      <div className="min-h-screen bg-[#0B0F19] text-[#EAEAEA] selection:bg-brand-accent selection:text-[#0B0F19] transition-colors duration-500 overflow-x-hidden font-sans pb-24 md:pb-0">
        
        {/* Navigation Navbar */}
        <Navbar
          selectedCity={resolvedCity}
          onSelectCityName={handleSelectCityName}
          isScraping={loadingPlaces}
          pinnedCount={pinnedIds.length}
          onOpenTripBag={handleOpenTripBagAction}
          onOpenSettings={handleSettingsAction}
        />

        {/* Fullscreen cinematic hero banner */}
        <HeroSection
          selectedCity={resolvedCity}
          onSelectCityName={handleSelectCityName}
          isScraping={loadingPlaces}
          filterType={filterType}
          onFilterChange={setFilterType}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        {/* Discovery content canvas */}
        <main id="discover" className="max-w-7xl mx-auto px-4 md:px-8 py-8 flex flex-col gap-8">
          {loadingPlaces ? (
            <LoadingSkeleton />
          ) : (
            <>
              {errorFetching && (
                <div className="w-full bg-red-500/10 border border-red-500/30 p-4 rounded-xl text-xs font-mono text-red-400">
                  [WARNING] Dynamic Scrape Scan Interrupted: {errorFetching}
                </div>
              )}
              
              {/* Places Grid */}
              <DiscoveryGrid
                locations={filteredLocations}
                accentColorClass={resolvedCity.accentColorClass}
                pinnedIds={pinnedIds}
                onTogglePin={handleTogglePin}
              />

              {/* Climate Feeds Card */}
              {resolvedWeather && (
                <WeatherWidget weather={resolvedWeather} cityName={resolvedCity.name} />
              )}
            </>
          )}

          {/* Sensory Story Hook */}
          <DestinationStory city={resolvedCity} />

          {/* Essential Logistics Dashboard */}
          <DestinationSpecs city={resolvedCity} />

          {/* Tourism Guideline Accordions */}
          <DestinationGuides city={resolvedCity} onOpenTripBag={handleOpenTripBagAction} />

          {/* Geographical Map Coordinate Explorer */}
          <MapExplorer
            cities={resolvedCitiesList}
            selectedCity={resolvedCity}
            onSelectCity={(city) => handleSelectCityName(city.name)}
            locations={filteredLocations}
            onSelectLocation={setActiveDetail}
          />
        </main>

        {/* Mobile Navigation bar shortcuts */}
        <BottomNav
          pinnedCount={pinnedIds.length}
          onExplore={handleExploreAction}
          onMap={handleMapAction}
          onGems={handleGemsAction}
          onOpenTripBag={handleOpenTripBagAction}
          onSettings={handleSettingsAction}
          activeTab={mobileActiveTab}
        />

        {/* Global Footer */}
        <Footer onSelectFilter={setFilterType} onOpenTripBag={handleOpenTripBagAction} />
      </div>

      {/* Global Pinned List Slide-In Drawer */}
      <AnimatePresence>
        {tripBagOpen && (
          <TripBag
            selectedCity={resolvedCity}
            pinnedLocations={pinnedLocations}
            onTogglePin={handleTogglePin}
            isOpen={tripBagOpen}
            onClose={() => setTripBagOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Global Location Details Drawer Overlay (for map nodes trigger) */}
      <AnimatePresence>
        {activeDetail && (
          <PlaceDetailModal
            location={activeDetail}
            isPinned={pinnedIds.includes(activeDetail.id)}
            onTogglePin={handleTogglePin}
            onClose={() => setActiveDetail(null)}
          />
        )}
      </AnimatePresence>

      {/* Settings Dialog Console */}
      <AnimatePresence>
        {settingsOpen && (
          <SettingsModal
            isOpen={settingsOpen}
            onClose={() => {
              setSettingsOpen(false);
              if (mobileActiveTab === 'settings') {
                setMobileActiveTab('explore');
              }
            }}
            activeNiche={activeNiche}
            onNicheChange={(niche) => {
              setActiveNiche(niche);
              setToastMessage(`Applied ${niche.charAt(0).toUpperCase() + niche.slice(1)} Typography`);
              setToastVisible(true);
            }}
            aiProvider={aiProvider}
            onProviderChange={(provider) => {
              setAiProvider(provider);
              setToastMessage(`Switched Scraper Engine to: ${provider === 'auto' ? 'Cascading Auto' : provider.toUpperCase()}`);
              setToastVisible(true);
            }}
            onReplayIntro={() => {
              sessionStorage.removeItem('tourgo_intro_seen');
              setIntroComplete(false);
              setSettingsOpen(false);
              setToastMessage("Playing Cinematic Intro...");
              setToastVisible(true);
            }}
          />
        )}
      </AnimatePresence>

      {/* Toast Notification HUD */}
      <Toast
        message={toastMessage}
        isVisible={toastVisible}
        onClose={() => setToastVisible(false)}
      />
    </>
  );
}
