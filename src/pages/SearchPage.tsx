import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { Place } from '../types';
import { PlaceCard } from '../components/ui/PlaceCard';
import { SearchBar } from '../components/ui/SearchBar';
import { SectionHeader } from '../components/ui/SectionHeader';
import { TagChip } from '../components/ui/TagChip';
import { Search, MapPin, Globe, Sparkles, SlidersHorizontal, ArrowUpDown } from 'lucide-react';

export const SearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { currentCity, userLocation, requestUserLocation } = useApp();

  const initialQuery = searchParams.get('q') || '';
  const initialScope = (searchParams.get('scope') as 'nearby' | 'india') || 'india';

  const [query, setQuery] = useState(initialQuery);
  const [scope, setScope] = useState<'nearby' | 'india'>(initialScope);
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'rating' | 'cost' | 'name'>('rating');
  const [results, setResults] = useState<Place[]>([]);
  const [loading, setLoading] = useState(false);

  const sampleSearchPills = [
    'Heritage forts',
    'Best morning',
    'UNESCO World Heritage',
    'Free entry',
    'Photography',
    'Sunset view',
  ];

  const performSearch = (searchQuery: string, currentScope: 'nearby' | 'india', tag: string) => {
    setLoading(true);

    const lat = currentScope === 'nearby' ? (userLocation?.lat || currentCity.coordinates.lat) : undefined;
    const lng = currentScope === 'nearby' ? (userLocation?.lng || currentCity.coordinates.lng) : undefined;

    api.getPlaces({
      query: searchQuery,
      cityId: currentScope === 'nearby' ? currentCity.id : undefined,
      tag: tag === 'all' ? undefined : tag,
      scope: currentScope,
      lat,
      lng,
    })
      .then((places) => {
        let sorted = [...places];
        if (sortBy === 'rating') {
          sorted.sort((a, b) => b.rating - a.rating);
        } else if (sortBy === 'cost') {
          sorted.sort((a, b) => a.estimatedCost.foreignNational - b.estimatedCost.foreignNational);
        } else if (sortBy === 'name') {
          sorted.sort((a, b) => a.name.localeCompare(b.name));
        }
        setResults(sorted);
        setLoading(false);
      })
      .catch((e) => {
        console.error('Search error:', e);
        setLoading(false);
      });
  };

  useEffect(() => {
    performSearch(query, scope, selectedTag);
  }, [query, scope, selectedTag, sortBy, currentCity.id]);

  const handleScopeChange = (newScope: 'nearby' | 'india') => {
    setScope(newScope);
    setSearchParams({ q: query, scope: newScope });
    if (newScope === 'nearby' && !userLocation) {
      requestUserLocation();
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/60 pb-24 lg:pb-16">
      {/* Search Header */}
      <div className="bg-white border-b border-slate-200/80 px-4 sm:px-6 lg:px-8 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-4">
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Unified Tourism Intelligence Search
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Search by monument name, category, cultural practices, or practical attributes.
            </p>
          </div>

          <div className="max-w-3xl mb-4">
            <SearchBar
              value={query}
              onChange={setQuery}
              scope={scope}
              onScopeChange={handleScopeChange}
              cityName={currentCity.name}
              placeholder="e.g. Amber Fort, vegetarian lunch, sunset viewpoint..."
              autoFocus={!initialQuery}
            />
          </div>

          {/* Quick Filter Tag Chips */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-1">
            <span className="text-[11px] font-semibold text-slate-400 uppercase shrink-0">
              Popular Tags:
            </span>
            <button
              onClick={() => setSelectedTag('all')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold shrink-0 transition-all ${
                selectedTag === 'all'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              All Tags
            </button>
            {sampleSearchPills.map((tag) => {
              const isSelected = selectedTag.toLowerCase() === tag.toLowerCase();
              return (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(isSelected ? 'all' : tag)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold shrink-0 transition-all ${
                    isSelected
                      ? 'bg-amber-600 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {tag}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Results Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              {results.length} results found
              {query && <span className="text-amber-700 font-semibold"> for "{query}"</span>}
              {scope === 'nearby' ? ` near ${currentCity.name}` : ' across India'}
            </h2>
          </div>

          {/* Sort Controller */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
              <ArrowUpDown className="w-3 h-3" />
              Sort:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="text-xs font-semibold bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-800 focus:outline-none"
            >
              <option value="rating">Top Rated ⭐</option>
              <option value="cost">Lowest Entry Cost ₹</option>
              <option value="name">Alphabetical (A–Z)</option>
            </select>
          </div>
        </div>

        {results.length === 0 && !loading ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8">
            <Search className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-900">No matching destinations found</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto mb-4">
              Try searching with broader terms, switching from "Near {currentCity.name}" to "All India", or clearing active filters.
            </p>
            <button
              onClick={() => {
                setQuery('');
                setSelectedTag('all');
                setScope('india');
              }}
              className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition-colors"
            >
              Reset Search Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {results.map((place) => (
              <PlaceCard key={place.id} place={place} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};
