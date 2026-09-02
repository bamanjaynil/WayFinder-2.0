import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { Trip, TripItineraryItem, Place } from '../types';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { SectionHeader } from '../components/ui/SectionHeader';
import {
  Calendar,
  Clock,
  MapPin,
  Zap,
  Plus,
  Trash2,
  ChevronRight,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Share2,
  Printer,
  CheckCircle2,
  CloudCheck,
  FolderOpen
} from 'lucide-react';

export const TripsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { currentCity, cities, activeTrip, setActiveTrip, saveTripToCloud, userTrips, showToast, user } = useApp();

  const [trip, setTrip] = useState<Trip | null>(activeTrip);
  const [selectedDay, setSelectedDay] = useState<number>(1);
  const [availablePlaces, setAvailablePlaces] = useState<Place[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isSwitchTripModalOpen, setIsSwitchTripModalOpen] = useState(false);
  const [optimizing, setOptimizing] = useState(false);
  const [optimizationResult, setOptimizationResult] = useState<{ timeSaved: number; explanation: string } | null>(null);

  // New Trip form state
  const [newTitle, setNewTitle] = useState(`${currentCity.name} Highlights Journey`);
  const [newDays, setNewDays] = useState(2);
  const [newPace, setNewPace] = useState<'relaxed' | 'moderate' | 'packed'>('moderate');

  useEffect(() => {
    // Load places for current city
    api.getPlaces({ cityId: currentCity.id }).then(setAvailablePlaces);
  }, [currentCity.id]);

  useEffect(() => {
    if (id) {
      api.getTrip(id).then((t) => {
        if (t) {
          setTrip(t);
          setActiveTrip(t);
        }
      });
    } else if (activeTrip) {
      setTrip(activeTrip);
    }
  }, [id, activeTrip]);

  // Auto trigger optimize if query param present
  useEffect(() => {
    if (searchParams.get('optimize') === 'true' && trip) {
      handleOptimizeDay();
    }
  }, [searchParams, trip?.id]);

  const handleCreateTrip = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const placesInCity = availablePlaces.slice(0, newDays * 3).map((p) => p.id);
      const created = await api.createTrip({
        title: newTitle,
        cityId: currentCity.id,
        cityName: currentCity.name,
        daysCount: newDays,
        travelPace: newPace,
        placeIds: placesInCity,
      });

      setTrip(created);
      await saveTripToCloud(created);
      setIsCreateModalOpen(false);
      showToast('success', 'Trip Created & Synced', `${created.title} generated with smart pacing.`);
    } catch {
      showToast('error', 'Failed to create trip');
    }
  };

  const handleOptimizeDay = async () => {
    if (!trip) return;
    setOptimizing(true);
    setOptimizationResult(null);
    try {
      const res = await api.optimizeItinerary(trip.id);
      setTrip(res.trip);
      await saveTripToCloud(res.trip);
      setOptimizationResult({
        timeSaved: res.travelTimeSavedMin,
        explanation: res.explanation,
      });
      showToast('success', 'Route Optimized', `Saved ~${res.travelTimeSavedMin} min of transit time!`);
    } catch {
      showToast('error', 'Optimization failed');
    } finally {
      setOptimizing(false);
    }
  };

  const handleAddPlaceToDay = async (place: Place) => {
    if (!trip) return;
    const newItem: TripItineraryItem = {
      id: `item-${Date.now()}`,
      dayNumber: selectedDay,
      timeSlot: 'Afternoon',
      startTime: '14:30',
      durationHours: place.openingHours.estimatedDurationHours || 2,
      placeId: place.id,
      placeName: place.name,
      placeImage: place.images[0],
      tip: (place.travelTips && place.travelTips[0]) || 'Explore key architectural courtyards.',
      distanceFromPrevKm: 2.4,
    };

    const updatedItinerary = [...trip.itinerary, newItem];
    const updatedPlaceIds = Array.from(new Set([...trip.placeIds, place.id]));

    const updated = await api.updateTrip(trip.id, {
      itinerary: updatedItinerary,
      placeIds: updatedPlaceIds,
    });

    setTrip(updated);
    await saveTripToCloud(updated);
    setIsAddModalOpen(false);
    showToast('success', 'Added to Itinerary', place.name);
  };

  const handleRemoveItem = async (itemId: string) => {
    if (!trip) return;
    const updatedItinerary = trip.itinerary.filter((item) => item.id !== itemId);
    const updated = await api.updateTrip(trip.id, { itinerary: updatedItinerary });
    setTrip(updated);
    await saveTripToCloud(updated);
    showToast('info', 'Stop removed from schedule');
  };

  // Day filter
  const dayItems = trip ? trip.itinerary.filter((item) => item.dayNumber === selectedDay) : [];

  return (
    <div className="min-h-screen bg-slate-50/60 pb-24 lg:pb-16">
      {/* Top Header */}
      <div className="bg-white border-b border-slate-200/80 px-4 sm:px-6 lg:px-8 py-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-700">
                Itinerary & Trip Architect
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                <CheckCircle2 className="w-3 h-3" />
                {user.isGuest ? 'Local Saved' : 'Firestore Synced'}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {trip ? trip.title : 'Personalized Itineraries'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              <span>{trip ? `${trip.cityName} (${trip.daysCount} Days)` : `${currentCity.name} Destination`}</span>
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            {userTrips.length > 1 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsSwitchTripModalOpen(true)}
              >
                <FolderOpen className="w-3.5 h-3.5" />
                My Trips ({userTrips.length})
              </Button>
            )}

            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setNewTitle(`${currentCity.name} Highlights Journey`);
                setIsCreateModalOpen(true);
              }}
            >
              <Plus className="w-3.5 h-3.5" />
              New Trip
            </Button>

            <Button
              variant="primary"
              size="sm"
              loading={optimizing}
              onClick={handleOptimizeDay}
              disabled={!trip || trip.itinerary.length < 2}
            >
              <Zap className="w-3.5 h-3.5 text-amber-300" />
              Optimize Transit
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Optimization Banner if run */}
        {optimizationResult && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 mt-0.5">
              <Zap className="w-4 h-4" />
            </div>
            <div className="flex-1 text-xs sm:text-sm">
              <h4 className="font-bold text-emerald-950">
                Itinerary Geographically Optimized (Saved ~{optimizationResult.timeSaved} mins)
              </h4>
              <p className="mt-0.5 text-emerald-800 leading-relaxed">
                {optimizationResult.explanation}
              </p>
            </div>
          </div>
        )}

        {/* Main Day Tabs & Schedule */}
        {trip ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: Schedule List */}
            <div className="lg:col-span-2 space-y-4">
              {/* Day Selector */}
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2">
                {Array.from({ length: trip.daysCount }, (_, i) => i + 1).map((dayNum) => {
                  const isSelected = selectedDay === dayNum;
                  const countForDay = trip.itinerary.filter((it) => it.dayNumber === dayNum).length;
                  return (
                    <button
                      key={dayNum}
                      onClick={() => setSelectedDay(dayNum)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-slate-900 text-white shadow-sm'
                          : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200/80'
                      }`}
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Day {dayNum}</span>
                      <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${isSelected ? 'bg-slate-800 text-amber-400' : 'bg-slate-100 text-slate-600'}`}>
                        {countForDay} stops
                      </span>
                    </button>
                  );
                })}

                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-semibold bg-amber-500/10 text-amber-900 border border-amber-500/20 hover:bg-amber-500/20 transition-all cursor-pointer shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Stop</span>
                </button>
              </div>

              {/* Day Stops Timeline */}
              {dayItems.length === 0 ? (
                <div className="p-8 rounded-2xl bg-white border border-slate-200 text-center space-y-3">
                  <Clock className="w-8 h-8 text-slate-300 mx-auto" />
                  <h4 className="text-sm font-bold text-slate-800">No stops scheduled for Day {selectedDay}</h4>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    Add top monuments, heritage stepwells, or food trails from {trip.cityName} to plan your day.
                  </p>
                  <Button size="sm" variant="primary" onClick={() => setIsAddModalOpen(true)}>
                    <Plus className="w-3.5 h-3.5" /> Add Stop to Day {selectedDay}
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {dayItems.map((item, idx) => (
                    <div
                      key={item.id}
                      className="group p-4 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 transition-all flex items-start gap-3.5 shadow-2xs"
                    >
                      <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200/60">
                        <img
                          src={item.placeImage}
                          alt={item.placeName}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          loading="lazy"
                        />
                        <div className="absolute top-1 left-1 px-1.5 py-0.5 rounded-md bg-slate-900/80 backdrop-blur-xs text-white text-[9px] font-bold">
                          #{idx + 1}
                        </div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wide">
                              {item.timeSlot || 'Scheduled Stop'} · {item.startTime || '09:00 AM'}
                            </span>
                            <h3
                              onClick={() => navigate(`/places/${item.placeId}`)}
                              className="text-sm sm:text-base font-bold text-slate-900 hover:text-amber-600 transition-colors cursor-pointer truncate"
                            >
                              {item.placeName}
                            </h3>
                          </div>

                          <button
                            onClick={() => handleRemoveItem(item.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            aria-label="Remove stop"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        {item.tip && (
                          <p className="text-xs text-slate-600 mt-1 line-clamp-2">
                            💡 {item.tip}
                          </p>
                        )}

                        <div className="flex items-center gap-3 mt-2 text-[11px] text-slate-500">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-slate-400" />
                            ~{item.durationHours || 2} hrs dwell time
                          </span>
                          {item.distanceFromPrevKm ? (
                            <span className="flex items-center gap-1 text-slate-400">
                              · ~{item.distanceFromPrevKm} km transit
                            </span>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Right: Trip Intelligence & Tips */}
            <div className="space-y-4">
              <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-4">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Itinerary Pacing Intelligence</span>
                </h3>

                <div className="space-y-2.5 text-xs text-slate-600">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-2">
                    <span className="text-amber-500 font-bold">1.</span>
                    <span><strong>Hydration & Sun</strong>: Visit high-elevation fort courtyards early in the morning before midday heat.</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-2">
                    <span className="text-amber-500 font-bold">2.</span>
                    <span><strong>Footwear Advisory</strong>: Carry clean socks for temple marble courtyards where outdoor footwear is restricted.</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-2">
                    <span className="text-amber-500 font-bold">3.</span>
                    <span><strong>Transit Safety</strong>: Auto-rickshaw rates should be verified with the WayFinder Fair Price tool before boarding.</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => navigate(`/assistant?q=${encodeURIComponent(`Give me a detailed day-by-day practical briefing for visiting ${trip.cityName} with focus on crowd management and best food stops.`)}`)}
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    Ask AI Day Briefing
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-12 rounded-3xl bg-white border border-slate-200 text-center space-y-4 max-w-lg mx-auto">
            <Calendar className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-lg font-bold text-slate-900">Plan your India Journey</h3>
            <p className="text-xs sm:text-sm text-slate-500">
              Create custom itineraries with smart route optimization, dwell time estimation, and cultural warnings.
            </p>
            <Button
              variant="primary"
              size="md"
              onClick={() => setIsCreateModalOpen(true)}
            >
              <Plus className="w-4 h-4" /> Create New Trip
            </Button>
          </div>
        )}
      </div>

      {/* Add Place Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title={`Add Stop to Day ${selectedDay}`}
        subtitle={`Select places in ${trip?.cityName || currentCity.name} to add to your itinerary.`}
        maxWidth="md"
      >
        <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
          {availablePlaces.map((p) => {
            const alreadyAdded = trip?.placeIds.includes(p.id);
            return (
              <div
                key={p.id}
                onClick={() => handleAddPlaceToDay(p)}
                className="group flex items-center gap-3 p-3 rounded-xl border border-slate-200 hover:border-slate-400 hover:bg-slate-50 transition-all cursor-pointer"
              >
                <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0 bg-slate-100">
                  <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" loading="lazy" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate">{p.name}</h4>
                  <p className="text-[11px] text-slate-500 truncate">{p.speciality}</p>
                </div>
                <Button size="xs" variant={alreadyAdded ? "outline" : "primary"}>
                  <Plus className="w-3 h-3" /> Add
                </Button>
              </div>
            );
          })}
        </div>
      </Modal>

      {/* Create Trip Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Journey"
        subtitle={`Generate a structured itinerary for ${currentCity.name}.`}
        maxWidth="md"
      >
        <form onSubmit={handleCreateTrip} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Trip Title</label>
            <input
              type="text"
              required
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm text-slate-900 focus:ring-2 focus:ring-slate-900"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Duration (Days)</label>
              <select
                value={newDays}
                onChange={(e) => setNewDays(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-medium text-slate-900 bg-white"
              >
                <option value={1}>1 Day (Express)</option>
                <option value={2}>2 Days (Weekend)</option>
                <option value={3}>3 Days (Deep Dive)</option>
                <option value={4}>4 Days (Relaxed)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Pacing Style</label>
              <select
                value={newPace}
                onChange={(e) => setNewPace(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-medium text-slate-900 bg-white"
              >
                <option value="relaxed">Relaxed (1-2 stops/day)</option>
                <option value="moderate">Moderate (3-4 stops/day)</option>
                <option value="packed">Packed (5+ stops/day)</option>
              </select>
            </div>
          </div>

          <div className="pt-2">
            <Button type="submit" variant="primary" size="md" className="w-full">
              Generate & Save Trip
            </Button>
          </div>
        </form>
      </Modal>

      {/* Switch Trip Modal */}
      <Modal
        isOpen={isSwitchTripModalOpen}
        onClose={() => setIsSwitchTripModalOpen(false)}
        title="Your Saved Trips in Cloud"
        subtitle="Switch between active itineraries saved to your Firebase account."
        maxWidth="md"
      >
        <div className="space-y-2.5 max-h-[50vh] overflow-y-auto pr-1">
          {userTrips.map((t) => (
            <div
              key={t.id}
              onClick={() => {
                setTrip(t);
                setActiveTrip(t);
                setIsSwitchTripModalOpen(false);
                showToast('info', 'Loaded Trip', t.title);
              }}
              className="p-3.5 rounded-xl border border-slate-200 hover:border-slate-900 hover:bg-slate-50 transition-all cursor-pointer flex items-center justify-between"
            >
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900">{t.title}</h4>
                <p className="text-[11px] text-slate-500">{t.cityName} · {t.daysCount} Days · {t.itinerary.length} Stops</p>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </div>
          ))}
        </div>
      </Modal>
    </div>
  );
};
