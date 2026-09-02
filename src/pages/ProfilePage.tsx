import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { Place } from '../types';
import { PlaceCard } from '../components/ui/PlaceCard';
import { Button } from '../components/ui/Button';
import { SectionHeader } from '../components/ui/SectionHeader';
import {
  User,
  Sliders,
  Bookmark,
  Calendar,
  ShieldCheck,
  Globe,
  LogOut,
  Sparkles,
  Info,
  ExternalLink,
  MapPin,
  Compass
} from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout, setIsAuthModalOpen, setIsOnboardingOpen, savedPlaceIds } = useApp();

  const [savedPlaces, setSavedPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    api.getPlaces()
      .then((all) => {
        if (!isMounted) return;
        const matching = all.filter((p) => savedPlaceIds.includes(p.id));
        setSavedPlaces(matching);
        setLoading(false);
      })
      .catch(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [savedPlaceIds]);

  return (
    <div className="min-h-screen bg-slate-50/60 pb-24 lg:pb-16">
      {/* Header Profile Section */}
      <div className="bg-white border-b border-slate-200/80 px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-slate-900 text-white flex items-center justify-center text-2xl font-extrabold shadow-sm">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
                  {user.name}
                </h1>
                <span className={`text-xs px-2 py-0.5 rounded-md font-semibold ${
                  user.isGuest ? 'bg-slate-100 text-slate-700' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                }`}>
                  {user.isGuest ? 'Guest Mode' : 'Verified Traveler'}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {user.email || 'Browsing with local cache persistence'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsOnboardingOpen(true)}
            >
              <Sliders className="w-3.5 h-3.5" />
              Edit Travel Preferences
            </Button>

            {user.isGuest ? (
              <Button
                variant="primary"
                size="sm"
                onClick={() => setIsAuthModalOpen(true)}
              >
                Sign In
              </Button>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                onClick={logout}
                className="text-slate-600"
              >
                <LogOut className="w-3.5 h-3.5" />
                Sign Out
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Main Settings & Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Travel Style Profile Card */}
        <section className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs">
          <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-600" />
            Your Travel Style Profile
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Companion
              </span>
              <p className="text-xs sm:text-sm font-bold text-slate-900 capitalize">
                {user.preferences.companion}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Priority
              </span>
              <p className="text-xs sm:text-sm font-bold text-slate-900 capitalize">
                {user.preferences.priority}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Dietary
              </span>
              <p className="text-xs sm:text-sm font-bold text-slate-900 capitalize">
                {user.preferences.diet}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Language
              </span>
              <p className="text-xs sm:text-sm font-bold text-slate-900 capitalize">
                {user.preferences.language}
              </p>
            </div>
          </div>
        </section>

        {/* Saved Places Collection */}
        <section>
          <SectionHeader
            title="Saved Destinations & Bookmarks"
            subtitle={`${savedPlaces.length} destinations saved for your India journey`}
          />

          {savedPlaces.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 p-6">
              <Bookmark className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <h4 className="text-sm font-bold text-slate-900">No saved destinations yet</h4>
              <p className="text-xs text-slate-500 mt-1 mb-4">
                Tap the bookmark icon on any monument card in Explore to save here.
              </p>
              <Button variant="secondary" size="sm" onClick={() => navigate('/explore')}>
                Explore Highlights
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {savedPlaces.map((place) => (
                <PlaceCard key={place.id} place={place} />
              ))}
            </div>
          )}
        </section>

        {/* About & Trust Link Bar */}
        <section className="bg-slate-900 text-white rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">
                WayFinder Data & Trust Methodology
              </h4>
              <p className="text-xs text-slate-300">
                Learn how we categorize Verified Ground Truth, Community Reports, and AI synthesis.
              </p>
            </div>
          </div>
          <Link
            to="/about"
            className="px-4 py-2 rounded-xl bg-white text-slate-900 text-xs font-bold hover:bg-slate-100 transition-colors shrink-0"
          >
            Read Methodology →
          </Link>
        </section>
      </main>
    </div>
  );
};
