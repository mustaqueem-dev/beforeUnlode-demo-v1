import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useCounterGuard } from '@/hooks/useCounterGuard';

describe('useCounterGuard hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('initializes with count 0 and isGuarded true (< 10)', () => {
    const { result } = renderHook(() => useCounterGuard({ initialCount: 0, threshold: 10 }));
    expect(result.current.count).toBe(0);
    expect(result.current.isGuarded).toBe(true);
  });

  it('triggers beforeunload preventDefault when count < 10', () => {
    const { result } = renderHook(() => useCounterGuard({ initialCount: 5, threshold: 10 }));
    expect(result.current.isGuarded).toBe(true);

    const event = new Event('beforeunload', { cancelable: true });
    const preventDefaultSpy = vi.spyOn(event, 'preventDefault');

    window.dispatchEvent(event);

    expect(preventDefaultSpy).toHaveBeenCalled();
  });

  it('intercepts browser Back button (popstate) with confirm when count < 10', () => {
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(false); // click cancel (stay)
    const pushStateSpy = vi.spyOn(window.history, 'pushState');

    const { result } = renderHook(() => useCounterGuard({ initialCount: 2, threshold: 10 }));
    expect(result.current.isGuarded).toBe(true);

    // Simulate browser Back button
    window.dispatchEvent(new PopStateEvent('popstate'));

    expect(confirmSpy).toHaveBeenCalledWith(
      expect.stringContaining('less than 10')
    );
    // Because cancel was chosen, history trap was re-pushed
    expect(pushStateSpy).toHaveBeenCalled();
  });

  it('disables all warnings when count reaches 10 or more', () => {
    const confirmSpy = vi.spyOn(window, 'confirm');

    const { result } = renderHook(() => useCounterGuard({ initialCount: 9, threshold: 10 }));
    expect(result.current.isGuarded).toBe(true);

    // Increment to 10
    act(() => {
      result.current.increment();
    });

    expect(result.current.count).toBe(10);
    expect(result.current.isGuarded).toBe(false);

    // 1. Test beforeunload when count >= 10 -> Should NOT prevent default
    const event = new Event('beforeunload', { cancelable: true });
    const preventDefaultSpy = vi.spyOn(event, 'preventDefault');
    window.dispatchEvent(event);
    expect(preventDefaultSpy).not.toHaveBeenCalled();

    // 2. Test popstate Back button when count >= 10 -> Should NOT call confirm
    window.dispatchEvent(new PopStateEvent('popstate'));
    expect(confirmSpy).not.toHaveBeenCalled();
  });

  it('updates count correctly using increment, decrement, reset, and setCount', () => {
    const { result } = renderHook(() => useCounterGuard({ initialCount: 0, threshold: 10 }));

    act(() => {
      result.current.increment();
    });
    expect(result.current.count).toBe(1);

    act(() => {
      result.current.setCount(15);
    });
    expect(result.current.count).toBe(15);
    expect(result.current.isGuarded).toBe(false);

    act(() => {
      result.current.decrement();
    });
    expect(result.current.count).toBe(14);

    act(() => {
      result.current.reset();
    });
    expect(result.current.count).toBe(0);
    expect(result.current.isGuarded).toBe(true);
  });
});
