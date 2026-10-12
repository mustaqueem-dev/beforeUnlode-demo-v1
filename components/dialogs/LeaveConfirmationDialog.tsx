'use client';

import React, { useEffect, useRef } from 'react';
import { AlertTriangle, ArrowLeft, XCircle } from 'lucide-react';

export interface LeaveConfirmationDialogProps {
  isOpen: boolean;
  title?: string;
  message?: string;
  destination?: string | null;
  onStay: () => void;
  onLeave: () => void;
  stayButtonText?: string;
  leaveButtonText?: string;
}

export function LeaveConfirmationDialog({
  isOpen,
  title = 'Leave this page?',
  message = 'You have unsaved changes. If you leave now, your changes may be lost.',
  destination,
  onStay,
  onLeave,
  stayButtonText = 'Stay on Page',
  leaveButtonText = 'Leave Without Saving',
}: LeaveConfirmationDialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const stayButtonRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    // Remember currently focused element to restore upon close
    previousFocusRef.current = document.activeElement as HTMLElement | null;

    // Save previous body overflow style and lock scroll
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Focus the safe default action button ("Stay on Page")
    const focusTimer = setTimeout(() => {
      stayButtonRef.current?.focus();
    }, 50);

    const handleKeyDown = (e: KeyboardEvent) => {
      // Escape key cancels navigation and stays
      if (e.key === 'Escape') {
        e.preventDefault();
        onStay();
        return;
      }

      // Trap Tab focus inside the dialog
      if (e.key === 'Tab' && dialogRef.current) {
        const focusableElements = dialogRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
      clearTimeout(focusTimer);
      // Restore previous focus
      if (previousFocusRef.current && typeof previousFocusRef.current.focus === 'function') {
        previousFocusRef.current.focus();
      }
    };
  }, [isOpen, onStay]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm transition-opacity"
      role="presentation"
      onClick={(e) => {
        // Prevent background clicks from bypassing decision, or treat click outside as Stay
        if (e.target === e.currentTarget) {
          onStay();
        }
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="leave-dialog-title"
        aria-describedby="leave-dialog-description"
        className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-7 overflow-hidden text-slate-900 dark:text-slate-100 animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Warning Icon Badge */}
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-11 h-11 rounded-full bg-amber-100 dark:bg-amber-950/70 text-amber-600 dark:text-amber-400 flex items-center justify-center">
            <AlertTriangle className="w-6 h-6" aria-hidden="true" />
          </div>

          <div className="flex-1 min-w-0">
            <h2
              id="leave-dialog-title"
              className="text-lg font-semibold tracking-tight text-slate-900 dark:text-slate-100"
            >
              {title}
            </h2>
            <p
              id="leave-dialog-description"
              className="mt-2 text-sm text-slate-600 dark:text-slate-400 leading-relaxed"
            >
              {message}
            </p>

            {destination && (
              <div className="mt-3 py-1.5 px-2.5 rounded-md bg-slate-100 dark:bg-slate-800 text-xs text-slate-600 dark:text-slate-400 flex items-center gap-1.5 font-mono">
                <span className="font-semibold text-slate-700 dark:text-slate-300">Target:</span>
                <span className="truncate">{destination}</span>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 sm:mt-7 flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
          <button
            type="button"
            onClick={onLeave}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-red-300 dark:border-red-800/60 bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-900/60 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
          >
            <XCircle className="w-4 h-4" aria-hidden="true" />
            {leaveButtonText}
          </button>

          <button
            ref={stayButtonRef}
            type="button"
            onClick={onStay}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-200 text-sm font-medium shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-100 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            {stayButtonText}
          </button>
        </div>
      </div>
    </div>
  );
}
