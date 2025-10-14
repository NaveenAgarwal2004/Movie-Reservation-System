import { describe, it, expect } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import useDebounce from '../../hooks/useDebounce';

describe('useDebounce', () => {
  it('should return initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('test', 500));
    expect(result.current).toBe('test');
  });

  it('should debounce value changes', async () => {
    const { result, rerender } = renderHook(({ value, delay }) => useDebounce(value, delay), {
      initialProps: { value: 'initial', delay: 500 },
    });

    expect(result.current).toBe('initial');

    rerender({ value: 'updated', delay: 500 });
    expect(result.current).toBe('initial'); // Should still be initial

    await waitFor(
      () => {
        expect(result.current).toBe('updated');
      },
      { timeout: 600 }
    );
  });

  it('should cancel previous timeout on rapid changes', async () => {
    const { result, rerender } = renderHook(({ value }) => useDebounce(value, 500), {
      initialProps: { value: 'first' },
    });

    rerender({ value: 'second' });
    rerender({ value: 'third' });

    await waitFor(
      () => {
        expect(result.current).toBe('third');
      },
      { timeout: 600 }
    );
  });
});
