import React from 'react';
import { ArrowLeft } from 'lucide-react';

interface BackToDashboardButtonProps {
  onClick: () => void;
  label?: string;
  variant?: 'glass' | 'neutral' | 'dark';
  className?: string;
  id?: string;
}

export default function BackToDashboardButton({
  onClick,
  label = 'Volver al Dashboard',
  variant = 'glass',
  className = '',
  id,
}: BackToDashboardButtonProps) {
  // Styles based on header background
  const variantStyles = {
    glass: {
      button: 'bg-white/15 hover:bg-white/25 active:bg-white/30 text-white border-white/20 hover:border-white/35 backdrop-blur-md shadow-xs hover:shadow-sm',
      badge: 'bg-white/20 text-white shadow-xs',
      icon: 'text-white',
    },
    neutral: {
      button: 'bg-slate-100 hover:bg-slate-200/90 active:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700/90 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 shadow-xs hover:shadow-sm',
      badge: 'bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 shadow-xs border border-slate-200/70 dark:border-slate-600',
      icon: 'text-slate-600 dark:text-slate-300',
    },
    dark: {
      button: 'bg-slate-800/90 hover:bg-slate-700/90 active:bg-slate-700 text-slate-200 hover:text-white border-slate-700 hover:border-slate-600 shadow-xs hover:shadow-sm',
      badge: 'bg-slate-900/80 text-emerald-400 shadow-xs border border-slate-700/80',
      icon: 'text-slate-300 group-hover:text-white',
    },
  };

  const selected = variantStyles[variant];

  return (
    <button
      type="button"
      id={id}
      onClick={onClick}
      className={`group inline-flex items-center gap-2.5 h-9 sm:h-10 px-3 sm:px-3.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer border shrink-0 select-none whitespace-nowrap ${selected.button} ${className}`}
      title={label}
    >
      <span className={`w-6 h-6 rounded-lg flex items-center justify-center transition-transform duration-200 group-hover:-translate-x-1 shrink-0 ${selected.badge}`}>
        <ArrowLeft className={`w-3.5 h-3.5 ${selected.icon}`} />
      </span>
      <span className="font-semibold tracking-tight">{label}</span>
    </button>
  );
}
