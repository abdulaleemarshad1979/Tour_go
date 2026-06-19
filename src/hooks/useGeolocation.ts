import { useState, useEffect, useRef } from 'react';
import { reverseGeocode } from '../utils/geolocation';

export interface GeolocationState {
  city: string | null;
  loading: boolean;
  error: string | null;
}

export function useGeolocation(onCityDetected: (city: string) => void) {
  const [state, setState] = useState<GeolocationState>({
    city: null,
    loading: false,
    error: null,
  });

  const onCityDetectedRef = useRef(onCityDetected);
  useEffect(() => {
    onCityDetectedRef.current = onCityDetected;
  }, [onCityDetected]);

  useEffect(() => {
    if (!navigator.geolocation) {
      setState(prev => ({ ...prev, error: 'Geolocation is not supported by your browser' }));
      return;
    }

    setState(prev => ({ ...prev, loading: true }));
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const city = await reverseGeocode(latitude, longitude);
        if (city) {
          setState({ city, loading: false, error: null });
          onCityDetectedRef.current(city);
        } else {
          setState({ city: null, loading: false, error: 'Failed to resolve city name' });
        }
      },
      (error) => {
        setState({ city: null, loading: false, error: error.message });
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, []); // Run only once on mount

  return state;
}
