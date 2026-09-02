import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { Place } from '../types';
import { TrustBadge } from '../components/ui/TrustBadge';
import { Rating } from '../components/ui/Rating';
import { TagChip } from '../components/ui/TagChip';
import { GuidanceCard } from '../components/ui/GuidanceCard';
import { TravelTipCard } from '../components/ui/TravelTipCard';
import { SectionHeader } from '../components/ui/SectionHeader';
import { Button } from '../components/ui/Button';
import { PlaceCard } from '../components/ui/PlaceCard';
import {
  MapPin,
  Clock,
  DollarSign,
  Bookmark,
  Share2,
  AlertTriangle,
  CheckCircle2,
  ChevronLeft,
  Footprints,
  Camera,
  Shirt,
  ShieldCheck,
  Flag,
  Navigation,
  ThumbsUp,
  Sparkles,
  Users,
  Calendar,
  Plus
} from 'lucide-react';
import { firestoreService } from '../services/firebaseService';

export const PlaceDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isPlaceSaved, toggleSavePlace, showToast, activeTrip, setActiveTrip } = useApp();

  const [place, setPlace] = useState<Place | null>(null);
  const [nearbyPlaces, setNearbyPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);

  // Feedback form state
  const [feedbackSuccess, setFeedbackSuccess] = useState(false);
  const [feedbackHours, setFeedbackHours] = useState(true);
  const [feedbackPrice, setFeedbackPrice] = useState(true);
  const [feedbackComments, setFeedbackComments] = useState('');
  const [submittingFeedback, setSubmittingFeedback] = useState(false);

  // Report issue modal
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [reportCategory, setReportCategory] = useState<'timings' | 'pricing' | 'dress_code' | 'tout_warning' | 'other'>('timings');
  const [reportDescription, setReportDescription] = useState('');
  const [reportSubmitted, setReportSubmitted] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setFeedbackSuccess(false);

    api.getPlaceById(id)
      .then((p) => {
        setPlace(p);
        // Load nearby places in same city
        return api.getPlaces({ cityId: p.cityId });
      })
      .then((allInCity) => {
        setNearbyPlaces(allInCity.filter((p) => p.id !== id).slice(0, 3));
        setLoading(false);
      })
      .catch((e) => {
        console.error('Failed to load place', e);
        setLoading(false);
      });
  }, [id]);

  if (loading || !place) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-8">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm font-semibold text-slate-700">Loading ground truth intelligence...</p>
        </div>
      </div>
    );
  }

  const saved = isPlaceSaved(place.id);
  const isInActiveTrip = activeTrip ? activeTrip.placeIds.includes(place.id) : false;

  const handleToggleTrip = async () => {
    if (!activeTrip) {
      try {
        const created = await api.createTrip({
          title: `${place.cityName} Cultural Journey`,
          cityId: place.cityId,
          cityName: place.cityName,
          daysCount: 2,
          travelPace: 'moderate',
          placeIds: [place.id],
        });
        setActiveTrip(created);
        showToast('success', 'Trip Created', `${place.name} added to your new itinerary.`);
      } catch {
        showToast('error', 'Failed to create trip');
      }
      return;
    }

    if (isInActiveTrip) {
      const updatedItinerary = activeTrip.itinerary.filter((item) => item.placeId !== place.id);
      const updatedPlaceIds = activeTrip.placeIds.filter((id) => id !== place.id);
      const updated = await api.updateTrip(activeTrip.id, {
        itinerary: updatedItinerary,
        placeIds: updatedPlaceIds,
      });
      setActiveTrip(updated);
      showToast('info', 'Removed from Trip', `${place.name} removed from active itinerary.`);
    } else {
      const newItem = {
        id: `item-${Date.now()}`,
        dayNumber: 1,
        timeSlot: 'Morning' as const,
        startTime: '09:30',
        durationHours: place.openingHours.estimatedDurationHours || 2,
        placeId: place.id,
        placeName: place.name,
        placeImage: place.images[0],
        tip: (place.travelTips && place.travelTips[0]) || 'Explore key architectural courtyards.',
        distanceFromPrevKm: 2.5,
      };
      const updatedItinerary = [...activeTrip.itinerary, newItem];
      const updatedPlaceIds = Array.from(new Set([...activeTrip.placeIds, place.id]));
      const updated = await api.updateTrip(activeTrip.id, {
        itinerary: updatedItinerary,
        placeIds: updatedPlaceIds,
      });
      setActiveTrip(updated);
      showToast('success', 'Added to Itinerary', `${place.name} added to your active trip.`);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${place.name} - WayFinder Intelligence`,
        text: `Check out ${place.name} in ${place.cityName}: ${place.speciality}`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast('success', 'Link Copied', 'Place link copied to clipboard.');
    }
  };

  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingFeedback(true);
    try {
      await Promise.all([
        api.submitFeedback({
          placeId: place.id,
          placeName: place.name,
          isHoursAccurate: feedbackHours,
          isPriceAccurate: feedbackPrice,
          isGuidanceHelpful: true,
          comments: feedbackComments,
        }),
        firestoreService.submitFeedback({
          placeId: place.id,
          placeName: place.name,
          isHoursAccurate: feedbackHours,
          isPriceAccurate: feedbackPrice,
          isGuidanceHelpful: true,
          crowdRating: 'Moderate',
          comments: feedbackComments || 'Timing & price review submitted',
          timestamp: new Date().toISOString(),
        })
      ]);
      setFeedbackSuccess(true);
      showToast('success', 'Thank You!', 'Your feedback was logged to verify ground truth for travelers.');
    } catch {
      showToast('error', 'Feedback Submission Failed');
    } finally {
      setSubmittingFeedback(false);
    }
  };

  const handleReportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportDescription.trim()) return;
    try {
      await api.submitReport({
        placeId: place.id,
        placeName: place.name,
        category: reportCategory,
        description: reportDescription,
      });
      setReportSubmitted(true);
      showToast('info', 'Issue Logged', 'Editorial team will review this notice within 24 hours.');
      setTimeout(() => {
        setIsReportOpen(false);
        setReportSubmitted(false);
        setReportDescription('');
      }, 1800);
    } catch {
      showToast('error', 'Failed to submit report');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/60 pb-28 lg:pb-20">
      {/* Top Back Navigation Bar */}
      <div className="sticky top-16 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200 px-4 sm:px-6 lg:px-8 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-slate-950 transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleToggleTrip}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-colors cursor-pointer ${
                isInActiveTrip
                  ? 'bg-amber-500 text-slate-950 border-amber-500'
                  : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200/80'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>{isInActiveTrip ? 'In Trip Plan' : '+ Add to Trip'}</span>
            </button>
            <button
              onClick={handleShare}
              className="p-2 rounded-xl text-slate-700 hover:bg-slate-100 border border-slate-200/80 transition-colors"
              aria-label="Share place"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => toggleSavePlace(place.id)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200/80 bg-white hover:bg-slate-50 text-xs font-semibold transition-colors cursor-pointer"
            >
              <Bookmark className={`w-3.5 h-3.5 ${saved ? 'fill-amber-500 text-amber-500' : 'text-slate-500'}`} />
              <span>{saved ? 'Saved' : 'Save Place'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Hero Visual Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="relative rounded-3xl overflow-hidden shadow-md bg-slate-900 aspect-21/9 sm:aspect-21/8 min-h-[260px]">
          <img
            src={place.images[0]}
            alt={place.name}
            className="w-full h-full object-cover opacity-85"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />

          {/* Hero Content Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-8 text-white">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <TrustBadge status={place.trust.status} confidence={place.trust.confidence} className="bg-white text-slate-900 border-none shadow-sm" />
              <span className="text-xs bg-black/50 backdrop-blur-xs px-2.5 py-1 rounded-md text-amber-300 font-medium">
                {place.openingHours.estimatedDurationHours} Hours Estimated Visit
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white mb-2">
              {place.name}
            </h1>

            <div className="flex flex-wrap items-center gap-3 sm:gap-6 text-xs sm:text-sm text-slate-200">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-amber-400" />
                <span>{place.cityName}, {place.state}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Rating rating={place.rating} reviewCount={place.reviewCount} />
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-slate-300" />
                <span>Open {(place.openingHours as any).open ? `${(place.openingHours as any).open} - ${(place.openingHours as any).close}` : place.openingHours.regular}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Details Body Layout */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left 2 Columns: Core Content & Practical Guidance */}
          <div className="lg:col-span-2 space-y-8">
            {/* Overview & Speciality */}
            <section className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs">
              <h2 className="text-lg font-bold text-slate-900 mb-2">
                About this Destination
              </h2>
              <p className="text-sm text-slate-700 leading-relaxed font-normal mb-4">
                {place.description}
              </p>

              {place.speciality && (
                <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200/80 mb-4">
                  <div className="flex items-start gap-2.5">
                    <Sparkles className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-amber-900">
                        Why this destination is significant
                      </h4>
                      <p className="text-xs sm:text-sm text-amber-950 mt-0.5 leading-relaxed">
                        {place.speciality}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 pt-2">
                {place.tags.map((t, idx) => (
                  <TagChip key={idx} label={t} size="md" />
                ))}
              </div>
            </section>

            {/* Practical Cultural & Navigational Guidance */}
            <section className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs">
              <SectionHeader
                title="Practical Ground Truth Guidance"
                subtitle="Footwear etiquette, camera rules, restrooms, and verified precautions"
              />

              <div className="space-y-3 mt-4">
                {place.guidance.map((g, idx) => (
                  <GuidanceCard key={idx} guidance={g} />
                ))}
              </div>
            </section>

            {/* What Not to Miss */}
            {(((place as any).whatNotToMiss && (place as any).whatNotToMiss.length > 0) || (place.culture.sacredRules && place.culture.sacredRules.length > 0)) && (
              <section className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs">
                <SectionHeader
                  title="Key Highlights & Etiquette Rules"
                  subtitle="Architectural highlights and sacred norms inside"
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                  {((place as any).whatNotToMiss || place.culture.sacredRules || []).map((item: string, idx: number) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-3"
                    >
                      <div className="w-6 h-6 rounded-full bg-slate-900 text-amber-400 flex items-center justify-center text-xs font-bold shrink-0">
                        {idx + 1}
                      </div>
                      <p className="text-xs sm:text-sm text-slate-800 font-medium leading-relaxed">
                        {item}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Insider Tips */}
            {((place.travelTips && place.travelTips.length > 0) || ((place as any).tips && (place as any).tips.length > 0)) && (
              <section className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs">
                <SectionHeader
                  title="Curated Insider Tips"
                  subtitle="Advice from local cultural custodians and verified travelers"
                />
                <div className="space-y-3 mt-3">
                  {(place.travelTips || (place as any).tips || []).map((tip: string, idx: number) => (
                    <TravelTipCard key={idx} tip={tip} source={place.trust.sourceType} />
                  ))}
                </div>
              </section>
            )}

            {/* Community Accuracy Verification Form */}
            <section className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs">
              <div className="flex items-center justify-between gap-2 mb-3">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Help Keep Ground Truth Accurate
                  </h3>
                  <p className="text-xs text-slate-500">
                    Did you visit recently? Confirm details to support fellow travelers.
                  </p>
                </div>
                <button
                  onClick={() => setIsReportOpen(true)}
                  className="text-xs font-semibold text-rose-600 hover:text-rose-800 flex items-center gap-1 cursor-pointer"
                >
                  <Flag className="w-3.5 h-3.5" />
                  Report Change
                </button>
              </div>

              {feedbackSuccess ? (
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Thank you! Your verification contributes to real-time traveler intelligence.</span>
                </div>
              ) : (
                <form onSubmit={handleFeedbackSubmit} className="space-y-3 pt-2">
                  <div className="flex flex-wrap gap-4 text-xs font-medium text-slate-700">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={feedbackHours}
                        onChange={(e) => setFeedbackHours(e.target.checked)}
                        className="rounded text-slate-900"
                      />
                      <span>Opening hours were accurate ({(place.openingHours as any).open ? `${(place.openingHours as any).open} - ${(place.openingHours as any).close}` : place.openingHours.regular})</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={feedbackPrice}
                        onChange={(e) => setFeedbackPrice(e.target.checked)}
                        className="rounded text-slate-900"
                      />
                      <span>Entry fee was accurate (₹{place.estimatedCost.foreignNational})</span>
                    </label>
                  </div>

                  <input
                    type="text"
                    value={feedbackComments}
                    onChange={(e) => setFeedbackComments(e.target.value)}
                    placeholder="Optional note: e.g. Cloakroom was moved near East Gate..."
                    className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-1 focus:ring-slate-900"
                  />

                  <Button
                    type="submit"
                    variant="secondary"
                    size="sm"
                    loading={submittingFeedback}
                  >
                    Submit Traveler Verification
                  </Button>
                </form>
              )}
            </section>
          </div>

          {/* Right Column: Ground Truth Quick Card & Logistics */}
          <div className="space-y-6">
            {/* Quick Logistics Box */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs sticky top-28 space-y-5">
              <h3 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-100 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                Ground Truth Summary
              </h3>

              {/* Timings */}
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Operating Hours
                </span>
                <p className="text-sm font-semibold text-slate-900">
                  {(place.openingHours as any).open ? `${(place.openingHours as any).open} – ${(place.openingHours as any).close}` : place.openingHours.regular}
                </p>
                <p className="text-xs text-slate-500 mt-0.5">
                  Best visiting time: <strong className="text-slate-800">{place.openingHours.bestTime || (place.openingHours as any).bestTimeOfDay || 'Early Morning'}</strong>
                </p>
              </div>

              {/* Pricing */}
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Verified Entry Ticket
                </span>
                <div className="flex items-center justify-between text-xs sm:text-sm py-1 border-b border-slate-100">
                  <span className="text-slate-600">Foreign National:</span>
                  <span className="font-bold text-slate-900">₹{place.estimatedCost.foreignNational}</span>
                </div>
                <div className="flex items-center justify-between text-xs sm:text-sm py-1">
                  <span className="text-slate-600">Indian Citizen:</span>
                  <span className="font-bold text-slate-900">₹{place.estimatedCost.indianCitizen}</span>
                </div>
                {place.estimatedCost.note && (
                  <p className="text-[11px] text-slate-500 mt-1">
                    {place.estimatedCost.note}
                  </p>
                )}
              </div>

              {/* Crowd Rhythm */}
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Crowd Rhythm
                </span>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-slate-500" />
                  <span className="text-xs font-semibold text-slate-800">
                    Quiet in early mornings · Peaks 11:30 AM–3:00 PM
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 flex flex-col gap-2.5">
                <Button
                  variant={isInActiveTrip ? "outline" : "primary"}
                  size="md"
                  onClick={handleToggleTrip}
                  className={`w-full ${isInActiveTrip ? 'border-amber-500 text-amber-900 bg-amber-50' : 'bg-slate-900 hover:bg-slate-800 text-white'}`}
                >
                  <Calendar className="w-4 h-4 text-amber-400" />
                  {isInActiveTrip ? 'In Active Trip (Tap to Remove)' : 'Add to My Trip Plan'}
                </Button>

                <Button
                  variant="outline"
                  size="md"
                  onClick={() => navigate(`/assistant?q=${encodeURIComponent(`Give me a detailed plan and insider tips for visiting ${place.name} in ${place.cityName}`)}`)}
                  className="w-full"
                >
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  Ask AI About {place.name}
                </Button>

                <Button
                  variant="outline"
                  size="md"
                  onClick={() => navigate(`/fair-price?dest=${encodeURIComponent(place.name)}`)}
                  className="w-full"
                >
                  <DollarSign className="w-4 h-4 text-emerald-600" />
                  Check Auto Fare to Here
                </Button>
              </div>
            </div>

            {/* Nearby Highlights in same city */}
            {nearbyPlaces.length > 0 && (
              <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs">
                <h4 className="text-sm font-bold text-slate-900 mb-3">
                  Also in {place.cityName}
                </h4>
                <div className="space-y-3">
                  {nearbyPlaces.map((np) => (
                    <div
                      key={np.id}
                      onClick={() => navigate(`/place/${np.id}`)}
                      className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer group"
                    >
                      <img
                        src={np.images[0]}
                        alt={np.name}
                        className="w-12 h-12 rounded-lg object-cover shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h5 className="text-xs font-bold text-slate-900 truncate group-hover:text-amber-700 transition-colors">
                          {np.name}
                        </h5>
                        <p className="text-[11px] text-slate-500 truncate">
                          {np.openingHours.estimatedDurationHours}h · ₹{np.estimatedCost.foreignNational}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Report Issue Modal */}
      {isReportOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-1">
              Report Correction for {place.name}
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Help us maintain verified data standards.
            </p>

            {reportSubmitted ? (
              <div className="p-4 rounded-xl bg-emerald-50 text-emerald-800 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Notice recorded. Thank you for keeping traveler intelligence accurate.</span>
              </div>
            ) : (
              <form onSubmit={handleReportSubmit} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Issue Category
                  </label>
                  <select
                    value={reportCategory}
                    onChange={(e) => setReportCategory(e.target.value as any)}
                    className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 text-slate-900"
                  >
                    <option value="timings">Changed Opening/Closing Hours</option>
                    <option value="pricing">Ticket Price Update</option>
                    <option value="dress_code">Dress Code or Footwear Rule Update</option>
                    <option value="tout_warning">New Tout or Scam Pattern</option>
                    <option value="other">Other Correction</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Details
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={reportDescription}
                    onChange={(e) => setReportDescription(e.target.value)}
                    placeholder="Describe the update (e.g. Foreign ticket is now ₹550, or shoes must be deposited at Cloakroom 2)..."
                    className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 text-slate-900 focus:ring-1 focus:ring-slate-900"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsReportOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    size="sm"
                  >
                    Submit Report
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
