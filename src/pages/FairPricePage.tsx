import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { FairPriceItem } from '../types';
import { Button } from '../components/ui/Button';
import { SectionHeader } from '../components/ui/SectionHeader';
import {
  DollarSign,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  Bus,
  MapPin,
  Car,
  UserCheck,
  Sailboat,
  ShoppingBag,
  Sparkles
} from 'lucide-react';

export const FairPricePage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { currentCity } = useApp();

  const initialDest = searchParams.get('dest') || '';

  // Calculator inputs
  const [serviceType, setServiceType] = useState<'auto_rickshaw' | 'taxi' | 'monument_guide' | 'boat_ride'>('auto_rickshaw');
  const [quotedAmount, setQuotedAmount] = useState<string>('250');
  const [distanceKm, setDistanceKm] = useState<number>(6);
  const [origin, setOrigin] = useState('Current Location / Hotel');
  const [destination, setDestination] = useState(initialDest || 'Amber Fort');

  // Calculation output state
  const [result, setResult] = useState<any>(null);
  const [calculating, setCalculating] = useState(false);

  // Reference items
  const [referenceItems, setReferenceItems] = useState<FairPriceItem[]>([]);

  useEffect(() => {
    api.getFairPrices(currentCity.id).then(setReferenceItems);
  }, [currentCity.id]);

  const handleCalculate = async () => {
    const quote = parseFloat(quotedAmount);
    if (isNaN(quote) || quote < 0) return;

    setCalculating(true);
    try {
      const data = await api.calculateFairPrice({
        cityId: currentCity.id,
        serviceType,
        quotedAmount: quote,
        distanceKm,
      });
      setResult(data);
    } catch {
      // Fallback
    } finally {
      setCalculating(false);
    }
  };

  useEffect(() => {
    handleCalculate();
  }, [serviceType, quotedAmount, distanceKm, currentCity.id]);

  return (
    <div className="min-h-screen bg-slate-50/60 pb-24 lg:pb-16">
      {/* Top Header */}
      <div className="bg-white border-b border-slate-200/80 px-4 sm:px-6 lg:px-8 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                Fair Price & Tariff Intelligence
              </h1>
              <p className="text-xs sm:text-sm text-slate-500">
                Check driver quotes against verified local rates, metered formulas, and get polite counter-phrases.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Interactive Calculator + Reference Tariffs */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Interactive Calculator (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-6">
          <SectionHeader
            title="Interactive Fare & Service Quote Check"
            subtitle={`Evaluating tariffs for ${currentCity.name}`}
          />

          {/* Service Type Selector */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Select Service
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'auto_rickshaw', label: 'Auto (Tuk-tuk)', icon: Bus },
                { id: 'taxi', label: 'Taxi / Cab', icon: Car },
                { id: 'monument_guide', label: 'Official Guide', icon: UserCheck },
                { id: 'boat_ride', label: 'Boat / Cruise', icon: Sailboat },
              ].map((s) => {
                const Icon = s.icon;
                const isSelected = serviceType === s.id;
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setServiceType(s.id as any)}
                    className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                      isSelected
                        ? 'border-slate-900 bg-slate-900 text-white font-bold shadow-xs'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <Icon className="w-5 h-5 mb-1" />
                    <span className="text-xs">{s.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Form Fields: Distance & Quoted Amount */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Quoted Price (₹)
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-2.5 text-sm font-bold text-slate-400">₹</span>
                <input
                  type="number"
                  value={quotedAmount}
                  onChange={(e) => setQuotedAmount(e.target.value)}
                  placeholder="250"
                  className="w-full pl-8 pr-3 py-2 rounded-xl border border-slate-300 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-slate-900"
                />
              </div>
            </div>

            {(serviceType === 'auto_rickshaw' || serviceType === 'taxi') && (
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Approx Distance ({distanceKm} km)
                </label>
                <input
                  type="range"
                  min="1"
                  max="30"
                  value={distanceKm}
                  onChange={(e) => setDistanceKm(parseInt(e.target.value))}
                  className="w-full accent-slate-900 mt-2"
                />
              </div>
            )}
          </div>

          {/* Calculation Output Card */}
          {result && (
            <div className="p-5 sm:p-6 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-4 animate-in fade-in">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Typical Local Estimate
                  </span>
                  <div className="text-xl sm:text-2xl font-extrabold text-slate-900">
                    ₹{result.estimatedRange.min} – ₹{result.estimatedRange.max}
                  </div>
                </div>

                {/* Verdict Badge */}
                <div
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border ${
                    result.warningLevel === 'fair'
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      : result.warningLevel === 'slight_high'
                      ? 'bg-amber-50 text-amber-900 border-amber-200'
                      : 'bg-rose-50 text-rose-900 border-rose-200'
                  }`}
                >
                  {result.warningLevel === 'fair' && '✅ Reasonable Local Fare'}
                  {result.warningLevel === 'slight_high' && '⚠️ Slightly Elevated'}
                  {result.warningLevel === 'very_high' && '🚨 Significantly Overquoted'}
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
                {result.practicalAdvice}
              </p>

              {/* Recommended Polite Hindi & English Counter Phrase */}
              <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-1.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700">
                  Recommended Polite Response / Counter-Offer
                </span>
                <p className="text-sm sm:text-base font-bold text-slate-950 font-serif">
                  "{result.politeCounterPhrase.hindi}"
                </p>
                <p className="text-xs text-slate-600">
                  {result.politeCounterPhrase.english}
                </p>
              </div>

              {/* Verified Alternatives */}
              {result.alternatives && (
                <div className="text-xs text-slate-500 pt-1">
                  <strong>Practical Alternatives:</strong>
                  <ul className="list-disc list-inside mt-1 space-y-0.5 text-slate-600">
                    {result.alternatives.map((alt: string, i: number) => (
                      <li key={i}>{alt}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Column: Verified Reference Tariffs (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            Verified Standard Tariffs in {currentCity.name}
          </h3>

          <div className="space-y-3">
            {referenceItems.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5"
              >
                <div className="flex items-start justify-between gap-2">
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                    {item.title}
                  </h4>
                  <span className="text-xs font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 shrink-0">
                    ₹{item.minPrice}–₹{item.maxPrice} {item.unit}
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed font-normal">
                  {item.guidance}
                </p>
                {item.counterOffer && (
                  <span className="inline-block text-[11px] text-amber-800 font-medium">
                    💡 Suggestion: {item.counterOffer}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};
