import React from 'react';
import { Lightbulb } from 'lucide-react';

interface TravelTipCardProps {
  tip: string;
  source?: string;
  index?: number;
  className?: string;
}

export const TravelTipCard: React.FC<TravelTipCardProps> = ({
  tip,
  source,
  index,
  className = '',
}) => {
  return (
    <div className={`flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 ${className}`}>
      <div className="p-1.5 rounded-lg bg-amber-100/80 text-amber-800 shrink-0">
        <Lightbulb className="w-4 h-4" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs sm:text-sm text-slate-800 leading-relaxed">
          {tip}
        </p>
        {source && (
          <span className="block text-[11px] text-slate-400 mt-1">
            Source: {source}
          </span>
        )}
      </div>
    </div>
  );
};
