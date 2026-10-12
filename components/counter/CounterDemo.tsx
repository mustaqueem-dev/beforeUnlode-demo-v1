'use client';

import React from 'react';
import { useCounterGuard } from '@/hooks/useCounterGuard';

export function CounterDemo() {
  const { count, isGuarded, increment, decrement, reset, setCount } = useCounterGuard({
    initialCount: 0,
    threshold: 10,
  });

  return (
    <div className="max-w-md mx-auto w-full">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 text-center space-y-6">
        {/* Title */}
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Counter Navigation Guard
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Agar counter &lt; 10 hai to Refresh aur Back button par warning trigger hoga. 10 ya usse jyada hone par warning nahi hoga.
          </p>
        </div>

        {/* Big Counter Value */}
        <div className="py-7 bg-slate-50 rounded-xl border border-slate-100 flex flex-col items-center justify-center">
          <span className="text-6xl font-black tracking-tight text-slate-900 font-mono">
            {count}
          </span>
          <span className="text-xs uppercase tracking-wider font-semibold text-slate-400 mt-1.5">
            Current Count
          </span>
        </div>

        {/* Status Badge */}
        <div>
          {isGuarded ? (
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              <span>Warning Active (Count &lt; 10)</span>
            </div>
          ) : (
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Safe to Leave (Count &ge; 10) — No Warning</span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 pt-1">
          {/* Main Increment Counter Button */}
          <button
            type="button"
            onClick={increment}
            className="w-full py-3.5 px-6 rounded-xl bg-slate-900 hover:bg-slate-800 active:scale-[0.99] text-white font-medium text-sm transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
          >
            <span className="text-lg font-bold leading-none">+</span>
            <span>Increment Counter ({count} &rarr; {count + 1})</span>
          </button>

          {/* Quick Controls */}
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={decrement}
              disabled={count <= 0}
              className="py-2 px-3 text-xs font-medium text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg transition-colors disabled:opacity-40"
            >
              -1 Decrement
            </button>

            <button
              type="button"
              onClick={() => setCount(10)}
              className="py-2 px-3 text-xs font-medium text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              Set to 10
            </button>

            <button
              type="button"
              onClick={reset}
              className="py-2 px-3 text-xs font-medium text-red-600 hover:text-red-700 bg-white hover:bg-red-50 border border-slate-200 rounded-lg transition-colors"
            >
              Reset to 0
            </button>
          </div>
        </div>

        {/* Explanation / Testing Tips */}
        <div className="pt-4 border-t border-slate-100 text-left text-xs text-slate-500 space-y-1.5">
          <p className="font-semibold text-slate-700">Test Kaise Karein:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>
              <strong>Count &lt; 10:</strong> Browser ka <em>Back button</em> dabayein ya <em>Refresh (F5)</em> karein &rarr; Native warning dialog trigger hoga.
            </li>
            <li>
              <strong>Count &ge; 10:</strong> Counter ko 10 ya usse upar le jayein, ab Back ya Refresh dabane par seedha navigate hoga, koi warning nahi aayegi.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
