import { useEffect, useRef, useState } from 'react';
import { ProductCard } from '../components/ProductCard';
import { Reviews } from '../components/Reviews';
import type { CartWorkerResponse } from '../lib/expensiveWork';

/**
 * OPTIMIZED IMPLEMENTATION.
 *
 * Same UI as /bad, with every Core Web Vitals problem fixed:
 *   - LCP: optimized WebP hero with explicit width/height, loading="eager" and
 *     fetchPriority="high"; no artificial render delay.
 *   - CLS: the promo banner slot is RESERVED up front (fixed min-height); every
 *     image and avatar has dimensions; typography is stable (no late swap).
 *   - INP: "Add to cart" posts the expensive work to a Web Worker, so the main
 *     thread never blocks. The click handler returns immediately.
 */
const PRODUCT = {
  id: 'aurora-headphones',
  name: 'Aurora Wireless Headphones',
  price: '$249.00',
  description:
    'Over-ear wireless headphones with adaptive noise cancellation, 40-hour battery life, and spatial audio. The /optimized version loads them fast and stays responsive.',
};

const RELATED = [
  { name: 'Aurora Buds', price: '$129.00', image: '/images/product-1.webp' },
  { name: 'Aurora Stand', price: '$39.00', image: '/images/product-2.webp' },
];

// Optimized: properly sized WebP, not the 2MB JPEG.
const HERO_IMAGE = '/images/hero-optimized.webp';

export function OptimizedPage() {
  const [cartCount, setCartCount] = useState(0);
  const [adding, setAdding] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const workerRef = useRef<Worker | null>(null);

  useEffect(() => {
    const worker = new Worker(new URL('../lib/cartWorker.ts', import.meta.url), { type: 'module' });
    worker.onmessage = (event: MessageEvent<CartWorkerResponse>) => {
      // Runs on the main thread, but only after the work is already done off-thread.
      setCartCount((c) => c + event.data.quantity);
      setAdding(false);
      setStatus('Added to cart (work ran on a worker thread — UI never froze).');
    };
    workerRef.current = worker;
    return () => worker.terminate();
  }, []);

  const handleAddToCart = (): void => {
    const worker = workerRef.current;
    if (!worker || adding) return;
    setAdding(true);
    // Non-blocking: hand the expensive work to the worker. The main thread stays
    // free, so the browser can paint the next frame immediately (good INP).
    worker.postMessage({ productId: PRODUCT.id, quantity: 1, durationMs: 700 });
  };

  return (
    <main className="page page--product page--optimized">
      <div className="variant-banner variant-banner--ok" role="status">
        ✓ Optimized implementation. Compare with <a href="/bad">/bad</a>.
      </div>

      {/* Optimized: the promo banner slot is reserved up front — no layout shift. */}
      <div className="promo-banner promo-banner--reserved">
        🔥 Flash sale — 20% off Aurora for the next hour!
      </div>

      <section className="hero hero--product">
        <div className="hero__media">
          <img
            className="hero__img"
            src={HERO_IMAGE}
            alt={PRODUCT.name}
            width={1600}
            height={1000}
            loading="eager"
            // fetchPriority is typed on <img> in React 19 — prioritizes the LCP element.
            fetchPriority="high"
            decoding="async"
          />
        </div>
        <div className="hero__content">
          <span className="eyebrow eyebrow--ok">/optimized — good vitals</span>
          <h1 className="hero__title">{PRODUCT.name}</h1>
          <p className="hero__desc">{PRODUCT.description}</p>

          <div className="price-card">
            <span className="price-card__price">{PRODUCT.price}</span>
            <span className="price-card__hint">Free shipping · 2-year warranty</span>
            <button type="button" className="btn btn--primary" onClick={handleAddToCart} disabled={adding}>
              {adding ? 'Adding…' : 'Add to cart'}
            </button>
            {cartCount > 0 && <span className="cart-count">Cart: {cartCount}</span>}
            {status && <span className="cart-status cart-status--ok">{status}</span>}
          </div>
        </div>
      </section>

      <Reviews stable />

      <section className="related" aria-label="Related products">
        <h2>You might also like</h2>
        <div className="related__grid">
          {RELATED.map((p) => (
            // stable={true} → sized image, no layout shift.
            <ProductCard key={p.name} name={p.name} price={p.price} image={p.image} stable />
          ))}
        </div>
      </section>
    </main>
  );
}
