/**
 * "Expensive work" used by the Add-to-cart interaction on both routes.
 *
 * The /bad page runs `runExpensiveSync` directly on the main thread inside the
 * click handler, which blocks rendering and tanks INP.
 *
 * The /optimized page runs the *exact same* computation, but inside a Web Worker
 * (`cartWorker.ts`), so the main thread stays free and the interaction stays
 * responsive. See `src/lib/cartWorker.ts`.
 */

export interface CartRequest {
  readonly productId: string;
  readonly quantity: number;
  /** Target busy duration in milliseconds. */
  readonly durationMs: number;
}

export interface CartResult {
  readonly ok: true;
  readonly productId: string;
  readonly quantity: number;
  /** A number produced by the busy loop (purely to consume the result). */
  readonly checksum: number;
}

/** Worker protocol types (kept here so page and worker share one source of truth). */
export type CartWorkerMessage = CartRequest;
export type CartWorkerResponse = CartResult;

function nowMs(): number {
  return typeof performance !== 'undefined' && typeof performance.now === 'function'
    ? performance.now()
    : Date.now();
}

/**
 * Intentionally bad: this blocks the main thread to demonstrate INP problems.
 *
 * It runs a tight synchronous loop that performs real math (so the optimizer
 * cannot delete it) for roughly `durationMs`. Because it is synchronous, the
 * browser cannot paint the result of the click — e.g. the "Added!" state —
 * until the loop finishes, producing a poor INP score.
 *
 * DO NOT copy this into production code. It exists only to create a measurable
 * regression on the /bad route.
 */
export function runExpensiveSync(durationMs: number): number {
  const start = nowMs();
  let checksum = 0;
  let i = 0;
  do {
    checksum += Math.sqrt(i + 1) * Math.sin(i);
    i++;
  } while (nowMs() - start < durationMs);
  return checksum;
}
