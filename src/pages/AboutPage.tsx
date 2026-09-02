import React from 'react';
import { SectionHeader } from '../components/ui/SectionHeader';
import { TrustBadge } from '../components/ui/TrustBadge';
import {
  Compass,
  ShieldCheck,
  Users,
  Database,
  Sparkles,
  HeartHandshake,
  CheckCircle2,
  FileCheck,
  AlertCircle
} from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50/60 pb-24 lg:pb-16">
      {/* Header */}
      <div className="bg-white border-b border-slate-200/80 px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-amber-400 flex items-center justify-center font-bold">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                WayFinder Intelligence & Trust Philosophy
              </h1>
              <p className="text-xs sm:text-sm text-slate-500">
                Built to replace generic travel fluff with calm, verified, culturally respectful ground truth.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Philosophy Body */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Core Principles */}
        <section className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-4">
          <h2 className="text-lg font-bold text-slate-900">
            Our 4-Tier Data Trust Hierarchy
          </h2>
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
            Every place, price point, and cultural guideline in WayFinder carries a transparent trust classification. We never blend speculative opinions with verified operational rules.
          </p>

          <div className="space-y-4 pt-3">
            <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200/80">
              <div className="flex items-center gap-2 mb-1.5">
                <TrustBadge status="VERIFIED" />
                <span className="text-xs font-bold text-emerald-950">Tier 1: Ground Truth</span>
              </div>
              <p className="text-xs text-emerald-900 leading-relaxed font-normal">
                Cross-referenced directly with Archeological Survey of India (ASI) portals, State Tourism boards, ticket counter fee schedules, and verified field audits.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200/80">
              <div className="flex items-center gap-2 mb-1.5">
                <TrustBadge status="COMMUNITY_REPORTED" />
                <span className="text-xs font-bold text-blue-950">Tier 2: Community Verified</span>
              </div>
              <p className="text-xs text-blue-900 leading-relaxed font-normal">
                Recent traveler submissions confirming seasonal changes, temporary cloakroom shifts, or updated auto fare quotes, reviewed before general promotion.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200/80">
              <div className="flex items-center gap-2 mb-1.5">
                <TrustBadge status="AI_GENERATED" />
                <span className="text-xs font-bold text-amber-950">Tier 3: AI Intelligence Synthesis</span>
              </div>
              <p className="text-xs text-amber-900 leading-relaxed font-normal">
                Synthesized by Google Gemini models under strict system prompts grounded in verified Indian tourism schemas and official advisory context.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div className="flex items-center gap-2 mb-1.5">
                <TrustBadge status="DEMO" />
                <span className="text-xs font-bold text-slate-800">Tier 4: Curated Prototype Dataset</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                Editorial mock dataset seeded for testing high-density routing and simulation across Jaipur, Delhi, Agra, Varanasi, and beyond.
              </p>
            </div>
          </div>
        </section>

        {/* Responsible Travel Ethics */}
        <section className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-indigo-700 mb-1">
            <HeartHandshake className="w-5 h-5" />
            <h3 className="text-base font-bold text-slate-900">
              Responsible & Culturally Respectful Exploration
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
            India is home to thousands of distinct living traditions, sacred rituals, and delicate heritage structures. WayFinder champions mindful travel:
          </p>
          <ul className="space-y-2 text-xs text-slate-700 pt-2 list-disc list-inside">
            <li><strong>Sacred Spaces:</strong> Maintain reverent silence, follow circumambulation paths clockwise (Pradakshina), and always deposit footwear at designated counters.</li>
            <li><strong>Fair Livelihoods:</strong> Bargain with polite composure rather than aggressive devaluations. Modest price differences represent meaningful livelihoods for artisanal craftspeople and local drivers.</li>
            <li><strong>Photography Ethics:</strong> Never photograph cremation ghats, worshippers in prayer, or private courtyards without prior consent.</li>
          </ul>
        </section>

        {/* Disclaimers & Safety Notice */}
        <section className="p-5 rounded-2xl bg-slate-100 border border-slate-200 text-xs text-slate-600 space-y-2">
          <div className="flex items-center gap-1.5 font-bold text-slate-800">
            <AlertCircle className="w-4 h-4 text-slate-500" />
            Official Travel Advisory Notice
          </div>
          <p className="leading-relaxed">
            While WayFinder strives for meticulous data accuracy, monument operating hours and pricing may fluctuate on national holidays (e.g. Republic Day, Independence Day, Gandhi Jayanti) or religious festivals (Diwali, Holi, Eid). In emergencies, always contact the national helpline at <strong>112</strong> or <strong>1363</strong>.
          </p>
        </section>
      </main>
    </div>
  );
};
