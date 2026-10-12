import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, renderHook, act } from '@testing-library/react';
import { UnsavedChangesProvider, useUnsavedChanges } from '@/hooks/useUnsavedChanges';

const mockPush = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    replace: vi.fn(),
  }),
}));

describe('useUnsavedChanges', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('triggers beforeunload preventDefault when dirty', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <UnsavedChangesProvider>{children}</UnsavedChangesProvider>
    );

    const { result } = renderHook(() => useUnsavedChanges(), { wrapper });

    act(() => {
      result.current.setIsDirty(true);
    });

    const event = new Event('beforeunload', { cancelable: true });
    const preventDefaultSpy = vi.spyOn(event, 'preventDefault');

    window.dispatchEvent(event);

    expect(preventDefaultSpy).toHaveBeenCalled();
  });

  it('intercepts browser Back button (popstate) when dirty', () => {
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(false); // user clicks cancel (stay)
    const pushStateSpy = vi.spyOn(window.history, 'pushState');

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <UnsavedChangesProvider>{children}</UnsavedChangesProvider>
    );

    const { result } = renderHook(() => useUnsavedChanges(), { wrapper });

    act(() => {
      result.current.setIsDirty(true);
    });

    // Simulate user pressing browser Back button
    window.dispatchEvent(new PopStateEvent('popstate'));

    expect(confirmSpy).toHaveBeenCalled();
    // Because user cancelled leaving, history trap is re-pushed
    expect(pushStateSpy).toHaveBeenCalled();
  });

  it('intercepts in-app links when dirty', () => {
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(false); // user stays

    function TestComponent() {
      const { setIsDirty } = useUnsavedChanges();
      return (
        <div>
          <button onClick={() => setIsDirty(true)}>Make Dirty</button>
          <a href="/target">Leave Link</a>
        </div>
      );
    }

    render(
      <UnsavedChangesProvider>
        <TestComponent />
      </UnsavedChangesProvider>
    );

    // Make dirty
    fireEvent.click(screen.getByText('Make Dirty'));

    // Click link
    const link = screen.getByText('Leave Link');
    const clickEvent = new MouseEvent('click', { bubbles: true, cancelable: true });
    link.dispatchEvent(clickEvent);

    expect(confirmSpy).toHaveBeenCalled();
    expect(clickEvent.defaultPrevented).toBe(true);
  });
});
