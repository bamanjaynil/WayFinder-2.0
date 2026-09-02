import React from 'react';
import { PracticalGuidance } from '../../types';
import { Info, AlertTriangle, AlertCircle, CheckCircle2 } from 'lucide-react';

interface GuidanceCardProps {
  guidance: PracticalGuidance;
  className?: string;
}

export const GuidanceCard: React.FC<GuidanceCardProps> = ({ guidance, className = '' }) => {
  const configs = {
    info: {
      border: 'border-slate-200 bg-slate-50/70',
      icon: <Info className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />,
      titleColor: 'text-slate-900',
    },
    caution: {
      border: 'border-amber-200 bg-amber-50/60',
      icon: <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />,
      titleColor: 'text-amber-950',
    },
    important: {
      border: 'border-rose-200 bg-rose-50/70',
      icon: <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />,
      titleColor: 'text-rose-950',
    },
  };

  const config = configs[guidance.severity] || configs.info;

  return (
    <div className={`p-4 rounded-xl border ${config.border} flex items-start gap-3 ${className}`}>
      {config.icon}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2 mb-1">
          <h4 className={`text-sm font-semibold ${config.titleColor}`}>
            {guidance.title}
          </h4>
          {guidance.verified && (
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              <CheckCircle2 className="w-3 h-3" />
              Verified
            </span>
          )}
        </div>
        <p className="text-xs text-slate-700 leading-relaxed font-normal">
          {guidance.description}
        </p>
      </div>
    </div>
  );
};
