import React from 'react';

interface TagChipProps {
  label: string;
  variant?: 'default' | 'highlight' | 'warning' | 'cultural';
  size?: 'sm' | 'md';
  onClick?: () => void;
  className?: string;
}

export const TagChip: React.FC<TagChipProps> = ({
  label,
  variant = 'default',
  size = 'sm',
  onClick,
  className = '',
}) => {
  const variantStyles = {
    default: 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200',
    highlight: 'bg-amber-50 text-amber-900 border-amber-200 hover:bg-amber-100',
    warning: 'bg-rose-50 text-rose-800 border-rose-200 hover:bg-rose-100',
    cultural: 'bg-indigo-50 text-indigo-900 border-indigo-200 hover:bg-indigo-100',
  };

  const sizeStyles = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
  };

  const interactive = onClick ? 'cursor-pointer active:scale-95 transition-transform' : '';

  return (
    <span
      onClick={onClick}
      className={`inline-flex items-center rounded-md border font-normal tracking-tight ${sizeStyles[size]} ${variantStyles[variant]} ${interactive} ${className}`}
    >
      {label}
    </span>
  );
};
