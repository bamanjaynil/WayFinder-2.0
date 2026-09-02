import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { Place, PlaceCategory } from '../types';
import { PlaceCard } from '../components/ui/PlaceCard';
import { SectionHeader } from '../components/ui/SectionHeader';
import { SearchBar } from '../components/ui/SearchBar';
import {
  Compass,
  Landmark,
  Utensils,
  Sparkles,
  Camera,
  Trees,
  Mountain,
  ShoppingBag,
  Building2,
  Filter
} from 'lucide-react';

export const ExplorePage: React.FC = () => {
  const navigate = useNavigate();
  const { currentCity, cities, setCurrentCityId } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);

  const categories: { id: string; label: string; icon: any }[] = [
    { id: 'all', label: 'All Highlights', icon: Sparkles },
    { id: 'heritage', label: 'Heritage & Forts', icon: Landmark },
    { id: 'photography', label: 'Photography', icon: Camera },
    { id: 'spiritual', label: 'Sacred & Spiritual', icon: Building2 },
    { id: 'food', label: 'Food & Dining', icon: Utensils },
    { id: 'nature', label: 'Nature & Parks', icon: Trees },
    { id: 'viewpoint', label: 'Vistas & Sunsets', icon: Mountain },
    { id: 'shopping', label: 'Bazaars & Crafts', icon: ShoppingBag },
  ];

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    api.getPlaces({
      cityId: currentCity.id,
      category: selectedCategory === 'all' ? undefined : selectedCategory,
    })
      .then((data) => {
        if (!isMounted) return;
        setPlaces(data);
        setLoading(false);
      })
      .catch(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [currentCity.id, selectedCategory]);

  const handleSearchSubmit = (q: string) => {
    if (q.trim()) {
      navigate(`/search?q=${encodeURIComponent(q.trim())}`);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/60 pb-24 lg:pb-16">
      {/* Header Bar */}
      <div className="bg-white border-b border-slate-200/80 px-4 sm:px-6 lg:px-8 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                Explore Destinations in India
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Curated historical monuments, cultural sanctuaries, and culinary landmarks.
              </p>
            </div>

            {/* City Selector Buttons Pill list */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
              {cities.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setCurrentCityId(c.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-all cursor-pointer ${
                    c.id === currentCity.id
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>

          {/* Search Box */}
          <div className="max-w-2xl mb-4">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              onSearch={handleSearchSubmit}
              placeholder={`Search attractions in ${currentCity.name}...`}
            />
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-2">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold shrink-0 transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'bg-white border border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Places List Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <SectionHeader
          title={`${selectedCategory === 'all' ? 'All Attractions' : categories.find((c) => c.id === selectedCategory)?.label} in ${currentCity.name}`}
          subtitle={`${places.length} curated destinations with ground truth guidance`}
        />

        {places.length === 0 && !loading ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8">
            <Landmark className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-900">No destinations in this category yet</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Try switching category or explore another city.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {places.map((place) => (
              <PlaceCard key={place.id} place={place} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};
