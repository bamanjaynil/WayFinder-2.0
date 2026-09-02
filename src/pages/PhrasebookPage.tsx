import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Phrase } from '../types';
import { SectionHeader } from '../components/ui/SectionHeader';
import {
  Volume2,
  Sparkles,
  Smile,
  DollarSign,
  Bus,
  Utensils,
  ShieldAlert,
  Search,
  Check,
  Languages
} from 'lucide-react';

export const PhrasebookPage: React.FC = () => {
  const [phrases, setPhrases] = useState<Phrase[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [playingId, setPlayingId] = useState<string | null>(null);

  const categories = [
    { id: 'all', label: 'All Phrases', icon: Sparkles },
    { id: 'greetings', label: 'Greetings', icon: Smile },
    { id: 'bargaining', label: 'Bazaars & Bargaining', icon: DollarSign },
    { id: 'transport', label: 'Auto & Transit', icon: Bus },
    { id: 'dining', label: 'Food & Chai', icon: Utensils },
    { id: 'emergencies', label: 'Safety & Help', icon: ShieldAlert },
  ];

  useEffect(() => {
    api.getPhrases().then((data) => {
      setPhrases(data);
    });
  }, []);

  const speakPhrase = (phrase: Phrase) => {
    const textToSpeak = phrase.audioPronunciationText || phrase.hindi || phrase.originalText || phrase.phonetic || '';
    if ('speechSynthesis' in window && textToSpeak) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.lang = 'hi-IN';
      utterance.rate = 0.85;

      utterance.onstart = () => setPlayingId(phrase.id);
      utterance.onend = () => setPlayingId(null);
      utterance.onerror = () => setPlayingId(null);

      window.speechSynthesis.speak(utterance);
    } else {
      setPlayingId(phrase.id);
      setTimeout(() => setPlayingId(null), 1200);
    }
  };

  const filtered = phrases.filter((p) => {
    const matchesCat = selectedCategory === 'all' || p.category.toLowerCase() === selectedCategory.toLowerCase();
    const eng = (p.english || p.englishMeaning || '').toLowerCase();
    const trans = (p.transliteration || p.phonetic || '').toLowerCase();
    const hin = p.hindi || p.originalText || '';
    const matchesQuery =
      searchQuery === '' ||
      eng.includes(searchQuery.toLowerCase()) ||
      trans.includes(searchQuery.toLowerCase()) ||
      hin.includes(searchQuery);
    return matchesCat && matchesQuery;
  });

  return (
    <div className="min-h-screen bg-slate-50/60 pb-24 lg:pb-16">
      {/* Top Header */}
      <div className="bg-white border-b border-slate-200/80 px-4 sm:px-6 lg:px-8 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
              <Languages className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                Essential Local Phrasebook & Audio Pronunciation
              </h1>
              <p className="text-xs sm:text-sm text-slate-500">
                Tap the speaker icon on any phrase to hear natural pronunciation with audio speech synthesis.
              </p>
            </div>
          </div>

          {/* Search box */}
          <div className="max-w-md my-4">
            <div className="flex items-center gap-2 px-3 py-2 bg-slate-100 rounded-xl border border-slate-200">
              <Search className="w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search phrase in English or Hindi..."
                className="w-full text-xs bg-transparent focus:outline-none text-slate-900"
              />
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-1">
            {categories.map((cat) => {
              const Icon = cat.icon;
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

      {/* Phrases Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((phrase) => {
            const isPlaying = playingId === phrase.id;
            return (
              <div
                key={phrase.id}
                className="flex flex-col justify-between bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs hover:border-slate-300 transition-all group"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      {phrase.category}
                    </span>
                    <button
                      onClick={() => speakPhrase(phrase)}
                      className={`p-2 rounded-xl transition-all cursor-pointer ${
                        isPlaying
                          ? 'bg-amber-500 text-slate-950 scale-110 shadow-sm animate-pulse'
                          : 'bg-slate-100 text-slate-700 hover:bg-amber-100 hover:text-amber-900'
                      }`}
                      aria-label={`Listen to ${phrase.transliteration}`}
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Hindi & Phonetic */}
                  <h3 className="text-lg font-bold text-slate-950 font-serif mb-1">
                    {phrase.hindi || phrase.originalText}
                  </h3>
                  <p className="text-sm font-semibold text-amber-700">
                    "{phrase.transliteration || phrase.phonetic}"
                  </p>

                  <p className="text-xs font-medium text-slate-600 mt-2">
                    Meaning: <strong className="text-slate-900">{phrase.english || phrase.englishMeaning}</strong>
                  </p>
                </div>

                {(phrase.situation || phrase.contextTip) && (
                  <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500 italic">
                    Use when: {phrase.situation || phrase.contextTip}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
};
