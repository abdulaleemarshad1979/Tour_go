import React, { useEffect, useRef } from 'react';
import { Globe, MapPin } from 'lucide-react';
import { City, SpotLocation } from '../types';
import L from 'leaflet';

interface MapExplorerProps {
  cities: City[];
  selectedCity: City;
  onSelectCity: (city: City) => void;
  locations: SpotLocation[];
  onSelectLocation: (location: SpotLocation) => void;
}

export const MapExplorer: React.FC<MapExplorerProps> = ({
  cities,
  selectedCity,
  onSelectCity,
  locations,
  onSelectLocation,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Remove existing map instance
    if (mapRef.current) {
      mapRef.current.remove();
    }

    // Set base view coordinates (fallback to Delhi center coordinates)
    const baseLat = 20.5937;
    const baseLng = 78.9629;

    const map = L.map(mapContainerRef.current, {
      zoomControl: true,
      scrollWheelZoom: false,
    }).setView([baseLat, baseLng], 5);

    mapRef.current = map;

    // Dark tiles
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
    }).addTo(map);

    const markersGroup = L.featureGroup();

    // 1. Plot place locations for the selected city if coordinates exist
    const validSpots = locations.filter((l) => l.lat && l.lng);

    validSpots.forEach((loc) => {
      if (loc.lat && loc.lng) {
        const markerColor = loc.type === 'gem' ? '#FFD166' : '#52B788';
        const popupHtml = `
          <div class="p-2.5 font-sans text-xs bg-[#111827] text-[#EAEAEA] rounded-2xl border border-white/10" style="min-width: 170px;">
            <div class="flex items-center gap-1.5 mb-1.5">
              <span class="px-2 py-0.5 text-[8px] font-mono uppercase tracking-widest rounded-full" style="background: ${markerColor}15; border: 1px solid ${markerColor}30; color: ${markerColor}">
                ${loc.type === 'gem' ? '✦ Gem' : '★ Famous'}
              </span>
              <span class="text-[9px] text-[#FFD166]">★ ${loc.rating.toFixed(1)}</span>
            </div>
            <h5 class="font-display font-extrabold text-white text-xs uppercase leading-snug line-clamp-1 mb-0.5">${loc.title}</h5>
            <p class="text-[10px] text-gray-400 italic line-clamp-1 mb-2">"${loc.tagline}"</p>
            <button id="popup-btn-${loc.id}" style="width: 100%; background: #FFD166; color: #0B0F19; border: none; font-family: monospace; font-size: 8px; font-weight: 900; letter-spacing: 0.1em; text-transform: uppercase; padding: 6px 10px; border-radius: 8px; cursor: pointer;">
              Reveal Details &rarr;
            </button>
          </div>
        `;

        const customIcon = L.divIcon({
          html: `<div style="background-color: ${markerColor}; width: 14px; height: 14px; border-radius: 50%; border: 2.5px solid #0B0F19; box-shadow: 0 0 10px ${markerColor}; transition: all 0.3s; transform-origin: center;"></div>`,
          className: 'custom-leaflet-marker',
          iconSize: [14, 14],
          iconAnchor: [7, 7]
        });

        const marker = L.marker([loc.lat, loc.lng], { icon: customIcon })
          .bindPopup(popupHtml, {
            className: 'custom-leaflet-popup',
            closeButton: false,
            minWidth: 190
          });

        marker.on('popupopen', () => {
          const btn = document.getElementById(`popup-btn-${loc.id}`);
          if (btn) {
            btn.onclick = (e) => {
              e.preventDefault();
              onSelectLocation(loc);
              marker.closePopup();
            };
          }
        });

        marker.addTo(markersGroup);
      }
    });

    // 2. Plot city nodes if no specific spots coordinates are loaded
    if (validSpots.length === 0) {
      cities.forEach((city) => {
        // Map abstract coordinate percentages (mapX, mapY) roughly to India lat/lng bounding box for nodes plotting
        // Latitude bounding: 8.4 to 37.6
        // Longitude bounding: 68.7 to 97.2
        const mapLat = 37.6 - (city.mapY / 100) * (37.6 - 8.4);
        const mapLng = 68.7 + (city.mapX / 100) * (97.2 - 68.7);
        const isSelected = city.id === selectedCity.id;

        const customIcon = L.divIcon({
          html: `<div style="background-color: ${isSelected ? '#FFD166' : '#1F2937'}; width: 16px; height: 16px; border-radius: 50%; border: 3px solid #0B0F19; box-shadow: 0 0 12px ${isSelected ? '#FFD166' : 'rgba(255,255,255,0.1)'};"></div>`,
          className: 'custom-leaflet-city-marker',
          iconSize: [16, 16],
          iconAnchor: [8, 8]
        });

        const marker = L.marker([mapLat, mapLng], { icon: customIcon })
          .bindTooltip(`
            <div class="px-2.5 py-1 font-mono text-[9px] font-bold uppercase tracking-wider bg-[#111827] text-white border border-white/10 rounded-lg">
              ${city.name}
            </div>
          `, { direction: 'top', permanent: false, opacity: 0.9 });

        marker.on('click', () => {
          onSelectCity(city);
        });

        marker.addTo(markersGroup);
      });
    }

    markersGroup.addTo(map);

    // Auto-bounds viewport
    if (markersGroup.getBounds().isValid()) {
      map.fitBounds(markersGroup.getBounds(), { padding: [50, 50], maxZoom: 13 });
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [cities, selectedCity, locations, onSelectLocation, onSelectCity]);

  return (
    <section className="w-full my-12 select-none text-left" id="map-section">
      {/* SECTION HEADER */}
      <div className="flex flex-col gap-3 mb-6">
        <span className="font-mono text-xs text-[#FFD166] font-black uppercase tracking-widest flex items-center gap-1.5">
          <Globe className="w-4 h-4 text-brand-accent animate-spin-[spin_30s_linear_infinite]" />
          <span>Geographical Vector Console</span>
        </span>
        <h3 className="font-display font-black text-2xl uppercase tracking-tight text-white">
          Interactive discovery map
        </h3>
        <p className="font-sans text-xs md:text-sm text-gray-400 max-w-2xl leading-relaxed">
          Click any glowing beacon node on the interactive dark viewport to explore local coordinates, trace custom itineraries, and view climate conditions.
        </p>
      </div>

      {/* CORE CONTAINER */}
      <div className="glass rounded-3xl overflow-hidden p-6 flex flex-col gap-6 min-h-[500px] bg-white/2">
        {/* LEAFLET CANVAS */}
        <div
          ref={mapContainerRef}
          className="w-full h-[480px] rounded-2xl overflow-hidden border border-white/8 relative z-20 shadow-2xl bg-[#0b0f19]"
        />

        {/* Legend strip */}
        <div className="flex items-center gap-6 text-[9px] font-mono tracking-widest uppercase text-gray-400 px-2 py-0.5 border-t border-white/5 pt-4">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#52B788] border border-[#0B0F19]" />
            <span>Famous Places</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FFD166] border border-[#0B0F19]" />
            <span>Hidden Gems</span>
          </div>
        </div>
      </div>
    </section>
  );
};
