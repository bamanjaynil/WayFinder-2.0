import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { Place, TravelUpdate } from '../types';
import { PlaceCard } from '../components/ui/PlaceCard';
import { SectionHeader } from '../components/ui/SectionHeader';
import { Button } from '../components/ui/Button';
import { SearchBar } from '../components/ui/SearchBar';
import {
  MapPin,
  Sparkles,
  Calendar,
  Clock,
  ArrowRight,
  ShieldCheck,
  BadgeAlert,
  Compass,
  DollarSign,
  BookOpen,
  Volume2,
  AlertTriangle,
  Flame,
  CheckCircle
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { currentCity, user, activeTrip, setIsCityModalOpen, setIsOnboardingOpen } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [recommendedPlaces, setRecommendedPlaces] = useState<Place[]>([]);
  const [nearbyPlaces, setNearbyPlaces] = useState<Place[]>([]);
  const [travelUpdates, setTravelUpdates] = useState<TravelUpdate[]>([]);
  const [loading, setLoading] = useState(true);

  // Time-based greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    Promise.all([
      api.getRecommendations({
        cityId: currentCity.id,
        interests: user.preferences.interests,
        priority: user.preferences.priority,
        lat: currentCity.coordinates.lat,
        lng: currentCity.coordinates.lng,
      }),
      api.getPlaces({ cityId: currentCity.id }),
      api.getTravelUpdates(currentCity.id),
    ])
      .then(([recs, places, updates]) => {
        if (!isMounted) return;
        setRecommendedPlaces(recs.slice(0, 4));
        setNearbyPlaces(places.slice(0, 6));
        setTravelUpdates(updates);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Home load error:', err);
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [currentCity.id, user.preferences]);

  const handleSearchSubmit = (q: string) => {
    if (q.trim()) {
      navigate(`/search?q=${encodeURIComponent(q.trim())}`);
    }
  };

  const topLandmark = currentCity.popularFor[0] || 'the main sights';
  const quickAssistantPrompts = [
    { label: `Should I visit ${topLandmark} now?`, query: `Should I visit ${topLandmark} in ${currentCity.name} right now? What are current timings and crowd levels?` },
    { label: `What should I avoid in ${currentCity.name}?`, query: `What common tourist pitfalls, scams, or tout situations should I avoid in ${currentCity.name}?` },
    { label: `Authentic local food & tea`, query: `Where can I find clean, authentic local food and chai in ${currentCity.name}?` },
    { label: `Dress code & shoe etiquette`, query: `What are the exact footwear, head-covering, and clothing rules for heritage sites in ${currentCity.name}?` },
  ];

  return (
    <div className="min-h-screen bg-slate-50/60 pb-24 lg:pb-16">
      {/* Top Hero Command Center */}
      <section className="bg-slate-900 text-white pt-8 pb-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Header Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-1">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                Tourism Intelligence Radar
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                {getGreeting()}, {user.name}
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 mt-1">
                Navigating {currentCity.name} with verified ground truth & cultural context.
              </p>
            </div>

            {/* City Switch Badge */}
            <button
              onClick={() => setIsCityModalOpen(true)}
              className="self-start sm:self-auto flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 backdrop-blur-xs text-xs font-semibold transition-all cursor-pointer"
            >
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              <span>Current City: <strong>{currentCity.name}</strong></span>
              <span className="text-slate-400 text-[11px] underline ml-1">Change</span>
            </button>
          </div>

          {/* Unified Search Input */}
          <div className="max-w-3xl mb-6">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              onSearch={handleSearchSubmit}
              placeholder={`Search heritage, vegetarian food, quiet spots in ${currentCity.name}...`}
              cityName={currentCity.name}
              className="shadow-xl"
            />
          </div>

          {/* Quick AI Prompt Pills */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            <span className="text-[11px] font-semibold text-slate-400 uppercase shrink-0 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-400" />
              Ask AI:
            </span>
            {quickAssistantPrompts.map((p, idx) => (
              <button
                key={idx}
                onClick={() => navigate(`/assistant?q=${encodeURIComponent(p.query)}`)}
                className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 border border-white/10 text-slate-200 text-xs font-medium shrink-0 whitespace-nowrap transition-colors cursor-pointer"
              >
                "{p.label}"
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        {/* Active Trip & Today's Schedule Card */}
        {activeTrip && activeTrip.cityId === currentCity.id && activeTrip.itinerary.length > 0 && (
          <section className="bg-white rounded-2xl border border-slate-200/90 shadow-md p-5 sm:p-6 mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-700 flex items-center justify-center font-bold">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-700">
                      Your Active Itinerary
                    </span>
                    <span className="text-xs text-slate-400">· Day 1 of {activeTrip.daysCount}</span>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900">
                    {activeTrip.title}
                  </h3>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate(`/trips/${activeTrip.id}`)}
                >
                  View Full Trip Plan
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => navigate(`/trips/${activeTrip.id}?optimize=true`)}
                >
                  ⚡ Optimize Day
                </Button>
              </div>
            </div>

            {/* Today's Timeline Slot Items */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-4">
              {activeTrip.itinerary.slice(0, 3).map((item, idx) => (
                <div
                  key={item.id || idx}
                  onClick={() => navigate(`/place/${item.placeId}`)}
                  className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200/70 hover:border-slate-300 transition-all cursor-pointer group"
                >
                  <img
                    src={item.placeImage}
                    alt={item.placeName}
                    className="w-12 h-12 rounded-lg object-cover shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-medium">
                      <Clock className="w-3 h-3 text-amber-600" />
                      <span>{item.timeSlot} · {item.startTime}</span>
                    </div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate group-hover:text-amber-700 transition-colors">
                      {item.placeName}
                    </h4>
                    {item.tip && (
                      <p className="text-[11px] text-slate-500 truncate mt-0.5">
                        💡 {item.tip}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Quick Tools Grid */}
        <section className="mb-10">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div
              onClick={() => navigate('/fair-price')}
              className="flex items-center gap-3 p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md hover:border-slate-300 transition-all cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 group-hover:bg-emerald-100 transition-colors">
                <DollarSign className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate">Fair Price Check</h4>
                <p className="text-[11px] text-slate-500 truncate">Auto & Taxi tariff guide</p>
              </div>
            </div>

            <div
              onClick={() => navigate('/culture')}
              className="flex items-center gap-3 p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md hover:border-slate-300 transition-all cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center shrink-0 group-hover:bg-indigo-100 transition-colors">
                <BookOpen className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate">Cultural Etiquette</h4>
                <p className="text-[11px] text-slate-500 truncate">Temples, dress & norms</p>
              </div>
            </div>

            <div
              onClick={() => navigate('/phrasebook')}
              className="flex items-center gap-3 p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md hover:border-slate-300 transition-all cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0 group-hover:bg-amber-100 transition-colors">
                <Volume2 className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate">Local Phrases</h4>
                <p className="text-[11px] text-slate-500 truncate">Pronunciation & audio</p>
              </div>
            </div>

            <div
              onClick={() => navigate('/safety')}
              className="flex items-center gap-3 p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md hover:border-slate-300 transition-all cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center shrink-0 group-hover:bg-rose-100 transition-colors">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate">Safety Center</h4>
                <p className="text-[11px] text-slate-500 truncate">112 Helpline & Contacts</p>
              </div>
            </div>
          </div>
        </section>

        {/* Recommended For You Section */}
        <section className="mb-10">
          <SectionHeader
            title="Recommended for Your Travel Style"
            subtitle={`Curated for ${user.preferences.companion} traveler interested in ${user.preferences.interests.slice(0, 2).join(' & ')}`}
            actionText="View all in Explore"
            onAction={() => navigate('/explore')}
            badge="Tailored"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {recommendedPlaces.map((place) => (
              <PlaceCard key={place.id} place={place} />
            ))}
          </div>
        </section>

        {/* Travel Updates / Ground Truth Advisories */}
        {travelUpdates.length > 0 && (
          <section className="mb-10">
            <SectionHeader
              title="Verified Travel Updates"
              subtitle="Latest monument timings, advisories, and operational notices"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {travelUpdates.map((update) => (
                <div
                  key={update.id}
                  className="flex items-start gap-3.5 p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs"
                >
                  <div className={`p-2 rounded-xl shrink-0 ${
                    update.importance === 'high' ? 'bg-rose-50 text-rose-700' : 'bg-sky-50 text-sky-700'
                  }`}>
                    <BadgeAlert className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-[11px] font-semibold text-slate-500 uppercase">
                        {update.cityName} · {update.date}
                      </span>
                      <span className="text-[11px] text-slate-400 font-medium">
                        {update.sourceLabel}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 leading-snug mb-1">
                      {update.title}
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {update.summary}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Popular Nearby Places Section */}
        <section className="mb-12">
          <SectionHeader
            title={`Top Highlights in ${currentCity.name}`}
            subtitle="Verified monuments, viewpoints, and cultural experiences"
            actionText="Explore interactive Map"
            onAction={() => navigate('/compass')}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {nearbyPlaces.map((place) => (
              <PlaceCard key={place.id} place={place} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};
