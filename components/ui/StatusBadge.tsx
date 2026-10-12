import React from 'react';
import { FormStatus } from '@/lib/form-utils';

interface StatusBadgeProps {
  status: FormStatus;
  size?: 'sm' | 'md' | 'lg';
  showDot?: boolean;
}

export function StatusBadge({
  status,
  size = 'md',
  showDot = true,
}: StatusBadgeProps) {
  const configs: Record<
    FormStatus,
    { label: string; bg: string; text: string; border: string; dot: string }
  > = {
    pristine: {
      label: 'Pristine (Clean)',
      bg: 'bg-slate-100 dark:bg-slate-800',
      text: 'text-slate-700 dark:text-slate-300',
      border: 'border-slate-300 dark:border-slate-700',
      dot: 'bg-slate-400',
    },
    dirty: {
      label: 'Dirty (Unsaved Changes)',
      bg: 'bg-amber-50 dark:bg-amber-950/60',
      text: 'text-amber-800 dark:text-amber-300',
      border: 'border-amber-300 dark:border-amber-700',
      dot: 'bg-amber-500 animate-pulse',
    },
    submitting: {
      label: 'Submitting...',
      bg: 'bg-blue-50 dark:bg-blue-950/60',
      text: 'text-blue-800 dark:text-blue-300',
      border: 'border-blue-300 dark:border-blue-700',
      dot: 'bg-blue-500 animate-ping',
    },
    submitted: {
      label: 'Submitted (Saved)',
      bg: 'bg-emerald-50 dark:bg-emerald-950/60',
      text: 'text-emerald-800 dark:text-emerald-300',
      border: 'border-emerald-300 dark:border-emerald-700',
      dot: 'bg-emerald-500',
    },
  };

  const config = configs[status];
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-xs sm:text-sm px-2.5 py-1',
    lg: 'text-sm sm:text-base px-3.5 py-1.5',
  }[size];

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-full border transition-colors duration-200 ${config.bg} ${config.text} ${config.border} ${sizeClasses}`}
      role="status"
      aria-label={`Form status: ${config.label}`}
    >
      {showDot && (
        <span
          className={`h-2 w-2 rounded-full flex-shrink-0 ${config.dot}`}
          aria-hidden="true"
        />
      )}
      <span>{config.label}</span>
    </span>
  );
}
