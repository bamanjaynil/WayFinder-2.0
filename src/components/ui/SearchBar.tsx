import React, { useState } from 'react';
import { Search, X, MapPin, Globe } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (val: string) => void;
  onSearch?: (val: string) => void;
  placeholder?: string;
  scope?: 'nearby' | 'india';
  onScopeChange?: (scope: 'nearby' | 'india') => void;
  cityName?: string;
  className?: string;
  autoFocus?: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  onSearch,
  placeholder = 'Search heritage, food, quiet spots...',
  scope = 'india',
  onScopeChange,
  cityName = 'Jaipur',
  className = '',
  autoFocus = false,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) onSearch(value);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`relative flex flex-col sm:flex-row items-stretch gap-2 bg-white p-1.5 rounded-2xl border transition-all duration-200 ${
        isFocused ? 'border-slate-900 ring-2 ring-slate-900/10 shadow-md' : 'border-slate-200 shadow-xs'
      } ${className}`}
    >
      {/* Search Input Box */}
      <div className="flex items-center flex-1 px-3 py-1.5 gap-2.5">
        <Search className="w-4 h-4 text-slate-400 shrink-0" />
        <input
          id="main-search-input"
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          autoFocus={autoFocus}
          className="w-full text-sm text-slate-900 placeholder:text-slate-400 bg-transparent focus:outline-none"
        />
        {value && (
          <button
            type="button"
            onClick={() => onChange('')}
            className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Scope Switch (Nearby vs India) */}
      {onScopeChange && (
        <div className="flex items-center gap-1 p-1 bg-slate-100/90 rounded-xl shrink-0 self-end sm:self-center">
          <button
            type="button"
            onClick={() => onScopeChange('nearby')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
              scope === 'nearby'
                ? 'bg-white text-slate-900 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <MapPin className="w-3 h-3 text-amber-600" />
            <span>Near {cityName}</span>
          </button>
          <button
            type="button"
            onClick={() => onScopeChange('india')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
              scope === 'india'
                ? 'bg-white text-slate-900 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Globe className="w-3 h-3 text-sky-600" />
            <span>All India</span>
          </button>
        </div>
      )}
    </form>
  );
};
