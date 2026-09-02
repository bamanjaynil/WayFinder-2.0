import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { Place } from '../types';
import { Button } from '../components/ui/Button';
import { Rating } from '../components/ui/Rating';
import { TrustBadge } from '../components/ui/TrustBadge';
import {
  Compass as CompassIcon,
  MapPin,
  Navigation,
  Landmark,
  Utensils,
  ShieldCheck,
  Bus,
  Sparkles,
  ArrowUpRight,
  Clock,
  Layers,
  ChevronRight,
  Maximize2
} from 'lucide-react';

export const CompassPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentCity, userLocation, requestUserLocation } = useApp();

  const [places, setPlaces] = useState<Place[]>([]);
  const [filterType, setFilterType] = useState<'all' | 'heritage' | 'food' | 'safety' | 'transport'>('all');
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [loading, setLoading] = useState(true);

  // Simulated compass bearing or heading (degrees)
  const [heading, setHeading] = useState<number>(0);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    const lat = userLocation?.lat || currentCity.coordinates.lat;
    const lng = userLocation?.lng || currentCity.coordinates.lng;

    api.getPlaces({
      cityId: currentCity.id,
      category: filterType === 'all' ? undefined : filterType,
      lat,
      lng,
    })
      .then((data) => {
        if (!isMounted) return;
        setPlaces(data);
        // Clear selected place if it doesn't belong to the new city, or set first place
        if (data.length > 0) {
          if (!selectedPlace || selectedPlace.cityId !== currentCity.id) {
            setSelectedPlace(data[0]);
          }
        } else {
          setSelectedPlace(null);
        }
        setLoading(false);
      })
      .catch(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [currentCity.id, filterType, userLocation]);

  // Compute mock compass direction bearing (N, NE, E, SE, S, SW, W, NW)
  const getBearing = (index: number) => {
    const bearings = ['N', 'NNE', 'ENE', 'E', 'ESE', 'SSE', 'S', 'SSW', 'WSW', 'W', 'WNW', 'NNW'];
    return bearings[index % bearings.length];
  };

  const centerLat = userLocation?.lat || currentCity.coordinates.lat;
  const centerLng = userLocation?.lng || currentCity.coordinates.lng;

  return (
    <div className="min-h-screen bg-slate-900 text-white pb-24 lg:pb-16 flex flex-col">
      {/* Top Bar */}
      <div className="bg-slate-950/80 border-b border-slate-800 px-4 sm:px-6 lg:px-8 py-4 backdrop-blur-md sticky top-16 z-30">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
              <CompassIcon className="w-5 h-5 animate-spin-slow" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  WayFinder Compass Radar
                </h1>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold">
                  LIVE RADAR
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Centering around {currentCity.name} ({centerLat.toFixed(2)}° N, {centerLng.toFixed(2)}° E)
              </p>
            </div>
          </div>

          {/* GPS Toggle & Filter Pills */}
          <div className="flex items-center gap-2">
            <button
              onClick={requestUserLocation}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition-all cursor-pointer"
            >
              <Navigation className="w-3.5 h-3.5 text-amber-400" />
              <span>{userLocation ? 'GPS Active' : 'Acquire GPS'}</span>
            </button>
          </div>
        </div>

        {/* Filter Categories Bar */}
        <div className="max-w-7xl mx-auto flex items-center gap-2 overflow-x-auto no-scrollbar pt-3">
          {[
            { id: 'all', label: 'All Sights', icon: Sparkles },
            { id: 'heritage', label: 'Monuments', icon: Landmark },
            { id: 'food', label: 'Food & Chai', icon: Utensils },
            { id: 'safety', label: 'Police & Helplines', icon: ShieldCheck },
            { id: 'transport', label: 'Transit & Auto', icon: Bus },
          ].map((cat) => {
            const Icon = cat.icon;
            const isSelected = filterType === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setFilterType(cat.id as any)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
                    : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 border border-slate-700/80'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Grid: Visual Radar Display + List Panel */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 w-full grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Visual Radar / Map Simulation */}
        <div className="lg:col-span-7 bg-slate-950 border border-slate-800 rounded-3xl p-6 relative overflow-hidden flex flex-col items-center justify-center min-h-[380px] sm:min-h-[480px]">
          {/* Radar Background Rings */}
          <div className="absolute w-[440px] h-[440px] rounded-full border border-slate-800/80 pointer-events-none" />
          <div className="absolute w-[320px] h-[320px] rounded-full border border-slate-800/60 pointer-events-none" />
          <div className="absolute w-[200px] h-[200px] rounded-full border border-slate-700/50 pointer-events-none" />
          <div className="absolute w-[80px] h-[80px] rounded-full border border-amber-500/20 pointer-events-none" />

          {/* Compass Cardinal Points */}
          <span className="absolute top-3 font-bold text-xs tracking-widest text-slate-500">N (000°)</span>
          <span className="absolute bottom-3 font-bold text-xs tracking-widest text-slate-500">S (180°)</span>
          <span className="absolute left-4 font-bold text-xs tracking-widest text-slate-500">W (270°)</span>
          <span className="absolute right-4 font-bold text-xs tracking-widest text-slate-500">E (090°)</span>

          {/* Center User Marker */}
          <div className="relative z-10 w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center text-slate-950 font-extrabold text-xs shadow-lg ring-4 ring-amber-500/30 animate-pulse">
            <CompassIcon className="w-4 h-4 text-slate-950" />
          </div>
          <span className="text-[11px] text-amber-300 font-semibold mt-2 z-10 bg-slate-900/90 px-2 py-0.5 rounded-md border border-amber-500/30">
            You are here · {currentCity.name}
          </span>

          {/* Plotted Destination Pins with Math Coordinates */}
          <div className="absolute inset-0 pointer-events-none">
            {places.map((place, idx) => {
              // Distribute pins along radius based on index
              const angle = (idx * (360 / Math.max(places.length, 1)) - 45) * (Math.PI / 180);
              const radius = 60 + ((idx % 3) + 1) * 45;
              const leftPercent = 50 + (Math.cos(angle) * radius) / 5;
              const topPercent = 50 + (Math.sin(angle) * radius) / 5;

              const isSelected = selectedPlace?.id === place.id;

              return (
                <div
                  key={place.id}
                  style={{ left: `${leftPercent}%`, top: `${topPercent}%` }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedPlace(place);
                  }}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 pointer-events-auto cursor-pointer group"
                >
                  <div
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-semibold transition-all shadow-md ${
                      isSelected
                        ? 'bg-amber-400 text-slate-950 scale-110 ring-2 ring-white z-20 font-bold'
                        : 'bg-slate-800 text-slate-200 hover:bg-slate-700 hover:text-white z-10 border border-slate-700'
                    }`}
                  >
                    <MapPin className={`w-3.5 h-3.5 ${isSelected ? 'text-slate-950' : 'text-amber-400'}`} />
                    <span className="truncate max-w-[100px]">{place.name}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Radar sweeping scan line effect */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-amber-500/5 to-transparent pointer-events-none animate-spin-slow opacity-40" />
        </div>

        {/* Right Column: Selected Place Details & Radar POI Feed */}
        <div className="lg:col-span-5 space-y-4">
          {/* Selected Place Card Preview */}
          {selectedPlace && (
            <div className="bg-slate-950 border border-slate-800 rounded-3xl p-5 shadow-xl">
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  Target Focus · {selectedPlace.cityName}
                </span>
                <TrustBadge status={selectedPlace.trust.status} className="bg-slate-900 border-slate-700 text-slate-200" />
              </div>

              <div className="flex gap-4 mb-4">
                <img
                  src={selectedPlace.images[0]}
                  alt={selectedPlace.name}
                  className="w-20 h-20 rounded-2xl object-cover shrink-0 border border-slate-800"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-bold text-white leading-tight truncate">
                    {selectedPlace.name}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                    {selectedPlace.speciality || selectedPlace.description}
                  </p>
                  <div className="flex items-center gap-3 mt-2 text-xs text-slate-300">
                    <span>⭐ {selectedPlace.rating}</span>
                    <span>·</span>
                    <span>⏱ {selectedPlace.openingHours.estimatedDurationHours}h</span>
                    <span>·</span>
                    <span className="text-amber-400 font-medium">₹{selectedPlace.estimatedCost.foreignNational}</span>
                  </div>
                </div>
              </div>

              {/* Guidance highlight */}
              {selectedPlace.guidance.length > 0 && (
                <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-slate-300 mb-4">
                  <strong className="text-amber-400 block mb-0.5">
                    {selectedPlace.guidance[0].title}:
                  </strong>
                  {selectedPlace.guidance[0].description}
                </div>
              )}

              <div className="flex items-center gap-2">
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => navigate(`/place/${selectedPlace.id}`)}
                  className="flex-1 bg-amber-500 hover:bg-amber-400 text-slate-950 border-amber-500 font-bold"
                >
                  View Full Guidance →
                </Button>
                <Button
                  variant="outline"
                  size="md"
                  onClick={() => navigate(`/fair-price?dest=${encodeURIComponent(selectedPlace.name)}`)}
                  className="border-slate-700 text-slate-200 hover:bg-slate-800"
                >
                  Fare Guide
                </Button>
              </div>
            </div>
          )}

          {/* List of Nearby POIs */}
          <div className="bg-slate-950 border border-slate-800 rounded-3xl p-5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center justify-between">
              <span>Points of Interest ({places.length})</span>
              <span className="text-[10px] text-slate-500 font-normal">Ranked by proximity</span>
            </h4>

            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
              {places.map((p, idx) => {
                const isSelected = selectedPlace?.id === p.id;
                return (
                  <div
                    key={p.id}
                    onClick={() => setSelectedPlace(p)}
                    className={`flex items-center justify-between p-3 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'border-amber-500/80 bg-slate-900 text-white'
                        : 'border-slate-850 bg-slate-900/40 text-slate-300 hover:bg-slate-900 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-xl bg-slate-800 text-amber-400 flex items-center justify-center text-xs font-bold shrink-0">
                        {getBearing(idx)}
                      </div>
                      <div className="min-w-0">
                        <h5 className="text-xs font-bold text-white truncate">
                          {p.name}
                        </h5>
                        <p className="text-[11px] text-slate-400 truncate">
                          {p.cityName} · {p.categories[0]}
                        </p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-xs font-semibold text-amber-400">
                        {p.distanceKm !== undefined ? `${p.distanceKm} km` : 'Near'}
                      </span>
                      <ChevronRight className="w-4 h-4 text-slate-500 ml-auto mt-0.5" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
