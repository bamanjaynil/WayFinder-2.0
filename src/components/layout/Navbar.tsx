import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  Compass,
  MapPin,
  Sparkles,
  ShieldAlert,
  Search,
  User as UserIcon,
  ChevronDown,
  Navigation,
  Globe,
  SlidersHorizontal
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { currentCity, setIsCityModalOpen, setIsAuthModalOpen, user, setIsOnboardingOpen } = useApp();
  const location = useLocation();
  const navigate = useNavigate();

  const navLinks = [
    { path: '/home', label: 'Home' },
    { path: '/explore', label: 'Explore' },
    { path: '/trips', label: 'Trips' },
    { path: '/compass', label: 'Compass' },
    { path: '/culture', label: 'Culture' },
    { path: '/fair-price', label: 'Fair Price' },
    { path: '/phrasebook', label: 'Phrases' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3 sm:gap-6">
          {/* Logo & City Selector */}
          <div className="flex items-center gap-3 sm:gap-6">
            <Link to="/home" className="flex items-center gap-2 group">
              <div className="w-9 h-9 rounded-xl bg-slate-900 flex items-center justify-center text-white shadow-xs group-hover:bg-slate-800 transition-colors">
                <Compass className="w-5 h-5 text-amber-400" />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-base tracking-tight text-slate-950 flex items-center gap-1">
                  WAYFINDER
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 inline-block" />
                </span>
                <span className="text-[10px] text-slate-500 font-medium tracking-wide uppercase">
                  India Intelligence
                </span>
              </div>
            </Link>

            {/* City Selector Button */}
            <button
              id="city-selector-btn"
              onClick={() => setIsCityModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100/90 hover:bg-slate-200/80 text-slate-800 border border-slate-200 text-xs font-semibold transition-all cursor-pointer"
            >
              <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span>{currentCity.name}</span>
              <ChevronDown className="w-3 h-3 text-slate-500" />
            </button>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const active = location.pathname === link.path || (link.path === '/home' && location.pathname === '/');
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    active
                      ? 'bg-slate-900 text-white font-semibold'
                      : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Icons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Search shortcut button */}
            <Link
              to="/search"
              aria-label="Search"
              className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-transparent hover:border-slate-200 transition-all"
            >
              <Search className="w-4 h-4" />
            </Link>

            {/* Ask WayFinder Assistant Pill */}
            <Link
              to="/assistant"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-white text-xs font-semibold shadow-xs hover:from-amber-600 hover:to-amber-700 transition-all active:scale-95"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-100" />
              <span className="hidden sm:inline">Ask WayFinder</span>
              <span className="sm:hidden">AI</span>
            </Link>

            {/* Safety Shortcut */}
            <Link
              to="/safety"
              aria-label="Safety Center"
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 text-xs font-semibold transition-all"
            >
              <ShieldAlert className="w-3.5 h-3.5 text-rose-600 shrink-0" />
              <span className="hidden md:inline">Safety</span>
            </Link>

            {/* Profile / Auth Button */}
            <div className="flex items-center gap-1.5">
              <button
                id="profile-nav-btn"
                onClick={() => navigate('/profile')}
                className="flex items-center gap-2 p-1 sm:px-2.5 sm:py-1.5 rounded-xl text-slate-700 hover:bg-slate-100 border border-slate-200/80 text-xs font-medium transition-colors cursor-pointer"
                aria-label="View Profile and Preferences"
              >
                <div className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px] font-bold">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="hidden sm:inline font-semibold text-slate-900 max-w-[90px] truncate">
                  {user.name}
                </span>
                {user.isGuest && (
                  <span className="hidden md:inline text-[10px] px-1.5 py-0.5 rounded-md bg-slate-200 text-slate-700 font-medium">
                    Guest
                  </span>
                )}
              </button>

              {user.isGuest && (
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="hidden lg:inline-flex text-xs font-bold px-2.5 py-1.5 rounded-xl bg-slate-900 text-white hover:bg-slate-800 transition-colors"
                >
                  Sign In
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
