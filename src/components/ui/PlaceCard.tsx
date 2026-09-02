import React from 'react';
import { Place } from '../../types';
import { useApp } from '../../context/AppContext';
import { Rating } from './Rating';
import { TagChip } from './TagChip';
import { TrustBadge } from './TrustBadge';
import { MapPin, Bookmark, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface PlaceCardProps {
  place: Place;
  variant?: 'standard' | 'horizontal' | 'compact';
  onSelect?: (place: Place) => void;
  className?: string;
}

export const PlaceCard: React.FC<PlaceCardProps> = ({
  place,
  variant = 'standard',
  onSelect,
  className = '',
}) => {
  const navigate = useNavigate();
  const { toggleSavePlace, isPlaceSaved } = useApp();
  const saved = isPlaceSaved(place.id);

  const handleClick = () => {
    if (onSelect) {
      onSelect(place);
    } else {
      navigate(`/place/${place.id}`);
    }
  };

  const handleBookmark = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleSavePlace(place.id);
  };

  if (variant === 'horizontal') {
    return (
      <div
        id={`place-card-${place.id}`}
        onClick={handleClick}
        className={`group flex bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer ${className}`}
      >
        <div className="relative w-36 sm:w-44 shrink-0 bg-slate-100 overflow-hidden">
          <img
            src={place.images[0]}
            alt={place.name}
            loading="lazy"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <button
            id={`bookmark-btn-${place.id}`}
            onClick={handleBookmark}
            aria-label={saved ? 'Remove from saved' : 'Save place'}
            className="absolute top-2 left-2 p-1.5 rounded-full bg-white/90 backdrop-blur-xs text-slate-700 hover:text-amber-600 shadow-xs transition-colors"
          >
            <Bookmark className={`w-3.5 h-3.5 ${saved ? 'fill-amber-500 text-amber-500' : ''}`} />
          </button>
        </div>

        <div className="p-3.5 sm:p-4 flex flex-col justify-between flex-1 min-w-0">
          <div>
            <div className="flex items-center justify-between gap-2 mb-1">
              <div className="flex items-center gap-1.5 text-xs text-slate-500 truncate">
                <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                <span className="truncate">{place.cityName}, {place.state}</span>
                {place.distanceKm !== undefined && (
                  <span className="text-slate-400 font-medium shrink-0">· {place.distanceKm} km</span>
                )}
              </div>
              <Rating rating={place.rating} size="sm" />
            </div>

            <h3 className="text-sm sm:text-base font-semibold text-slate-900 leading-snug truncate group-hover:text-amber-700 transition-colors">
              {place.name}
            </h3>

            <p className="text-xs text-slate-600 line-clamp-2 mt-1 font-normal">
              {place.speciality || place.description}
            </p>
          </div>

          <div className="flex items-center justify-between gap-2 mt-2 pt-2 border-t border-slate-100">
            <div className="flex flex-wrap gap-1">
              {place.tags.slice(0, 2).map((t, idx) => (
                <TagChip key={idx} label={t} size="sm" />
              ))}
            </div>
            <TrustBadge status={place.trust.status} />
          </div>
        </div>
      </div>
    );
  }

  // Standard Card
  return (
    <div
      id={`place-card-${place.id}`}
      onClick={handleClick}
      className={`group flex flex-col bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-xs hover:shadow-md hover:border-slate-300 transition-all duration-200 cursor-pointer ${className}`}
    >
      {/* Image container */}
      <div className="relative aspect-16/10 w-full bg-slate-100 overflow-hidden">
        <img
          src={place.images[0]}
          alt={place.name}
          loading="lazy"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60 pointer-events-none" />

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between">
          <TrustBadge status={place.trust.status} className="bg-white/95 backdrop-blur-xs shadow-xs" />
          <button
            id={`bookmark-btn-${place.id}`}
            onClick={handleBookmark}
            aria-label={saved ? 'Remove from saved' : 'Save place'}
            className="p-2 rounded-full bg-white/90 backdrop-blur-xs text-slate-700 hover:text-amber-600 shadow-xs transition-colors"
          >
            <Bookmark className={`w-4 h-4 ${saved ? 'fill-amber-500 text-amber-500' : ''}`} />
          </button>
        </div>

        {/* Bottom image overlay stats */}
        <div className="absolute bottom-2 left-2.5 right-2.5 flex items-center justify-between text-white text-xs">
          <span className="flex items-center gap-1 bg-black/50 backdrop-blur-xs px-2 py-0.5 rounded-md">
            <Clock className="w-3 h-3 text-amber-300" />
            {place.openingHours.estimatedDurationHours}h visit
          </span>
          <span className="bg-black/50 backdrop-blur-xs px-2 py-0.5 rounded-md font-medium">
            {place.estimatedCost.foreignNational > 0 ? `₹${place.estimatedCost.foreignNational}` : 'Free Entry'}
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="p-4 flex flex-col justify-between flex-1">
        <div>
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <div className="flex items-center gap-1 text-xs text-slate-500 truncate">
              <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
              <span className="truncate">{place.cityName}, {place.state}</span>
              {place.distanceKm !== undefined && (
                <span className="text-slate-500 font-medium shrink-0">· {place.distanceKm} km</span>
              )}
            </div>
            <Rating rating={place.rating} reviewCount={place.reviewCount} />
          </div>

          <h3 className="text-base font-semibold text-slate-900 leading-snug group-hover:text-amber-700 transition-colors line-clamp-1">
            {place.name}
          </h3>

          <p className="text-xs text-slate-600 line-clamp-2 mt-1.5 leading-relaxed font-normal">
            {place.speciality || place.description}
          </p>
        </div>

        {/* Sparse High-Value Tags (max 3) */}
        <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-slate-100">
          {place.tags.slice(0, 3).map((t, idx) => (
            <TagChip key={idx} label={t} size="sm" />
          ))}
        </div>
      </div>
    </div>
  );
};
