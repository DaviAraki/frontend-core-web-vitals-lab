import { describe, expect, it } from 'vitest';
import { runExpensiveSync } from '../expensiveWork';

describe('runExpensiveSync', () => {
  it('returns a finite number', () => {
    const result = runExpensiveSync(15);
    expect(typeof result).toBe('number');
    expect(Number.isFinite(result)).toBe(true);
  });

  it('blocks the thread for roughly the requested duration', () => {
    const start = performance.now();
    runExpensiveSync(60);
    const elapsed = performance.now() - start;
    // Generous lower bound to stay stable across machines/CI; the point is that
    // it does not return instantly.
    expect(elapsed).toBeGreaterThanOrEqual(40);
  });
});
