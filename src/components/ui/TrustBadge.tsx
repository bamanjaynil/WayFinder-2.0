import React from 'react';
import { TrustStatus } from '../../types';
import { ShieldCheck, Users, Sparkles, Database } from 'lucide-react';

interface TrustBadgeProps {
  status: TrustStatus;
  confidence?: 'High' | 'Medium' | 'Preliminary';
  sourceType?: string;
  showDetails?: boolean;
  className?: string;
}

export const TrustBadge: React.FC<TrustBadgeProps> = ({
  status,
  confidence = 'High',
  sourceType,
  showDetails = false,
  className = '',
}) => {
  const configs = {
    VERIFIED: {
      label: 'Verified Ground Truth',
      icon: <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />,
      bg: 'bg-emerald-50 border-emerald-200 text-emerald-800',
    },
    COMMUNITY_REPORTED: {
      label: 'Community Reported',
      icon: <Users className="w-3.5 h-3.5 text-blue-600" />,
      bg: 'bg-blue-50 border-blue-200 text-blue-800',
    },
    DEMO: {
      label: 'Curated Prototype Dataset',
      icon: <Database className="w-3.5 h-3.5 text-slate-500" />,
      bg: 'bg-slate-50 border-slate-200 text-slate-700',
    },
    AI_GENERATED: {
      label: 'AI Synthesis',
      icon: <Sparkles className="w-3.5 h-3.5 text-amber-600" />,
      bg: 'bg-amber-50 border-amber-200 text-amber-800',
    },
  };

  const config = configs[status] || configs.VERIFIED;

  return (
    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-xs font-medium ${config.bg} ${className}`}>
      {config.icon}
      <span>{config.label}</span>
      {confidence && confidence !== 'High' && (
        <span className="opacity-75 font-normal">({confidence})</span>
      )}
    </div>
  );
};
