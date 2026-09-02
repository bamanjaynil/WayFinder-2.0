import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { useApp } from '../../context/AppContext';
import { CityId, CityInfo } from '../../types';
import { MapPin, Check, Search, Navigation, Sparkles } from 'lucide-react';

export const CitySelectorModal: React.FC = () => {
  const {
    isCityModalOpen,
    setIsCityModalOpen,
    cities,
    currentCity,
    setCurrentCityId,
    requestUserLocation,
    userLocation,
    showToast
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string>('All');
  const [detectingGps, setDetectingGps] = useState(false);

  const regions = ['All', 'North', 'South', 'West', 'East', 'Central', 'Northeast'];

  const handleSelect = (cityId: CityId) => {
    setCurrentCityId(cityId);
    setIsCityModalOpen(false);
  };

  const handleDetectLocation = async () => {
    setDetectingGps(true);
    try {
      await requestUserLocation();
      showToast('success', 'Location Detected', 'Set destination based on closest geographic proximity.');
    } catch {
      showToast('info', 'Location Notice', 'Could not retrieve exact GPS. Select your city manually below.');
    } finally {
      setDetectingGps(false);
    }
  };

  const filteredCities = cities.filter((city: CityInfo) => {
    const matchesRegion =
      selectedRegion === 'All' ||
      (city.region && city.region.toLowerCase() === selectedRegion.toLowerCase());

    const q = searchQuery.toLowerCase().trim();
    if (!q) return matchesRegion;

    const matchesName = city.name.toLowerCase().includes(q);
    const matchesState = city.state.toLowerCase().includes(q);
    const matchesTagline = (city.tagline || '').toLowerCase().includes(q);
    const matchesPopular = city.popularFor.some((item) => item.toLowerCase().includes(q));

    return matchesRegion && (matchesName || matchesState || matchesTagline || matchesPopular);
  });

  return (
    <Modal
      isOpen={isCityModalOpen}
      onClose={() => setIsCityModalOpen(false)}
      title="Select Destination City in India"
      subtitle="Explore verified travel intelligence, monument timings, tariffs, and cultural guides tailored to each city."
      maxWidth="lg"
    >
      <div className="space-y-4 pt-1">
        {/* Search Bar and GPS Button */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by city, state, or landmark (e.g. Jaipur, Golden Temple)..."
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 bg-slate-50/70 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-xs text-slate-400 hover:text-slate-600"
              >
                Clear
              </button>
            )}
          </div>

          <button
            onClick={handleDetectLocation}
            disabled={detectingGps}
            className="flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-900 border border-amber-500/30 text-xs font-bold transition-all shrink-0 cursor-pointer disabled:opacity-50"
          >
            <Navigation className={`w-3.5 h-3.5 text-amber-700 ${detectingGps ? 'animate-spin' : ''}`} />
            <span>{detectingGps ? 'Detecting...' : userLocation ? 'GPS Updated' : 'Detect GPS City'}</span>
          </button>
        </div>

        {/* Region Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
          {regions.map((region) => {
            const isSelected = selectedRegion === region;
            return (
              <button
                key={region}
                onClick={() => setSelectedRegion(region)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {region}
              </button>
            );
          })}
        </div>

        {/* City Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[56vh] overflow-y-auto pr-1">
          {filteredCities.length === 0 ? (
            <div className="col-span-full py-12 text-center text-slate-500 text-xs">
              No cities match "{searchQuery}". Try searching for another region or keyword.
            </div>
          ) : (
            filteredCities.map((city: CityInfo) => {
              const selected = city.id === currentCity.id;
              return (
                <div
                  key={city.id}
                  id={`city-option-${city.id}`}
                  onClick={() => handleSelect(city.id)}
                  className={`group relative flex items-start gap-3 p-3 rounded-2xl border transition-all cursor-pointer ${
                    selected
                      ? 'border-slate-900 bg-slate-900 text-white shadow-sm ring-1 ring-slate-900'
                      : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/80 shadow-2xs'
                  }`}
                >
                  <div className="relative w-14 h-14 rounded-xl overflow-hidden shrink-0 bg-slate-100 border border-slate-200/50">
                    <img
                      src={city.image}
                      alt={city.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <h4 className={`text-sm font-bold truncate ${selected ? 'text-white' : 'text-slate-900'}`}>
                        {city.name}
                      </h4>
                      {selected ? (
                        <span className="flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-amber-400 text-slate-950">
                          <Check className="w-3 h-3" /> Active
                        </span>
                      ) : city.region ? (
                        <span className="text-[10px] text-slate-400 font-semibold">
                          {city.region}
                        </span>
                      ) : null}
                    </div>

                    <p className={`text-xs truncate ${selected ? 'text-slate-300' : 'text-slate-500'}`}>
                      {city.state}
                    </p>

                    <p className={`text-[11px] truncate mt-1 ${selected ? 'text-amber-300' : 'text-amber-700 font-medium'}`}>
                      {city.popularFor.slice(0, 3).join(' · ')}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </Modal>
  );
};
