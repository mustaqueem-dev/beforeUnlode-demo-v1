'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

export interface UseCounterGuardOptions {
  initialCount?: number;
  threshold?: number;
}

export interface UseCounterGuardReturn {
  count: number;
  isGuarded: boolean;
  increment: () => void;
  decrement: () => void;
  setCount: (value: number | ((prev: number) => number)) => void;
  reset: () => void;
}

/**
 * Custom hook to guard navigation based on counter value:
 * - If count < threshold (default 10): Refresh, Tab Close, Browser Back, and in-app links trigger warning.
 * - If count >= threshold (10): Navigation is completely free with no warnings.
 */
export function useCounterGuard({
  initialCount = 0,
  threshold = 10,
}: UseCounterGuardOptions = {}): UseCounterGuardReturn {
  const [count, setCountState] = useState<number>(initialCount);

  // Condition: warning triggers when count < threshold
  const isGuarded = count < threshold;

  const countRef = useRef<number>(count);
  const isGuardedRef = useRef<boolean>(isGuarded);
  const hasHistoryTrapRef = useRef<boolean>(false);
  const isSilentPopRef = useRef<boolean>(false);
  const isBypassingRef = useRef<boolean>(false);

  useEffect(() => {
    countRef.current = count;
    isGuardedRef.current = count < threshold;
  }, [count, threshold]);

  const setCount = useCallback(
    (value: number | ((prev: number) => number)) => {
      setCountState((prev) => {
        const next = typeof value === 'function' ? value(prev) : value;
        countRef.current = next;
        isGuardedRef.current = next < threshold;
        return next;
      });
    },
    [threshold]
  );

  const increment = useCallback(() => {
    setCount((prev) => prev + 1);
  }, [setCount]);

  const decrement = useCallback(() => {
    setCount((prev) => Math.max(0, prev - 1));
  }, [setCount]);

  const reset = useCallback(() => {
    setCount(0);
  }, [setCount]);

  // 1. Browser Refresh & Tab Close (beforeunload)
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!isGuardedRef.current) return;
      e.preventDefault();
      e.returnValue = '';
      return '';
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  // 2. Browser Back Button Trap (History API popstate)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (isGuarded && !hasHistoryTrapRef.current) {
      // When guarded (< 10), push trap entry to catch Back button
      window.history.pushState({ __counterTrap: true }, '', window.location.href);
      hasHistoryTrapRef.current = true;
    } else if (!isGuarded && hasHistoryTrapRef.current) {
      // When >= 10, remove trap entry cleanly
      isSilentPopRef.current = true;
      hasHistoryTrapRef.current = false;
      window.history.back();
    }
  }, [isGuarded]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handlePopState = () => {
      if (isSilentPopRef.current) {
        isSilentPopRef.current = false;
        return;
      }

      if (isBypassingRef.current) {
        return;
      }

      if (isGuardedRef.current) {
        // Count is less than 10: trigger native warning
        const leave = window.confirm(
          `Counter is ${countRef.current} (less than 10). Are you sure you want to leave this page?`
        );

        if (!leave) {
          // Stay: re-push trap to remain on current page
          window.history.pushState({ __counterTrap: true }, '', window.location.href);
          hasHistoryTrapRef.current = true;
        } else {
          // Leave: let browser go back
          isBypassingRef.current = true;
          hasHistoryTrapRef.current = false;
          window.history.back();
        }
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  // 3. In-App Links Interception
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleCaptureClick = (e: MouseEvent) => {
      if (!isGuardedRef.current) return;

      const target = e.target as HTMLElement | null;
      if (!target) return;

      const anchor = target.closest('a');
      if (!anchor) return;

      const rawHref = anchor.getAttribute('href');
      if (!rawHref || rawHref.startsWith('#') || rawHref.startsWith('javascript:')) return;
      if (anchor.target === '_blank' || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

      try {
        const url = new URL(anchor.href, window.location.href);
        if (url.origin === window.location.origin) {
          const currentPath = window.location.pathname + window.location.search;
          const targetPath = url.pathname + url.search;
          if (currentPath === targetPath) return;

          const leave = window.confirm(
            `Counter is ${countRef.current} (less than 10). Are you sure you want to leave this page?`
          );

          if (!leave) {
            e.preventDefault();
            e.stopPropagation();
          } else {
            if (hasHistoryTrapRef.current) {
              hasHistoryTrapRef.current = false;
            }
          }
        }
      } catch {
        // Fallback for non-standard URLs
      }
    };

    window.addEventListener('click', handleCaptureClick, true);
    return () => {
      window.removeEventListener('click', handleCaptureClick, true);
    };
  }, []);

  return {
    count,
    isGuarded,
    increment,
    decrement,
    setCount,
    reset,
  };
}
