'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
  ReactNode,
} from 'react';
import { useRouter } from 'next/navigation';
import { FormStatus } from '@/lib/form-utils';

export interface UnsavedChangesContextValue {
  isDirty: boolean;
  status: FormStatus;
  setIsDirty: (dirty: boolean) => void;
  setFormStatus: (status: FormStatus) => void;
}

const UnsavedChangesContext = createContext<UnsavedChangesContextValue | null>(null);

export interface UnsavedChangesProviderProps {
  children: ReactNode;
}

/**
 * Clean & Native Unsaved Changes Provider:
 * - Native browser `beforeunload` for Refresh and Tab/Window Close.
 * - History API `popstate` + native confirmation for Browser Back button.
 * - Native confirmation for in-app link navigation.
 */
export function UnsavedChangesProvider({ children }: UnsavedChangesProviderProps) {
  const router = useRouter();

  const [isDirty, setIsDirtyState] = useState<boolean>(false);
  const [status, setStatusState] = useState<FormStatus>('pristine');

  const isDirtyRef = useRef<boolean>(false);
  const hasHistoryTrapRef = useRef<boolean>(false);
  const isSilentPopRef = useRef<boolean>(false);
  const isBypassingRef = useRef<boolean>(false);

  const setIsDirty = useCallback((dirty: boolean) => {
    setIsDirtyState(dirty);
    isDirtyRef.current = dirty;
    if (!dirty) {
      setStatusState((prev) => (prev === 'submitting' ? prev : 'pristine'));
    } else {
      setStatusState((prev) => (prev === 'submitting' ? prev : 'dirty'));
    }
  }, []);

  const setFormStatus = useCallback((newStatus: FormStatus) => {
    setStatusState(newStatus);
    if (newStatus === 'pristine' || newStatus === 'submitted') {
      setIsDirtyState(false);
      isDirtyRef.current = false;
    } else if (newStatus === 'dirty') {
      setIsDirtyState(true);
      isDirtyRef.current = true;
    } else if (newStatus === 'submitting') {
      isDirtyRef.current = false;
    }
  }, []);

  // 1. Browser Refresh & Tab / Window Close (beforeunload)
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!isDirtyRef.current) return;
      e.preventDefault();
      e.returnValue = '';
      return '';
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  // 2. Browser Back Button Protection (History Trap + popstate)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (isDirty && !hasHistoryTrapRef.current) {
      // Form became dirty: push trap entry so browser Back is caught
      window.history.pushState({ __unsavedTrap: true }, '', window.location.href);
      hasHistoryTrapRef.current = true;
    } else if (!isDirty && hasHistoryTrapRef.current) {
      // Form returned to pristine: remove the trap entry cleanly
      isSilentPopRef.current = true;
      hasHistoryTrapRef.current = false;
      window.history.back();
    }
  }, [isDirty]);

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

      if (isDirtyRef.current) {
        // User clicked the browser Back button while having unsaved changes
        const leave = window.confirm(
          'You have unsaved changes. Are you sure you want to leave this page?'
        );

        if (!leave) {
          // User chose to stay: re-push trap so they remain on this page with input intact
          window.history.pushState({ __unsavedTrap: true }, '', window.location.href);
          hasHistoryTrapRef.current = true;
        } else {
          // User chose to leave: allow navigation back
          isBypassingRef.current = true;
          isDirtyRef.current = false;
          setIsDirtyState(false);
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

  // 3. In-App Navigation (Links on page)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleCaptureClick = (e: MouseEvent) => {
      if (!isDirtyRef.current) return;

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
            'You have unsaved changes. Are you sure you want to leave this page?'
          );

          if (!leave) {
            e.preventDefault();
            e.stopPropagation();
          } else {
            isDirtyRef.current = false;
            setIsDirtyState(false);
            if (hasHistoryTrapRef.current) {
              hasHistoryTrapRef.current = false;
            }
          }
        }
      } catch {
        // Ignore invalid URLs
      }
    };

    window.addEventListener('click', handleCaptureClick, true);
    return () => {
      window.removeEventListener('click', handleCaptureClick, true);
    };
  }, []);

  const value: UnsavedChangesContextValue = {
    isDirty,
    status,
    setIsDirty,
    setFormStatus,
  };

  return React.createElement(UnsavedChangesContext.Provider, { value }, children);
}

export function useUnsavedChanges() {
  const context = useContext(UnsavedChangesContext);
  if (!context) {
    throw new Error('useUnsavedChanges must be used within an UnsavedChangesProvider');
  }
  return context;
}
