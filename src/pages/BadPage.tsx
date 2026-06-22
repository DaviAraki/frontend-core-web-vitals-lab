import { useEffect, useState } from 'react';
import { ProductCard } from '../components/ProductCard';
import { Reviews } from '../components/Reviews';
import { runExpensiveSync } from '../lib/expensiveWork';

/**
 * ⚠️ INTENTIONALLY POOR IMPLEMENTATION — DO NOT COPY INTO PRODUCTION.
 *
 * Every performance sin below is deliberate and labelled, so readers can map a
 * symptom to the metric it harms:
 *   - LCP: the hero is a huge (1.5MB) unoptimized JPEG, lazy-loaded with no
 *     width/height and no fetchPriority, and its render is delayed ~1s. Under
 *     real (throttled) conditions this makes the image the slow LCP element.
 *   - CLS: a promo banner and a notice bar are injected ABOVE already-rendered
 *     content, the title typography changes after load, and every image/avatar
 *     is unsized — each one shoves visible content around.
 *   - INP: "Add to cart" runs a ~700ms synchronous busy-loop on the main thread.
 */
const PRODUCT = {
  id: 'aurora-headphones',
  name: 'Aurora Wireless Headphones',
  price: '$249.00',
  description:
    'Over-ear wireless headphones with adaptive noise cancellation, 40-hour battery life, and spatial audio. The /bad version of this page loads them about as slowly as possible.',
};

const RELATED = [
  { name: 'Aurora Buds', price: '$129.00', image: '/images/product-1.webp' },
  { name: 'Aurora Stand', price: '$39.00', image: '/images/product-2.webp' },
];

// Intentionally bad: the hero is a large, unoptimized JPEG (~1.5MB).
const HERO_IMAGE = '/images/hero-large.jpg';

export function BadPage() {
  const [heroImgReady, setHeroImgReady] = useState(false);
  const [bannerShown, setBannerShown] = useState(false);
  const [noticeShown, setNoticeShown] = useState(false);
  const [fontSwapped, setFontSwapped] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [status, setStatus] = useState<string | null>(null);

  // Intentionally bad: artificially delay the hero image render to hurt LCP.
  useEffect(() => {
    const t = setTimeout(() => setHeroImgReady(true), 1000);
    return () => clearTimeout(t);
  }, []);

  // Intentionally bad: inject a banner ABOVE existing content after a delay → CLS.
  useEffect(() => {
    const t = setTimeout(() => setBannerShown(true), 1100);
    return () => clearTimeout(t);
  }, []);
  // Intentionally bad: a second, later injected bar shifts content again → more CLS.
  useEffect(() => {
    const t = setTimeout(() => setNoticeShown(true), 2000);
    return () => clearTimeout(t);
  }, []);

  // Intentionally bad: a late style/font change shifts the title vertically → CLS.
  useEffect(() => {
    const t = setTimeout(() => setFontSwapped(true), 900);
    return () => clearTimeout(t);
  }, []);

  const handleAddToCart = (): void => {
    // Intentionally bad: this blocks the main thread to demonstrate INP problems.
    // The button cannot repaint "Added!" until this loop finishes.
    runExpensiveSync(700);
    setCartCount((c) => c + 1);
    setStatus('Added to cart (after freezing the UI — see the poor INP).');
  };

  return (
    <main className="page page--product page--bad">
      <div className="variant-banner variant-banner--bad" role="status">
        ⚠ Intentionally poor implementation — do not copy these patterns. Compare with{' '}
        <a href="/optimized">/optimized</a>.
      </div>

      {/* Intentionally bad: bars that appear AFTER first paint, pushing content down (CLS). */}
      {bannerShown && (
        <div className="promo-banner promo-banner--bad">
          <strong>🔥 Flash sale</strong> — 20% off Aurora for the next hour. Use code AURORA20.
        </div>
      )}
      {noticeShown && (
        <div className="late-notice">
          ✓ Free 2-day shipping unlocked · 30-day returns · 2-year warranty included
        </div>
      )}

      <section className="hero hero--product">
        <div className="hero__media">
          {heroImgReady ? (
            // Intentionally bad: large unoptimized JPEG, lazy, no dimensions, no priority.
            <img className="hero__img" src={HERO_IMAGE} alt={PRODUCT.name} loading="lazy" />
          ) : (
            // Intentionally bad: a non-contentful skeleton holds the space while the
            // huge hero image render is artificially delayed (hurts LCP).
            <div className="hero__placeholder" aria-hidden="true">
              <span>Loading hero…</span>
            </div>
          )}
        </div>
        <div className="hero__content">
          <span className="eyebrow eyebrow--bad">/bad — poor vitals</span>
          <h1 className={`hero__title ${fontSwapped ? 'is-font-swapped' : ''}`}>{PRODUCT.name}</h1>
          <p className="hero__desc">{PRODUCT.description}</p>

          <div className="price-card">
            <span className="price-card__price">{PRODUCT.price}</span>
            <span className="price-card__hint">Free shipping · 2-year warranty</span>
            <button type="button" className="btn btn--primary" onClick={handleAddToCart}>
              Add to cart
            </button>
            {cartCount > 0 && <span className="cart-count">Cart: {cartCount}</span>}
            {status && <span className="cart-status">{status}</span>}
          </div>
        </div>
      </section>

      <Reviews stable={false} />

      <section className="related" aria-label="Related products">
        <h2>You might also like</h2>
        <div className="related__grid">
          {RELATED.map((p) => (
            // stable={false} → unsized image, contributing to CLS.
            <ProductCard key={p.name} name={p.name} price={p.price} image={p.image} stable={false} />
          ))}
        </div>
      </section>
    </main>
  );
}
