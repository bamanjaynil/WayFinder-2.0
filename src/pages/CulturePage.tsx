import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { CulturalTopic } from '../types';
import { SectionHeader } from '../components/ui/SectionHeader';
import {
  BookOpen,
  CheckCircle2,
  XCircle,
  Sparkles,
  Building2,
  Utensils,
  Shirt,
  Camera,
  ShoppingBag,
  HeartHandshake
} from 'lucide-react';

export const CulturePage: React.FC = () => {
  const [topics, setTopics] = useState<CulturalTopic[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  const categoryIcons: { [key: string]: any } = {
    all: Sparkles,
    sacred_spaces: Building2,
    dining: Utensils,
    dress_code: Shirt,
    photography: Camera,
    bargaining: ShoppingBag,
    social_norms: HeartHandshake,
  };

  useEffect(() => {
    api.getCulture().then((data) => {
      setTopics(data);
      setLoading(false);
    });
  }, []);

  const filtered = selectedCategory === 'all'
    ? topics
    : topics.filter((t) => t.category === selectedCategory);

  const categories = [
    { id: 'all', label: 'All Etiquette' },
    { id: 'sacred_spaces', label: 'Temples & Sacred' },
    { id: 'dining', label: 'Dining & Chai' },
    { id: 'dress_code', label: 'Dress Codes' },
    { id: 'photography', label: 'Photography' },
    { id: 'bargaining', label: 'Bazaar Etiquette' },
    { id: 'social_norms', label: 'Greetings & Gestures' },
  ];

  return (
    <div className="min-h-screen bg-slate-50/60 pb-24 lg:pb-16">
      {/* Header */}
      <div className="bg-white border-b border-slate-200/80 px-4 sm:px-6 lg:px-8 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                Indian Cultural Guidance & Etiquette
              </h1>
              <p className="text-xs sm:text-sm text-slate-500">
                Actionable norms for visiting temples, sharing meals, bazaar interactions, and sacred heritage.
              </p>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-4">
            {categories.map((cat) => {
              const Icon = categoryIcons[cat.id] || Sparkles;
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold shrink-0 transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
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

      {/* Main Content List */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {filtered.map((topic) => (
          <div
            key={topic.id}
            className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs"
          >
            <div className="flex items-start justify-between gap-4 mb-3">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 mb-1 block">
                  {topic.category.replace('_', ' ')}
                </span>
                <h3 className="text-base sm:text-lg font-bold text-slate-900">
                  {topic.title}
                </h3>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal mb-5">
              {topic.summary}
            </p>

            {/* Dos and Don'ts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {/* DO's */}
              <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200/80">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-900 uppercase tracking-wider mb-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Recommended Practices (Do)
                </div>
                <ul className="space-y-2 text-xs text-emerald-950">
                  {(topic.dos || topic.doList || []).map((item: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="font-bold text-emerald-700">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* DONT's */}
              <div className="p-4 rounded-xl bg-rose-50/70 border border-rose-200/80">
                <div className="flex items-center gap-2 text-xs font-bold text-rose-900 uppercase tracking-wider mb-2.5">
                  <XCircle className="w-4 h-4 text-rose-600" />
                  What to Avoid (Don't)
                </div>
                <ul className="space-y-2 text-xs text-rose-950">
                  {(topic.donts || topic.dontList || []).map((item: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="font-bold text-rose-700">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </main>
    </div>
  );
};
