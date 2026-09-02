import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { useApp } from '../../context/AppContext';
import { PlaceCategory } from '../../types';
import { Users, Sparkles, Shield, Utensils, Check } from 'lucide-react';

export const OnboardingModal: React.FC = () => {
  const { isOnboardingOpen, setIsOnboardingOpen, user, updatePreferences, showToast } = useApp();
  const [step, setStep] = useState(1);

  const [companion, setCompanion] = useState(user.preferences.companion || 'solo');
  const [interests, setInterests] = useState<PlaceCategory[]>(user.preferences.interests || ['heritage', 'food', 'photography']);
  const [priority, setPriority] = useState(user.preferences.priority || 'safety');
  const [diet, setDiet] = useState(user.preferences.diet || 'all');
  const [language, setLanguage] = useState(user.preferences.language || 'English');

  const companions = [
    { id: 'solo', label: 'Solo Traveler', desc: 'Independent navigation and local insights' },
    { id: 'couple', label: 'Couple', desc: 'Romantic vistas, private dining & quiet retreats' },
    { id: 'family', label: 'Family', desc: 'Kid-friendly paces, comfort & easy logistics' },
    { id: 'friends', label: 'Friends Group', desc: 'Vibrant markets, adventures & shared experiences' },
  ];

  const interestOptions: { id: PlaceCategory; label: string }[] = [
    { id: 'heritage', label: 'Heritage & Forts' },
    { id: 'food', label: 'Food & Culinary' },
    { id: 'photography', label: 'Photography & Vistas' },
    { id: 'spiritual', label: 'Spiritual & Sacred' },
    { id: 'nature', label: 'Nature & Gardens' },
    { id: 'shopping', label: 'Bazaars & Crafts' },
    { id: 'museum', label: 'Museums & Arts' },
    { id: 'viewpoint', label: 'Sunsets & Viewpoints' },
  ];

  const priorities = [
    { id: 'safety', label: 'Safety & Trust', desc: 'Verified guidance and calm precautions' },
    { id: 'authentic', label: 'Authentic Experience', desc: 'Deep cultural immersion and local traditions' },
    { id: 'convenience', label: 'Convenience & Comfort', desc: 'Smooth transit and streamlined timing' },
    { id: 'budget', label: 'Budget Efficiency', desc: 'Fair pricing and free attractions' },
  ];

  const dietOptions = [
    { id: 'all', label: 'No Dietary Restriction' },
    { id: 'vegetarian', label: 'Vegetarian (Shakahari)' },
    { id: 'vegan', label: 'Vegan' },
    { id: 'jain', label: 'Jain (No root vegetables)' },
    { id: 'halal', label: 'Halal' },
  ];

  const toggleInterest = (id: PlaceCategory) => {
    if (interests.includes(id)) {
      if (interests.length > 1) {
        setInterests(interests.filter((i) => i !== id));
      }
    } else {
      setInterests([...interests, id]);
    }
  };

  const handleFinish = () => {
    updatePreferences({
      companion: companion as any,
      interests,
      priority: priority as any,
      diet: diet as any,
      language,
      onboardingCompleted: true,
    });
    setIsOnboardingOpen(false);
    showToast('success', 'Preferences Tailored', 'WayFinder personalized your recommendations and itinerary pacing.');
  };

  return (
    <Modal
      isOpen={isOnboardingOpen}
      onClose={() => setIsOnboardingOpen(false)}
      title="Personalize Your India Journey"
      subtitle={`Step ${step} of 4 — Tell us your travel style`}
      maxWidth="md"
    >
      <div className="py-2">
        {step === 1 && (
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Who are you travelling with?
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {companions.map((c) => {
                const isSelected = companion === c.id;
                return (
                  <div
                    key={c.id}
                    onClick={() => setCompanion(c.id as any)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'border-slate-900 bg-slate-900 text-white shadow-xs'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold">{c.label}</span>
                      {isSelected && <Check className="w-4 h-4 text-amber-400" />}
                    </div>
                    <p className={`text-xs mt-1 ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                      {c.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              What interests you most? (Select multiple)
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {interestOptions.map((opt) => {
                const isSelected = interests.includes(opt.id);
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => toggleInterest(opt.id)}
                    className={`p-3 rounded-xl border text-left text-xs font-semibold flex items-center justify-between transition-all ${
                      isSelected
                        ? 'border-amber-600 bg-amber-50 text-amber-950 font-bold'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <span>{opt.label}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-amber-700 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              What matters most to you?
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {priorities.map((p) => {
                const isSelected = priority === p.id;
                return (
                  <div
                    key={p.id}
                    onClick={() => setPriority(p.id as any)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'border-slate-900 bg-slate-900 text-white shadow-xs'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold">{p.label}</span>
                      {isSelected && <Check className="w-4 h-4 text-amber-400" />}
                    </div>
                    <p className={`text-xs mt-1 ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                      {p.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                Dietary Preference
              </h4>
              <div className="grid grid-cols-1 gap-1.5">
                {dietOptions.map((d) => (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => setDiet(d.id as any)}
                    className={`px-3 py-2 rounded-xl border text-left text-xs font-medium flex items-center justify-between transition-all ${
                      diet === d.id
                        ? 'border-slate-900 bg-slate-900 text-white font-bold'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <span>{d.label}</span>
                    {diet === d.id && <Check className="w-3.5 h-3.5 text-amber-400" />}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                Preferred Interface Language
              </h4>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
              >
                <option value="English">English</option>
                <option value="Hindi">हिन्दी (Hindi)</option>
                <option value="French">Français (French)</option>
                <option value="German">Deutsch (German)</option>
                <option value="Spanish">Español (Spanish)</option>
                <option value="Japanese">日本語 (Japanese)</option>
              </select>
            </div>
          </div>
        )}

        {/* Step Navigation Controls */}
        <div className="flex items-center justify-between gap-3 pt-6 border-t border-slate-100 mt-5">
          {step > 1 ? (
            <Button
              variant="outline"
              size="md"
              onClick={() => setStep(step - 1)}
            >
              Previous
            </Button>
          ) : (
            <div />
          )}

          {step < 4 ? (
            <Button
              variant="primary"
              size="md"
              onClick={() => setStep(step + 1)}
            >
              Next Step →
            </Button>
          ) : (
            <Button
              variant="primary"
              size="md"
              onClick={handleFinish}
            >
              Explore WayFinder
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
};
