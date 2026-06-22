/// <reference lib="webworker" />
/**
 * Web Worker that performs the same expensive cart calculation as the /bad
 * route's synchronous handler — but off the main thread, so the /optimized
 * route's Add-to-cart interaction stays responsive (good INP).
 *
 * Vite bundles this via the `new Worker(new URL('./cartWorker.ts', import.meta.url), { type: 'module' })`
 * form used in OptimizedPage.
 */
import type { CartWorkerMessage, CartWorkerResponse } from './expensiveWork';
import { runExpensiveSync } from './expensiveWork';

const ctx = self as unknown as DedicatedWorkerGlobalScope;

ctx.onmessage = (event: MessageEvent<CartWorkerMessage>) => {
  const { productId, quantity, durationMs } = event.data;
  // Same work as the bad route — but here it runs on the worker thread.
  const checksum = runExpensiveSync(durationMs);
  const response: CartWorkerResponse = { ok: true, productId, quantity, checksum };
  ctx.postMessage(response);
};
